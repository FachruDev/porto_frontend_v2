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
    <main className="min-h-screen bg-linear-to-br from-stone-100 via-neutral-50 to-stone-200">
      <div className="space-y-10">
        <HeroSection hero={hero} locale={locale} />
        <AboutSection about={about} locale={locale} />
        <ExperienceSection experiences={normalizedExperiences} locale={locale} />
      </div>
    </main>
  );
}
