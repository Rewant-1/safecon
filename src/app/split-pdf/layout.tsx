import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Split PDF — SafeCon",
  description: "Extract specific pages or page ranges from your PDF document easily and securely in your browser.",
};

export default function SplitPdfLayout({ children }: { children: React.ReactNode }) {
  return children;
}
