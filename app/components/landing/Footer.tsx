import type { ContactInformation, SocialMedia, WebConfig } from "~/lib/types";

type Props = {
  contact: ContactInformation | null;
  socials: SocialMedia[];
  webConfig: WebConfig | null;
};

export function Footer({ contact, socials, webConfig }: Props) {
  return (
    <footer className="mt-12 bg-slate-900 px-6 py-8 text-white md:px-10">
      <div className="grid gap-8 md:grid-cols-3">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Portfolio</p>
          <p className="text-lg font-semibold">{webConfig?.metaTitle || "Creative Lab"}</p>
          <p className="text-sm text-slate-200">{webConfig?.metaDescription || "Design. Code. Deploy."}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-white">Contact</p>
          <p className="text-sm text-slate-200">{contact?.email || "email@example.com"}</p>
          <p className="text-sm text-slate-200">{contact?.phoneNumber || "+62-0000-0000"}</p>
          <p className="text-sm text-slate-200">{contact?.location || "Indonesia"}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-white">Social</p>
          <div className="flex flex-wrap gap-2">
            {socials.map((s) => (
              <a
                key={s.id}
                href={s.link}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/20 px-3 py-1 text-xs text-white transition hover:border-white hover:bg-white/10"
              >
                {s.title}
              </a>
            ))}
            {socials.length === 0 ? <p className="text-sm text-slate-300">No links</p> : null}
          </div>
        </div>
      </div>
      <div className="mt-6 border-t border-white/10 pt-4 text-xs text-slate-300">
        {webConfig?.copyright || "© 2025 Creative Lab"}
      </div>
    </footer>
  );
}
