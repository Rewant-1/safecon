"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Zap,
  Layers,
  FileText,
  Hash,
  Stamp,
  PenTool,
  Lock,
  Unlock,
  ArrowRight,
} from "lucide-react";

const categories = [
  {
    label: "Image Tools",
    tools: [
      {
        href: "/compress",
        title: "Compress",
        description: "Sculpt file sizes while preserving clarity.",
        icon: <Zap className="w-5 h-5" strokeWidth={1.5} />,
      },
      {
        href: "/images-to-pdf",
        title: "Images → PDF",
        description: "Bind visuals into a unified document.",
        icon: <Layers className="w-5 h-5" strokeWidth={1.5} />,
      },
      {
        href: "/pdf-to-images",
        title: "PDF → Images",
        description: "Extract pages as high-res rasters.",
        icon: <FileText className="w-5 h-5" strokeWidth={1.5} />,
      },
    ],
  },
  {
    label: "Edit & Annotate",
    tools: [
      {
        href: "/add-page-numbers",
        title: "Page Numbers",
        description: "Stamp sequential numbering on every page.",
        icon: <Hash className="w-5 h-5" strokeWidth={1.5} />,
      },
      {
        href: "/watermark-pdf",
        title: "Watermark",
        description: "Brand pages with text or logo overlays.",
        icon: <Stamp className="w-5 h-5" strokeWidth={1.5} />,
      },
      {
        href: "/sign-pdf",
        title: "Sign PDF",
        description: "Draw and embed your signature instantly.",
        icon: <PenTool className="w-5 h-5" strokeWidth={1.5} />,
      },
    ],
  },
  {
    label: "Security",
    tools: [
      {
        href: "/protect-pdf",
        title: "Protect",
        description: "Encrypt with password-grade AES.",
        icon: <Lock className="w-5 h-5" strokeWidth={1.5} />,
      },
      {
        href: "/unlock-pdf",
        title: "Unlock",
        description: "Remove existing password protection.",
        icon: <Unlock className="w-5 h-5" strokeWidth={1.5} />,
      },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { y: 16, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Hero — compact, punchy */}
      <motion.section
        className="max-w-3xl text-center mb-24 pt-8"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/5 bg-black/[0.02] text-black/60 text-[10px] font-bold tracking-[0.2em] uppercase mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-black/40 animate-pulse" />
          Files never leave your browser
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-7xl font-bold tracking-tighter text-black leading-[1.05] mb-6"
        >
          Every PDF tool
          <br />
          <span className="text-black/25">you&apos;ll ever need.</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-black/50 text-lg font-light leading-relaxed max-w-lg mx-auto"
        >
          Compress, convert, watermark, sign, protect — powered entirely
          by your browser. No uploads. No tracking. No compromise.
        </motion.p>
      </motion.section>

      {/* Categorized Tool Grid */}
      {categories.map((category, catIdx) => (
        <motion.section
          key={category.label}
          className="w-full max-w-[1200px] mb-20"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-black/30">
              {String(catIdx + 1).padStart(2, "0")}
            </span>
            <div className="h-px flex-1 bg-black/5" />
            <span className="text-xs font-bold tracking-widest uppercase text-black/60">
              {category.label}
            </span>
            <div className="h-px flex-1 bg-black/5" />
          </motion.div>

          <div
            className={`grid gap-5 ${
              category.tools.length === 2
                ? "grid-cols-1 sm:grid-cols-2"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {category.tools.map((tool) => (
              <Link href={tool.href} key={tool.href} className="group outline-none">
                <motion.div
                  variants={itemVariants}
                  className="relative h-full flex flex-col p-7 rounded-[24px] bg-white border border-black/[0.04] shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:-translate-y-1 overflow-hidden"
                >
                  {/* Hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="flex items-start justify-between mb-6">
                    <div className="w-11 h-11 rounded-[14px] bg-black/[0.03] flex items-center justify-center text-black transition-transform duration-500 group-hover:scale-110">
                      {tool.icon}
                    </div>
                    <div className="w-9 h-9 rounded-full border border-black/5 flex items-center justify-center text-black/30 opacity-0 translate-x-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0 group-hover:bg-black group-hover:text-white group-hover:border-black">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold tracking-tight text-black mb-1.5">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-black/40 font-medium leading-relaxed">
                    {tool.description}
                  </p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.section>
      ))}

      {/* Bottom privacy note */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center pb-8"
      >
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-black/20">
          Engineered with obsessive attention to privacy & craft
        </p>
      </motion.div>
    </div>
  );
}
