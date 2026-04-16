/**
 * Watermark PDF — Pure business logic (no React)
 * Uses pdf-lib to overlay text or image watermarks.
 */

import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";

export interface WatermarkTextOptions {
  type: "text";
  text: string;
  fontSize?: number;
  opacity?: number;
  rotation?: number; // degrees
  color?: { r: number; g: number; b: number };
}

export interface WatermarkImageOptions {
  type: "image";
  imageFile: File;
  opacity?: number;
  scale?: number; // 0–1
}

export type WatermarkOptions = WatermarkTextOptions | WatermarkImageOptions;

export async function watermarkPdf(
  file: File,
  options: WatermarkOptions,
  onProgress?: (current: number, total: number) => void
): Promise<Blob> {
  const bytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(bytes);
  const pages = pdfDoc.getPages();

  if (options.type === "text") {
    const {
      text,
      fontSize = 48,
      opacity = 0.15,
      rotation = -45,
      color = { r: 0.5, g: 0.5, b: 0.5 },
    } = options;

    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();
      const textWidth = font.widthOfTextAtSize(text, fontSize);

      page.drawText(text, {
        x: (width - textWidth) / 2,
        y: height / 2,
        size: fontSize,
        font,
        color: rgb(color.r, color.g, color.b),
        opacity,
        rotate: degrees(rotation),
      });

      onProgress?.(i + 1, pages.length);
    }
  } else {
    const { imageFile, opacity = 0.2, scale = 0.3 } = options;
    const imgBytes = await imageFile.arrayBuffer();
    const image = imageFile.type === "image/png"
      ? await pdfDoc.embedPng(imgBytes)
      : await pdfDoc.embedJpg(imgBytes);

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();
      const imgW = image.width * scale;
      const imgH = image.height * scale;

      page.drawImage(image, {
        x: (width - imgW) / 2,
        y: (height - imgH) / 2,
        width: imgW,
        height: imgH,
        opacity,
      });

      onProgress?.(i + 1, pages.length);
    }
  }

  const saved = await pdfDoc.save();
  return new Blob([saved as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
}
