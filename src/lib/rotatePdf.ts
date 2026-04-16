import { PDFDocument, degrees } from "pdf-lib";

export interface RotateOptions {
  angle: number; // 90, 180, 270 (or -90)
}

export async function rotatePdf(
  file: File,
  options: RotateOptions,
  onProgress?: (current: number, total: number) => void
): Promise<Blob> {
  const bytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(bytes);
  const pages = pdfDoc.getPages();

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    // get existing rotation and add the new angle
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees(currentRotation + options.angle));
    onProgress?.(i + 1, pages.length);
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
}
