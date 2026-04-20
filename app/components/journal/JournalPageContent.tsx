"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

import { alternateLocale, pickTranslation } from "~/lib/locale";
import type { BlogCategory, BlogPost, Locale } from "~/lib/types";

type Props = {
  posts: BlogPost[];
  categories: BlogCategory[];
  locale: Locale;
};

type SortBy = "newest" | "oldest" | "read" | "title";

const PAGE_SIZE = 12;

const copy = {
  heading: { EN: "Journal", ID: "Jurnal" },
  title: { EN: "Journal Archive", ID: "Arsip Jurnal" },
  subtitle: {
    EN: "A modern archive layout designed for growing article collections.",
    ID: "Layout arsip modern yang dirancang untuk koleksi artikel yang terus bertambah.",
  },
  searchPlaceholder: { EN: "Search title, keyword, or slug...", ID: "Cari judul, keyword, atau slug..." },
  allTopics: { EN: "All Topics", ID: "Semua Topik" },
  sortBy: { EN: "Sort by", ID: "Urutkan" },
  newest: { EN: "Newest", ID: "Terbaru" },
  oldest: { EN: "Oldest", ID: "Terlama" },
  longestRead: { EN: "Longest Read", ID: "Bacaan Terpanjang" },
  titleAz: { EN: "Title A-Z", ID: "Judul A-Z" },
  reset: { EN: "Reset", ID: "Reset" },
  showing: { EN: "Showing", ID: "Menampilkan" },
  of: { EN: "of", ID: "dari" },
  results: { EN: "results", ID: "hasil" },
  totalArticles: { EN: "Total Articles", ID: "Total Artikel" },
  topics: { EN: "Topics", ID: "Topik" },
  readArticle: { EN: "Read Article", ID: "Baca Artikel" },
  noPreview: { EN: "No preview image", ID: "Tidak ada gambar preview" },
  by: { EN: "By", ID: "Oleh" },
  readMinutes: { EN: "min read", ID: "menit baca" },
  emptyTitle: { EN: "No journal found", ID: "Jurnal tidak ditemukan" },
  emptyBody: {
    EN: "Try a different keyword, topic, or sorting option.",
    ID: "Coba keyword, topik, atau urutan yang lain.",
  },
  previous: { EN: "Previous", ID: "Sebelumnya" },
  next: { EN: "Next", ID: "Berikutnya" },
};

const stripHtml = (value: string | null | undefined) =>
  (value ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const calculateReadMinutes = (text: string) => Math.max(1, Math.ceil(text.split(/\s+/).filter(Boolean).length / 200));

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

const getPostDate = (post: BlogPost) => {
  const timestamp = new Date(post.publishedAt || post.createdAt).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

export function JournalPageContent({ posts, categories, locale }: Props) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<number | "all">("all");
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const categoryMap = useMemo(() => new Map(categories.map((item) => [item.id, item])), [categories]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<number, number>();
    for (const post of posts) counts.set(post.blogCategoryId, (counts.get(post.blogCategoryId) || 0) + 1);
    return counts;
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    const filtered = posts.filter((post) => {
      const current = pickTranslation(post.translations, locale);
      const fallback = pickTranslation(post.translations, alternateLocale(locale));
      const title = (current?.title || fallback?.title || "").toLowerCase();
      const content = stripHtml(current?.content || fallback?.content).toLowerCase();
      const passCategory = activeCategory === "all" || post.blogCategoryId === activeCategory;
      const passSearch =
        keyword.length === 0 ||
        title.includes(keyword) ||
        content.includes(keyword) ||
        post.slug.toLowerCase().includes(keyword);
      return passCategory && passSearch;
    });

    const sorted = [...filtered];
    sorted.sort((left, right) => {
      if (sortBy === "title") {
        const leftTitle =
          pickTranslation(left.translations, locale)?.title ||
          pickTranslation(left.translations, alternateLocale(locale))?.title ||
          left.slug;
        const rightTitle =
          pickTranslation(right.translations, locale)?.title ||
          pickTranslation(right.translations, alternateLocale(locale))?.title ||
          right.slug;
        return leftTitle.localeCompare(rightTitle);
      }

      if (sortBy === "read") {
        const leftRead = calculateReadMinutes(
          stripHtml(
            pickTranslation(left.translations, locale)?.content ||
              pickTranslation(left.translations, alternateLocale(locale))?.content,
          ),
        );
        const rightRead = calculateReadMinutes(
          stripHtml(
            pickTranslation(right.translations, locale)?.content ||
              pickTranslation(right.translations, alternateLocale(locale))?.content,
          ),
        );
        return rightRead - leftRead;
      }

      const leftDate = getPostDate(left);
      const rightDate = getPostDate(right);
      return sortBy === "oldest" ? leftDate - rightDate : rightDate - leftDate;
    });
    return sorted;
  }, [activeCategory, locale, posts, query, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, query, sortBy, locale]);

  const totalResults = filteredPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filteredPosts.slice(startIndex, startIndex + PAGE_SIZE);
  const startNumber = totalResults === 0 ? 0 : startIndex + 1;
  const endNumber = startIndex + pageItems.length;

  const pageNumbers = useMemo(() => {
    if (totalPages <= 1) return [1];
    const spread = 2;
    let start = Math.max(1, currentPage - spread);
    let end = Math.min(totalPages, currentPage + spread);
    while (end - start < 4) {
      if (start > 1) start -= 1;
      else if (end < totalPages) end += 1;
      else break;
    }
    const result: number[] = [];
    for (let page = start; page <= end; page += 1) result.push(page);
    return result;
  }, [currentPage, totalPages]);

  const resetFilters = () => {
    setQuery("");
    setActiveCategory("all");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const getCategoryTitle = (post: BlogPost) => {
    const category = categoryMap.get(post.blogCategoryId);
    return (
      (category &&
        (pickTranslation(category.translations, locale)?.title ||
          pickTranslation(category.translations, alternateLocale(locale))?.title ||
          category.slug)) ||
      copy.allTopics[locale]
    );
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 pb-20 md:px-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-stone-200/80 bg-white p-6 shadow-sm md:p-10">
        <div className="pointer-events-none absolute -top-20 right-0 h-64 w-64 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-64 w-64 rounded-full bg-sky-200/30 blur-3xl" />

        <div className="relative space-y-4">
          <p className="text-xs font-extrabold tracking-[0.35em] text-orange-500 uppercase">{copy.heading[locale]}</p>
          <h1 className="max-w-4xl text-4xl leading-tight font-black tracking-tight text-stone-900 md:text-6xl">
            {copy.title[locale]}
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-stone-600 md:text-lg">{copy.subtitle[locale]}</p>

          <div className="grid gap-3 sm:grid-cols-2">
            <article className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">
              <p className="text-[11px] font-bold tracking-[0.16em] text-stone-500 uppercase">{copy.totalArticles[locale]}</p>
              <p className="mt-1 text-3xl font-black text-stone-900">{String(posts.length).padStart(2, "0")}</p>
            </article>
            <article className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">
              <p className="text-[11px] font-bold tracking-[0.16em] text-stone-500 uppercase">{copy.topics[locale]}</p>
              <p className="mt-1 text-3xl font-black text-stone-900">{String(categories.length).padStart(2, "0")}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm md:p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr),220px,auto]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.searchPlaceholder[locale]}
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortBy)}
            className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          >
            <option value="newest">{copy.sortBy[locale]}: {copy.newest[locale]}</option>
            <option value="oldest">{copy.sortBy[locale]}: {copy.oldest[locale]}</option>
            <option value="read">{copy.sortBy[locale]}: {copy.longestRead[locale]}</option>
            <option value="title">{copy.sortBy[locale]}: {copy.titleAz[locale]}</option>
          </select>

          <button
            type="button"
            onClick={resetFilters}
            className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-bold tracking-[0.14em] text-stone-700 uppercase transition-colors hover:border-orange-300 hover:text-orange-600"
          >
            {copy.reset[locale]}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`rounded-full px-4 py-2 text-xs font-bold tracking-[0.14em] uppercase transition ${
              activeCategory === "all"
                ? "bg-stone-900 text-white"
                : "border border-stone-300 bg-white text-stone-600 hover:border-stone-400"
            }`}
          >
            {copy.allTopics[locale]} ({posts.length})
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
                className={`rounded-full px-4 py-2 text-xs font-bold tracking-[0.14em] uppercase transition ${
                  activeCategory === category.id
                    ? "bg-stone-900 text-white"
                    : "border border-stone-300 bg-white text-stone-600 hover:border-stone-400"
                }`}
              >
                {title} ({categoryCounts.get(category.id) || 0})
              </button>
            );
          })}
        </div>

        <p className="text-sm font-semibold text-stone-700">
          {copy.showing[locale]} <span className="font-black">{startNumber}</span>-<span className="font-black">{endNumber}</span> {copy.of[locale]}{" "}
          <span className="font-black">{totalResults}</span> {copy.results[locale]}
        </p>
      </section>

      {totalResults === 0 ? (
        <section className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
          <h3 className="text-lg font-black text-stone-900">{copy.emptyTitle[locale]}</h3>
          <p className="mt-1 text-sm text-stone-500">{copy.emptyBody[locale]}</p>
        </section>
      ) : (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {pageItems.map((post, index) => {
            const translation = pickTranslation(post.translations, locale);
            const fallback = pickTranslation(post.translations, alternateLocale(locale));
            const title = translation?.title || fallback?.title || post.slug;
            const text = stripHtml(translation?.content || fallback?.content);
            const categoryTitle = getCategoryTitle(post);
            const leadCard = index === 0;

            return (
              <article
                key={post.id}
                className={`group overflow-hidden rounded-[1.5rem] border border-stone-200 bg-white transition-all hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md ${
                  leadCard ? "md:col-span-2 xl:col-span-2" : ""
                }`}
              >
                {post.featuredImage ? (
                  <img
                    src={post.featuredImage}
                    alt={title}
                    className={`w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] ${
                      leadCard ? "aspect-[21/9]" : "aspect-[16/10]"
                    }`}
                    loading="lazy"
                  />
                ) : (
                  <div
                    className={`flex w-full items-center justify-center bg-stone-100 text-sm text-stone-500 ${
                      leadCard ? "aspect-[21/9]" : "aspect-[16/10]"
                    }`}
                  >
                    {copy.noPreview[locale]}
                  </div>
                )}

                <div className="space-y-3 p-5">
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold tracking-[0.14em] text-stone-500 uppercase">
                    <span className="rounded-full bg-stone-100 px-2.5 py-1 text-stone-600">{categoryTitle}</span>
                    <span>{formatDate(post.publishedAt || post.createdAt, locale)}</span>
                  </div>

                  <h3 className={`${leadCard ? "text-2xl md:text-3xl" : "text-xl"} line-clamp-2 font-black tracking-tight text-stone-900`}>
                    {title}
                  </h3>
                  <p className={`${leadCard ? "line-clamp-4 md:text-base" : "line-clamp-3"} text-sm leading-relaxed text-stone-600`}>
                    {text}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-stone-500">
                    <span>
                      {copy.by[locale]} {post.createdBy || "Admin"}
                    </span>
                    <span aria-hidden>|</span>
                    <span>
                      {calculateReadMinutes(text)} {copy.readMinutes[locale]}
                    </span>
                  </div>

                  <Link
                    to={`/journal/${post.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-xs font-bold tracking-[0.16em] text-stone-700 uppercase transition-colors hover:border-orange-300 hover:text-orange-600"
                  >
                    {copy.readArticle[locale]}
                    <span aria-hidden>{"->"}</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {totalResults > 0 && totalPages > 1 ? (
        <section className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
            className="rounded-full border border-stone-300 bg-white px-4 py-2 text-xs font-bold tracking-[0.14em] text-stone-700 uppercase transition-colors enabled:hover:border-orange-300 enabled:hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copy.previous[locale]}
          </button>

          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => setCurrentPage(pageNumber)}
              className={`h-9 min-w-9 rounded-full border px-3 text-xs font-bold transition ${
                pageNumber === currentPage
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-300 bg-white text-stone-700 hover:border-orange-300 hover:text-orange-600"
              }`}
            >
              {pageNumber}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages}
            className="rounded-full border border-stone-300 bg-white px-4 py-2 text-xs font-bold tracking-[0.14em] text-stone-700 uppercase transition-colors enabled:hover:border-orange-300 enabled:hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copy.next[locale]}
          </button>
        </section>
      ) : null}
    </div>
  );
}
