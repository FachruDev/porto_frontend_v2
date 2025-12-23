"use client";

import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import type { Skill } from "~/lib/types";

type Props = { skills: Skill[] };

export function SkillsSection({ skills }: Props) {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    <section className="relative mx-auto my-32 max-w-7xl px-6">
      {/* --- HEADER SECTION --- */}
      <div className="mb-16 text-left" data-aos="fade-right">
        <div className="relative inline-block">
          {/* Background Text Overlay - Konsisten dengan section lain */}
          <span className="absolute -left-2 -top-12 select-none text-8xl font-black text-stone-100 md:text-9xl lg:text-[12rem]">
            STACK
          </span>
          <h2 className="relative text-5xl font-black tracking-tighter text-stone-900 md:text-7xl">
            Skills <span className="text-orange-500">&</span> Mastery.
          </h2>
        </div>
        <p className="mt-4 text-sm font-bold uppercase tracking-[0.4em] text-stone-400">
          Tools I use to bring ideas to life
        </p>
      </div>

      {/* --- SKILLS GRID --- */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {skills.map((skill, idx) => (
          <div
            key={skill.id}
            data-aos="fade-up"
            data-aos-delay={idx * 50} // Efek staggered yang smooth
            className="group relative flex flex-col items-center justify-center rounded-[2rem] border border-stone-200/60 bg-white/50 p-6 transition-all duration-500 hover:-translate-y-2 hover:border-orange-200 hover:bg-white hover:shadow-xl hover:shadow-orange-500/5 backdrop-blur-sm"
          >
            {/* Background Decoration Inside Card */}
            <div className="absolute inset-0 -z-10 bg-linear-to-br from-orange-50/0 to-orange-50/0 opacity-0 transition-opacity duration-500 group-hover:from-orange-50/50 group-hover:opacity-100" />

            {/* Icon Wrapper */}
            <div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-stone-100 bg-stone-50 p-4 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
              {skill.image ? (
                <img 
                  src={skill.image} 
                  alt={skill.title}
                  loading="lazy" 
                  className="h-full w-full object-contain filter grayscale transition-all duration-500 group-hover:grayscale-0" 
                />
              ) : (
                <div className="text-[10px] font-bold text-stone-400">CODE</div>
              )}
            </div>

            {/* Typography */}
            <div className="text-center">
              <p className="text-sm font-black tracking-tight text-stone-800 md:text-base">
                {skill.title}
              </p>
              <div className="mt-1 flex items-center justify-center gap-1.5">
                <div className="h-1 w-1 rounded-full bg-orange-400 opacity-0 transition-opacity group-hover:opacity-100" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 transition-colors group-hover:text-orange-500">
                  {skill.level}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="absolute -bottom-20 -left-20 -z-10 h-64 w-64 rounded-full bg-orange-100/30 blur-3xl" />
      <div className="absolute -right-20 top-0 -z-10 h-64 w-64 rounded-full bg-rose-100/20 blur-3xl" />
    </section>
  );
}