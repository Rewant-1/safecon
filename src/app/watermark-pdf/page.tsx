"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Stamp, Download, RotateCcw } from "lucide-react";
import FileDropzone from "@/components/tools/FileDropzone";
import ProgressBar from "@/components/ui/ProgressBar";
import ErrorBanner from "@/components/ui/ErrorBanner";
import { useFileProcessor } from "@/hooks/useFileProcessor";
import { watermarkPdf, type WatermarkOptions } from "@/lib/watermarkPdf";
import { formatBytes } from "@/lib/compress";

export default function WatermarkPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkType, setWatermarkType] = useState<"text" | "image">("text");
  const [text, setText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(0.15);
  const [rotation, setRotation] = useState(-45);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { status, progress, result, error, process, reset } = useFileProcessor<Blob>();

  const handleFiles = useCallback((accepted: File[]) => {
    if (accepted.length > 0) setFile(accepted[0]);
  }, []);

  const handleImageFile = useCallback((accepted: File[]) => {
    if (accepted.length > 0) setImageFile(accepted[0]);
  }, []);

  const handleProcess = async () => {
    if (!file) return;
    let options: WatermarkOptions;
    if (watermarkType === "text") {
      options = { type: "text", text, opacity, rotation };
    } else {
      if (!imageFile) return;
      options = { type: "image", imageFile, opacity };
    }
    await process(async (onProgress) => {
      return await watermarkPdf(file, options, (c, t) => onProgress((c / t) * 100));
    });
  };

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement("a");
    a.href = url;
    a.download = file?.name.replace(/\.pdf$/i, "_watermarked.pdf") ?? "watermarked.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => { setFile(null); setImageFile(null); reset(); };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-16 text-center">
        <div className="w-12 h-12 rounded-2xl bg-black/[0.03] flex items-center justify-center mx-auto mb-6">
          <Stamp className="w-5 h-5 text-black" strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black mb-4">Watermark</h1>
        <p className="text-muted text-lg font-light">Brand every page with a text or image watermark. Full control.</p>
      </div>

      <AnimatePresence mode="popLayout">
        {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-8"><ErrorBanner message={error} onRetry={handleProcess} onDismiss={reset} /></motion.div>}
      </AnimatePresence>

      {status === "idle" && !file && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <FileDropzone onFilesAccepted={handleFiles} accept={{ "application/pdf": [".pdf"] }} maxFiles={1} label="Drop your PDF here" sublabel="We'll stamp every single page" />
        </motion.div>
      )}

      {status === "idle" && file && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center justify-between p-5 rounded-[24px] bg-white border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div><p className="text-base font-semibold">{file.name}</p><p className="text-xs text-black/40 mt-1">{formatBytes(file.size)}</p></div>
            <button onClick={handleReset} aria-label="Reset file" className="text-black/20 hover:text-black transition-colors cursor-pointer"><RotateCcw className="w-4 h-4" /></button>
          </div>

          {/* Type Toggle */}
          <div className="p-6 rounded-2xl bg-white border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
            <label className="block text-xs font-bold tracking-widest text-black/40 uppercase mb-4">Watermark Type</label>
            <div className="flex gap-2 p-1 bg-black/[0.03] rounded-xl">
              {(["text", "image"] as const).map((t) => (
                <button key={t} onClick={() => setWatermarkType(t)}
                  className={`relative flex-1 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer ${watermarkType === t ? "text-white" : "text-black/40 hover:text-black"}`}>
                  {watermarkType === t && <motion.div layoutId="wm-type-bg" className="absolute inset-0 bg-black rounded-lg" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
                  <span className="relative z-10">{t === "text" ? "Text Stamp" : "Image Logo"}</span>
                </button>
              ))}
            </div>
          </div>

          {watermarkType === "text" ? (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-white border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
                <label htmlFor="watermark-text" className="block text-xs font-bold tracking-widest text-black/40 uppercase mb-3">Text</label>
                <input id="watermark-text" type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="CONFIDENTIAL"
                  className="w-full px-4 py-3 rounded-xl bg-black/[0.03] border-none text-sm font-semibold outline-none focus:ring-2 focus:ring-black/10 placeholder:text-black/20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-white border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
                  <label htmlFor="watermark-opacity-text" className="flex justify-between text-xs font-bold tracking-widest text-black/40 uppercase mb-4"><span>Opacity</span><span className="text-black">{Math.round(opacity * 100)}%</span></label>
                  <input id="watermark-opacity-text" type="range" min={0.02} max={0.5} step={0.01} value={opacity} onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="w-full h-1 bg-black/5 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer" />
                </div>
                <div className="p-6 rounded-2xl bg-white border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
                  <label htmlFor="watermark-rotation" className="flex justify-between text-xs font-bold tracking-widest text-black/40 uppercase mb-4"><span>Rotation</span><span className="text-black">{rotation}°</span></label>
                  <input id="watermark-rotation" type="range" min={-90} max={90} step={5} value={rotation} onChange={(e) => setRotation(parseInt(e.target.value))}
                    className="w-full h-1 bg-black/5 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer" />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <FileDropzone onFilesAccepted={handleImageFile} accept={{ "image/*": [".png", ".jpg", ".jpeg"] }} maxFiles={1} label="Drop your logo image" sublabel="PNG or JPEG" />
              {imageFile && <p className="text-sm text-black/60 px-2">Selected: <span className="font-semibold">{imageFile.name}</span></p>}
              <div className="p-6 rounded-2xl bg-white border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
                <label htmlFor="watermark-opacity-image" className="flex justify-between text-xs font-bold tracking-widest text-black/40 uppercase mb-4"><span>Opacity</span><span className="text-black">{Math.round(opacity * 100)}%</span></label>
                <input id="watermark-opacity-image" type="range" min={0.02} max={0.5} step={0.01} value={opacity} onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="w-full h-1 bg-black/5 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer" />
              </div>
            </div>
          )}

          <button onClick={handleProcess} disabled={watermarkType === "image" && !imageFile}
            className="w-full py-4 rounded-xl bg-black text-white text-sm font-bold tracking-widest uppercase shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.16)] transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">
            Apply Watermark
          </button>
        </motion.div>
      )}

      {status === "processing" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-24 space-y-8">
          <div className="w-24 h-24 rounded-full border border-black/10 border-t-black animate-spin" style={{ animationDuration: "2s" }} />
          <div className="w-full max-w-sm"><ProgressBar progress={progress} label="Branding Pages" /></div>
        </motion.div>
      )}

      {status === "done" && result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center py-16 px-4 rounded-[32px] bg-white border border-black/5 shadow-[0_20px_60px_rgb(0,0,0,0.06)]">
          <div className="w-20 h-20 rounded-[24px] bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6"><Stamp className="w-8 h-8" strokeWidth={1.5} /></div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Watermarked</h2>
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
