"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const categories = [
  {
    label: "Images",
    links: [
      { href: "/compress", label: "Compress" },
      { href: "/images-to-pdf", label: "Images → PDF" },
      { href: "/pdf-to-images", label: "PDF → Images" },
    ],
  },
  {
    label: "Organize",
    links: [
      { href: "/merge-pdf", label: "Merge" },
      { href: "/split-pdf", label: "Split" },
      { href: "/rotate-pdf", label: "Rotate" },
    ],
  },
  {
    label: "Edit",
    links: [
      { href: "/add-page-numbers", label: "Page Numbers" },
      { href: "/watermark-pdf", label: "Watermark" },
      { href: "/sign-pdf", label: "Sign PDF" },
    ],
  },
  {
    label: "Security",
    links: [
      { href: "/protect-pdf", label: "Protect" },
      { href: "/unlock-pdf", label: "Unlock" },
    ],
  },
];


export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
      className="sticky top-6 z-50 mx-auto w-full max-w-[1400px] px-6 sm:px-12 md:px-24"
    >
      <nav className="flex items-center justify-between h-16 rounded-2xl bg-white/70 backdrop-blur-2xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/Logo.png"
            alt="SafeCon"
            width={32}
            height={32}
            className="w-auto h-auto min-w-[32px] min-h-[32px] transition-transform duration-500 ease-out group-hover:scale-95"
          />
          <span className="font-semibold text-sm tracking-widest uppercase hidden sm:inline">
            SafeCon
          </span>
        </Link>

        {/* Desktop: Clean minimal links */}
        <div className="hidden xl:flex items-center gap-5">
          {categories.map((cat, idx) => (
            <div key={cat.label} className="flex items-center gap-5">
              {idx > 0 && <div className="w-px h-3 bg-black/10" />}
              <div className="flex items-center gap-4">
                {cat.links.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`relative text-[11px] font-semibold tracking-wide transition-colors duration-300 ${
                        isActive ? "text-black" : "text-black/40 hover:text-black"
                      }`}
                    >
                      {link.label}
                      {isActive && (
                        <motion.div
                          layoutId="navbar-indicator"
                          className="absolute -bottom-1.5 left-0 right-0 h-px bg-black"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="xl:hidden p-2 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="xl:hidden mt-2 p-4 rounded-2xl bg-white/90 backdrop-blur-2xl border border-black/5 shadow-[0_20px_60px_rgb(0,0,0,0.08)]"
          >
            {categories.map((cat) => (
              <div key={cat.label} className="mb-4 last:mb-0">
                <p className="text-[9px] font-bold tracking-widest uppercase text-black/30 mb-2 px-2">{cat.label}</p>
                <div className="grid grid-cols-2 gap-1">
                  {cat.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                        pathname === link.href
                          ? "bg-black text-white"
                          : "text-black/60 hover:bg-black/5"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
