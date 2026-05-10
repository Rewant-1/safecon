"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, X, Download, RotateCcw } from "lucide-react";
import FileDropzone from "@/components/tools/FileDropzone";
import ProgressBar from "@/components/ui/ProgressBar";
import ErrorBanner from "@/components/ui/ErrorBanner";
import { useFileProcessor } from "@/hooks/useFileProcessor";
import {
  compressImage,
  formatBytes,
  calcSavings,
  type CompressResult,
} from "@/lib/compress";

export default function CompressPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(0.7);
  const [format, setFormat] = useState<"jpeg" | "png" | "webp">("jpeg");
  const { status, progress, result, error, process, reset } =
    useFileProcessor<CompressResult[]>();

  const handleFiles = useCallback((accepted: File[]) => {
    setFiles((prev) => [...prev, ...accepted]);
  }, []);

  const handleRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCompress = async () => {
    if (files.length === 0) return;

    await process(async (onProgress) => {
      const results: CompressResult[] = [];
      for (let i = 0; i < files.length; i++) {
        const res = await compressImage(files[i], quality, format);
        results.push(res);
        onProgress(((i + 1) / files.length) * 100);
      }
      return results;
    });
  };

  const handleDownload = (item: CompressResult) => {
    const url = URL.createObjectURL(item.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = item.fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setFiles([]);
    reset();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-16 text-center">
        <div className="w-12 h-12 rounded-2xl bg-black/[0.03] flex items-center justify-center mx-auto mb-6">
          <Zap className="w-5 h-5 text-black" strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black mb-4">
          Image Compressor
        </h1>
        <p className="text-muted text-lg font-light">
          Sculpt your images to perfection. Complete privacy, zero uploads.
        </p>
      </div>

      <AnimatePresence mode="popLayout">
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-8"
          >
            <ErrorBanner message={error} onRetry={handleCompress} onDismiss={reset} />
          </motion.div>
        )}
      </AnimatePresence>

      {status === "idle" && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <FileDropzone
            onFilesAccepted={handleFiles}
            accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp"] }}
            maxFiles={50}
            label="Drop pristine images here"
            sublabel="JPEG, PNG, WebP — infinite uploads"
          />

          {files.length > 0 && (
            <div className="pt-8 border-t border-black/5 space-y-8">
              {/* File List */}
              <div>
                <div className="flex justify-between items-end mb-4 px-2">
                  <h3 className="text-xs font-bold tracking-widest text-black/40 uppercase">Queue ({files.length})</h3>
                </div>
                <div className="grid gap-2">
                  {files.map((f, i) => (
                    <div
                      key={i}
                      className="group flex justify-between items-center px-5 py-4 rounded-xl bg-white border border-black/5 shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-all hover:border-black/10"
                    >
                      <span className="text-sm font-medium tracking-wide truncate max-w-[60%]">{f.name}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-black/40 font-medium">{formatBytes(f.size)}</span>
                        <button
                          onClick={() => handleRemove(i)}
                          aria-label={`Remove ${f.name}`}
                          className="text-black/20 hover:text-red-500 transition-colors cursor-pointer outline-none"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-white border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
                  <label htmlFor="compress-quality" className="flex justify-between text-xs font-bold tracking-widest text-black/40 uppercase mb-6">
                    <span>Quality</span>
                    <span className="text-black">{Math.round(quality * 100)}%</span>
                  </label>
                  <input
                    id="compress-quality"
                    type="range"
                    min={0.1}
                    max={1}
                    step={0.05}
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="w-full h-1 bg-black/5 rounded-full appearance-none outline-none focus:outline-none focus:ring-2 focus:ring-black/10 transition-shadow [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
                  />
                  <div className="flex justify-between text-[10px] text-black/30 font-medium tracking-widest uppercase mt-4">
                    <span>Maximum Savings</span>
                    <span>Pristine Quality</span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
                  <label className="block text-xs font-bold tracking-widest text-black/40 uppercase mb-6">
                    Output Format
                  </label>
                  <div className="flex gap-2 p-1 bg-black/[0.03] rounded-xl">
                    {(["jpeg", "png", "webp"] as const).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setFormat(fmt)}
                        className={`relative flex-1 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors outline-none cursor-pointer ${
                          format === fmt ? "text-white" : "text-black/40 hover:text-black"
                        }`}
                      >
                        {format === fmt && (
                          <motion.div
                            layoutId="format-bg"
                            className="absolute inset-0 bg-black rounded-lg"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        <span className="relative z-10">{fmt}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleCompress}
                className="w-full py-4 rounded-xl bg-black text-white text-sm font-bold tracking-widest uppercase shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.16)] transition-all hover:-translate-y-0.5 cursor-pointer outline-none"
              >
                Compress {files.length} Image{files.length > 1 ? "s" : ""}
              </button>
            </div>
          )}
        </motion.div>
      )}

      {status === "processing" && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-24 space-y-8"
        >
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="w-24 h-24 rounded-full border border-black/10 border-t-black border-r-black animate-spin"
            style={{ animationDuration: '2s' }}
          />
          <div className="w-full max-w-sm">
            <ProgressBar progress={progress} label="Sculpting Pixels" />
          </div>
        </motion.div>
      )}

      {status === "done" && result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex justify-between items-end border-b border-black/5 pb-4 px-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-black mb-1">Masterpieces Ready</h2>
              <p className="text-sm text-black/40">Your optimized files have been generated entirely locally.</p>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-black/40 hover:text-black transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </div>

          <div className="grid gap-3">
            {result.map((item, i) => (
              <div
                key={i}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-white border border-black/5 shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_12px_30px_rgb(0,0,0,0.04)]"
              >
                <div className="mb-4 sm:mb-0">
                  <p className="text-sm font-semibold tracking-wide text-black mb-1 truncate max-w-sm">
                    {item.fileName}
                  </p>
                  <p className="flex items-center gap-3 text-xs text-black/40 font-medium">
                    <span className="line-through decoration-black/20">{formatBytes(item.originalSize)}</span>
                    <span>→</span>
                    <span className="text-black">{formatBytes(item.compressedSize)}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold tracking-wider ml-1">
                      −{calcSavings(item.originalSize, item.compressedSize)}%
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => handleDownload(item)}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-black/[0.03] hover:bg-black text-black hover:text-white text-xs font-bold tracking-widest uppercase transition-all whitespace-nowrap cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
