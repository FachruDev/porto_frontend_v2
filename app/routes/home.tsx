import type { Route } from "./+types/home";
import type { ClientLoaderFunction } from "react-router";
import { useLoaderData } from "react-router";
import { useState } from "react";

import { getLandingAbout, getLandingHero, getLandingWebConfig, listLandingExperiences } from "~/lib/landing";
import type { About, Experience, Hero, WebConfig } from "~/lib/types";
import LandingPage from "~/routes/landing/page";
import { Navbar } from "~/components/landing/Navbar";

type LoaderData = {
  hero: Hero | null;
  about: About | null;
  experiences: Experience[];
  webConfig: WebConfig | null;
};

async function safe<T>(fallback: T, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export const clientLoader: ClientLoaderFunction = async () => {
  const [
    hero,
    about,
    experiences,
    webConfig,
  ] = await Promise.all([
    safe<Hero | null>(null, getLandingHero),
    safe<About | null>(null, getLandingAbout),
    safe<Experience[]>([], listLandingExperiences),
    safe<WebConfig | null>(null, getLandingWebConfig),
  ]);

  return {
    hero,
    about,
    experiences,
    webConfig,
  };
};

export function meta({ data }: Route.MetaArgs) {
  const typed = (data || {}) as Partial<LoaderData>;
  const title = typed.webConfig?.metaTitle || "Portfolio";
  const description = typed.webConfig?.metaDescription || "Creative portfolio website";
  return [{ title }, { name: "description", content: description }];
}

export default function Home() {
  const data = useLoaderData<LoaderData>();
  const [locale, setLocale] = useState<"EN" | "ID">("EN");
  return (
    <div className="space-y-6">
      <Navbar locale={locale} onLocaleChange={setLocale} />
      <LandingPage {...data} locale={locale} />
    </div>
  );
}
