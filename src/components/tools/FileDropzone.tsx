"use client";

import { useDropzone, type Accept } from "react-dropzone";
import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FolderUp, XCircle } from "lucide-react";

interface FileDropzoneProps {
  onFilesAccepted: (files: File[]) => void;
  accept?: Accept;
  maxSize?: number; // bytes
  maxFiles?: number;
  label?: string;
  sublabel?: string;
  disabled?: boolean;
}

export default function FileDropzone({
  onFilesAccepted,
  accept,
  maxSize = 50 * 1024 * 1024,
  maxFiles = 20,
  label = "Drop files here or click to browse",
  sublabel,
  disabled = false,
}: FileDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFilesAccepted(acceptedFiles);
      }
    },
    [onFilesAccepted]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept,
      maxSize,
      maxFiles,
      disabled,
    });

  return (
    <motion.div
      {...getRootProps() as any}
      initial={false}
      animate={{
        scale: isDragActive ? 0.98 : 1,
        backgroundColor: isDragReject 
          ? "rgba(239, 68, 68, 0.04)" 
          : isDragActive 
          ? "rgba(0, 0, 0, 0.04)" 
          : "rgba(0, 0, 0, 0.01)",
        borderColor: isDragReject 
          ? "rgba(239, 68, 68, 0.2)" 
          : isDragActive 
          ? "rgba(0, 0, 0, 0.2)" 
          : "rgba(0, 0, 0, 0.05)",
      }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
      className={`
        relative flex flex-col items-center justify-center gap-6 py-20 px-8 
        rounded-[32px] border cursor-pointer outline-none overflow-hidden
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <input {...getInputProps()} />

      {/* Decorative gradient blur behind icon */}
      <AnimatePresence>
        {isDragActive && !isDragReject && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center -z-10"
          >
            <div className="w-64 h-64 bg-black/5 rounded-full blur-3xl" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{ 
          y: isDragActive ? -4 : 0,
          color: isDragReject ? "#EF4444" : "var(--foreground)"
        }}
        className="w-16 h-16 rounded-[20px] bg-white border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-center"
      >
        {isDragReject ? (
          <XCircle strokeWidth={1.5} className="w-6 h-6 text-red-500" />
        ) : isDragActive ? (
          <FolderUp strokeWidth={1.5} className="w-6 h-6 text-black" />
        ) : (
          <UploadCloud strokeWidth={1.5} className="w-6 h-6 text-black/60" />
        )}
      </motion.div>

      <div className="text-center space-y-2">
        <p className="text-lg font-medium tracking-tight text-black">
          {isDragActive
            ? isDragReject
              ? "Unsupported file type"
              : "Release to upload"
            : label}
        </p>
        {sublabel && (
          <p className="text-sm text-black/40 font-medium tracking-wide">
            {sublabel}
          </p>
        )}
      </div>
    </motion.div>
  );
}
