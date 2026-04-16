import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merge PDF — SafeCon",
  description: "Combine multiple PDF files into one. Drag and drop to reorder, completely private and secure.",
};

export default function MergePdfLayout({ children }: { children: React.ReactNode }) {
  return children;
}
