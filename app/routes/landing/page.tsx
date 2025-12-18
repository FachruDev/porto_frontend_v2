import type { About, Experience, Hero } from "~/lib/types";
import { HeroSection } from "~/components/landing/hero/HeroSection";
import { AboutSection } from "~/components/landing/about/AboutSection";
import { ExperienceSection } from "~/components/landing/experience/ExperienceSection";

type Props = {
  hero: Hero | null;
  about: About | null;
  experiences: Experience[];
  locale: "EN" | "ID";
};

export default function LandingPage({
  hero,
  about,
  experiences,
  locale,
}: Props) {
  const normalizedExperiences = Array.isArray(experiences) ? experiences : [];

  return (
    <main className="min-h-screen space-y-10 bg-linear-to-b from-slate-50 to-white px-4 py-10 dark:from-slate-950 dark:to-slate-900 md:px-10">
      <HeroSection hero={hero} locale={locale} />
      <AboutSection about={about} locale={locale} />
      <ExperienceSection experiences={normalizedExperiences} locale={locale} />
    </main>
  );
}
