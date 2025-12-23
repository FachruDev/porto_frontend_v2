"use client";

import React, { useEffect } from "react";
import { Link } from "react-router";
import AOS from "aos";
import "aos/dist/aos.css";
import type { Project } from "~/lib/types";

const pick = <T extends { locale: string }>(list: T[] | undefined, locale: "EN" | "ID") =>
  list?.find((t) => t.locale === locale) ?? list?.[0] ?? null;

type Props = {
  projects: Project[];
  locale: "EN" | "ID";
};

export function ProjectSection({ projects, locale }: Props) {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
    });
  }, []);

  return (
    <section className="relative mx-auto my-32 max-w-6xl px-6">
      {/* --- HEADER --- */}
      <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between" data-aos="fade-up">
        <div className="relative">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.5em] text-orange-400">
            {locale === "EN" ? "Selected Works" : "Karya Terpilih"}
          </p>
          <h2 className="text-5xl font-black tracking-tighter text-stone-900 md:text-7xl">
            Projects<span className="text-orange-500">.</span>
          </h2>
        </div>
        <div className="mt-4 h-px flex-1 bg-stone-200 md:mx-10 md:mb-4" />
        <p className="max-w-xs text-sm font-medium text-stone-400">
          {locale === "EN" 
            ? "Focused on building performant and visually stunning products." 
            : "Fokus membangun produk berperforma tinggi dan visual yang memukau."}
        </p>
      </div>

      {/* --- LIST LAYOUT (100% Berbeda dari Grid) --- */}
      <div className="flex flex-col border-t border-stone-200">
        {projects.map((project, idx) => {
          const current = pick(project.translations, locale);
          const fallback = pick(project.translations, locale === "EN" ? "ID" : "EN");
          const cover = project.images?.[0]?.url;

          return (
            <Link
              key={project.id}
              to={`/project/${project.slug}`}
              data-aos="fade-up"
              data-aos-delay={idx * 50}
              className="group relative flex flex-col items-start justify-between border-b border-stone-200 py-8 transition-all duration-500 hover:bg-stone-50/50 md:flex-row md:items-center md:px-6"
            >
              {/* 1. Project Info (Left) */}
              <div className="flex items-center gap-6 md:gap-10">
                <span className="text-xs font-bold text-stone-300">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                
                {/* Small Thumbnail Preview (Tidak mendominasi) */}
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-stone-100 md:h-20 md:w-20 lg:h-24 lg:w-24">
                  {cover ? (
                    <img
                      src={cover}
                      alt={current?.title ?? project.slug}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full w-full bg-stone-200" />
                  )}
                </div>

                <div className="flex flex-col">
                  <h3 className="text-2xl font-black tracking-tighter text-stone-800 transition-colors group-hover:text-orange-500 md:text-4xl">
                    {current?.title || fallback?.title || "Project"}
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-stone-400">
                    {project.slug}
                  </p>
                </div>
              </div>

              {/* 2. Description (Center - Hidden on Mobile) */}
              <div className="mt-4 hidden max-w-sm flex-1 px-10 lg:block">
                <p className="text-sm leading-relaxed text-stone-500 line-clamp-2">
                  {current?.subtitle || fallback?.subtitle}
                </p>
              </div>

              {/* 3. Button/Action (Right) */}
              <div className="mt-6 flex w-full items-center justify-between md:mt-0 md:w-auto">
                <div className="flex gap-2">
                   {/* Tags Minimalis */}
                   <span className="rounded-full border border-stone-200 px-3 py-1 text-[10px] font-bold uppercase text-stone-400">
                     Web
                   </span>
                   <span className="rounded-full border border-stone-200 px-3 py-1 text-[10px] font-bold uppercase text-stone-400">
                     Design
                   </span>
                </div>
                
                <div className="ml-6 flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-900 transition-all group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 md:h-12 md:w-12">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Decorative Text background yang lebih halus */}
      <div className="pointer-events-none absolute -bottom-10 right-0 -z-10 select-none text-[15vw] font-black text-stone-100/50">
        PROJECTS
      </div>
    </section>
  );
}