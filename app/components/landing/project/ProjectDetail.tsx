"use client";

import { useEffect } from "react";
import { Link } from "react-router"; // Gunakan "next/link" jika di Next.js
import AOS from "aos";
import "aos/dist/aos.css";
import type { Project } from "~/lib/types";

const pick = <T extends { locale: string }>(list: T[] | undefined, locale: "EN" | "ID") =>
  list?.find((t) => t.locale === locale) ?? list?.[0] ?? null;

export function ProjectDetail({ project, locale = "EN" }: { project: Project; locale?: "EN" | "ID" }) {
  const current = pick(project.translations, locale);
  const fallback = pick(project.translations, locale === "EN" ? "ID" : "EN");
  
  const title = current?.title || fallback?.title;
  const description = current?.description || fallback?.description;

  useEffect(() => {
    AOS.init({ duration: 1000, once: false, mirror: true });
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-40 selection:bg-orange-100">
      
      {/* --- 1. MINIMALIST FIXED NAV --- */}
      <nav className="fixed top-0 z-50 flex w-full items-center justify-between px-6 py-8 md:px-12">
        <Link 
          to="/" 
          className="flex h-12 w-12 items-center justify-center rounded-full border border-stone-200 bg-white/80 backdrop-blur-md transition-transform hover:scale-110 active:scale-95"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </Link>
        <div className="hidden rounded-full border border-stone-200 bg-white/80 px-6 py-2 backdrop-blur-md md:block">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">Project Detail / {project.slug}</span>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 pt-32 md:px-12">
        
        {/* --- 2. ASYMMETRIC HEADER --- */}
        <div className="relative mb-32 grid gap-10 md:grid-cols-[1.5fr,1fr]">
          <div data-aos="fade-right">
            <span className="mb-4 block text-xs font-black uppercase tracking-[0.5em] text-orange-500">Overview</span>
            <h1 className="text-6xl font-black leading-[0.85] tracking-[ -0.05em] text-stone-900 md:text-8xl lg:text-9xl">
              {title?.split(" ").map((word, i) => (
                <span key={i} className={i % 2 !== 0 ? "text-stone-200" : "block"}>{word} </span>
              ))}
            </h1>
          </div>
          
          <div className="flex flex-col justify-end gap-6" data-aos="fade-left" data-aos-delay="200">
            <p className="text-lg font-medium leading-relaxed text-stone-500 md:text-xl">
              {description}
            </p>
            <div className="flex flex-wrap gap-2">
              {["React", "Tailwind", "Motion"].map((tech) => (
                <span key={tech} className="rounded-full bg-stone-100 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* --- 3. CREATIVE COLLAGE GALLERY (100% DIFFERENT) --- */}
        {/* Di sini gambar tidak besar-besar, ukurannya bervariasi dan selang-seling */}
        <div className="grid grid-cols-12 gap-4 md:gap-8">
          
          {/* Image 1: Medium Left */}
          <div className="col-span-12 md:col-span-7" data-aos="fade-up">
            <div className="group relative aspect-video overflow-hidden rounded-[2rem] border border-stone-100 bg-stone-50 shadow-sm transition-all duration-700 hover:shadow-xl">
              {project.images?.[0] && <img src={project.images[0].url} alt="" className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" />}
            </div>
          </div>

          {/* Image 2: Small Right (Offset) */}
          <div className="col-span-8 col-start-3 mt-0 md:col-span-4 md:col-start-9 md:mt-20" data-aos="fade-up" data-aos-delay="150">
            <div className="group relative aspect-square overflow-hidden rounded-[2rem] border border-stone-100 bg-stone-50 shadow-sm transition-all duration-700 hover:shadow-xl">
              {project.images?.[1] && <img src={project.images[1].url} alt="" className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0" />}
            </div>
          </div>

          {/* Large Vertical Quote or Text in between images */}
          <div className="col-span-12 py-20 text-center md:col-span-6 md:col-start-4" data-aos="zoom-in">
             <h2 className="text-3xl font-black italic tracking-tighter text-stone-300 md:text-5xl">
               "Designing with purpose, <br/> 
               <span className="text-stone-900">executing with precision."</span>
             </h2>
          </div>

          {/* Image 3: Small Left */}
          <div className="col-span-6 md:col-span-3 md:col-start-2" data-aos="fade-up">
            <div className="group relative aspect-[3/4] overflow-hidden rounded-[2rem] border border-stone-100 bg-stone-50 shadow-sm transition-all duration-700 hover:shadow-xl">
               {project.images?.[2] && <img src={project.images[2].url} alt="" className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0" />}
            </div>
          </div>

          {/* Image 4: Medium Right */}
          <div className="col-span-12 mt-4 md:col-span-6 md:mt-[-80px]" data-aos="fade-up" data-aos-delay="200">
             <div className="group relative aspect-video overflow-hidden rounded-[2rem] border border-stone-100 bg-stone-50 shadow-sm transition-all duration-700 hover:shadow-xl">
               {project.images?.[3] && <img src={project.images[3].url} alt="" className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0" />}
            </div>
          </div>

        </div>

        {/* --- 4. MINIMALIST NEXT PROJECT NAV --- */}
        <div className="mt-40 border-t border-stone-100 pt-20 text-center" data-aos="fade-up">
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.5em] text-stone-400">Next Project</p>
          <Link to="#" className="group relative inline-block">
            <h2 className="text-5xl font-black tracking-tighter text-stone-900 transition-colors group-hover:text-orange-500 md:text-8xl">
              Keep Exploring.
            </h2>
            <div className="mx-auto mt-4 h-1 w-0 bg-orange-400 transition-all duration-500 group-hover:w-full" />
          </Link>
        </div>

      </main>

      {/* --- BACKGROUND DECOR (ULTRA LIGHT) --- */}
      <div className="pointer-events-none fixed left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-black text-stone-50 opacity-40">
        {project.slug.substring(0, 3).toUpperCase()}
      </div>
    </div>
  );
}