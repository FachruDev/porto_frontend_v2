import React from "react";
import type { Hero } from "~/lib/types";

const pick = <T extends { locale: string }>(list: T[] | undefined, locale: "EN" | "ID") =>
  list?.find((t) => t.locale === locale) ?? list?.[0] ?? null;

export function HeroSection({ hero, locale }: { hero: Hero | null; locale: "EN" | "ID" }) {
  const current = pick(hero?.translations, locale);
  const fallback = pick(hero?.translations, locale === "EN" ? "ID" : "EN");

  const title = current?.title || fallback?.title || (locale === "EN" ? "Creative Developer" : "Developer Kreatif");
  const subtitle = current?.subtitle || fallback?.subtitle || (locale === "EN" 
    ? "Building beautiful digital experiences with modern technologies."
    : "Membangun pengalaman digital yang indah dengan teknologi modern.");

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#fafafa] px-6 py-20">
      
      {/* --- BACKGROUND LAYER (0% LAG) --- */}
      {/* 1. Base Gradient Layer */}
      <div className="absolute inset-0 z-0 bg-linear-to-tr from-orange-50/50 via-white to-blue-50/50" />
      
      {/* 2. Micro-Grid Pattern (Bikin kesan 'pro' dan gak sepi, tapi sangat ringan) */}
      <div className="absolute inset-0 z-1 opacity-[0.05] bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[30px_30px]" />

      {/* 3. Floating Shapes (Tanpa Blur, hanya opacity pastel) */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-orange-100/40 mix-blend-multiply" />
      <div className="absolute top-1/2 -right-24 h-125 w-125 rounded-full bg-blue-100/30 mix-blend-multiply" />

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10 mx-auto max-w-7xl">
        
        {/* Floating Tag */}
        <div className="mb-10 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/80 px-4 py-1.5 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
              {locale === "EN" ? "Available for Work" : "Tersedia untuk Kerja"}
            </span>
          </div>
        </div>

        {/* Huge Creative Title */}
        <div className="relative text-center">
          {/* Background Text Overlay (Shadow Text yang gak bikin lag) */}
          <span className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 select-none text-[20vw] font-black text-stone-200/20 md:text-[15vw]">
            {locale === "EN" ? "DESIGN" : "KARYA"}
          </span>

          <h1 className="text-6xl font-black leading-[0.9] tracking-tighter text-stone-900 sm:text-8xl md:text-9xl lg:text-[10rem]">
            <span className="inline-block transition-transform duration-500 hover:scale-105">
              {title.split(" ")[0]}
            </span>
            <br />
            <span className="bg-linear-to-r from-orange-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
              {title.split(" ").slice(1).join(" ")}
            </span>
          </h1>
        </div>

        {/* Subtitle & Visual Line */}
        <div className="mt-12 flex flex-col items-center gap-8">
          <p className="mx-auto max-w-2xl text-lg font-medium leading-relaxed text-stone-500 md:text-xl lg:text-2xl">
            {subtitle}
          </p>
          
          {/* Creative Minimalist Separator */}
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-stone-300" />
            <div className="flex gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-orange-300" />
              <div className="h-1.5 w-1.5 rounded-full bg-rose-300" />
              <div className="h-1.5 w-1.5 rounded-full bg-amber-300" />
            </div>
            <div className="h-px w-12 bg-stone-300" />
          </div>
        </div>

      </div>

      {/* Scroll Hint (Bottom) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-stone-900">
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
        </svg>
      </div>

    </section>
  );
}