"use client";

import { useMemo, useState } from "react";
import { Link } from "react-router";

import { alternateLocale, pickTranslation } from "~/lib/locale";
import type { Locale, Project } from "~/lib/types";

type Props = {
  projects: Project[];
  locale: Locale;
};

const copy = {
  heading: { EN: "Work", ID: "Karya" },
  subtitle: {
    EN: "A curated collection of products and digital experiences I have built.",
    ID: "Koleksi karya digital yang saya bangun dengan fokus pada kualitas produk dan pengalaman pengguna.",
  },
  searchPlaceholder: { EN: "Search project, keyword, or slug...", ID: "Cari project, keyword, atau slug..." },
  results: { EN: "results", ID: "hasil" },
  noResults: {
    EN: "No project matched your search yet. Try another keyword.",
    ID: "Belum ada project yang cocok dengan pencarian kamu. Coba kata kunci lain.",
  },
  openProject: { EN: "Open Project", ID: "Buka Project" },
  featured: { EN: "Featured", ID: "Unggulan" },
  latestWorks: { EN: "Latest Works", ID: "Karya Terbaru" },
};

const stripHtml = (value: string | null | undefined) =>
  (value ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

export function WorkPageContent({ projects, locale }: Props) {
  const [query, setQuery] = useState("");

  const filteredProjects = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return projects;

    return projects.filter((project) => {
      const current = pickTranslation(project.translations, locale);
      const fallback = pickTranslation(project.translations, alternateLocale(locale));
      const title = (current?.title || fallback?.title || "").toLowerCase();
      const subtitle = (current?.subtitle || fallback?.subtitle || "").toLowerCase();
      const description = stripHtml(current?.description || fallback?.description).toLowerCase();
      return (
        project.slug.toLowerCase().includes(keyword) ||
        title.includes(keyword) ||
        subtitle.includes(keyword) ||
        description.includes(keyword)
      );
    });
  }, [locale, projects, query]);

  const featured = filteredProjects[0];
  const others = filteredProjects.slice(1);

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 pb-20 md:px-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-stone-200/80 bg-white p-6 shadow-sm md:p-10">
        <div className="pointer-events-none absolute -top-20 right-0 h-64 w-64 rounded-full bg-orange-200/45 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-12 h-64 w-64 rounded-full bg-violet-200/35 blur-3xl" />

        <div className="relative space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-extrabold tracking-[0.35em] text-orange-500 uppercase">{copy.heading[locale]}</p>
            <h1 className="text-4xl leading-tight font-black tracking-tight text-stone-900 md:text-6xl">
              {copy.latestWorks[locale]}
            </h1>
            <p className="max-w-3xl text-base leading-relaxed text-stone-600 md:text-lg">{copy.subtitle[locale]}</p>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl flex-1">
              <label htmlFor="project-search" className="sr-only">
                Search projects
              </label>
              <input
                id="project-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={copy.searchPlaceholder[locale]}
                className="w-full rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-stone-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div className="rounded-full border border-stone-300 bg-stone-50 px-4 py-2 text-xs font-bold tracking-[0.18em] text-stone-500 uppercase">
              {filteredProjects.length} {copy.results[locale]}
            </div>
          </div>
        </div>
      </section>

      {featured ? (
        <section className="grid gap-5 lg:grid-cols-[1.2fr,1fr]">
          <article className="overflow-hidden rounded-[1.6rem] border border-stone-200 bg-white">
            <div className="relative">
              {featured.images?.[0]?.url ? (
                <img
                  src={featured.images[0].url}
                  alt={pickTranslation(featured.translations, locale)?.title || featured.slug}
                  className="aspect-[16/9] w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex aspect-[16/9] items-center justify-center bg-stone-100 text-sm text-stone-500">
                  No Preview
                </div>
              )}
              <span className="absolute top-4 left-4 rounded-full bg-black/65 px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-white uppercase">
                {copy.featured[locale]}
              </span>
            </div>

            <div className="space-y-4 p-6">
              <div className="space-y-2">
                <p className="text-xs font-bold tracking-[0.16em] text-stone-500 uppercase">{featured.slug}</p>
                <h2 className="text-2xl font-black tracking-tight text-stone-900 md:text-3xl">
                  {pickTranslation(featured.translations, locale)?.title ||
                    pickTranslation(featured.translations, alternateLocale(locale))?.title ||
                    featured.slug}
                </h2>
                <p className="text-sm leading-relaxed text-stone-600 md:text-base">
                  {stripHtml(
                    pickTranslation(featured.translations, locale)?.description ||
                      pickTranslation(featured.translations, alternateLocale(locale))?.description ||
                      pickTranslation(featured.translations, locale)?.subtitle ||
                      pickTranslation(featured.translations, alternateLocale(locale))?.subtitle,
                  )}
                </p>
              </div>
              <Link
                to={`/project/${featured.slug}`}
                className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 text-xs font-bold tracking-[0.2em] text-white uppercase transition-colors hover:bg-orange-500"
              >
                {copy.openProject[locale]}
                <span aria-hidden>→</span>
              </Link>
            </div>
          </article>

          <div className="grid gap-4">
            {others.slice(0, 3).map((project) => {
              const current = pickTranslation(project.translations, locale);
              const fallback = pickTranslation(project.translations, alternateLocale(locale));
              return (
                <Link
                  key={project.id}
                  to={`/project/${project.slug}`}
                  className="group flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
                >
                  <div className="h-16 w-16 overflow-hidden rounded-xl bg-stone-100">
                    {project.images?.[0]?.url ? (
                      <img
                        src={project.images[0].url}
                        alt={current?.title || fallback?.title || project.slug}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold tracking-[0.16em] text-stone-500 uppercase">{project.slug}</p>
                    <h3 className="truncate text-lg font-black tracking-tight text-stone-900">
                      {current?.title || fallback?.title || project.slug}
                    </h3>
                    <p className="truncate text-sm text-stone-500">{current?.subtitle || fallback?.subtitle || ""}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-sm text-stone-500">
          {copy.noResults[locale]}
        </section>
      )}

      {others.length > 3 ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {others.slice(3).map((project) => {
            const current = pickTranslation(project.translations, locale);
            const fallback = pickTranslation(project.translations, alternateLocale(locale));
            return (
              <article
                key={project.id}
                className="group overflow-hidden rounded-2xl border border-stone-200 bg-white transition-all hover:border-orange-200 hover:shadow-md"
              >
                {project.images?.[0]?.url ? (
                  <img
                    src={project.images[0].url}
                    alt={current?.title || fallback?.title || project.slug}
                    className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex aspect-[16/10] items-center justify-center bg-stone-100 text-sm text-stone-500">
                    No Preview
                  </div>
                )}
                <div className="space-y-3 p-4">
                  <p className="text-xs font-bold tracking-[0.16em] text-stone-500 uppercase">{project.slug}</p>
                  <h3 className="text-xl font-black tracking-tight text-stone-900">
                    {current?.title || fallback?.title || project.slug}
                  </h3>
                  <p className="line-clamp-2 text-sm leading-relaxed text-stone-600">
                    {stripHtml(current?.description || fallback?.description || current?.subtitle || fallback?.subtitle)}
                  </p>
                  <Link
                    to={`/project/${project.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-orange-600 uppercase"
                  >
                    {copy.openProject[locale]}
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      ) : null}
    </div>
  );
}

