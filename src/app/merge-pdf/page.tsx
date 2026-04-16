"use client";

import { useState, useCallback } from "react";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import { CopyPlus, X, Download, RotateCcw, GripVertical } from "lucide-react";
import FileDropzone from "@/components/tools/FileDropzone";
import ProgressBar from "@/components/ui/ProgressBar";
import ErrorBanner from "@/components/ui/ErrorBanner";
import { useFileProcessor } from "@/hooks/useFileProcessor";
import { mergePdfs } from "@/lib/mergePdf";
import { formatBytes } from "@/lib/compress";

export default function MergePdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const { status, progress, result, error, process, reset } = useFileProcessor<Blob>();

  const handleFiles = useCallback((accepted: File[]) => {
    setFiles((prev) => [...prev, ...accepted]);
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    if (files.length === 0) return;
    await process(async (onProgress) => {
      return await mergePdfs(files, (current, total) => {
        onProgress((current / total) * 100);
      });
    });
  };

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement("a");
    a.href = url;
    a.download = "SafeCon_Merged.pdf";
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
          <CopyPlus className="w-5 h-5 text-black" strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black mb-4">
          Merge PDF
        </h1>
        <p className="text-muted text-lg font-light">
          Merge multiple PDFs together into a single unified document.
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
            <ErrorBanner message={error} onRetry={handleMerge} onDismiss={reset} />
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
            accept={{ "application/pdf": [".pdf"] }}
            maxFiles={100}
            label="Drop PDFs here"
            sublabel="Drag to reorder later"
          />

          {files.length > 0 && (
            <div className="pt-8 border-t border-black/5 space-y-8">
              <div>
                <div className="flex justify-between items-end mb-4 px-2">
                  <h3 className="text-xs font-bold tracking-widest text-black/40 uppercase">Sequence ({files.length})</h3>
                  <span className="text-[10px] uppercase tracking-widest text-black/30 font-semibold">Drag to reorder</span>
                </div>
                
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

              <button
                onClick={handleMerge}
                className="w-full py-4 rounded-xl bg-black text-white text-sm font-bold tracking-widest uppercase shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.16)] transition-all hover:-translate-y-0.5 cursor-pointer outline-none"
              >
                Merge Documents
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
            <ProgressBar progress={progress} label="Merging Documents" />
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
             <CopyPlus className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-black mb-2">PDF Ready</h2>
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
              Start Over
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
