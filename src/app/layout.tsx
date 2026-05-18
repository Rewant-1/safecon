import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SafeCon | Every PDF tool you'll ever need",
    template: "%s | SafeCon",
  },
  description:
    "Compress images, construct PDFs, extract pages, merge, split, rotate, watermark, protect, and unlock PDFs. SafeCon is 100% private, elegant, and secure. Powered entirely by your browser.",
  keywords: [
    "SafeCon",
    "PDF tools",
    "compress PDF",
    "merge PDF",
    "split PDF",
    "protect PDF",
    "watermark PDF",
    "browser PDF tools",
    "private PDF tools"
  ],
  authors: [{ name: "SafeCon" }],
  creator: "SafeCon",
  publisher: "SafeCon",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://safecon-phi.vercel.app/",
    siteName: "SafeCon",
    title: "SafeCon",
    description: "Every PDF tool you'll ever need. Powered entirely by your browser. No uploads. No tracking.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SafeCon",
    description: "Every PDF tool you'll ever need. Powered entirely by your browser.",
  },
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased selection:bg-black selection:text-white`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground bg-grain relative">
        <Navbar />
        <main className="flex-1 max-w-[1400px] w-full mx-auto pb-32 pt-16 px-6 sm:px-12 md:px-24">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
