"use client";

import { useState, useCallback } from "react";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import { Layers, X, Download, RotateCcw, GripVertical } from "lucide-react";
import FileDropzone from "@/components/tools/FileDropzone";
import ProgressBar from "@/components/ui/ProgressBar";
import ErrorBanner from "@/components/ui/ErrorBanner";
import { useFileProcessor } from "@/hooks/useFileProcessor";
import { imagesToPdf, type ImageToPdfOptions } from "@/lib/imagesToPdf";
import { formatBytes } from "@/lib/compress";

export default function ImagesToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageSize, setPageSize] = useState<ImageToPdfOptions["pageSize"]>("A4");
  const { status, progress, result, error, process, reset } = useFileProcessor<Blob>();

  const handleFiles = useCallback((accepted: File[]) => {
    setFiles((prev) => [...prev, ...accepted]);
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    await process(async (onProgress) => {
      return await imagesToPdf(files, { pageSize }, (current, total) => {
        onProgress((current / total) * 100);
      });
    });
  };

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement("a");
    a.href = url;
    a.download = "SafeCon_Document.pdf";
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
          <Layers className="w-5 h-5 text-black" strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black mb-4">
          Document Binder
        </h1>
        <p className="text-muted text-lg font-light">
          Sequence and bind images into a seamless PDF narrative.
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
            <ErrorBanner message={error} onRetry={handleConvert} onDismiss={reset} />
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
            maxFiles={100}
            label="Drop visual assets here"
            sublabel="JPEG, PNG — elegant drag-to-reorder enabled"
          />

          {files.length > 0 && (
            <div className="pt-8 border-t border-black/5 space-y-8">
              
              <div>
                <div className="flex justify-between items-end mb-4 px-2">
                  <h3 className="text-xs font-bold tracking-widest text-black/40 uppercase">Sequence ({files.length})</h3>
                  <span className="text-[10px] uppercase tracking-widest text-black/30 font-semibold">Drag to reorder</span>
                </div>
                
                {/* Framer Motion Reorder List */}
                <Reorder.Group axis="y" values={files} onReorder={setFiles} className="grid gap-2">
                  {files.map((f, i) => (
                    <Reorder.Item
                      key={`${f.name}-${i}`}
                      value={f}
                      className="group flex justify-between items-center px-4 py-3 rounded-xl bg-white border border-black/5 shadow-[0_4px_20px_rgb(0,0,0,0.02)] cursor-grab active:cursor-grabbing hover:border-black/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-4 h-4 text-black/20 group-hover:text-black/40" />
                        <span className="w-5 text-xs font-bold tracking-widest text-black/30 bg-black/5 rounded text-center px-1 py-0.5">{i + 1}</span>
                        <span className="text-sm font-medium tracking-wide truncate max-w-[200px] sm:max-w-sm">{f.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-black/40 font-medium">{formatBytes(f.size)}</span>
                        <button
                          onClick={() => removeFile(i)}
                          className="text-black/20 hover:text-red-500 transition-colors cursor-pointer outline-none"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              </div>

              {/* Page Format */}
              <div className="p-6 rounded-2xl bg-white border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
                <label className="block text-xs font-bold tracking-widest text-black/40 uppercase mb-6">
                  Page Dimensions
                </label>
                <div className="flex flex-col sm:flex-row gap-2 p-1 bg-black/[0.03] rounded-xl">
                  {(["A4", "Letter", "FitImage"] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setPageSize(size)}
                      className={`relative flex-1 py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors outline-none cursor-pointer ${
                        pageSize === size ? "text-white" : "text-black/40 hover:text-black"
                      }`}
                    >
                      {pageSize === size && (
                        <motion.div
                          layoutId="page-size-bg"
                          className="absolute inset-0 bg-black rounded-lg"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className="relative z-10">{size === "FitImage" ? "Adaptive Fit" : size}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleConvert}
                className="w-full py-4 rounded-xl bg-black text-white text-sm font-bold tracking-widest uppercase shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.16)] transition-all hover:-translate-y-0.5 cursor-pointer outline-none"
              >
                Assemble Document
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
            <ProgressBar progress={progress} label="Encoding Document" />
          </div>
        </motion.div>
      )}

      {status === "done" && result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 px-4 rounded-[32px] bg-white border border-black/5 shadow-[0_20px_60px_rgb(0,0,0,0.06)]"
        >
          <div className="w-20 h-20 rounded-[24px] bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6">
             <Layers className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-black mb-2">Immaculate Output</h2>
          <p className="text-black/50 text-base font-medium mb-8">PDF dynamically rendered at {formatBytes(result.size)}</p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-black text-white text-xs font-bold tracking-widest uppercase shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.16)] transition-all hover:-translate-y-0.5 cursor-pointer outline-none"
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
            <button
              onClick={handleReset}
              className="flex-1 py-4 rounded-xl bg-black/[0.03] text-black hover:bg-black/10 text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer outline-none"
            >
              Start Anonymous
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
