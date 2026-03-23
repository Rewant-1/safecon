"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, RotateCcw, X, Image as ImageIcon } from "lucide-react";
import FileDropzone from "@/components/tools/FileDropzone";
import ProgressBar from "@/components/ui/ProgressBar";
import ErrorBanner from "@/components/ui/ErrorBanner";
import { useFileProcessor } from "@/hooks/useFileProcessor";
import { renderPdfPages, downloadAsZip, type RenderedPage } from "@/lib/pdfToImages";

export default function PdfToImagesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [scale, setScale] = useState(2);
  const [format, setFormat] = useState<"png" | "jpeg">("png");
  const { status, progress, result, error, process, reset } = useFileProcessor<RenderedPage[]>();

  const handleFiles = useCallback((accepted: File[]) => {
    if (accepted.length > 0) setFile(accepted[0]);
  }, []);

  const handleExtract = async () => {
    if (!file) return;
    await process(async (onProgress) => {
      return await renderPdfPages(file, { scale, format }, (current, total) => {
        onProgress((current / total) * 100);
      });
    });
  };

  const handleDownloadAll = async () => {
    if (!result) return;
    const baseName = file?.name.replace(/\.pdf$/i, "") ?? "Document";
    await downloadAsZip(result, baseName, format);
  };

  const handleDownloadSingle = (page: RenderedPage) => {
    const ext = format === "jpeg" ? "jpg" : "png";
    const baseName = file?.name.replace(/\.pdf$/i, "") ?? "Document";
    const url = URL.createObjectURL(page.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${baseName}_Page_${page.pageNumber}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setFile(null);
    reset();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-16 text-center">
        <div className="w-12 h-12 rounded-2xl bg-black/[0.03] flex items-center justify-center mx-auto mb-6">
          <FileText className="w-5 h-5 text-black" strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black mb-4">
          PDF Extractor
        </h1>
        <p className="text-muted text-lg font-light">
          Dissect and extract every single page into high-resolution raster images.
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
            <ErrorBanner message={error} onRetry={handleExtract} onDismiss={reset} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {status === "idle" && !file && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <FileDropzone
              onFilesAccepted={handleFiles}
              accept={{ "application/pdf": [".pdf"] }}
              maxFiles={1}
              label="Securely drop PDF here"
              sublabel="Single majestic document — boundless privacy"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {status === "idle" && file && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between p-5 rounded-[24px] bg-white border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-black/[0.04] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-black/60" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-base font-semibold tracking-wide text-black leading-tight max-w-[200px] sm:max-w-sm truncate">{file.name}</p>
                  <p className="text-xs font-medium text-black/40 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB Payload</p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="p-3 rounded-full text-black/20 hover:text-black hover:bg-black/5 transition-colors cursor-pointer outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-white border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
                <label className="flex justify-between text-xs font-bold tracking-widest text-black/40 uppercase mb-6">
                  <span>Resolution</span>
                  <span className="text-black">{scale * 72} DPI</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={4}
                  step={0.5}
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full h-1 bg-black/5 rounded-full appearance-none outline-none focus:outline-none focus:ring-2 focus:ring-black/10 transition-shadow [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
                />
                <div className="flex justify-between text-[10px] text-black/30 font-medium tracking-widest uppercase mt-4">
                  <span>Economic</span>
                  <span>Opulent</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
                <label className="block text-xs font-bold tracking-widest text-black/40 uppercase mb-6">
                  Architecture
                </label>
                <div className="flex gap-2 p-1 bg-black/[0.03] rounded-xl">
                  {(["png", "jpeg"] as const).map((fmt) => (
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
              onClick={handleExtract}
              className="w-full py-4 rounded-xl bg-black text-white text-sm font-bold tracking-widest uppercase shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.16)] transition-all hover:-translate-y-0.5 cursor-pointer outline-none"
            >
              Parse & Render Pages
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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
            <ProgressBar progress={progress} label="Rasterizing Engine" />
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
              <h2 className="text-2xl font-bold tracking-tight text-black mb-1">Decoded Renderings</h2>
              <p className="text-sm text-black/40">{result.length} artifact{result.length > 1 ? "s" : ""} generated securely.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDownloadAll}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-black/80 transition-colors mx-2 shadow-[0_4px_14px_0_rgba(0,0,0,0.2)] cursor-pointer"
              >
                <Download className="w-4 h-4" /> Export Archive
              </button>
              <button
                onClick={handleReset}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-black/5 text-black/40 hover:text-black hover:border-black/20 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.05 } }
            }}
          >
            {result.map((page) => (
              <motion.div
                key={page.pageNumber}
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                className="group relative rounded-[20px] bg-black/[0.02] border border-black/5 overflow-hidden transition-all hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:-translate-y-1"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={page.dataUrl}
                  alt={`Page ${page.pageNumber}`}
                  className="w-full aspect-[1/1.4] object-contain p-2"
                />
                
                {/* Cinematic overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
                  <button
                    onClick={() => handleDownloadSingle(page)}
                    className="translate-y-4 group-hover:translate-y-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-xs font-bold tracking-wider uppercase transition-all duration-500 cursor-pointer shadow-xl hover:scale-105"
                  >
                    Save
                  </button>
                </div>
                
                <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold tracking-widest uppercase">
                  {page.pageNumber}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
