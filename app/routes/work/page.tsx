import { useState } from "react";
import type { ClientLoaderFunction } from "react-router";
import { useLoaderData } from "react-router";

import { Footer } from "~/components/landing/Footer";
import { Navbar } from "~/components/landing/Navbar";
import { WorkPageContent } from "~/components/work/WorkPageContent";
import { getLandingContactInfo, getLandingWebConfig, listLandingProjects, listLandingSocials } from "~/lib/landing";
import type { ContactInformation, Project, SocialMedia, WebConfig } from "~/lib/types";
import type { Route } from "./+types/page";

type LoaderData = {
  projects: Project[];
  socials: SocialMedia[];
  contact: ContactInformation | null;
  webConfig: WebConfig | null;
};

export const clientLoader: ClientLoaderFunction = async () => {
  const [projectsResult, socialsResult, contactResult, webConfigResult] = await Promise.allSettled([
    listLandingProjects(),
    listLandingSocials(),
    getLandingContactInfo(),
    getLandingWebConfig(),
  ]);

  return {
    projects: projectsResult.status === "fulfilled" ? projectsResult.value : [],
    socials: socialsResult.status === "fulfilled" ? socialsResult.value : [],
    contact: contactResult.status === "fulfilled" ? contactResult.value : null,
    webConfig: webConfigResult.status === "fulfilled" ? webConfigResult.value : null,
  };
};

export function meta({ data }: Route.MetaArgs) {
  const typed = (data || {}) as Partial<LoaderData>;
  const baseTitle = typed.webConfig?.metaTitle || "Portfolio";
  const title = `Work | ${baseTitle}`;
  const description =
    typed.webConfig?.metaDescription ||
    `Selected portfolio works${typed.projects?.length ? ` (${typed.projects.length} projects)` : ""}.`;

  return [{ title }, { name: "description", content: description }];
}

export default function WorkRoutePage() {
  const data = useLoaderData<LoaderData>();
  const [locale, setLocale] = useState<"EN" | "ID">("EN");

  return (
    <main className="min-h-screen bg-linear-to-br from-stone-100 via-orange-50/35 to-sky-100/45 pt-28">
      <Navbar locale={locale} onLocaleChange={setLocale} />
      <WorkPageContent projects={data.projects} locale={locale} />
      <Footer contact={data.contact} socials={data.socials} webConfig={data.webConfig} />
    </main>
  );
}
