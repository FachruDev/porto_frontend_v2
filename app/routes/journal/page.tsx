import { useState } from "react";
import type { ClientLoaderFunction } from "react-router";
import { useLoaderData } from "react-router";

import { JournalPageContent } from "~/components/journal/JournalPageContent";
import { Footer } from "~/components/landing/Footer";
import { Navbar } from "~/components/landing/Navbar";
import {
  getLandingContactInfo,
  getLandingWebConfig,
  listLandingBlogCategories,
  listLandingBlogPosts,
  listLandingSocials,
} from "~/lib/landing";
import type { BlogCategory, BlogPost, ContactInformation, SocialMedia, WebConfig } from "~/lib/types";
import type { Route } from "./+types/page";

type LoaderData = {
  posts: BlogPost[];
  categories: BlogCategory[];
  socials: SocialMedia[];
  contact: ContactInformation | null;
  webConfig: WebConfig | null;
};

const stripHtml = (value: string | null | undefined) =>
  (value ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

export const clientLoader: ClientLoaderFunction = async () => {
  const [postsResult, categoriesResult, socialsResult, contactResult, webConfigResult] = await Promise.allSettled([
    listLandingBlogPosts(),
    listLandingBlogCategories(),
    listLandingSocials(),
    getLandingContactInfo(),
    getLandingWebConfig(),
  ]);

  const postPayload = postsResult.status === "fulfilled" ? postsResult.value : [];
  const posts = Array.isArray(postPayload) ? postPayload : postPayload.data;

  return {
    posts,
    categories: categoriesResult.status === "fulfilled" ? categoriesResult.value : [],
    socials: socialsResult.status === "fulfilled" ? socialsResult.value : [],
    contact: contactResult.status === "fulfilled" ? contactResult.value : null,
    webConfig: webConfigResult.status === "fulfilled" ? webConfigResult.value : null,
  };
};

export function meta({ data }: Route.MetaArgs) {
  const typed = (data || {}) as Partial<LoaderData>;
  const baseTitle = typed.webConfig?.metaTitle || "Portfolio";
  const title = `Journal | ${baseTitle}`;

  const firstPost = typed.posts?.[0];
  const firstTranslation = firstPost?.translations?.find((translation) => translation.locale === "EN");
  const description =
    stripHtml(firstTranslation?.content).slice(0, 155) ||
    typed.webConfig?.metaDescription ||
    "Notes and insights from my portfolio journey.";

  return [{ title }, { name: "description", content: description }];
}

export default function JournalRoutePage() {
  const data = useLoaderData<LoaderData>();
  const [locale, setLocale] = useState<"EN" | "ID">("EN");

  return (
    <main className="min-h-screen bg-linear-to-br from-stone-100 via-orange-50/35 to-sky-100/45 pt-28">
      <Navbar locale={locale} onLocaleChange={setLocale} />
      <JournalPageContent posts={data.posts} categories={data.categories} locale={locale} />
      <Footer contact={data.contact} socials={data.socials} webConfig={data.webConfig} />
    </main>
  );
}

