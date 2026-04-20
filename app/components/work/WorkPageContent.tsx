"use client";

import { useEffect, useMemo, useState } from "react";
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
    EN: "A scalable showcase of digital products, design systems, and engineering work.",
    ID: "Koleksi karya digital yang scalable: produk, design system, dan engineering execution.",
  },
  searchPlaceholder: { EN: "Search project, keyword, or slug...", ID: "Cari project, keyword, atau slug..." },
  results: { EN: "results", ID: "hasil" },
  noResults: {
    EN: "No project matched your search yet. Try another keyword.",
    ID: "Belum ada project yang cocok dengan pencarian kamu. Coba kata kunci lain.",
  },
  sortBy: { EN: "Sort by", ID: "Urutkan" },
  latest: { EN: "Latest", ID: "Terbaru" },
  oldest: { EN: "Oldest", ID: "Terlama" },
  title: { EN: "Title A-Z", ID: "Judul A-Z" },
  totalProjects: { EN: "Total Projects", ID: "Total Project" },
  previewReady: { EN: "Preview Ready", ID: "Siap Preview" },
  currentlyShown: { EN: "Currently Shown", ID: "Sedang Ditampilkan" },
  openProject: { EN: "Open Project", ID: "Buka Project" },
  featured: { EN: "Spotlight", ID: "Sorotan" },
  latestWorks: { EN: "Latest Works", ID: "Karya Terbaru" },
  clearSearch: { EN: "Clear", ID: "Reset" },
  loadMore: { EN: "Load More Works", ID: "Muat Karya Lain" },
  projectCatalog: { EN: "Project Catalog", ID: "Katalog Project" },
};

const stripHtml = (value: string | null | undefined) =>
  (value ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

export function WorkPageContent({ projects, locale }: Props) {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "title">("latest");
  const [visibleCount, setVisibleCount] = useState(9);

  const sortedProjects = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    const filtered = projects.filter((project) => {
      const current = pickTranslation(project.translations, locale);
      const fallback = pickTranslation(project.translations, alternateLocale(locale));
      const title = (current?.title || fallback?.title || "").toLowerCase();
      const subtitle = (current?.subtitle || fallback?.subtitle || "").toLowerCase();
      const description = stripHtml(current?.description || fallback?.description).toLowerCase();
      return (
        keyword.length === 0 ||
        project.slug.toLowerCase().includes(keyword) ||
        title.includes(keyword) ||
        subtitle.includes(keyword) ||
        description.includes(keyword)
      );
    });

    const sorted = [...filtered];
    if (sortBy === "title") {
      sorted.sort((a, b) => {
        const aTitle =
          pickTranslation(a.translations, locale)?.title ||
          pickTranslation(a.translations, alternateLocale(locale))?.title ||
          a.slug;
        const bTitle =
          pickTranslation(b.translations, locale)?.title ||
          pickTranslation(b.translations, alternateLocale(locale))?.title ||
          b.slug;
        return aTitle.localeCompare(bTitle);
      });
      return sorted;
    }

    sorted.sort((a, b) => {
      const aDate = new Date(a.createdAt).getTime();
      const bDate = new Date(b.createdAt).getTime();
      if (sortBy === "oldest") return aDate - bDate;
      return bDate - aDate;
    });
    return sorted;
  }, [locale, projects, query, sortBy]);

  useEffect(() => {
    setVisibleCount(9);
  }, [query, sortBy, locale]);

  const spotlight = sortedProjects.slice(0, 2);
  const catalog = sortedProjects.slice(2);
  const visibleCatalog = catalog.slice(0, visibleCount);
  const previewReadyCount = projects.filter((project) => project.images?.[0]?.url).length;
  const shownCount = spotlight.length + visibleCatalog.length;
  const canLoadMore = catalog.length > visibleCount;

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

          <div className="grid gap-3 sm:grid-cols-3">
            <article className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">
              <p className="text-[11px] font-bold tracking-[0.16em] text-stone-500 uppercase">{copy.totalProjects[locale]}</p>
              <p className="mt-1 text-3xl font-black text-stone-900">{String(projects.length).padStart(2, "0")}</p>
            </article>
            <article className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">
              <p className="text-[11px] font-bold tracking-[0.16em] text-stone-500 uppercase">{copy.previewReady[locale]}</p>
              <p className="mt-1 text-3xl font-black text-stone-900">{String(previewReadyCount).padStart(2, "0")}</p>
            </article>
            <article className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">
              <p className="text-[11px] font-bold tracking-[0.16em] text-stone-500 uppercase">{copy.currentlyShown[locale]}</p>
              <p className="mt-1 text-3xl font-black text-stone-900">{String(shownCount).padStart(2, "0")}</p>
            </article>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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

            <div className="flex flex-wrap items-center gap-2">
              <label
                htmlFor="project-sort"
                className="rounded-full border border-stone-300 bg-stone-50 px-3 py-2 text-[11px] font-bold tracking-[0.14em] text-stone-500 uppercase"
              >
                {copy.sortBy[locale]}
              </label>
              <select
                id="project-sort"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as "latest" | "oldest" | "title")}
                className="rounded-full border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-stone-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              >
                <option value="latest">{copy.latest[locale]}</option>
                <option value="oldest">{copy.oldest[locale]}</option>
                <option value="title">{copy.title[locale]}</option>
              </select>
              <button
                type="button"
                onClick={() => setQuery("")}
                className="rounded-full border border-stone-300 bg-white px-4 py-2 text-xs font-bold tracking-[0.14em] text-stone-600 uppercase transition-colors hover:border-orange-300 hover:text-orange-600"
              >
                {copy.clearSearch[locale]}
              </button>
              <div className="rounded-full border border-stone-300 bg-stone-50 px-4 py-2 text-xs font-bold tracking-[0.16em] text-stone-500 uppercase">
                {sortedProjects.length} {copy.results[locale]}
              </div>
            </div>
          </div>
        </div>
      </section>

      {sortedProjects.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-sm text-stone-500">
          {copy.noResults[locale]}
        </section>
      ) : null}

      {spotlight.length > 0 ? (
        <section className="space-y-5">
          <h2 className="text-2xl font-black tracking-tight text-stone-900 md:text-3xl">{copy.featured[locale]}</h2>
          <div className="grid gap-5 lg:grid-cols-2">
            {spotlight.map((project) => {
              const current = pickTranslation(project.translations, locale);
              const fallback = pickTranslation(project.translations, alternateLocale(locale));
              const previewText = stripHtml(current?.description || fallback?.description || current?.subtitle || fallback?.subtitle);
              return (
                <article
                  key={project.id}
                  className="overflow-hidden rounded-[1.6rem] border border-stone-200 bg-white transition-all hover:border-orange-200 hover:shadow-md"
                >
                  <div className="relative">
                    {project.images?.[0]?.url ? (
                      <img
                        src={project.images[0].url}
                        alt={current?.title || fallback?.title || project.slug}
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

                  <div className="space-y-3 p-6">
                    <p className="text-xs font-bold tracking-[0.16em] text-stone-500 uppercase">{project.slug}</p>
                    <h3 className="text-2xl font-black tracking-tight text-stone-900 md:text-3xl">
                      {current?.title || fallback?.title || project.slug}
                    </h3>
                    <p className="line-clamp-3 text-sm leading-relaxed text-stone-600 md:text-base">{previewText}</p>
                    <Link
                      to={`/project/${project.slug}`}
                      className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 text-xs font-bold tracking-[0.2em] text-white uppercase transition-colors hover:bg-orange-500"
                    >
                      {copy.openProject[locale]}
                      <span aria-hidden>{"->"}</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {catalog.length > 0 ? (
        <section className="space-y-6">
          <h2 className="text-2xl font-black tracking-tight text-stone-900 md:text-3xl">{copy.projectCatalog[locale]}</h2>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleCatalog.map((project) => {
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
                      <span aria-hidden>{"->"}</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          {canLoadMore ? (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + 9)}
                className="rounded-full border border-stone-300 bg-white px-6 py-3 text-xs font-bold tracking-[0.2em] text-stone-700 uppercase transition-colors hover:border-orange-300 hover:text-orange-600"
              >
                {copy.loadMore[locale]}
              </button>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

