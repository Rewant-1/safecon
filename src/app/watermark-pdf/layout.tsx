import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Watermark PDF — SafeCon",
  description: "Brand every page of your PDF with text or image watermarks. Full control over opacity, rotation, and placement.",
};

export default function WatermarkPdfLayout({ children }: { children: React.ReactNode }) {
  return children;
}
