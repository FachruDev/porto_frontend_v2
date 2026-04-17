"use client";

import { useMemo, useState } from "react";

import { submitContactForm } from "~/lib/contactForms";
import type { ContactInformation, Locale, SocialMedia } from "~/lib/types";

type Props = {
  info: ContactInformation | null;
  socials: SocialMedia[];
  locale: Locale;
};

const copy = {
  heading: { EN: "Contact", ID: "Kontak" },
  subtitle: {
    EN: "Share your idea and I will get back with a thoughtful plan.",
    ID: "Ceritakan ide kamu, saya akan membalas dengan rencana yang matang.",
  },
  details: { EN: "Direct Channels", ID: "Kanal Langsung" },
  form: { EN: "Project Brief", ID: "Brief Project" },
  fullName: { EN: "Full Name", ID: "Nama Lengkap" },
  email: { EN: "Email", ID: "Email" },
  subject: { EN: "Subject", ID: "Subjek" },
  message: { EN: "Message", ID: "Pesan" },
  send: { EN: "Send Message", ID: "Kirim Pesan" },
  sending: { EN: "Sending...", ID: "Mengirim..." },
  required: {
    EN: "Name, email, and message are required.",
    ID: "Nama, email, dan pesan wajib diisi.",
  },
  success: {
    EN: "Thanks! Your message has been sent successfully.",
    ID: "Terima kasih! Pesan kamu berhasil dikirim.",
  },
  fallbackName: { EN: "Portfolio Owner", ID: "Pemilik Portofolio" },
  location: { EN: "Location", ID: "Lokasi" },
  phone: { EN: "Phone", ID: "Telepon" },
  emailLabel: { EN: "Email", ID: "Email" },
  cv: { EN: "Download CV", ID: "Unduh CV" },
};

export function ContactPageContent({ info, socials, locale }: Props) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const titleName = useMemo(() => info?.name || copy.fallbackName[locale], [info?.name, locale]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const subject = String(formData.get("subject") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    if (!name || !email || !description) {
      setStatus("error");
      setMessage(copy.required[locale]);
      return;
    }

    try {
      setStatus("submitting");
      await submitContactForm({
        name,
        email,
        subject: subject || undefined,
        description,
      });
      setStatus("success");
      setMessage(copy.success[locale]);
      event.currentTarget.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Request failed");
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 pb-20 md:px-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm md:p-10">
        <div className="pointer-events-none absolute -top-16 -left-12 h-64 w-64 rounded-full bg-orange-200/45 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-0 h-64 w-64 rounded-full bg-fuchsia-200/30 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.05fr,1fr]">
          <div className="space-y-6">
            <div>
              <p className="text-xs font-extrabold tracking-[0.35em] text-orange-500 uppercase">{copy.heading[locale]}</p>
              <h1 className="mt-2 text-4xl leading-tight font-black tracking-tight text-stone-900 md:text-6xl">{titleName}</h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-stone-600 md:text-lg">{copy.subtitle[locale]}</p>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-stone-50/80 p-5">
              <p className="text-xs font-bold tracking-[0.2em] text-stone-500 uppercase">{copy.details[locale]}</p>
              <div className="mt-4 grid gap-4 text-sm">
                <div>
                  <p className="text-[11px] font-bold tracking-[0.16em] text-stone-500 uppercase">{copy.emailLabel[locale]}</p>
                  <a className="font-semibold text-stone-900 hover:text-orange-500" href={`mailto:${info?.email || ""}`}>
                    {info?.email || "-"}
                  </a>
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-[0.16em] text-stone-500 uppercase">{copy.phone[locale]}</p>
                  <a className="font-semibold text-stone-900 hover:text-orange-500" href={`tel:${info?.phoneNumber || ""}`}>
                    {info?.phoneNumber || "-"}
                  </a>
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-[0.16em] text-stone-500 uppercase">{copy.location[locale]}</p>
                  <p className="font-semibold text-stone-900">{info?.location || "-"}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.link}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-stone-300 bg-white px-3 py-1 text-[11px] font-bold tracking-[0.14em] text-stone-600 uppercase hover:border-orange-300 hover:text-orange-600"
                  >
                    {social.title}
                  </a>
                ))}
              </div>

              {info?.cv ? (
                <div className="mt-5">
                  <a
                    href={info.cv}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2 text-xs font-bold tracking-[0.16em] text-white uppercase hover:bg-orange-500"
                  >
                    {copy.cv[locale]}
                    <span aria-hidden>{"->"}</span>
                  </a>
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-[1.6rem] border border-stone-200 bg-white/90 p-6 shadow-sm md:p-8">
            <p className="text-xs font-bold tracking-[0.2em] text-stone-500 uppercase">{copy.form[locale]}</p>

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label htmlFor="contact-name" className="text-xs font-semibold text-stone-500">
                  {copy.fullName[locale]}
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="contact-email" className="text-xs font-semibold text-stone-500">
                  {copy.email[locale]}
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="contact-subject" className="text-xs font-semibold text-stone-500">
                  {copy.subject[locale]}
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="contact-message" className="text-xs font-semibold text-stone-500">
                  {copy.message[locale]}
                </label>
                <textarea
                  id="contact-message"
                  name="description"
                  rows={5}
                  required
                  className="w-full resize-none rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {message ? (
                <p className={`text-sm ${status === "error" ? "text-red-600" : "text-emerald-600"}`}>{message}</p>
              ) : null}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex w-full items-center justify-center rounded-full bg-stone-900 px-5 py-3 text-xs font-bold tracking-[0.2em] text-white uppercase transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "submitting" ? copy.sending[locale] : copy.send[locale]}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

