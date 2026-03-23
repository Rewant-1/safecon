"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number; // 0–100
  label?: string;
}

export default function ProgressBar({ progress, label }: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-[11px] font-bold tracking-widest uppercase text-black/40 mb-3">
          <span>{label}</span>
          <span>{Math.round(clampedProgress)}%</span>
        </div>
      )}
      <div
        className="w-full h-[2px] bg-black/5 overflow-hidden rounded-full"
        role="progressbar"
        aria-valuenow={clampedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className="h-full bg-black"
          initial={{ width: "0%" }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
        />
      </div>
    </div>
  );
}
