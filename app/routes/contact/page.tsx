import { useState } from "react";
import type { ClientLoaderFunction } from "react-router";
import { useLoaderData } from "react-router";

import { ContactPageContent } from "~/components/contact/ContactPageContent";
import { Footer } from "~/components/landing/Footer";
import { Navbar } from "~/components/landing/Navbar";
import { getLandingContactInfo, getLandingWebConfig, listLandingSocials } from "~/lib/landing";
import type { ContactInformation, SocialMedia, WebConfig } from "~/lib/types";
import type { Route } from "./+types/page";

type LoaderData = {
  socials: SocialMedia[];
  contact: ContactInformation | null;
  webConfig: WebConfig | null;
};

export const clientLoader: ClientLoaderFunction = async () => {
  const [socialsResult, contactResult, webConfigResult] = await Promise.allSettled([
    listLandingSocials(),
    getLandingContactInfo(),
    getLandingWebConfig(),
  ]);

  return {
    socials: socialsResult.status === "fulfilled" ? socialsResult.value : [],
    contact: contactResult.status === "fulfilled" ? contactResult.value : null,
    webConfig: webConfigResult.status === "fulfilled" ? webConfigResult.value : null,
  };
};

export function meta({ data }: Route.MetaArgs) {
  const typed = (data || {}) as Partial<LoaderData>;
  const baseTitle = typed.webConfig?.metaTitle || "Portfolio";
  const title = `Contact | ${baseTitle}`;
  const description = typed.webConfig?.metaDescription || "Get in touch for collaboration and project inquiries.";

  return [{ title }, { name: "description", content: description }];
}

export default function ContactRoutePage() {
  const data = useLoaderData<LoaderData>();
  const [locale, setLocale] = useState<"EN" | "ID">("EN");

  return (
    <main className="min-h-screen bg-linear-to-br from-stone-100 via-rose-50/30 to-orange-100/35 pt-28">
      <Navbar locale={locale} onLocaleChange={setLocale} />
      <ContactPageContent info={data.contact} socials={data.socials} locale={locale} />
      <Footer contact={data.contact} socials={data.socials} webConfig={data.webConfig} />
    </main>
  );
}

