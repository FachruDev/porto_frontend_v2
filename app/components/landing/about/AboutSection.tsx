import type { About } from "~/lib/types";

const pick = <T extends { locale: string }>(list: T[] | undefined, locale: "EN" | "ID") =>
  list?.find((t) => t.locale === locale) ?? list?.[0] ?? null;

export function AboutSection({ about, locale }: { about: About | null; locale: "EN" | "ID" }) {
  const current = pick(about?.translations, locale);
  const fallback = pick(about?.translations, locale === "EN" ? "ID" : "EN");

  return (
    <section className="grid gap-8 rounded-3xl border bg-white/70 p-6 shadow-sm backdrop-blur md:grid-cols-[280px,1fr] md:p-10 dark:bg-slate-900/60">
      <div className="flex flex-col items-center gap-3">
        <div className="h-48 w-48 overflow-hidden rounded-2xl border bg-slate-100 dark:bg-slate-800">
          {about?.profile ? (
            <img src={about.profile} alt={current?.title ?? fallback?.title ?? "Profile"} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">No image</div>
          )}
        </div>
        <div className="text-center">
          <p className="text-xs uppercase tracking-wide text-slate-500">About</p>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">{current?.title || fallback?.title || "About me"}</p>
        </div>
      </div>
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Story</h2>
        <p className="text-base leading-relaxed text-slate-600 dark:text-slate-200 whitespace-pre-line">
          {current?.content || fallback?.content || "Tell a brief story about your journey, skills, and focus areas."}
        </p>
      </div>
    </section>
  );
}
