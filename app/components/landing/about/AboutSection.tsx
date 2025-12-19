"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import type { About } from "~/lib/types";

const pick = <T extends { locale: string }>(list: T[] | undefined, locale: "EN" | "ID") =>
  list?.find((t) => t.locale === locale) ?? list?.[0] ?? null;

export function AboutSection({ about, locale }: { about: About | null; locale: "EN" | "ID" }) {
  const current = pick(about?.translations, locale);
  const fallback = pick(about?.translations, locale === "EN" ? "ID" : "EN");

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
      easing: "ease-out",
      offset: 100, // Trigger lebih awal agar terasa responsif
    });
  }, []);

  return (
    <section className="relative mx-auto my-24 max-w-7xl px-6">
      {/* OPTIMASI: 
          1. Ganti 'backdrop-blur' ke 'bg-white/95' (lebih ringan).
          2. Tambah 'will-change-transform' untuk memicu GPU Acceleration.
      */}
      <div className="grid items-center gap-12 overflow-hidden rounded-[2.5rem] border border-stone-200/60 bg-[#FAFAFAd9] p-8 md:grid-cols-2 md:p-16 lg:gap-20 shadow-sm will-change-transform">
        
        {/* --- KIRI: FOTO --- */}
        <div 
          className="relative w-full overflow-hidden rounded-[2rem] bg-stone-100 will-change-transform"
          data-aos="fade-right"
        >
          {about?.profile ? (
            <img 
              src={about.profile} 
              alt="Profile" 
              loading="lazy" // Penting: Jangan load semua gambar sekaligus
              className="aspect-4/5 w-full object-cover transition-transform duration-500 hover:scale-105" 
            />
          ) : (
            <div className="aspect-4/5 flex w-full items-center justify-center text-stone-400">No Image</div>
          )}
        </div>

        {/* --- KANAN: TEKS --- */}
        <div 
          className="flex flex-col space-y-6 will-change-transform" 
          data-aos="fade-left"
        >
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-[0.5em] text-orange-500/80">
              {locale === "EN" ? "The Story" : "Cerita Saya"}
            </h3>
            <h2 className="text-5xl font-black tracking-tighter text-stone-900 md:text-7xl">
              {current?.title || fallback?.title || "Story."}
            </h2>
          </div>

          <p className="text-lg leading-relaxed text-stone-600 md:text-xl font-medium">
            {current?.content || fallback?.content}
          </p>

          <div className="flex items-center gap-3">
             <div className="h-px w-8 bg-orange-400" />
             <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                Fresh Graduate & Developer
             </span>
          </div>
        </div>
      </div>
    </section>
  );
}