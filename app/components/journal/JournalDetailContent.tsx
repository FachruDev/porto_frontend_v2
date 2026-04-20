"use client";

import { Link } from "react-router";

import { alternateLocale, pickTranslation } from "~/lib/locale";
import type { BlogPost, Locale } from "~/lib/types";

type Props = {
  post: BlogPost;
  relatedPosts: BlogPost[];
  locale: Locale;
};

const copy = {
  backToJournal: { EN: "Back to Journal", ID: "Kembali ke Jurnal" },
  articleOverview: { EN: "Article Snapshot", ID: "Ringkasan Artikel" },
  readMinutes: { EN: "min read", ID: "menit baca" },
  readTime: { EN: "Estimated read", ID: "Estimasi baca" },
  writtenBy: { EN: "Written by", ID: "Ditulis oleh" },
  publishedAt: { EN: "Published", ID: "Dipublikasikan" },
  category: { EN: "Category", ID: "Kategori" },
  noCategory: { EN: "General", ID: "Umum" },
  related: { EN: "Continue Reading", ID: "Lanjut Membaca" },
  relatedSubtitle: {
    EN: "More notes and stories from the same journal archive.",
    ID: "Catatan dan cerita lainnya dari arsip jurnal yang sama.",
  },
  noRelated: { EN: "No related journals yet.", ID: "Belum ada jurnal terkait." },
  readStory: { EN: "Open", ID: "Buka" },
  noPreview: { EN: "No preview image", ID: "Tidak ada gambar preview" },
  archive: { EN: "Browse Archive", ID: "Lihat Arsip" },
};

const stripHtml = (value: string | null | undefined) =>
  (value ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

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

const calculateReadMinutes = (text: string) => Math.max(1, Math.ceil(text.split(/\s+/).filter(Boolean).length / 200));

export function JournalDetailContent({ post, relatedPosts, locale }: Props) {
  const current = pickTranslation(post.translations, locale);
  const fallback = pickTranslation(post.translations, alternateLocale(locale));
  const title = current?.title || fallback?.title || post.slug;
  const contentHtml = current?.content || fallback?.content || "";
  const plainContent = stripHtml(contentHtml);
  const readMinutes = calculateReadMinutes(plainContent);
  const excerpt = plainContent.slice(0, 190);

  const categoryTitle =
    post.blogCategory &&
    (pickTranslation(post.blogCategory.translations, locale)?.title ||
      pickTranslation(post.blogCategory.translations, alternateLocale(locale))?.title ||
      post.blogCategory.slug);
  const publishedAt = post.publishedAt || post.createdAt;

  return (
    <article className="mx-auto max-w-7xl space-y-8 px-4 pb-20 md:px-6">
      <section className="relative overflow-hidden rounded-[2.4rem] border border-stone-700/60 bg-linear-to-br from-stone-900 via-stone-800 to-stone-900 p-6 text-white shadow-xl md:p-10">
        <div className="pointer-events-none absolute -top-28 -right-10 h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-sky-400/15 blur-3xl" />

        <div className="relative space-y-6">
          <Link
            to="/journal"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-bold tracking-[0.16em] text-white uppercase transition-colors hover:border-orange-300/60 hover:bg-white/10"
          >
            <span aria-hidden>{"<-"}</span>
            {copy.backToJournal[locale]}
          </Link>

          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold tracking-[0.15em] text-stone-200 uppercase">
            <span className="rounded-full bg-white/10 px-3 py-1 text-white">{categoryTitle || copy.noCategory[locale]}</span>
            <span>{formatDate(publishedAt, locale)}</span>
            <span aria-hidden>|</span>
            <span>
              {readMinutes} {copy.readMinutes[locale]}
            </span>
          </div>

          <h1 className="max-w-4xl text-4xl leading-tight font-black tracking-tight md:text-6xl">{title}</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-stone-200 md:text-base">{excerpt}</p>

          {post.featuredImage ? (
            <div className="overflow-hidden rounded-[1.4rem] border border-white/15">
              <img src={post.featuredImage} alt={title} className="aspect-[16/8] w-full object-cover" loading="lazy" />
            </div>
          ) : (
            <div className="flex min-h-52 items-center justify-center rounded-[1.4rem] border border-white/15 bg-white/5 p-6 text-center text-sm font-semibold text-stone-200">
              {copy.noPreview[locale]}
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[280px,minmax(0,1fr)]">
        <aside className="space-y-4 lg:self-start">
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-black tracking-[0.18em] text-stone-700 uppercase">{copy.articleOverview[locale]}</h2>
            <div className="mt-4 space-y-3 text-sm text-stone-700">
              <p className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-bold tracking-[0.14em] text-stone-500 uppercase">{copy.publishedAt[locale]}</span>
                <span className="text-right font-semibold">{formatDate(publishedAt, locale)}</span>
              </p>
              <p className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-bold tracking-[0.14em] text-stone-500 uppercase">{copy.category[locale]}</span>
                <span className="text-right font-semibold">{categoryTitle || copy.noCategory[locale]}</span>
              </p>
              <p className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-bold tracking-[0.14em] text-stone-500 uppercase">{copy.writtenBy[locale]}</span>
                <span className="text-right font-semibold">{post.createdBy || "Admin"}</span>
              </p>
              <p className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-bold tracking-[0.14em] text-stone-500 uppercase">{copy.readTime[locale]}</span>
                <span className="text-right font-semibold">
                  {readMinutes} {copy.readMinutes[locale]}
                </span>
              </p>
            </div>

            <Link
              to="/journal"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-xs font-bold tracking-[0.16em] text-stone-700 uppercase transition-colors hover:border-orange-300 hover:text-orange-600"
            >
              {copy.archive[locale]}
              <span aria-hidden>{"->"}</span>
            </Link>
          </section>
        </aside>

        <div className="rounded-[1.8rem] border border-stone-200 bg-white p-6 shadow-sm md:p-10">
          <div
            className="space-y-4 leading-relaxed text-stone-700 [&_a]:font-semibold [&_a]:text-orange-600 [&_a]:underline [&_h1]:mt-8 [&_h1]:text-3xl [&_h1]:font-black [&_h1]:tracking-tight [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:tracking-tight [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-black [&_img]:my-6 [&_img]:rounded-xl [&_img]:border [&_img]:border-stone-200 [&_img]:shadow-sm [&_li]:my-1 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_p]:text-base [&_p]:md:text-lg [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-stone-900 [&_pre]:p-4 [&_pre]:text-sm [&_pre]:text-stone-100 [&_strong]:font-bold [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-black tracking-tight text-stone-900 md:text-3xl">{copy.related[locale]}</h2>
          <p className="text-sm text-stone-600">{copy.relatedSubtitle[locale]}</p>
        </div>

        {!relatedPosts.length ? <p className="text-sm text-stone-500">{copy.noRelated[locale]}</p> : null}
        {relatedPosts.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {relatedPosts.map((item) => {
              const itemTitle =
                pickTranslation(item.translations, locale)?.title ||
                pickTranslation(item.translations, alternateLocale(locale))?.title ||
                item.slug;
              const itemContent = stripHtml(
                pickTranslation(item.translations, locale)?.content ||
                  pickTranslation(item.translations, alternateLocale(locale))?.content,
              );
              return (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-stone-200 bg-white transition-all hover:border-orange-200 hover:shadow-md"
                >
                  {item.featuredImage ? (
                    <img src={item.featuredImage} alt={itemTitle} className="aspect-[16/9] w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex aspect-[16/9] w-full items-center justify-center bg-stone-100 text-sm text-stone-500">
                      {copy.noPreview[locale]}
                    </div>
                  )}

                  <div className="space-y-3 p-4">
                    <p className="text-[11px] font-semibold text-stone-500">{formatDate(item.publishedAt || item.createdAt, locale)}</p>
                    <h3 className="line-clamp-2 text-lg font-black tracking-tight text-stone-900">{itemTitle}</h3>
                    <p className="line-clamp-2 text-sm text-stone-600">{itemContent}</p>
                    <Link
                      to={`/journal/${item.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-orange-600 uppercase"
                    >
                      {copy.readStory[locale]}
                      <span aria-hidden>{"->"}</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </section>
    </article>
  );
}

