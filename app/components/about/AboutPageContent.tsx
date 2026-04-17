"use client";

import { Link } from "react-router";

import { alternateLocale, pickTranslation } from "~/lib/locale";
import type { About, Experience, Locale, Skill, SkillLevel } from "~/lib/types";

type Props = {
  about: About | null;
  experiences: Experience[];
  skills: Skill[];
  locale: Locale;
};

const levelMeta: Record<SkillLevel, { label: Record<Locale, string>; progress: string }> = {
  PROFESSIONAL: {
    label: { EN: "Professional", ID: "Profesional" },
    progress: "w-full",
  },
  MIDDLE: {
    label: { EN: "Intermediate", ID: "Menengah" },
    progress: "w-3/4",
  },
  BEGINNER: {
    label: { EN: "Beginner", ID: "Pemula" },
    progress: "w-2/5",
  },
};

const sectionCopy = {
  heading: { EN: "About Me", ID: "Tentang Saya" },
  subtitle: {
    EN: "A closer look at how I think, build, and grow.",
    ID: "Mengenal lebih dekat bagaimana saya berpikir, membangun, dan berkembang.",
  },
  journey: { EN: "Journey", ID: "Perjalanan" },
  journeySubtitle: {
    EN: "Experiences that shaped the way I approach products and people.",
    ID: "Pengalaman yang membentuk cara saya membangun produk dan bekerja dengan orang lain.",
  },
  skillMap: { EN: "Skill Map", ID: "Peta Keahlian" },
  skillMapSubtitle: {
    EN: "A practical stack I rely on to ship polished digital products.",
    ID: "Tumpukan teknologi yang saya andalkan untuk membangun produk digital yang matang.",
  },
  openForWork: { EN: "Open for meaningful collaboration", ID: "Terbuka untuk kolaborasi yang bermakna" },
  seeWork: { EN: "See My Work", ID: "Lihat Karya" },
  noJourney: {
    EN: "Experience data is still being prepared.",
    ID: "Data pengalaman sedang disiapkan.",
  },
  noSkills: {
    EN: "Skill data is still being prepared.",
    ID: "Data keahlian sedang disiapkan.",
  },
};

export function AboutPageContent({ about, experiences, skills, locale }: Props) {
  const aboutTranslation = pickTranslation(about?.translations, locale);
  const aboutFallback = pickTranslation(about?.translations, alternateLocale(locale));

  return (
    <div className="mx-auto max-w-7xl space-y-14 px-4 pb-20 md:px-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-stone-200/70 bg-white/75 p-6 shadow-sm backdrop-blur-sm md:p-10">
        <div className="pointer-events-none absolute -top-16 -left-16 h-64 w-64 rounded-full bg-orange-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-purple-200/40 blur-3xl" />

        <div className="relative grid gap-10 md:grid-cols-[1.2fr,1fr] md:items-center">
          <div className="space-y-5">
            <p className="text-xs font-extrabold tracking-[0.35em] text-orange-500 uppercase">
              {sectionCopy.heading[locale]}
            </p>
            <h1 className="text-4xl leading-tight font-black tracking-tight text-stone-900 md:text-6xl">
              {aboutTranslation?.title || aboutFallback?.title || sectionCopy.heading[locale]}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-stone-600 md:text-lg">
              {aboutTranslation?.content || aboutFallback?.content || sectionCopy.subtitle[locale]}
            </p>
            <div className="inline-flex items-center gap-3 rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-bold tracking-[0.18em] text-stone-500 uppercase">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {sectionCopy.openForWork[locale]}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[1.5rem] border border-stone-200 bg-stone-100">
            {about?.profile ? (
              <img
                src={about.profile}
                alt={aboutTranslation?.title || aboutFallback?.title || "Profile"}
                className="aspect-[4/5] w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex aspect-[4/5] items-center justify-center text-sm font-semibold tracking-widest text-stone-400 uppercase">
                Profile
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-stone-900 md:text-4xl">
              {sectionCopy.journey[locale]}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-500 md:text-base">
              {sectionCopy.journeySubtitle[locale]}
            </p>
          </div>
        </div>

        {experiences.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-6 text-sm text-stone-500">
            {sectionCopy.noJourney[locale]}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {experiences.map((experience) => {
              const translation = pickTranslation(experience.translations, locale);
              const fallback = pickTranslation(experience.translations, alternateLocale(locale));

              return (
                <article
                  key={experience.id}
                  className="group rounded-2xl border border-stone-200 bg-white p-5 transition-all hover:-translate-y-1 hover:border-orange-200 hover:shadow-md"
                >
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <p className="text-sm font-extrabold tracking-[0.18em] text-orange-500 uppercase">
                      {experience.years}
                    </p>
                    <span className="rounded-full bg-stone-100 px-3 py-1 text-[10px] font-bold tracking-[0.14em] text-stone-500 uppercase">
                      {experience.institution}
                    </span>
                  </div>
                  <h3 className="text-xl font-black tracking-tight text-stone-900">
                    {translation?.title || fallback?.title || experience.institution}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    {translation?.description || fallback?.description || ""}
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-[2rem] border border-stone-200 bg-white p-6 md:p-8">
        <h2 className="text-3xl font-black tracking-tight text-stone-900 md:text-4xl">{sectionCopy.skillMap[locale]}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-stone-500 md:text-base">
          {sectionCopy.skillMapSubtitle[locale]}
        </p>

        {skills.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6 text-sm text-stone-500">
            {sectionCopy.noSkills[locale]}
          </div>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill) => {
              const meta = levelMeta[skill.level];
              return (
                <article
                  key={skill.id}
                  className="rounded-2xl border border-stone-200 bg-stone-50/80 p-4 transition-all hover:border-stone-300 hover:bg-white"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-extrabold tracking-tight text-stone-900">{skill.title}</h3>
                    <span className="text-[10px] font-bold tracking-[0.16em] text-stone-500 uppercase">
                      {meta.label[locale]}
                    </span>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-stone-200">
                    <div className={`h-full rounded-full bg-orange-500 ${meta.progress}`} />
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-8">
          <Link
            to="/work"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-xs font-bold tracking-[0.2em] text-white uppercase transition-colors hover:bg-orange-500"
          >
            {sectionCopy.seeWork[locale]}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

