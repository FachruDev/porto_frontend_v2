import type { Route } from "./+types/home";
import type { ClientLoaderFunction } from "react-router";
import { useLoaderData } from "react-router";
import { useState } from "react";

import {
  getLandingAbout,
  getLandingHero,
  getLandingWebConfig,
  listLandingCertificates,
  listLandingExperiences,
  listLandingProjects,
  listLandingSkills,
} from "~/lib/landing";
import type { About, Certificate, Experience, Hero, Project, Skill, WebConfig } from "~/lib/types";
import LandingPage from "~/routes/landing/page";
import { Navbar } from "~/components/landing/Navbar";

type LoaderData = {
  hero: Hero | null;
  about: About | null;
  experiences: Experience[];
  skills: Skill[];
  projects: Project[];
  certificates: Certificate[];
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
    skills,
    projects,
    certificates,
    webConfig,
  ] = await Promise.all([
    safe<Hero | null>(null, getLandingHero),
    safe<About | null>(null, getLandingAbout),
    safe<Experience[]>([], listLandingExperiences),
    safe<Skill[]>([], listLandingSkills),
    safe<Project[]>([], listLandingProjects),
    safe<Certificate[]>([], listLandingCertificates),
    safe<WebConfig | null>(null, getLandingWebConfig),
  ]);

  return {
    hero,
    about,
    experiences,
    skills,
    projects,
    certificates,
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
