import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full max-w-[1400px] mx-auto px-6 sm:px-12 md:px-24 pb-8 pt-16">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-black/5">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/Logo.png"
            alt="SafeCon"
            width={20}
            height={20}
            className="w-auto h-auto min-w-[20px] min-h-[20px] transition-transform duration-500 group-hover:scale-95"
          />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-black/40">
            SafeCon
          </span>
        </Link>
        <p className="text-[10px] font-medium tracking-wider text-black/25">
          100% client-side · No uploads · No tracking
        </p>
      </div>
    </footer>
  );
}
