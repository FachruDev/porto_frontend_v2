import { useState } from "react";
import type { ClientLoaderFunction } from "react-router";
import { redirect, useLoaderData } from "react-router";

import {
  getLandingContactInfo,
  getLandingWebConfig,
  listLandingProjects,
  listLandingSocials,
} from "~/lib/landing";
import type { Project } from "~/lib/types";
import { ProjectDetail as ProjectDetailView } from "~/components/landing/project/ProjectDetail";
import { ContactSection } from "~/components/landing/contact/ContactSection";
import { Footer } from "~/components/landing/Footer";
import { Navbar } from "~/components/landing/Navbar";

type LoaderData = {
  project: Project;
  socials: Awaited<ReturnType<typeof listLandingSocials>>;
  contact: Awaited<ReturnType<typeof getLandingContactInfo>>;
  webConfig: Awaited<ReturnType<typeof getLandingWebConfig>>;
};

export const clientLoader: ClientLoaderFunction = async ({ params }) => {
  const slug = params.slug;
  if (!slug) throw redirect("/");
  const [projects, socials, contact, webConfig] = await Promise.all([
    listLandingProjects(),
    listLandingSocials(),
    getLandingContactInfo(),
    getLandingWebConfig(),
  ]);
  const project = projects.find((p) => p.slug === slug);
  if (!project) throw redirect("/");
  return { project, socials, contact, webConfig };
};

export default function ProjectDetailRoute() {
  const { project, socials, contact, webConfig } = useLoaderData<LoaderData>();
  const [locale, setLocale] = useState<"EN" | "ID">("EN");

  return (
    <main className="min-h-screen space-y-10 bg-linear-to-br from-stone-100 via-neutral-50 to-stone-200 dark:from-slate-950 dark:to-slate-900 ">
      <Navbar locale={locale} onLocaleChange={setLocale} />
      <div className="px-4 py-8 md:px-10">
        <ProjectDetailView project={project} locale={locale} />
        <ContactSection info={contact} />
      </div>
      <Footer contact={contact} socials={socials} webConfig={webConfig} />
    </main>
  );
}
