"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Unlock, Download, Eye, EyeOff } from "lucide-react";
import FileDropzone from "@/components/tools/FileDropzone";
import ErrorBanner from "@/components/ui/ErrorBanner";
import { useFileProcessor } from "@/hooks/useFileProcessor";
import { unlockPdf } from "@/lib/unlockPdf";
import { formatBytes } from "@/lib/compress";

export default function UnlockPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { status, result, error, process, reset } = useFileProcessor<Blob>();

  const handleFiles = useCallback((accepted: File[]) => {
    if (accepted.length > 0) setFile(accepted[0]);
  }, []);

  const handleProcess = async () => {
    if (!file || !password) return;
    await process(async () => {
      return await unlockPdf(file, password);
    });
  };

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement("a");
    a.href = url;
    a.download = file?.name.replace(/\.pdf$/i, "_unlocked.pdf") ?? "unlocked.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => { setFile(null); setPassword(""); reset(); };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-16 text-center">
        <div className="w-12 h-12 rounded-2xl bg-black/[0.03] flex items-center justify-center mx-auto mb-6">
          <Unlock className="w-5 h-5 text-black" strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black mb-4">Unlock PDF</h1>
        <p className="text-muted text-lg font-light">Remove password protection from an encrypted document.</p>
      </div>

      <AnimatePresence mode="popLayout">
        {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-8"><ErrorBanner message={error} onRetry={handleProcess} onDismiss={reset} /></motion.div>}
      </AnimatePresence>

      {status === "idle" && !file && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <FileDropzone onFilesAccepted={handleFiles} accept={{ "application/pdf": [".pdf"] }} maxFiles={1} label="Drop your encrypted PDF" sublabel="You'll need to provide the password" />
        </motion.div>
      )}

      {status === "idle" && file && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center justify-between p-5 rounded-[24px] bg-white border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div><p className="text-base font-semibold">{file.name}</p><p className="text-xs text-black/40 mt-1">{formatBytes(file.size)}</p></div>
            <button onClick={handleReset} className="text-black/20 hover:text-black transition-colors cursor-pointer"><Unlock className="w-4 h-4" /></button>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
            <label className="block text-xs font-bold tracking-widest text-black/40 uppercase mb-3">Document Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter the document's password"
                className="w-full px-4 py-4 pr-12 rounded-xl bg-black/[0.03] border-none text-sm font-semibold outline-none focus:ring-2 focus:ring-black/10 placeholder:text-black/20" />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 hover:text-black transition-colors cursor-pointer">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-black/30 tracking-wider uppercase mt-3">Your password is never transmitted. Decryption is 100% local.</p>
          </div>

          <button onClick={handleProcess} disabled={!password}
            className="w-full py-4 rounded-xl bg-black text-white text-sm font-bold tracking-widest uppercase shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.16)] transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">
            Decrypt & Unlock
          </button>
        </motion.div>
      )}

      {status === "done" && result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center py-16 px-4 rounded-[32px] bg-white border border-black/5 shadow-[0_20px_60px_rgb(0,0,0,0.06)]">
          <div className="w-20 h-20 rounded-[24px] bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6"><Unlock className="w-8 h-8" strokeWidth={1.5} /></div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Liberated</h2>
          <p className="text-black/40 mb-8">Password protection has been removed</p>
          <div className="flex gap-4">
            <button onClick={handleDownload} className="flex items-center gap-2 px-6 py-4 rounded-xl bg-black text-white text-xs font-bold tracking-widest uppercase shadow-lg cursor-pointer"><Download className="w-4 h-4" /> Download</button>
            <button onClick={handleReset} className="px-6 py-4 rounded-xl bg-black/[0.03] text-xs font-bold tracking-widest uppercase cursor-pointer">New File</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
