import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rotate PDF — SafeCon",
  description: "Rotate the pages in your PDF document. Simple, fast, and entirely client-side without any tracking.",
};

export default function RotatePdfLayout({ children }: { children: React.ReactNode }) {
  return children;
}
