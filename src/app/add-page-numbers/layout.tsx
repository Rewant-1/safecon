import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Page Numbers — SafeCon",
  description: "Stamp sequential page numbers on every page of your PDF. Choose position, prefix, and start number.",
};

export default function AddPageNumbersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
