"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number; // 0–100
  label?: string;
}

export default function ProgressBar({ progress, label }: ProgressBarProps) {
  const safeProgress = Number.isFinite(progress) ? progress : 0;
  const clampedProgress = Math.min(100, Math.max(0, safeProgress));
  const labelId = label ? `progressbar-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined;

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-[11px] font-bold tracking-widest uppercase text-black/40 mb-3">
          <span id={labelId}>{label}</span>
          <span>{Math.round(clampedProgress)}%</span>
        </div>
      )}
      <progress
        className="w-full h-[2px] bg-black/5 overflow-hidden rounded-full"
        {...(labelId
          ? { "aria-labelledby": labelId }
          : { "aria-label": "Progress" })}
        value={clampedProgress}
        max={100}
      />
    </div>
  );
}
