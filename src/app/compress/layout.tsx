import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Compressor — SafeCon",
  description: "Compress JPEG, PNG, and WebP images entirely in your browser. No uploads, no tracking.",
};

export default function CompressLayout({ children }: { children: React.ReactNode }) {
  return children;
}
