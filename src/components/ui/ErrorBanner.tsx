"use client";

import { AlertCircle, X, RotateCw } from "lucide-react";
import { motion } from "framer-motion";

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export default function ErrorBanner({
  message,
  onRetry,
  onDismiss,
}: ErrorBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
      role="alert"
    >
      <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
        <AlertCircle className="w-5 h-5 text-red-500" strokeWidth={1.5} />
      </div>
      
      <p className="flex-1 text-sm font-medium text-black/80 leading-relaxed">
        {message}
      </p>
      
      <div className="flex items-center gap-1 shrink-0">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-black/5 text-black/60 hover:text-black text-xs font-semibold tracking-wide transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            RETRY
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-2 rounded-xl text-black/40 hover:text-black hover:bg-black/5 transition-colors cursor-pointer"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
