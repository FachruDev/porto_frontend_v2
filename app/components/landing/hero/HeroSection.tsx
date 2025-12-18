import type { Hero } from "~/lib/types";
import { HeroCanvas } from "./hero-canvas";

const pick = <T extends { locale: string }>(list: T[] | undefined, locale: "EN" | "ID") =>
  list?.find((t) => t.locale === locale) ?? list?.[0] ?? null;

export function HeroSection({ hero, locale }: { hero: Hero | null; locale: "EN" | "ID" }) {
  const current = pick(hero?.translations, locale);
  const fallback = pick(hero?.translations, locale === "EN" ? "ID" : "EN");

  return (
    <section className="relative overflow-hidden rounded-3xl border border-stone-900/10 bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950 px-6 py-28 text-stone-50 shadow-2xl md:px-12 md:py-36 lg:px-20 lg:py-44">
      <HeroCanvas />
      
      <div className="relative z-10 mx-auto grid max-w-6xl gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
        {/* Left content */}
        <div className="space-y-6 md:space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-stone-600/50 bg-stone-800/60 px-4 py-1.5 text-xs font-medium text-stone-300 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            {locale === "EN" ? "Available for work" : "Terbuka untuk bekerja"}
          </div>
          
          {/* Heading */}
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-stone-50 md:text-5xl lg:text-6xl xl:text-7xl">
            {current?.title || fallback?.title || (locale === "EN" 
              ? "Crafting Digital Solutions" 
              : "Membuat Solusi Digital")}
          </h1>
          
          {/* Subtitle */}
          <p className="max-w-xl text-base leading-relaxed text-stone-300 md:text-lg">
            {current?.subtitle || fallback?.subtitle || (locale === "EN" 
              ? "Full-stack developer passionate about building beautiful, functional, and user-centered digital experiences."
              : "Full-stack developer yang passionate dalam membangun pengalaman digital yang indah, fungsional, dan berpusat pada pengguna.")}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 pt-2 md:gap-4">
            <button className="group relative overflow-hidden rounded-xl bg-stone-50 px-6 py-3 text-sm font-semibold text-stone-900 shadow-lg transition-all hover:scale-105 hover:bg-white hover:shadow-xl md:px-8 md:py-3.5 md:text-base">
              <span className="relative">{locale === "EN" ? "View My Work" : "Lihat Karya Saya"}</span>
            </button>
            <button className="rounded-xl border-2 border-stone-600/50 bg-transparent px-6 py-3 text-sm font-semibold text-stone-100 backdrop-blur-sm transition-all hover:border-stone-500 hover:bg-stone-800/40 md:px-8 md:py-3.5 md:text-base">
              {locale === "EN" ? "Contact Me" : "Hubungi Saya"}
            </button>
          </div>
        </div>
        
        {/* Right side - Skills showcase */}
        <div className="space-y-4 lg:pl-8">
          <p className="text-sm font-medium uppercase tracking-wider text-stone-400">
            {locale === "EN" ? "Skills & Expertise" : "Keahlian"}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { name: "Frontend", items: ["React", "TypeScript", "Tailwind"] },
              { name: "Backend", items: ["Node.js", "Prisma", "PostgreSQL"] },
              { name: "Design", items: ["UI/UX", "Figma", "Responsive"] },
              { name: "Tools", items: ["Git", "Docker", "VS Code"] },
            ].map((category) => (
              <div
                key={category.name}
                className="group rounded-xl border border-stone-700/50 bg-stone-800/40 p-4 backdrop-blur-sm transition-all hover:border-stone-600 hover:bg-stone-800/60 hover:shadow-lg"
              >
                <h3 className="mb-2 text-sm font-semibold text-stone-200">{category.name}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {category.items.map((item) => (
                    <span
                      key={item}
                      className="rounded bg-stone-700/50 px-2 py-0.5 text-xs text-stone-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
