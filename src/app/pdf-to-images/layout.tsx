import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF to Images — SafeCon",
  description: "Convert PDF pages into high-quality PNG or JPEG images. Adjustable DPI, batch download as ZIP. All in-browser.",
};

export default function PdfToImagesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
