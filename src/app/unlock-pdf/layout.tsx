import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unlock PDF — SafeCon",
  description: "Remove password protection from an encrypted PDF document. Decryption happens entirely in your browser.",
};

export default function UnlockPdfLayout({ children }: { children: React.ReactNode }) {
  return children;
}
