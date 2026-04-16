"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCw, Download, RotateCcw, X } from "lucide-react";
import FileDropzone from "@/components/tools/FileDropzone";
import ProgressBar from "@/components/ui/ProgressBar";
import ErrorBanner from "@/components/ui/ErrorBanner";
import { useFileProcessor } from "@/hooks/useFileProcessor";
import { rotatePdf } from "@/lib/rotatePdf";
import { formatBytes } from "@/lib/compress";

export default function RotatePdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [angle, setAngle] = useState(90);
  const { status, progress, result, error, process, reset } = useFileProcessor<Blob>();

  const handleFiles = useCallback((accepted: File[]) => {
    if (accepted.length > 0) setFile(accepted[0]);
  }, []);

  const handleRotate = async () => {
    if (!file) return;
    await process(async (onProgress) => {
      return await rotatePdf(file, { angle }, (c, t) => onProgress((c / t) * 100));
    });
  };

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement("a");
    a.href = url;
    a.download = file?.name.replace(/\.pdf$/i, "_rotated.pdf") ?? "rotated.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => { setFile(null); reset(); };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-16 text-center">
        <div className="w-12 h-12 rounded-2xl bg-black/[0.03] flex items-center justify-center mx-auto mb-6">
          <RotateCw className="w-5 h-5 text-black" strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black mb-4">
          Rotate PDF
        </h1>
        <p className="text-muted text-lg font-light">
          Ensure your pages are correctly oriented by rotating them all.
        </p>
      </div>

      <AnimatePresence mode="popLayout">
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-8">
            <ErrorBanner message={error} onRetry={handleRotate} onDismiss={reset} />
          </motion.div>
        )}
      </AnimatePresence>

      {status === "idle" && !file && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <FileDropzone onFilesAccepted={handleFiles} accept={{ "application/pdf": [".pdf"] }} maxFiles={1} label="Drop your PDF here" />
        </motion.div>
      )}

      {status === "idle" && file && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center justify-between p-5 rounded-[24px] bg-white border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div>
              <p className="text-base font-semibold">{file.name}</p>
              <p className="text-xs text-black/40 mt-1">{formatBytes(file.size)}</p>
            </div>
            <button onClick={handleReset} className="p-3 rounded-full text-black/20 hover:text-black hover:bg-black/5 transition-colors cursor-pointer outline-none">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
            <label className="block text-xs font-bold tracking-widest text-black/40 uppercase mb-4">
              Rotation Angle
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[90, 180, 270].map((deg) => (
                <button 
                  key={deg} 
                  onClick={() => setAngle(deg)}
                  className={`py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                    angle === deg ? "bg-black text-white" : "bg-black/[0.03] text-black/40 hover:text-black"
                  }`}
                >
                  {deg}°
                </button>
              ))}
            </div>
            <p className="text-[10px] text-black/30 tracking-wider uppercase mt-3 text-center">Clockwise direction</p>
          </div>

          <button 
            onClick={handleRotate} 
            className="w-full py-4 rounded-xl bg-black text-white text-sm font-bold tracking-widest uppercase shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.16)] transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            Apply Rotation
          </button>
        </motion.div>
      )}

      {status === "processing" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-24 space-y-8">
          <div className="w-24 h-24 rounded-full border border-black/10 border-t-black animate-spin" style={{ animationDuration: "2s" }} />
          <div className="w-full max-w-sm"><ProgressBar progress={progress} label="Rotating Pages" /></div>
        </motion.div>
      )}

      {status === "done" && result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center py-16 px-4 rounded-[32px] bg-white border border-black/5 shadow-[0_20px_60px_rgb(0,0,0,0.06)]">
          <div className="w-20 h-20 rounded-[24px] bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6">
            <RotateCw className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Rotated Successfully</h2>
          <p className="text-black/40 mb-8">{formatBytes(result.size)}</p>
          <div className="flex gap-4">
            <button onClick={handleDownload} className="flex items-center gap-2 px-6 py-4 rounded-xl bg-black text-white text-xs font-bold tracking-widest uppercase shadow-lg cursor-pointer">
              <Download className="w-4 h-4" /> Download
            </button>
            <button onClick={handleReset} className="px-6 py-4 rounded-xl bg-black/[0.03] text-xs font-bold tracking-widest uppercase cursor-pointer">
              Start Over
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
