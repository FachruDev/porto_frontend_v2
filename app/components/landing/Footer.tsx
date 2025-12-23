"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import type { ContactInformation, SocialMedia, WebConfig } from "~/lib/types";

type Props = {
  contact: ContactInformation | null;
  socials: SocialMedia[];
  webConfig: WebConfig | null;
};

export function Footer({ contact, socials, webConfig }: Props) {
  useEffect(() => {
    AOS.init({ duration: 1000, once: false, mirror: true });
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 overflow-hidden bg-stone-950 px-6 pt-24 pb-12 text-stone-50 md:px-12 md:pt-40">
      
      {/* --- 1. THE MASSIVE BACKGROUND TEXT (The "Amazing" Part) --- */}
      <div className="pointer-events-none absolute -top-10 left-0 w-full overflow-hidden opacity-[0.03] select-none">
        <h2 className="whitespace-nowrap text-[25vw] font-black leading-none tracking-[ -0.05em]">
          {webConfig?.metaTitle?.toUpperCase() || "CREATIVE LAB"}
        </h2>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        
        {/* --- 2. TOP SECTION: BIG CALL TO ACTION --- */}
        <div className="grid gap-16 border-b border-stone-800 pb-20 lg:grid-cols-[1.5fr,1fr]">
          <div data-aos="fade-right">
            <h3 className="text-sm font-black uppercase tracking-[0.5em] text-orange-500 mb-8">
              Let&apos;s Connect
            </h3>
            <a 
              href={`mailto:${contact?.email}`} 
              className="group block text-5xl font-black tracking-tighter sm:text-7xl md:text-8xl lg:text-9xl transition-all hover:text-orange-400"
            >
              SAY <span className="italic text-stone-500 group-hover:text-stone-300 transition-colors">HELLO.</span>
            </a>
          </div>

          <div className="flex flex-col justify-end space-y-10" data-aos="fade-left">
            <p className="max-w-sm text-lg font-medium leading-relaxed text-stone-400">
              {webConfig?.metaDescription || "Open for new opportunities and interesting projects."}
            </p>
            
            {/* Social Links as "Action Tags" */}
            <div className="flex flex-wrap gap-3">
              {socials.map((s) => (
                <a
                  key={s.id}
                  href={s.link}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-stone-700 bg-stone-900/50 px-6 py-2 text-[10px] font-black uppercase tracking-widest text-stone-300 transition-all hover:border-orange-500 hover:text-orange-500 hover:-translate-y-1"
                >
                  {s.title}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* --- 3. MIDDLE SECTION: THE DIRECTORY --- */}
        <div className="grid gap-12 py-20 sm:grid-cols-2 md:grid-cols-4" data-aos="fade-up">
          {/* Location */}
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-600">Location</p>
            <p className="text-sm font-bold text-stone-300 leading-relaxed">
              {contact?.location || "Based in Jakarta, Indonesia. Available worldwide."}
            </p>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-600">Contact</p>
            <div className="space-y-1">
              <p className="text-sm font-bold text-stone-300">{contact?.email}</p>
              <p className="text-sm font-bold text-stone-300">{contact?.phoneNumber}</p>
            </div>
          </div>

          {/* Current Time (Extra Touch) */}
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-600">Local Time</p>
            <p className="text-sm font-bold text-stone-300">
              {new Date().toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric', timeZoneName: 'short' })}
            </p>
          </div>

          {/* Navigation / Other */}
          <div className="flex flex-col items-start md:items-end justify-end">
            <div className="h-12 w-12 rounded-full border border-stone-800 flex items-center justify-center animate-bounce">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-orange-500">
                    <path d="M12 19V5M5 12l7-7 7 7"/>
                </svg>
            </div>
          </div>
        </div>

        {/* --- 4. BOTTOM BAR: LEGAL & COPYRIGHT --- */}
        <div className="flex flex-col items-center justify-between gap-6 border-t border-stone-900 pt-12 md:flex-row">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-600">
            {webConfig?.copyright || `© ${currentYear} ALL RIGHTS RESERVED.`}
          </p>
          
          <div className="flex items-center gap-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-600 cursor-help hover:text-stone-300 transition-colors">
              Privacy Policy
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-600">
              Back to Top ↑
            </span>
          </div>
        </div>

      </div>

      {/* Subtle Glow Decor (0% Lag) */}
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-orange-500/10 blur-[120px]" />
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-rose-500/5 blur-[120px]" />

    </footer>  
  );
}