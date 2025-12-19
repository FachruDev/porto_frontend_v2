import type { Hero } from "~/lib/types";

const pick = <T extends { locale: string }>(list: T[] | undefined, locale: "EN" | "ID") =>
  list?.find((t) => t.locale === locale) ?? list?.[0] ?? null;

export function HeroSection({ hero, locale }: { hero: Hero | null; locale: "EN" | "ID" }) {
  const current = pick(hero?.translations, locale);
  const fallback = pick(hero?.translations, locale === "EN" ? "ID" : "EN");

  return (
    <section className="relative flex min-h-[80vh] w-full items-center justify-center overflow-hidden bg-[#fafafa] px-6">
      
      {/* --- BACKGROUND: LAYERED GRADIENTS (NO BLUR = NO LAG) --- */}
      <div 
        className="absolute inset-0 z-0 opacity-60"
        style={{
          background: `
            radial-gradient(at 0% 0%, #FFEDD5 0%, transparent 50%),
            radial-gradient(at 100% 0%, #FCE7F3 0%, transparent 50%),
            radial-gradient(at 50% 100%, #FEF3C7 0%, transparent 50%),
            radial-gradient(at 0% 100%, #E0F2FE 0%, transparent 50%)
          `
        }}
      />

      {/* --- CONTENT --- */}
      <div className="relative z-10 flex flex-col items-center text-center">
        
        {/* Decorative Badge (Tanpa Blur/Shadow berat) */}
        <div className="mb-6 rounded-full border border-stone-200 bg-white/50 px-4 py-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500">
            {locale === "EN" ? "Creative Portfolio" : "Portofolio Kreatif"}
          </p>
        </div>

        {/* Title: Fokus pada Tipografi yang Kuat */}
        <h1 className="max-w-4xl text-5xl font-black leading-[1.1] tracking-tighter text-stone-900 sm:text-7xl md:text-8xl lg:text-9xl">
          <span className="block opacity-20">
             {locale === "EN" ? "CRAFTING" : "MEMBANGUN"}
          </span>
          <span className="bg-gradient-to-r from-orange-400 via-rose-500 to-amber-500 bg-clip-text text-transparent">
             {current?.title || fallback?.title || "DEVELOPER"}
          </span>
        </h1>

        {/* Subtitle: Clean & Readable */}
        <div className="mt-8 flex max-w-xl flex-col items-center gap-6">
          <p className="text-lg leading-relaxed text-stone-600 md:text-xl">
            {current?.subtitle || fallback?.subtitle || (locale === "EN" 
              ? "Simple, fast, and beautiful digital experiences built with precision."
              : "Pengalaman digital yang simpel, cepat, dan indah dibangun dengan presisi.")}
          </p>
          
          {/* Animated Element Ringan: Garis yang memanjang pelan */}
          <div className="h-[2px] w-24 overflow-hidden bg-stone-200">
            <div className="hero-line-slide h-full w-full bg-orange-400" />
          </div>
        </div>
      </div>

      {/* CSS Animasi murni (Sangat Ringan) */}
      <style>{`
        .hero-line-slide {
          animation: slide 3s ease-in-out infinite;
          transform-origin: left;
        }

        @keyframes slide {
          0% { transform: scaleX(0); transform-origin: left; }
          45% { transform: scaleX(1); transform-origin: left; }
          55% { transform: scaleX(1); transform-origin: right; }
          100% { transform: scaleX(0); transform-origin: right; }
        }
      `}</style>
    </section>
  );
}