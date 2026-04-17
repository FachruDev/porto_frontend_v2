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

const levelMeta: Record<
  SkillLevel,
  {
    label: Record<Locale, string>;
    percent: number;
    tone: string;
  }
> = {
  PROFESSIONAL: {
    label: { EN: "Professional", ID: "Profesional" },
    percent: 92,
    tone: "from-emerald-400 to-teal-500",
  },
  MIDDLE: {
    label: { EN: "Intermediate", ID: "Menengah" },
    percent: 74,
    tone: "from-orange-400 to-amber-500",
  },
  BEGINNER: {
    label: { EN: "Beginner", ID: "Pemula" },
    percent: 46,
    tone: "from-sky-400 to-indigo-500",
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
  const current = pickTranslation(about?.translations, locale);
  const fallback = pickTranslation(about?.translations, alternateLocale(locale));
  const totalExperiences = experiences.length;
  const totalSkills = skills.length;

  return (
    <div className="mx-auto max-w-7xl space-y-14 px-4 pb-20 md:px-6">
      <section className="relative">
        <div className="grid items-center gap-12 overflow-hidden rounded-[2.5rem] border border-stone-200/60 bg-[#FAFAFAd9] p-8 shadow-sm md:grid-cols-2 md:p-16 lg:gap-20">
          <div className="relative w-full overflow-hidden rounded-[2rem] bg-stone-100" data-aos="fade-right">
            {about?.profile ? (
              <img
                src={about.profile}
                alt="Profile"
                loading="lazy"
                className="aspect-4/5 w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            ) : (
              <div className="aspect-4/5 flex w-full items-center justify-center text-stone-400">No Image</div>
            )}
          </div>

          <div className="flex flex-col space-y-6" data-aos="fade-left">
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-[0.5em] text-orange-500/80">
                {locale === "EN" ? "The Story" : "Cerita Saya"}
              </h3>
              <h2 className="text-5xl font-black tracking-tighter text-stone-900 md:text-7xl">
                {current?.title || fallback?.title || "Story."}
              </h2>
            </div>

            <p className="text-lg leading-relaxed font-medium text-stone-600 md:text-xl">
              {current?.content || fallback?.content}
            </p>

            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-orange-400" />
              <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">
                Fresh Graduate & Developer
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-stone-900 md:text-4xl">
              {sectionCopy.journey[locale]}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-500 md:text-base">
              {sectionCopy.journeySubtitle[locale]}
            </p>
          </div>
          <div className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-xs font-bold tracking-[0.16em] text-stone-500 uppercase">
            {String(totalExperiences).padStart(2, "0")} {locale === "EN" ? "Records" : "Riwayat"}
          </div>
        </div>

        {experiences.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-stone-300 bg-white p-6 text-sm text-stone-500">
            {sectionCopy.noJourney[locale]}
          </div>
        ) : (
          <div className="relative mt-8">
            <div className="absolute top-0 bottom-0 left-4 hidden w-px bg-gradient-to-b from-orange-200 via-stone-200 to-transparent md:block" />

            <div className="space-y-5">
              {experiences.map((experience, index) => {
              const translation = pickTranslation(experience.translations, locale);
              const fallback = pickTranslation(experience.translations, alternateLocale(locale));

              return (
                <article
                  key={experience.id}
                  className="relative md:pl-12"
                >
                  <span className="absolute top-6 left-0 hidden h-8 w-8 items-center justify-center rounded-full border border-orange-200 bg-orange-50 text-[11px] font-bold text-orange-600 md:flex">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="group rounded-2xl border border-stone-200 bg-stone-50/55 p-5 transition-all hover:-translate-y-0.5 hover:border-orange-200 hover:bg-white hover:shadow-md">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <p className="rounded-full bg-stone-900 px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-white uppercase">
                        {experience.years}
                      </p>
                      <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-[10px] font-bold tracking-[0.14em] text-stone-500 uppercase">
                        {experience.institution}
                      </span>
                    </div>
                    <h3 className="text-xl font-black tracking-tight text-stone-900">
                      {translation?.title || fallback?.title || experience.institution}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600 md:text-[15px]">
                      {translation?.description || fallback?.description || ""}
                    </p>
                  </div>
                </article>
              );
            })}
            </div>
          </div>
        )}
      </section>

      <section className="relative overflow-hidden rounded-[2rem] border border-stone-200 bg-linear-to-br from-white via-stone-50 to-orange-50/40 p-6 shadow-sm md:p-8">
        <div className="pointer-events-none absolute -top-20 -right-14 h-56 w-56 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-purple-200/30 blur-3xl" />

        <div className="relative">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-stone-900 md:text-4xl">{sectionCopy.skillMap[locale]}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-stone-500 md:text-base">
                {sectionCopy.skillMapSubtitle[locale]}
              </p>
            </div>
            <div className="rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-bold tracking-[0.16em] text-stone-500 uppercase">
              {String(totalSkills).padStart(2, "0")} {locale === "EN" ? "Tools" : "Tools"}
            </div>
          </div>

          {skills.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-stone-300 bg-white p-6 text-sm text-stone-500">
              {sectionCopy.noSkills[locale]}
            </div>
          ) : (
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {skills.map((skill) => {
                const meta = levelMeta[skill.level];
                return (
                  <article
                    key={skill.id}
                    className="group rounded-2xl border border-stone-200 bg-white/90 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
                          {skill.image ? (
                            <img src={skill.image} alt={skill.title} className="h-8 w-8 object-contain" loading="lazy" />
                          ) : (
                            <span className="text-xs font-black text-stone-500">
                              {skill.title.slice(0, 2).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="text-base font-extrabold tracking-tight text-stone-900">{skill.title}</h3>
                          <p className="text-[11px] font-semibold text-stone-500">{meta.label[locale]}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] text-stone-500 uppercase">
                        {meta.percent}%
                      </span>
                    </div>

                    <div className="mt-4 h-2 rounded-full bg-stone-200">
                      <div
                        className={`h-full rounded-full bg-linear-to-r ${meta.tone} transition-all duration-500`}
                        style={{ width: `${meta.percent}%` }}
                      />
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
              <span aria-hidden>{"->"}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

