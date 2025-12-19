"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import type { Experience } from "~/lib/types";

const pick = <T extends { locale: string }>(list: T[] | undefined, locale: "EN" | "ID") =>
  list?.find((t) => t.locale === locale) ?? list?.[0] ?? null;

export function ExperienceSection({ experiences, locale }: { experiences: Experience[]; locale: "EN" | "ID" }) {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
    });
  }, []);

  return (
    <section className="relative mx-auto my-32 max-w-7xl px-6">
      {/* --- HEADER SECTION --- */}
      <div className="mb-20 text-center" data-aos="fade-up">
        <div className="relative inline-block">
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 select-none text-7xl font-black text-stone-100 md:text-9xl">
            HISTORY
          </span>
          <h2 className="relative text-4xl font-black tracking-tighter text-stone-900 md:text-6xl">
            {locale === "EN" ? "Experience." : "Pengalaman."}
          </h2>
        </div>
        <p className="mt-4 text-sm font-bold uppercase tracking-[0.3em] text-orange-400">
          {locale === "EN" ? "Professional Journey" : "Perjalanan Profesional"}
        </p>
      </div>

      {/* --- TIMELINE CONTAINER --- */}
      <div className="relative mx-auto max-w-5xl">
        
        {/* Garis Tengah (Hanya muncul di Desktop) */}
        <div className="absolute left-1/2 hidden h-full w-px -translate-x-1/2 bg-linear-to-b from-transparent via-stone-200 to-transparent md:block" />

        <div className="space-y-12 md:space-y-24">
          {experiences.map((exp, index) => {
            const current = pick(exp.translations, locale);
            const fallback = pick(exp.translations, locale === "EN" ? "ID" : "EN");
            const isEven = index % 2 === 0;

            return (
              <div key={exp.id} className="relative flex flex-col items-center justify-between md:flex-row">
                
                {/* 1. Konten Kiri (Untuk index genap) */}
                <div className={`w-full md:w-[45%] ${isEven ? "md:text-right" : "md:order-last md:text-left"}`}>
                  <div 
                    data-aos={isEven ? "fade-right" : "fade-left"}
                    className="group rounded-[2rem] border border-stone-200/60 bg-white/70 p-8 shadow-sm transition-all hover:border-orange-200 hover:shadow-md backdrop-blur-sm"
                  >
                    <span className="mb-2 inline-block text-xs font-black tracking-widest text-orange-500 uppercase">
                      {exp.years}
                    </span>
                    <h3 className="text-2xl font-black tracking-tighter text-stone-900">
                      {current?.title || fallback?.title}
                    </h3>
                    <p className="mb-4 text-sm font-bold text-stone-400">{exp.institution}</p>
                    <p className="text-base leading-relaxed text-stone-600/80">
                      {current?.description || fallback?.description}
                    </p>
                  </div>
                </div>

                {/* 2. Titik Tengah (Timeline Dot) */}
                <div className="relative z-10 my-6 flex items-center justify-center md:my-0 md:w-[10%]">
                  <div className="h-4 w-4 rounded-full border-4 border-white bg-orange-400 shadow-[0_0_15px_rgba(251,146,60,0.5)] transition-transform duration-500 hover:scale-150" />
                </div>

                {/* 3. Spacer (Untuk menyeimbangkan grid) */}
                <div className="hidden md:block md:w-[45%]" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 -z-10 h-64 w-64 -translate-y-1/2 rounded-full bg-orange-50/50 blur-3xl" />
      <div className="absolute bottom-0 right-0 -z-10 h-64 w-64 rounded-full bg-rose-50/50 blur-3xl" />
    </section>
  );
}