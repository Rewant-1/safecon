/**
 * Images to PDF — Pure business logic (no React)
 * Uses pdf-lib to create a PDF from image files.
 */

import { PDFDocument } from "pdf-lib";

export interface ImageToPdfOptions {
  pageSize?: "A4" | "Letter" | "FitImage";
  margin?: number; // px
}

const PAGE_SIZES = {
  A4: { width: 595.28, height: 841.89 },
  Letter: { width: 612, height: 792 },
};

export async function imagesToPdf(
  files: File[],
  options: ImageToPdfOptions = {},
  onProgress?: (current: number, total: number) => void
): Promise<Blob> {
  const { pageSize = "A4", margin = 20 } = options;
  const pdfDoc = await PDFDocument.create();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const bytes = await file.arrayBuffer();
    const uint8 = new Uint8Array(bytes);

    let image;
    if (file.type === "image/png") {
      image = await pdfDoc.embedPng(uint8);
    } else {
      // jpeg, webp (webp will be converted via canvas first in the hook)
      image = await pdfDoc.embedJpg(uint8);
    }

    let pageWidth: number;
    let pageHeight: number;

    if (pageSize === "FitImage") {
      pageWidth = image.width + margin * 2;
      pageHeight = image.height + margin * 2;
    } else {
      const dims = PAGE_SIZES[pageSize as keyof typeof PAGE_SIZES];
      pageWidth = dims.width;
      pageHeight = dims.height;
    }

    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    // Scale image to fit within margin
    const maxW = pageWidth - margin * 2;
    const maxH = pageHeight - margin * 2;
    const scale = Math.min(maxW / image.width, maxH / image.height, 1);
    const drawW = image.width * scale;
    const drawH = image.height * scale;

    page.drawImage(image, {
      x: (pageWidth - drawW) / 2,
      y: (pageHeight - drawH) / 2,
      width: drawW,
      height: drawH,
    });

    onProgress?.(i + 1, files.length);
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
}
