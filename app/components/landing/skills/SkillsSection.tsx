import type { Skill } from "~/lib/types";

type Props = { skills: Skill[] };

export function SkillsSection({ skills }: Props) {
  return (
    <section className="space-y-4 rounded-3xl border bg-white/70 p-6 shadow-sm backdrop-blur md:p-10 dark:bg-slate-900/60">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Skills</p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Tools & Mastery</h2>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {skills.map((skill, idx) => (
          <div
            key={skill.id}
            className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-linear-to-br from-white to-slate-50 p-4 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-950"
            data-aos="fade-up"
            data-aos-delay={idx * 50}
          >
            <div className="h-12 w-12 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800">
              {skill.image ? (
                <img src={skill.image} alt={skill.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">No img</div>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{skill.title}</p>
              <p className="text-xs uppercase tracking-wide text-slate-500">{skill.level}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
