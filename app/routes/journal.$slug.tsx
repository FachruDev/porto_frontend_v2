import { useState } from "react";
import type { ClientLoaderFunction } from "react-router";
import { redirect, useLoaderData } from "react-router";

import { JournalDetailContent } from "~/components/journal/JournalDetailContent";
import { Footer } from "~/components/landing/Footer";
import { Navbar } from "~/components/landing/Navbar";
import {
  getLandingContactInfo,
  getLandingWebConfig,
  listLandingBlogPosts,
  listLandingSocials,
} from "~/lib/landing";
import { pickTranslation } from "~/lib/locale";
import type { BlogPost, ContactInformation, SocialMedia, WebConfig } from "~/lib/types";
import type { Route } from "./+types/journal.$slug";

type LoaderData = {
  post: BlogPost;
  relatedPosts: BlogPost[];
  socials: SocialMedia[];
  contact: ContactInformation | null;
  webConfig: WebConfig | null;
};

const stripHtml = (value: string | null | undefined) =>
  (value ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const normalizePosts = (payload: Awaited<ReturnType<typeof listLandingBlogPosts>>): BlogPost[] =>
  Array.isArray(payload) ? payload : payload.data;

const getPostDate = (post: BlogPost) => {
  const time = new Date(post.publishedAt || post.createdAt).getTime();
  return Number.isNaN(time) ? 0 : time;
};

export const clientLoader: ClientLoaderFunction = async ({ params }) => {
  const slug = params.slug;
  if (!slug) throw redirect("/journal");

  const [postsResult, socialsResult, contactResult, webConfigResult] = await Promise.allSettled([
    listLandingBlogPosts({ limit: 500, sort: "new" }),
    listLandingSocials(),
    getLandingContactInfo(),
    getLandingWebConfig(),
  ]);

  const postList = postsResult.status === "fulfilled" ? normalizePosts(postsResult.value) : [];
  const post = postList.find((item) => item.slug === slug) ?? null;

  if (!post) throw redirect("/journal");

  const relatedPosts = postList
    .filter((item) => item.slug !== post.slug)
    .sort((a, b) => {
      const aScore = a.blogCategoryId === post.blogCategoryId ? 1 : 0;
      const bScore = b.blogCategoryId === post.blogCategoryId ? 1 : 0;
      if (aScore !== bScore) return bScore - aScore;
      return getPostDate(b) - getPostDate(a);
    })
    .slice(0, 5);

  return {
    post,
    relatedPosts,
    socials: socialsResult.status === "fulfilled" ? socialsResult.value : [],
    contact: contactResult.status === "fulfilled" ? contactResult.value : null,
    webConfig: webConfigResult.status === "fulfilled" ? webConfigResult.value : null,
  };
};

export function meta({ data }: Route.MetaArgs) {
  const typed = (data || {}) as Partial<LoaderData>;
  const baseTitle = typed.webConfig?.metaTitle || "Portfolio";
  const titleText =
    (typed.post && (pickTranslation(typed.post.translations, "EN")?.title || typed.post.slug)) || "Journal Detail";
  const description =
    (typed.post && stripHtml(pickTranslation(typed.post.translations, "EN")?.content).slice(0, 155)) ||
    typed.webConfig?.metaDescription ||
    "Read journal detail from my portfolio notes.";

  return [{ title: `${titleText} | ${baseTitle}` }, { name: "description", content: description }];
}

export default function JournalDetailRoute() {
  const data = useLoaderData<LoaderData>();
  const [locale, setLocale] = useState<"EN" | "ID">("EN");

  return (
    <main className="min-h-screen bg-linear-to-br from-stone-100 via-orange-50/35 to-sky-100/45 pt-28">
      <Navbar locale={locale} onLocaleChange={setLocale} />
      <JournalDetailContent post={data.post} relatedPosts={data.relatedPosts} locale={locale} />
      <Footer contact={data.contact} socials={data.socials} webConfig={data.webConfig} />
    </main>
  );
}

