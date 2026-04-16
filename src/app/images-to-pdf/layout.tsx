import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Images to PDF — SafeCon",
  description: "Combine and bind images into a single PDF document. Drag to reorder, pick page sizes. 100% client-side.",
};

export default function ImagesToPdfLayout({ children }: { children: React.ReactNode }) {
  return children;
}
