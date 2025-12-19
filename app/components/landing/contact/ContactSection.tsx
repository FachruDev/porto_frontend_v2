import { useState } from "react";
import type { ContactInformation } from "~/lib/types";
import { submitContactForm } from "~/lib/contactForms";

type Props = {
  info: ContactInformation | null;
};

export function ContactSection({ info }: Props) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const subject = String(formData.get("subject") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    if (!name || !email || !description) {
      setStatus("error");
      setMessage("Nama, email, dan pesan wajib diisi.");
      return;
    }
    try {
      setStatus("submitting");
      await submitContactForm({ name, email, subject: subject || undefined, description });
      setStatus("success");
      setMessage("Pesan terkirim. Terima kasih!");
      event.currentTarget.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Gagal mengirim pesan.");
    }
  };

  return (
    <section id="contact-section" className="space-y-6 rounded-3xl border bg-white/70 p-6 shadow-sm backdrop-blur md:p-10 dark:bg-slate-900/60" data-aos="fade-up">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Contact</p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Let&apos;s collaborate</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">Kirim pesan, saya akan balas secepatnya.</p>
        </div>
        <div className="text-right text-sm text-slate-500 dark:text-slate-300">
          <p>{info?.email || "email@example.com"}</p>
          <p>{info?.phoneNumber || "+62-0000-0000"}</p>
          <p>{info?.location || "Indonesia"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <input
            name="name"
            placeholder="Nama"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            required
            data-aos="fade-up"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            required
            data-aos="fade-up"
            data-aos-delay="50"
          />
        </div>
        <input
          name="subject"
          placeholder="Subject (opsional)"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          data-aos="fade-up"
          data-aos-delay="80"
        />
        <textarea
          name="description"
          placeholder="Pesan kamu"
          rows={4}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          required
          data-aos="fade-up"
          data-aos-delay="110"
        />
        {message ? (
          <p className={`text-sm ${status === "error" ? "text-red-600" : "text-green-600"}`} data-aos="fade-up">
            {message}
          </p>
        ) : null}
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-70 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          disabled={status === "submitting"}
          data-aos="fade-up"
          data-aos-delay="150"
        >
          {status === "submitting" ? "Mengirim..." : "Kirim Pesan"}
        </button>
      </form>
    </section>
  );
}
