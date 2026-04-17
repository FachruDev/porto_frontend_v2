"use client";

import { useMemo, useState } from "react";

import { alternateLocale, pickTranslation } from "~/lib/locale";
import type { BlogCategory, BlogPost, Locale } from "~/lib/types";

type Props = {
  posts: BlogPost[];
  categories: BlogCategory[];
  locale: Locale;
};

const copy = {
  heading: { EN: "Journal", ID: "Jurnal" },
  subtitle: {
    EN: "Thoughts, experiments, and lessons from building products.",
    ID: "Catatan, eksperimen, dan pelajaran dari proses membangun produk.",
  },
  all: { EN: "All Topics", ID: "Semua Topik" },
  searchPlaceholder: { EN: "Search article title...", ID: "Cari judul artikel..." },
  featured: { EN: "Featured Story", ID: "Cerita Unggulan" },
  by: { EN: "By", ID: "Oleh" },
  empty: {
    EN: "No article found with the current filter.",
    ID: "Belum ada artikel dengan filter saat ini.",
  },
  readMinutes: { EN: "min read", ID: "menit baca" },
};

const stripHtml = (value: string | null | undefined) =>
  (value ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const calculateReadMinutes = (text: string) => Math.max(1, Math.ceil(text.split(/\s+/).filter(Boolean).length / 180));

const formatDate = (value: string | null | undefined, locale: Locale) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(locale === "EN" ? "en-US" : "id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export function JournalPageContent({ posts, categories, locale }: Props) {
  const [activeCategory, setActiveCategory] = useState<number | "all">("all");
  const [query, setQuery] = useState("");

  const normalizedPosts = useMemo(
    () =>
      [...posts].sort((a, b) => {
        const left = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const right = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return right - left;
      }),
    [posts],
  );

  const filteredPosts = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return normalizedPosts.filter((post) => {
      const current = pickTranslation(post.translations, locale);
      const fallback = pickTranslation(post.translations, alternateLocale(locale));
      const title = (current?.title || fallback?.title || "").toLowerCase();

      const passCategory = activeCategory === "all" || post.blogCategoryId === activeCategory;
      const passSearch = keyword.length === 0 || title.includes(keyword);
      return passCategory && passSearch;
    });
  }, [activeCategory, locale, normalizedPosts, query]);

  const featured = filteredPosts[0];
  const list = filteredPosts.slice(1);

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 pb-20 md:px-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm md:p-10">
        <div className="pointer-events-none absolute -top-16 -right-12 h-64 w-64 rounded-full bg-orange-200/45 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-12 h-64 w-64 rounded-full bg-sky-200/35 blur-3xl" />

        <div className="relative space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-extrabold tracking-[0.35em] text-orange-500 uppercase">{copy.heading[locale]}</p>
            <h1 className="text-4xl leading-tight font-black tracking-tight text-stone-900 md:text-6xl">
              {copy.heading[locale]}
            </h1>
            <p className="max-w-3xl text-base leading-relaxed text-stone-600 md:text-lg">{copy.subtitle[locale]}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr,auto] md:items-center">
            <label htmlFor="journal-search" className="sr-only">
              Search
            </label>
            <input
              id="journal-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.searchPlaceholder[locale]}
              className="w-full rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-stone-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
            <div className="rounded-full border border-stone-300 bg-stone-50 px-4 py-2 text-xs font-bold tracking-[0.16em] text-stone-500 uppercase">
              {filteredPosts.length} articles
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`rounded-full px-4 py-2 text-xs font-bold tracking-[0.16em] uppercase transition ${
                activeCategory === "all"
                  ? "bg-stone-900 text-white"
                  : "border border-stone-300 bg-white text-stone-600 hover:border-stone-400"
              }`}
            >
              {copy.all[locale]}
            </button>
            {categories.map((category) => {
              const title =
                pickTranslation(category.translations, locale)?.title ||
                pickTranslation(category.translations, alternateLocale(locale))?.title ||
                category.slug;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className={`rounded-full px-4 py-2 text-xs font-bold tracking-[0.16em] uppercase transition ${
                    activeCategory === category.id
                      ? "bg-stone-900 text-white"
                      : "border border-stone-300 bg-white text-stone-600 hover:border-stone-400"
                  }`}
                >
                  {title}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {!featured ? (
        <section className="rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-sm text-stone-500">
          {copy.empty[locale]}
        </section>
      ) : (
        <section className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
          <article className="overflow-hidden rounded-[1.6rem] border border-stone-200 bg-white">
            {featured.featuredImage ? (
              <img
                src={featured.featuredImage}
                alt={pickTranslation(featured.translations, locale)?.title || featured.slug}
                className="aspect-[16/9] w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex aspect-[16/9] items-center justify-center bg-stone-100 text-sm text-stone-500">No Preview</div>
            )}

            <div className="space-y-4 p-6">
              <p className="text-xs font-extrabold tracking-[0.2em] text-orange-500 uppercase">{copy.featured[locale]}</p>
              <h2 className="text-2xl font-black tracking-tight text-stone-900 md:text-3xl">
                {pickTranslation(featured.translations, locale)?.title ||
                  pickTranslation(featured.translations, alternateLocale(locale))?.title ||
                  featured.slug}
              </h2>
              <p className="text-sm leading-relaxed text-stone-600 md:text-base">
                {stripHtml(
                  pickTranslation(featured.translations, locale)?.content ||
                    pickTranslation(featured.translations, alternateLocale(locale))?.content,
                ).slice(0, 220)}
                ...
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-stone-500">
                <span>{formatDate(featured.publishedAt, locale)}</span>
                <span aria-hidden>|</span>
                <span>
                  {copy.by[locale]} {featured.createdBy || "Admin"}
                </span>
                <span aria-hidden>|</span>
                <span>
                  {calculateReadMinutes(
                    stripHtml(
                      pickTranslation(featured.translations, locale)?.content ||
                        pickTranslation(featured.translations, alternateLocale(locale))?.content,
                    ),
                  )}{" "}
                  {copy.readMinutes[locale]}
                </span>
              </div>
            </div>
          </article>

          <div className="space-y-4">
            {list.slice(0, 4).map((post) => {
              const translation = pickTranslation(post.translations, locale);
              const fallback = pickTranslation(post.translations, alternateLocale(locale));
              const text = stripHtml(translation?.content || fallback?.content);
              return (
                <article
                  key={post.id}
                  className="rounded-2xl border border-stone-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
                >
                  <h3 className="text-xl font-black tracking-tight text-stone-900">{translation?.title || fallback?.title || post.slug}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-600">{text}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-stone-500">
                    <span>{formatDate(post.publishedAt, locale)}</span>
                    <span aria-hidden>|</span>
                    <span>
                      {calculateReadMinutes(text)} {copy.readMinutes[locale]}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {list.length > 4 ? (
        <section className="grid gap-4 md:grid-cols-2">
          {list.slice(4).map((post) => {
            const translation = pickTranslation(post.translations, locale);
            const fallback = pickTranslation(post.translations, alternateLocale(locale));
            const text = stripHtml(translation?.content || fallback?.content);
            return (
              <article key={post.id} className="rounded-2xl border border-stone-200 bg-white p-5">
                <h3 className="text-lg font-black tracking-tight text-stone-900">{translation?.title || fallback?.title || post.slug}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-stone-600">{text}</p>
                <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-stone-500">
                  <span>{formatDate(post.publishedAt, locale)}</span>
                  <span aria-hidden>|</span>
                  <span>
                    {calculateReadMinutes(text)} {copy.readMinutes[locale]}
                  </span>
                </div>
              </article>
            );
          })}
        </section>
      ) : null}
    </div>
  );
}

