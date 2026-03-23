"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PenTool, Download, RotateCcw, Eraser } from "lucide-react";
import FileDropzone from "@/components/tools/FileDropzone";
import ErrorBanner from "@/components/ui/ErrorBanner";
import { useFileProcessor } from "@/hooks/useFileProcessor";
import { signPdf } from "@/lib/signPdf";
import { formatBytes } from "@/lib/compress";

export default function SignPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [signatureBlob, setSignatureBlob] = useState<Blob | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const { status, result, error, process, reset } = useFileProcessor<Blob>();

  const handleFiles = useCallback((accepted: File[]) => {
    if (accepted.length > 0) setFile(accepted[0]);
  }, []);

  // Canvas drawing handlers
  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const endDraw = () => {
    isDrawing.current = false;
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (blob) setSignatureBlob(blob);
    }, "image/png");
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureBlob(null);
  };

  const handleProcess = async () => {
    if (!file || !signatureBlob) return;
    await process(async () => {
      return await signPdf(file, {
        signatureBlob,
        pageIndex: 0,
        x: 0.7,
        y: 0.1,
        scale: 0.3,
      });
    });
  };

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement("a");
    a.href = url;
    a.download = file?.name.replace(/\.pdf$/i, "_signed.pdf") ?? "signed.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => { setFile(null); clearCanvas(); reset(); };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-16 text-center">
        <div className="w-12 h-12 rounded-2xl bg-black/[0.03] flex items-center justify-center mx-auto mb-6">
          <PenTool className="w-5 h-5 text-black" strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black mb-4">Sign PDF</h1>
        <p className="text-muted text-lg font-light">Draw your signature and embed it on any document.</p>
      </div>

      <AnimatePresence mode="popLayout">
        {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-8"><ErrorBanner message={error} onRetry={handleProcess} onDismiss={reset} /></motion.div>}
      </AnimatePresence>

      {status === "idle" && !file && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <FileDropzone onFilesAccepted={handleFiles} accept={{ "application/pdf": [".pdf"] }} maxFiles={1} label="Drop your PDF here" sublabel="We'll let you sign it" />
        </motion.div>
      )}

      {status === "idle" && file && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center justify-between p-5 rounded-[24px] bg-white border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div><p className="text-base font-semibold">{file.name}</p><p className="text-xs text-black/40 mt-1">{formatBytes(file.size)}</p></div>
            <button onClick={handleReset} className="text-black/20 hover:text-black transition-colors cursor-pointer"><RotateCcw className="w-4 h-4" /></button>
          </div>

          {/* Signature Pad */}
          <div className="p-6 rounded-2xl bg-white border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
            <div className="flex justify-between items-center mb-4">
              <label className="text-xs font-bold tracking-widest text-black/40 uppercase">Draw Your Signature</label>
              <button onClick={clearCanvas} className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-black/30 hover:text-black transition-colors cursor-pointer">
                <Eraser className="w-3.5 h-3.5" /> Clear
              </button>
            </div>
            <canvas
              ref={canvasRef}
              width={600}
              height={200}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={endDraw}
              onMouseLeave={endDraw}
              className="w-full h-[200px] rounded-xl border-2 border-dashed border-black/10 bg-black/[0.01] cursor-crosshair"
            />
            <p className="text-[10px] text-black/30 tracking-wider uppercase mt-3 text-center">Click and drag to draw • Placed on page 1, bottom-right</p>
          </div>

          <button onClick={handleProcess} disabled={!signatureBlob}
            className="w-full py-4 rounded-xl bg-black text-white text-sm font-bold tracking-widest uppercase shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.16)] transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">
            Embed Signature
          </button>
        </motion.div>
      )}

      {status === "done" && result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center py-16 px-4 rounded-[32px] bg-white border border-black/5 shadow-[0_20px_60px_rgb(0,0,0,0.06)]">
          <div className="w-20 h-20 rounded-[24px] bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6"><PenTool className="w-8 h-8" strokeWidth={1.5} /></div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Signed & Sealed</h2>
          <p className="text-black/40 mb-8">{formatBytes(result.size)}</p>
          <div className="flex gap-4">
            <button onClick={handleDownload} className="flex items-center gap-2 px-6 py-4 rounded-xl bg-black text-white text-xs font-bold tracking-widest uppercase shadow-lg cursor-pointer"><Download className="w-4 h-4" /> Download</button>
            <button onClick={handleReset} className="px-6 py-4 rounded-xl bg-black/[0.03] text-xs font-bold tracking-widest uppercase cursor-pointer">New File</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
