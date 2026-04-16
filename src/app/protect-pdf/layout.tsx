import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Protect PDF — SafeCon",
  description: "Encrypt your PDF with a password using AES encryption. 100% client-side, your password never leaves the browser.",
};

export default function ProtectPdfLayout({ children }: { children: React.ReactNode }) {
  return children;
}
