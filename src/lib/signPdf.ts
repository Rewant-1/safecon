/**
 * Sign PDF — Pure business logic (no React)
 * Embeds a signature image (PNG) at a specified position on a page.
 */

import { PDFDocument } from "pdf-lib";

export interface SignOptions {
  signatureBlob: Blob; // PNG from canvas
  pageIndex: number; // 0-indexed
  x: number; // fraction 0–1 from left
  y: number; // fraction 0–1 from bottom
  scale?: number; // 0–1
}

export async function signPdf(
  file: File,
  options: SignOptions
): Promise<Blob> {
  const { signatureBlob, pageIndex, x, y, scale = 0.25 } = options;

  const pdfBytes = await file.arrayBuffer();
  const sigBytes = await signatureBlob.arrayBuffer();

  const pdfDoc = await PDFDocument.load(pdfBytes);
  const sigImage = await pdfDoc.embedPng(sigBytes);

  const pages = pdfDoc.getPages();
  const page = pages[Math.min(pageIndex, pages.length - 1)];
  const { width, height } = page.getSize();

  const sigW = sigImage.width * scale;
  const sigH = sigImage.height * scale;

  page.drawImage(sigImage, {
    x: x * width - sigW / 2,
    y: y * height - sigH / 2,
    width: sigW,
    height: sigH,
  });

  const saved = await pdfDoc.save();
  return new Blob([saved as any], { type: "application/pdf" });
}
