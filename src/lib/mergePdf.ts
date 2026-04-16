import { PDFDocument } from "pdf-lib";

export async function mergePdfs(
  files: File[],
  onProgress?: (current: number, total: number) => void
): Promise<Blob> {
  const mergedPdf = await PDFDocument.create();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const bytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes);
    
    const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    copiedPages.forEach((page) => {
      mergedPdf.addPage(page);
    });

    onProgress?.(i + 1, files.length);
  }

  const pdfBytes = await mergedPdf.save();
  return new Blob([pdfBytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
}
