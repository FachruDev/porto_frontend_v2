import type { ClientLoaderFunction } from "react-router";
import { useLoaderData } from "react-router";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { listBlogPosts } from "~/lib/cms/blogPosts";
import { listBlogCategories } from "~/lib/cms/blogCategories";
import { listExperiences } from "~/lib/cms/experiences";
import { listSkills } from "~/lib/cms/skills";
import { listCertificates } from "~/lib/cms/certificates";
import { listProjects } from "~/lib/cms/projects";
import { listSocials } from "~/lib/cms/socials";
import { getHero } from "~/lib/cms/heroes";
import { getAbout } from "~/lib/cms/about";
import type { BlogPost, BlogCategory, Experience, Skill, Certificate, Project, SocialMedia } from "~/lib/types";

type Metric = { label: string; count: number | null; error?: string };
type LoaderData = {
  metrics: Metric[];
};

const safeCount = async <T,>(label: string, fn: () => Promise<T | null | undefined>) => {
  try {
    const data = await fn();
    const count = Array.isArray(data) ? data.length : data ? 1 : 0;
    return { label, count } satisfies Metric;
  } catch (error) {
    return {
      label,
      count: null,
      error: error instanceof Error ? error.message : "Error",
    } satisfies Metric;
  }
};

export const clientLoader: ClientLoaderFunction = async () => {
  const metrics = await Promise.all<Metric>([
    safeCount<BlogPost[]>("Blog Posts", () => listBlogPosts()),
    safeCount<BlogCategory[]>("Blog Categories", () => listBlogCategories()),
    safeCount<Experience[]>("Experiences", () => listExperiences()),
    safeCount<Skill[]>("Skills", () => listSkills()),
    safeCount<Certificate[]>("Certificates", () => listCertificates()),
    safeCount<Project[]>("Projects", () => listProjects()),
    safeCount<SocialMedia[]>("Social Media", () => listSocials()),
    safeCount("Hero Section", () => getHero()),
    safeCount("About Section", () => getAbout()),
  ]);

  return { metrics };
};

export default function AdminDashboard() {
  const { metrics } = useLoaderData<LoaderData>();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Ringkasan cepat konten CMS.</p>
        </div>
      </div>

      <Separator />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label} className="border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{metric.label}</CardTitle>
            </CardHeader>
            <CardContent>
              {metric.count !== null ? (
                <p className="text-3xl font-semibold">{metric.count}</p>
              ) : (
                <p className="text-sm text-destructive">{metric.error ?? "Error"}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
