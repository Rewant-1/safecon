import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SafeCon — Elegant Client-Side Toolkit",
  description:
    "Compress images, construct PDFs, and extract pages. 100% private, elegant, and secure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased selection:bg-black selection:text-white`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground bg-grain relative">
        <Navbar />
        <main className="flex-1 max-w-[1400px] w-full mx-auto pb-32 pt-16 px-6 sm:px-12 md:px-24">
          {children}
        </main>
      </body>
    </html>
  );
}
