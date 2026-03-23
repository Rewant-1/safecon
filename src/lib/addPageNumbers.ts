/**
 * Add Page Numbers to PDF — Pure business logic (no React)
 * Uses pdf-lib to stamp sequential numbers on each page.
 */

import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export type NumberPosition =
  | "bottom-center"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "top-right"
  | "top-left";

export interface PageNumberOptions {
  position?: NumberPosition;
  fontSize?: number;
  margin?: number;
  startFrom?: number;
  prefix?: string; // e.g. "Page "
}

export async function addPageNumbers(
  file: File,
  options: PageNumberOptions = {},
  onProgress?: (current: number, total: number) => void
): Promise<Blob> {
  const {
    position = "bottom-center",
    fontSize = 10,
    margin = 30,
    startFrom = 1,
    prefix = "",
  } = options;

  const bytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(bytes);
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();
    const label = `${prefix}${startFrom + i}`;
    const textWidth = font.widthOfTextAtSize(label, fontSize);

    let x: number;
    let y: number;

    switch (position) {
      case "bottom-left":
        x = margin;
        y = margin;
        break;
      case "bottom-right":
        x = width - margin - textWidth;
        y = margin;
        break;
      case "top-center":
        x = (width - textWidth) / 2;
        y = height - margin - fontSize;
        break;
      case "top-left":
        x = margin;
        y = height - margin - fontSize;
        break;
      case "top-right":
        x = width - margin - textWidth;
        y = height - margin - fontSize;
        break;
      case "bottom-center":
      default:
        x = (width - textWidth) / 2;
        y = margin;
        break;
    }

    page.drawText(label, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0.3, 0.3, 0.3),
    });

    onProgress?.(i + 1, pages.length);
  }

  const saved = await pdfDoc.save();
  return new Blob([saved as any], { type: "application/pdf" });
}
