/**
 * PDF to Images — Pure business logic (no React)
 * Uses pdfjs-dist to render PDF pages to canvas, then exports as images.
 * Uses JSZip + file-saver for batch download.
 */

import JSZip from "jszip";
import { saveAs } from "file-saver";

export interface PdfToImagesOptions {
  scale?: number; // DPI multiplier, default 2
  format?: "png" | "jpeg";
  quality?: number; // 0–1, for JPEG
  pageRange?: { start: number; end: number }; // 1-indexed
}

export interface RenderedPage {
  pageNumber: number;
  blob: Blob;
  dataUrl: string;
}

// Dynamically import pdfjs-dist to support lazy loading
async function getPdfJs() {
  const pdfjs = await import("pdfjs-dist");
  // Set worker source
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
  return pdfjs;
}

export async function renderPdfPages(
  file: File,
  options: PdfToImagesOptions = {},
  onProgress?: (current: number, total: number) => void
): Promise<RenderedPage[]> {
  const { scale = 2, format = "png", quality = 0.92 } = options;

  const pdfjs = await getPdfJs();
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

  const totalPages = pdf.numPages;
  const start = options.pageRange?.start ?? 1;
  const end = Math.min(options.pageRange?.end ?? totalPages, totalPages);

  const results: RenderedPage[] = [];

  for (let pageNum = start; pageNum <= end; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const ctx = canvas.getContext("2d")!;
    await page.render({ canvasContext: ctx, viewport, canvas: null }).promise;

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (!b) return reject(new Error(`Failed to render page ${pageNum}`));
          resolve(b);
        },
        `image/${format}`,
        format === "jpeg" ? quality : undefined
      );
    });

    const dataUrl = canvas.toDataURL(`image/${format}`, quality);

    results.push({ pageNumber: pageNum, blob, dataUrl });
    onProgress?.(pageNum - start + 1, end - start + 1);
  }

  return results;
}

export async function downloadAsZip(
  pages: RenderedPage[],
  baseName: string,
  format: "png" | "jpeg" = "png"
) {
  const zip = new JSZip();
  const ext = format === "jpeg" ? "jpg" : "png";

  pages.forEach((page) => {
    zip.file(`${baseName}_page_${page.pageNumber}.${ext}`, page.blob);
  });

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `${baseName}_images.zip`);
}
