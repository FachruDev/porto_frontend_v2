"use client";

import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import type { ContactInformation } from "~/lib/types";
import { submitContactForm } from "~/lib/contactForms";

type Props = {
  info: ContactInformation | null;
};

export function ContactSection({ info }: Props) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: false, mirror: true });
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const subject = String(formData.get("subject") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    if (!name || !email || !description) {
      setStatus("error");
      setMessage("Name, email, and message are required.");
      return;
    }

    try {
      setStatus("submitting");
      await submitContactForm({ name, email, subject: subject || undefined, description });
      setStatus("success");
      setMessage("Got it! I'll reach out to you shortly.");
      event.currentTarget.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Submission failed.");
    }
  };

  return (
    <section id="contact-section" className="relative mx-auto my-40 max-w-7xl px-6">
      {/* --- BACKGROUND ACCENT (No Lag) --- */}
      <div className="absolute -top-24 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-orange-300/50 blur-[120px]" />

      <div className="grid gap-20 lg:grid-cols-2">
        
        {/* --- LEFT SIDE: THE INVITE --- */}
        <div className="flex flex-col justify-between space-y-12" data-aos="fade-right">
          <div className="relative">
             {/* Background Text Raksasa */}
            <span className="absolute -left-2 -top-16 select-none text-8xl font-black text-stone-100 md:text-9xl lg:text-[12rem]">
              HELLO
            </span>
            
            <div className="relative z-10 pt-10">
              <h2 className="text-6xl font-black leading-[0.85] tracking-tighter text-stone-900 md:text-8xl">
                Ready to start <br /> 
                <span className="italic text-orange-400">your</span> project?
              </h2>
              <p className="mt-8 max-w-md text-lg font-medium leading-relaxed text-stone-500 md:text-xl">
                I’m currently available for freelance work and collaborations. Let’s turn your vision into a digital reality.
              </p>
            </div>
          </div>

          {/* Minimal Info Strips */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-px w-8 bg-orange-300" />
              <p className="text-xs font-black uppercase tracking-[0.4em] text-stone-400">Details</p>
            </div>
            <div className="grid gap-6 text-stone-800 md:grid-cols-2 lg:grid-cols-1">
              <div className="group">
                <p className="text-[10px] font-bold text-stone-300 uppercase">Electronic Mail</p>
                <a href={`mailto:${info?.email}`} className="text-xl font-black transition-colors hover:text-orange-500">
                  {info?.email || "hello@domain.com"}
                </a>
              </div>
              <div className="group">
                <p className="text-[10px] font-bold text-stone-300 uppercase">Direct Line</p>
                <p className="text-xl font-black">{info?.phoneNumber || "+62 800 0000"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: THE SIGNATURE FORM --- */}
        <div className="relative" data-aos="fade-left">
          <form onSubmit={handleSubmit} className="relative space-y-12 rounded-[3rem] border border-stone-100 bg-white/40 p-10 backdrop-blur-xl md:p-16 shadow-2xl shadow-stone-200/30">
            
            {/* Input Row: Name & Email */}
            <div className="grid gap-12 md:grid-cols-2">
              <div className="group relative">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 transition-colors group-focus-within:text-orange-500">Full Name</label>
                <input
                  name="name"
                  type="text"
                  placeholder="e.g. John Doe"
                  className="w-full border-b-2 border-stone-100 bg-transparent py-3 text-base font-bold text-stone-900 outline-none transition-all focus:border-stone-900"
                  required
                />
              </div>
              <div className="group relative">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 transition-colors group-focus-within:text-orange-500">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  className="w-full border-b-2 border-stone-100 bg-transparent py-3 text-base font-bold text-stone-900 outline-none transition-all focus:border-stone-900"
                  required
                />
              </div>
            </div>

            {/* Subject */}
            <div className="group relative">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 transition-colors group-focus-within:text-orange-500">Subject</label>
              <input
                name="subject"
                type="text"
                placeholder="What are we talking about?"
                className="w-full border-b-2 border-stone-100 bg-transparent py-3 text-base font-bold text-stone-900 outline-none transition-all focus:border-stone-900"
              />
            </div>

            {/* Message */}
            <div className="group relative">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 transition-colors group-focus-within:text-orange-500">Message</label>
              <textarea
                name="description"
                placeholder="Briefly describe your goals..."
                rows={3}
                className="w-full border-b-2 border-stone-100 bg-transparent py-3 text-base font-bold text-stone-900 outline-none transition-all focus:border-stone-900 resize-none"
                required
              />
            </div>

            {/* Submit & Feedback */}
            <div className="pt-6">
              {message && (
                <p className={`mb-6 text-center text-xs font-black uppercase tracking-widest ${status === "error" ? "text-red-500" : "text-green-600"}`}>
                  {message}
                </p>
              )}
              
              <button
                type="submit"
                disabled={status === "submitting"}
                className="group relative flex w-full items-center justify-between overflow-hidden rounded-full bg-stone-900 px-8 py-5 text-white transition-all hover:bg-orange-500 disabled:opacity-50"
              >
                <span className="text-xs font-black uppercase tracking-[0.3em]">
                  {status === "submitting" ? "Sending..." : "Send Proposal"}
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-transform group-hover:rotate-45">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
              </button>
            </div>
          </form>

          {/* Decorative Elements */}
          <div className="absolute -right-6 -top-6 -z-10 h-32 w-32 rounded-full bg-rose-50" />
        </div>
      </div>
    </section>
  );
}