import { useState } from "react";
import type { ClientLoaderFunction } from "react-router";
import { useLoaderData } from "react-router";

import { AboutPageContent } from "~/components/about/AboutPageContent";
import { Footer } from "~/components/landing/Footer";
import { Navbar } from "~/components/landing/Navbar";
import {
  getLandingAbout,
  getLandingContactInfo,
  getLandingWebConfig,
  listLandingExperiences,
  listLandingSkills,
  listLandingSocials,
} from "~/lib/landing";
import { alternateLocale, pickTranslation } from "~/lib/locale";
import type { About, ContactInformation, Experience, Skill, SocialMedia, WebConfig } from "~/lib/types";
import type { Route } from "./+types/page";

type LoaderData = {
  about: About | null;
  experiences: Experience[];
  skills: Skill[];
  socials: SocialMedia[];
  contact: ContactInformation | null;
  webConfig: WebConfig | null;
};

export const clientLoader: ClientLoaderFunction = async () => {
  const [aboutResult, experiencesResult, skillsResult, socialsResult, contactResult, webConfigResult] =
    await Promise.allSettled([
      getLandingAbout(),
      listLandingExperiences(),
      listLandingSkills(),
      listLandingSocials(),
      getLandingContactInfo(),
      getLandingWebConfig(),
    ]);

  return {
    about: aboutResult.status === "fulfilled" ? aboutResult.value : null,
    experiences: experiencesResult.status === "fulfilled" ? experiencesResult.value : [],
    skills: skillsResult.status === "fulfilled" ? skillsResult.value : [],
    socials: socialsResult.status === "fulfilled" ? socialsResult.value : [],
    contact: contactResult.status === "fulfilled" ? contactResult.value : null,
    webConfig: webConfigResult.status === "fulfilled" ? webConfigResult.value : null,
  };
};

export function meta({ data }: Route.MetaArgs) {
  const typed = (data || {}) as Partial<LoaderData>;
  const baseTitle = typed.webConfig?.metaTitle || "Portfolio";
  const title = `About | ${baseTitle}`;

  const translation = pickTranslation(typed.about?.translations, "EN");
  const fallback = pickTranslation(typed.about?.translations, alternateLocale("EN"));
  const description =
    translation?.content || fallback?.content || typed.webConfig?.metaDescription || "About page for my portfolio.";

  return [{ title }, { name: "description", content: description }];
}

export default function AboutRoutePage() {
  const data = useLoaderData<LoaderData>();
  const [locale, setLocale] = useState<"EN" | "ID">("EN");

  return (
    <main className="min-h-screen bg-linear-to-br from-stone-100 via-orange-50/45 to-violet-100/55 pt-28">
      <Navbar locale={locale} onLocaleChange={setLocale} />
      <AboutPageContent
        about={data.about}
        experiences={data.experiences}
        skills={data.skills}
        locale={locale}
      />
      <Footer contact={data.contact} socials={data.socials} webConfig={data.webConfig} />
    </main>
  );
}
