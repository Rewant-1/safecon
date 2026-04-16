import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign PDF — SafeCon",
  description: "Draw your signature and embed it on any PDF document. Entirely in-browser, no uploads required.",
};

export default function SignPdfLayout({ children }: { children: React.ReactNode }) {
  return children;
}
