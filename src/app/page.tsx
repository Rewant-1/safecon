"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Image as ImageIcon, FileText, Zap, ArrowRight, Layers } from "lucide-react";

const tools = [
  {
    href: "/compress",
    title: "Image Compressor",
    description: "Intelligently reduce file sizes while preserving pristine visual fidelity.",
    icon: <Zap className="w-5 h-5 text-black" strokeWidth={1.5} />,
    features: ["JPEG, PNG, WebP", "Lossless options", "Batch processing"],
  },
  {
    href: "/images-to-pdf",
    title: "Document Binder",
    description: "Sequence and combine multiple images into a unified, elegant PDF document.",
    icon: <Layers className="w-5 h-5 text-black" strokeWidth={1.5} />,
    features: ["Drag to reorder", "A4 / Letter", "Custom margins"],
  },
  {
    href: "/pdf-to-images",
    title: "PDF Extractor",
    description: "Extract individual pages from documents as high-resolution raster images.",
    icon: <FileText className="w-5 h-5 text-black" strokeWidth={1.5} />,
    features: ["PNG / JPEG output", "Custom DPI", "ZIP archiving"],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { 
    y: 0, 
    opacity: 1, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      
      {/* Hero */}
      <motion.section 
        className="max-w-4xl text-center mb-32 relative"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/5 bg-black/[0.02] text-black/60 text-xs font-semibold tracking-widest uppercase mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-black/40 animate-pulse" />
          Zero server uploads. Absolute privacy.
        </motion.div>
        
        <motion.h1 
          variants={itemVariants}
          className="text-5xl sm:text-7xl font-bold tracking-tighter text-black leading-[1.1] mb-8"
        >
          Refined. Secure.
          <br />
          <span className="text-black/30">Client-Side Engine.</span>
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="text-muted text-lg sm:text-xl max-w-2xl mx-auto font-light leading-relaxed"
        >
          A sophisticated suite for image compression and PDF manipulation. 
          Crafted with passion, functioning entirely within the boundaries of your browser.
        </motion.p>
      </motion.section>

      {/* Tool Cards Grid */}
      <motion.section 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[1200px]"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        {tools.map((tool) => (
          <Link href={tool.href} key={tool.href} className="group outline-none">
            <motion.div 
              variants={itemVariants}
              className="relative h-full flex flex-col p-8 rounded-[24px] bg-white border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:-translate-y-1 overflow-hidden"
            >
              {/* Subtle hover gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Icon Container */}
              <div className="w-12 h-12 rounded-2xl bg-black/[0.03] flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110">
                {tool.icon}
              </div>

              <h2 className="text-xl font-semibold mb-3 tracking-tight text-black">{tool.title}</h2>
              <p className="text-sm text-muted mb-8 leading-relaxed max-w-[90%]">
                {tool.description}
              </p>

              <div className="mt-auto flex flex-col gap-2">
                {tool.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-xs font-medium text-black/50 tracking-wide uppercase">
                    <div className="w-1 h-1 rounded-full bg-black/20" />
                    {f}
                  </div>
                ))}
              </div>

              {/* Arrow */}
              <div className="absolute bottom-8 right-8 w-10 h-10 rounded-full border border-black/5 flex items-center justify-center text-black/40 opacity-0 -translate-x-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0 group-hover:bg-black group-hover:text-white">
                <ArrowRight className="w-4 h-4" />
              </div>

            </motion.div>
          </Link>
        ))}
      </motion.section>
    </div>
  );
}
