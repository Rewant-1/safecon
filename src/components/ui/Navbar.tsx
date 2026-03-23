"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const tools = [
  { href: "/compress", label: "Compress" },
  { href: "/images-to-pdf", label: "Images to PDF" },
  { href: "/pdf-to-images", label: "PDF to Images" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-6 z-50 mx-auto w-full max-w-[1400px] px-6 sm:px-12 md:px-24"
    >
      <nav className="flex items-center justify-between h-16 rounded-2xl bg-white/70 backdrop-blur-2xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] px-6">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white font-medium text-sm transition-transform duration-500 ease-out group-hover:scale-95">
            S
          </div>
          <span className="font-semibold text-sm tracking-widest uppercase">
            SafeCon
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          {tools.map((tool) => {
            const isActive = pathname === tool.href;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className={`relative text-xs font-medium tracking-wide uppercase transition-colors duration-300 ${
                  isActive ? "text-black" : "text-muted hover:text-black"
                }`}
              >
                {tool.label}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-2 left-0 right-0 h-px bg-black"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/5 bg-black/5 text-black text-[10px] font-bold tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
          Client-Side
        </div>

      </nav>
    </motion.header>
  );
}
