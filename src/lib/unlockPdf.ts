/**
 * Unlock PDF — Pure business logic (no React)
 * Removes password encryption from a PDF using pdf-lib.
 */

import { decryptPDF } from "@pdfsmaller/pdf-decrypt-lite";
import { PDFDocument } from "pdf-lib";

export async function unlockPdf(
  file: File,
  password: string
): Promise<Blob> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  
  // Decrypt the PDF bytes directly
  const decryptedBytes = await decryptPDF(bytes, password);

  return new Blob([decryptedBytes as any], { type: "application/pdf" });
}
