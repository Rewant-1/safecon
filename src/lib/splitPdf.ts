import { PDFDocument } from "pdf-lib";

export interface SplitOptions {
  pageRanges: string; // e.g., "1-3, 5, 8-10"
}

function parsePageRanges(rangesStr: string, totalPages: number): number[] {
  const pages = new Set<number>();
  const parts = rangesStr.split(",").map(p => p.trim()).filter(Boolean);

  for (const part of parts) {
    const rangeMatch = part.match(/^(\d+)-(\d+)$/);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10);
      const end = parseInt(rangeMatch[2], 10);
      if (start <= end && start >= 1 && end <= totalPages) {
        for (let i = start; i <= end; i++) {
          pages.add(i - 1); // 0-indexed for pdf-lib
        }
      }
    } else {
      const page = parseInt(part, 10);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        pages.add(page - 1);
      }
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

export async function splitPdf(
  file: File,
  options: SplitOptions,
  onProgress?: (current: number, total: number) => void
): Promise<Blob> {
  const bytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(bytes);
  const totalPages = pdfDoc.getPageCount();

  const pagesToKeep = parsePageRanges(options.pageRanges, totalPages);
  
  if (pagesToKeep.length === 0) {
    throw new Error("Invalid page range or no pages to extract.");
  }

  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(pdfDoc, pagesToKeep);
  
  copiedPages.forEach((page, index) => {
    newPdf.addPage(page);
    onProgress?.(index + 1, copiedPages.length);
  });

  const pdfBytes = await newPdf.save();
  return new Blob([pdfBytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
}
