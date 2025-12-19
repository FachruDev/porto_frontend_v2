import type { Project } from "~/lib/types";

const pick = <T extends { locale: string }>(list: T[] | undefined, locale: "EN" | "ID") =>
  list?.find((t) => t.locale === locale) ?? list?.[0] ?? null;

type Props = {
  projects: Project[];
  locale: "EN" | "ID";
};

export function ProjectSection({ projects, locale }: Props) {
  return (
    <section className="space-y-4 rounded-3xl border bg-white/70 p-6 shadow-sm backdrop-blur md:p-10 dark:bg-slate-900/60">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Projects</p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Selected Work</h2>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project, idx) => {
          const current = pick(project.translations, locale);
          const fallback = pick(project.translations, locale === "EN" ? "ID" : "EN");
          const cover = project.images?.[0]?.url;
          return (
            <div
              key={project.id}
              className="overflow-hidden rounded-2xl border border-slate-200/80 bg-linear-to-b from-white to-slate-50 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-950"
              data-aos="fade-up"
              data-aos-delay={idx * 60}
            >
              {cover ? <img src={cover} alt={current?.title ?? project.slug} className="h-48 w-full object-cover" /> : null}
              <div className="space-y-2 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">{project.slug}</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  {current?.title || fallback?.title || "Project"}
                </p>
                {current?.subtitle || fallback?.subtitle ? (
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {current?.subtitle || fallback?.subtitle}
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
