import type { Experience } from "~/lib/types";

const pick = <T extends { locale: string }>(list: T[] | undefined, locale: "EN" | "ID") =>
  list?.find((t) => t.locale === locale) ?? list?.[0] ?? null;

export function ExperienceSection({ experiences, locale }: { experiences: Experience[]; locale: "EN" | "ID" }) {
  return (
    <section className="space-y-4 rounded-3xl border bg-white/70 p-6 shadow-sm backdrop-blur md:p-10 dark:bg-slate-900/60">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Experience</p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Recent Roles</h2>
        </div>
      </div>
      <div className="space-y-4">
        {experiences.map((exp) => {
          const current = pick(exp.translations, locale);
          const fallback = pick(exp.translations, locale === "EN" ? "ID" : "EN");
          return (
            <div
              key={exp.id}
              className="rounded-2xl border border-slate-200/80 bg-gradient-to-r from-slate-50 to-white p-4 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{exp.institution}</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {current?.title || fallback?.title}
                  </p>
                </div>
                <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white dark:bg-white dark:text-slate-900">
                  {exp.years}
                </span>
              </div>
              {current?.description || fallback?.description ? (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {current?.description || fallback?.description}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
