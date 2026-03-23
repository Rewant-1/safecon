/**
 * Image Compression — Pure business logic (no React)
 * Uses Canvas API to re-encode images at a given quality.
 */

export interface CompressResult {
  blob: Blob;
  originalSize: number;
  compressedSize: number;
  fileName: string;
}

export async function compressImage(
  file: File,
  quality: number, // 0–1
  outputFormat: "jpeg" | "png" | "webp" = "jpeg"
): Promise<CompressResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        return reject(new Error("Canvas context not available"));
      }

      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Compression failed"));
          const ext = outputFormat === "jpeg" ? "jpg" : outputFormat;
          const baseName = file.name.replace(/\.[^/.]+$/, "");
          resolve({
            blob,
            originalSize: file.size,
            compressedSize: blob.size,
            fileName: `${baseName}_compressed.${ext}`,
          });
        },
        `image/${outputFormat}`,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Could not load image: ${file.name}`));
    };
    img.src = url;
  });
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function calcSavings(original: number, compressed: number): number {
  if (original === 0) return 0;
  return Math.round(((original - compressed) / original) * 100);
}
