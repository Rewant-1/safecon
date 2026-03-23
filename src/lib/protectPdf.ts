/**
 * Protect PDF — Pure business logic (no React)
 * Encrypts a PDF with a user password using pdf-lib.
 */

import { PDFDocument } from "pdf-lib";

export interface ProtectOptions {
  userPassword: string;
  ownerPassword?: string;
}

export async function protectPdf(
  file: File,
  options: ProtectOptions
): Promise<Blob> {
  const bytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(bytes);

  const saved = await pdfDoc.save({
    userPassword: options.userPassword,
    ownerPassword: options.ownerPassword || options.userPassword,
  });

  return new Blob([saved], { type: "application/pdf" });
}
