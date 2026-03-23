"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hash, Download, RotateCcw } from "lucide-react";
import FileDropzone from "@/components/tools/FileDropzone";
import ProgressBar from "@/components/ui/ProgressBar";
import ErrorBanner from "@/components/ui/ErrorBanner";
import { useFileProcessor } from "@/hooks/useFileProcessor";
import { addPageNumbers, type NumberPosition } from "@/lib/addPageNumbers";
import { formatBytes } from "@/lib/compress";

const positions: { value: NumberPosition; label: string }[] = [
  { value: "bottom-center", label: "Bottom Center" },
  { value: "bottom-right", label: "Bottom Right" },
  { value: "bottom-left", label: "Bottom Left" },
  { value: "top-center", label: "Top Center" },
  { value: "top-right", label: "Top Right" },
  { value: "top-left", label: "Top Left" },
];

export default function AddPageNumbersPage() {
  const [file, setFile] = useState<File | null>(null);
  const [position, setPosition] = useState<NumberPosition>("bottom-center");
  const [startFrom, setStartFrom] = useState(1);
  const [prefix, setPrefix] = useState("");
  const { status, progress, result, error, process, reset } = useFileProcessor<Blob>();

  const handleFiles = useCallback((accepted: File[]) => {
    if (accepted.length > 0) setFile(accepted[0]);
  }, []);

  const handleProcess = async () => {
    if (!file) return;
    await process(async (onProgress) => {
      return await addPageNumbers(file, { position, startFrom, prefix }, (c, t) =>
        onProgress((c / t) * 100)
      );
    });
  };

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement("a");
    a.href = url;
    a.download = file?.name.replace(/\.pdf$/i, "_numbered.pdf") ?? "numbered.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => { setFile(null); reset(); };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-16 text-center">
        <div className="w-12 h-12 rounded-2xl bg-black/[0.03] flex items-center justify-center mx-auto mb-6">
          <Hash className="w-5 h-5 text-black" strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black mb-4">Page Numbers</h1>
        <p className="text-muted text-lg font-light">Stamp sequential numbers on every page of your document.</p>
      </div>

      <AnimatePresence mode="popLayout">
        {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-8"><ErrorBanner message={error} onRetry={handleProcess} onDismiss={reset} /></motion.div>}
      </AnimatePresence>

      {status === "idle" && !file && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <FileDropzone onFilesAccepted={handleFiles} accept={{ "application/pdf": [".pdf"] }} maxFiles={1} label="Drop your PDF here" sublabel="We'll add elegant page numbers" />
        </motion.div>
      )}

      {status === "idle" && file && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center justify-between p-5 rounded-[24px] bg-white border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div><p className="text-base font-semibold">{file.name}</p><p className="text-xs text-black/40 mt-1">{formatBytes(file.size)}</p></div>
            <button onClick={handleReset} className="text-black/20 hover:text-black transition-colors cursor-pointer"><RotateCcw className="w-4 h-4" /></button>
          </div>

          {/* Position Grid */}
          <div className="p-6 rounded-2xl bg-white border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
            <label className="block text-xs font-bold tracking-widest text-black/40 uppercase mb-4">Position</label>
            <div className="grid grid-cols-3 gap-2">
              {positions.map((pos) => (
                <button key={pos.value} onClick={() => setPosition(pos.value)}
                  className={`py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${position === pos.value ? "bg-black text-white" : "bg-black/[0.03] text-black/40 hover:text-black"}`}>
                  {pos.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-white border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
              <label className="block text-xs font-bold tracking-widest text-black/40 uppercase mb-3">Start From</label>
              <input type="number" value={startFrom} onChange={(e) => setStartFrom(parseInt(e.target.value) || 1)} min={1}
                className="w-full px-4 py-3 rounded-xl bg-black/[0.03] border-none text-sm font-semibold outline-none focus:ring-2 focus:ring-black/10" />
            </div>
            <div className="p-6 rounded-2xl bg-white border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
              <label className="block text-xs font-bold tracking-widest text-black/40 uppercase mb-3">Prefix</label>
              <input type="text" value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder='e.g. "Page "'
                className="w-full px-4 py-3 rounded-xl bg-black/[0.03] border-none text-sm font-semibold outline-none focus:ring-2 focus:ring-black/10 placeholder:text-black/20" />
            </div>
          </div>

          <button onClick={handleProcess} className="w-full py-4 rounded-xl bg-black text-white text-sm font-bold tracking-widest uppercase shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.16)] transition-all hover:-translate-y-0.5 cursor-pointer">
            Apply Numbering
          </button>
        </motion.div>
      )}

      {status === "processing" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-24 space-y-8">
          <div className="w-24 h-24 rounded-full border border-black/10 border-t-black animate-spin" style={{ animationDuration: "2s" }} />
          <div className="w-full max-w-sm"><ProgressBar progress={progress} label="Stamping Pages" /></div>
        </motion.div>
      )}

      {status === "done" && result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center py-16 px-4 rounded-[32px] bg-white border border-black/5 shadow-[0_20px_60px_rgb(0,0,0,0.06)]">
          <div className="w-20 h-20 rounded-[24px] bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6"><Hash className="w-8 h-8" strokeWidth={1.5} /></div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Numbered & Ready</h2>
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
