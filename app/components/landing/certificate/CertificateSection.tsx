"use client";

import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import type { Certificate } from "~/lib/types";

const pick = <T extends { locale: string }>(list: T[] | undefined, locale: "EN" | "ID") =>
  list?.find((t) => t.locale === locale) ?? list?.[0] ?? null;

export function CertificateSection({ certificates, locale }: { certificates: Certificate[]; locale: "EN" | "ID" }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: false, mirror: true });
  }, []);

  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return "2025";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.getFullYear().toString();
  };

  return (
    <section className="relative mx-auto my-40 max-w-6xl px-6">
      {/* --- BACKGROUND TEXT (Consistent with previous sections) --- */}
      <div className="pointer-events-none absolute -top-16 left-0 -z-10 select-none">
        <span className="text-[15vw] font-black leading-none text-stone-100/80">
          INDEX
        </span>
      </div>

      {/* --- HEADER --- */}
      <div className="mb-16 flex items-end justify-between border-b-2 border-stone-900 pb-6" data-aos="fade-up">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500">Credentials Directory</p>
          <h2 className="text-4xl font-black tracking-tighter text-stone-900 md:text-6xl">
            Achievements<span className="text-orange-300">.</span>
          </h2>
        </div>
        <div className="hidden text-right md:block">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Total Archive</p>
          <p className="text-2xl font-black text-stone-900">{certificates.length.toString().padStart(2, '0')}</p>
        </div>
      </div>

      {/* --- THE DOSSIER INDEX (High Density Layout) --- */}
      <div className="flex flex-col gap-0 border-b border-stone-200">
        {certificates.map((cert, idx) => {
          const current = pick(cert.translations, locale);
          const fallback = pick(cert.translations, locale === "EN" ? "ID" : "EN");
          const isHovered = hoveredIndex === idx;

          return (
            <div
              key={cert.id}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative border-t border-stone-200 transition-all duration-500 ease-in-out"
              data-aos="fade-up"
            >
              {/* Main Row (Compact) */}
              <div className="flex cursor-pointer items-center justify-between py-6 md:px-4">
                <div className="flex items-center gap-6 md:gap-12">
                  <span className="text-xs font-bold tabular-nums text-stone-300">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className={`text-xl font-black tracking-tight transition-all duration-300 md:text-3xl ${isHovered ? "text-orange-500 translate-x-2" : "text-stone-800"}`}>
                      {current?.title || fallback?.title}
                    </h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{cert.issuedBy}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-8">
                  <span className="hidden text-xs font-black text-stone-300 md:block">{formatDate(cert.issuedOn)}</span>
                  <div className={`h-8 w-8 rounded-full border border-stone-200 flex items-center justify-center transition-all duration-500 ${isHovered ? "bg-stone-900 border-stone-900 rotate-45" : ""}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isHovered ? "white" : "currentColor"} strokeWidth="3">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Expansion Area (The "Mindblowing" Part) */}
              <div 
                className={`grid transition-all duration-500 ease-in-out ${isHovered ? "grid-rows-[1fr] opacity-100 pb-10" : "grid-rows-[0fr] opacity-0"}`}
              >
                <div className="overflow-hidden">
                  <div className="flex flex-col gap-8 pt-4 md:flex-row md:px-16">
                    {/* Floating Mini Preview */}
                    <div className="h-40 w-full shrink-0 overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 md:w-64">
                      {cert.previewImg ? (
                        <img src={cert.previewImg} alt="Preview" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-stone-300">NO_PREVIEW</div>
                      )}
                    </div>
                    
                    <div className="flex flex-col justify-between py-2">
                      <p className="max-w-xl text-sm leading-relaxed text-stone-500 md:text-base">
                        {current?.description || fallback?.description || "Detailed credential verification for professional achievement."}
                      </p>
                      
                      <div className="mt-6 flex gap-4">
                        <a 
                          href={cert.file} 
                          target="_blank" 
                          className="rounded-full bg-stone-900 px-6 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-orange-500"
                        >
                          Verify Link
                        </a>
                        <a 
                          href={cert.file} 
                          download 
                          className="rounded-full border border-stone-200 px-6 py-2 text-[10px] font-black uppercase tracking-widest text-stone-400 hover:border-stone-900 hover:text-stone-900"
                        >
                          Save PDF
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className={`absolute inset-0 -z-10 bg-gradient-to-r from-orange-50/50 to-transparent opacity-0 transition-opacity duration-500 ${isHovered ? "opacity-100" : ""}`} />
            </div>
          );
        })}
      </div>

      {/* Decorative Marks */}
      <div className="mt-12 flex items-center justify-between opacity-20">
        <div className="text-[10px] font-black tracking-[0.5em] text-stone-400 uppercase">End_Of_Archive</div>
        <div className="h-px flex-1 bg-stone-300 mx-8" />
        <div className="flex gap-2">
          <div className="h-2 w-2 rounded-full bg-stone-300" />
          <div className="h-2 w-2 rounded-full bg-stone-300" />
        </div>
      </div>
    </section>
  );
}