/**
 * Unlock PDF — Pure business logic (no React)
 * Removes password encryption from a PDF using pdf-lib.
 */

import { PDFDocument } from "pdf-lib";

export async function unlockPdf(
  file: File,
  password: string
): Promise<Blob> {
  const bytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(bytes, { password });

  // Save without encryption
  const saved = await pdfDoc.save();
  return new Blob([saved], { type: "application/pdf" });
}
