import type { Hero } from "~/lib/types";
import { HeroCanvas } from "./hero-canvas";

const pick = <T extends { locale: string }>(list: T[] | undefined, locale: "EN" | "ID") =>
  list?.find((t) => t.locale === locale) ?? list?.[0] ?? null;

export function HeroSection({ hero, locale }: { hero: Hero | null; locale: "EN" | "ID" }) {
  const current = pick(hero?.translations, locale);
  const fallback = pick(hero?.translations, locale === "EN" ? "ID" : "EN");

  return (
    <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-20 text-white md:px-12 md:py-28">
      <HeroCanvas color="#22d3ee" />
      <div className="relative z-10 space-y-6 max-w-4xl">
        <p className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-200">
          Portfolio
        </p>
        <h1 className="text-4xl font-bold leading-tight md:text-5xl">
          {current?.title || fallback?.title || "Building immersive digital experiences"}
        </h1>
        <p className="max-w-2xl text-lg text-slate-200">
          {current?.subtitle || fallback?.subtitle || "Developer with a passion for creative web and 3D interactions."}
        </p>
        <div className="flex flex-wrap gap-3 text-sm text-slate-200">
          <span className="rounded-full bg-white/10 px-4 py-2">React / Three.js</span>
          <span className="rounded-full bg-white/10 px-4 py-2">Creative Coding</span>
          <span className="rounded-full bg-white/10 px-4 py-2">Experience Design</span>
        </div>
      </div>
    </section>
  );
}
