import { useEffect } from "react";
import "aos/dist/aos.css";
import type { About, Certificate, Experience, Hero, Project, Skill } from "~/lib/types";
import { HeroSection } from "~/components/landing/hero/HeroSection";
import { AboutSection } from "~/components/landing/about/AboutSection";
import { ExperienceSection } from "~/components/landing/experience/ExperienceSection";
import { SkillsSection } from "~/components/landing/skills/SkillsSection";
import { ProjectSection } from "~/components/landing/project/ProjectSection";
import { CertificateSection } from "~/components/landing/certificate/CertificateSection";

type Props = {
  hero: Hero | null;
  about: About | null;
  experiences: Experience[];
  skills: Skill[];
  projects: Project[];
  certificates: Certificate[];
  locale: "EN" | "ID";
};

export default function LandingPage({
  hero,
  about,
  experiences,
  skills,
  projects,
  certificates,
  locale,
}: Props) {
  const normalizedExperiences = Array.isArray(experiences) ? experiences : [];
  const normalizedSkills = Array.isArray(skills) ? skills : [];
  const normalizedProjects = Array.isArray(projects) ? projects : [];
  const normalizedCertificates = Array.isArray(certificates) ? certificates : [];

  useEffect(() => {
    import("aos").then((mod) => {
      mod.default.init({
        duration: 800,
        once: true,
        easing: "ease-out-cubic",
      });
    });
  }, []);

  return (
    <main className="min-h-screen bg-linear-to-br from-stone-100 via-neutral-50 to-stone-200 scroll-smooth">
      <div className="space-y-10">
        <HeroSection hero={hero} locale={locale} />
        <AboutSection about={about} locale={locale} />
        <ExperienceSection experiences={normalizedExperiences} locale={locale} />
        <SkillsSection skills={normalizedSkills} />
        <ProjectSection projects={normalizedProjects} locale={locale} />
        <CertificateSection certificates={normalizedCertificates} locale={locale} />
      </div>
    </main>
  );
}
