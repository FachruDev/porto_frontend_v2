import type { Certificate } from "~/lib/types";

const pick = <T extends { locale: string }>(list: T[] | undefined, locale: "EN" | "ID") =>
  list?.find((t) => t.locale === locale) ?? list?.[0] ?? null;

type Props = {
  certificates: Certificate[];
  locale: "EN" | "ID";
};

export function CertificateSection({ certificates, locale }: Props) {
  return (
    <section className="space-y-4 rounded-3xl border bg-white/70 p-6 shadow-sm backdrop-blur md:p-10 dark:bg-slate-900/60">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Certificates</p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Achievements</h2>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {certificates.map((cert, idx) => {
          const current = pick(cert.translations, locale);
          const fallback = pick(cert.translations, locale === "EN" ? "ID" : "EN");
          return (
            <div
              key={cert.id}
              className="rounded-2xl border border-slate-200/80 bg-linear-to-r from-white to-slate-50 p-4 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-950"
              data-aos="fade-up"
              data-aos-delay={idx * 50}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {current?.title || fallback?.title || "Certificate"}
                  </p>
                  {current?.description || fallback?.description ? (
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {current?.description || fallback?.description}
                    </p>
                  ) : null}
                </div>
                <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white dark:bg-white dark:text-slate-900">
                  #{cert.sortOrder}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
