"use client"

import { useEffect, useState } from "react"

type Props = {
  onChange?: (locale: "EN" | "ID") => void
  locale?: "EN" | "ID"
}

export function LanguageToggle({ onChange, locale: controlled = "EN" }: Props) {
  const [locale, setLocale] = useState<"EN" | "ID">(controlled)

  useEffect(() => {
    setLocale(controlled)
  }, [controlled])

  const handle = (value: "EN" | "ID") => {
    setLocale(value)
    onChange?.(value)
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-1 py-1 text-xs text-white shadow-lg backdrop-blur">
      <button
        type="button"
        onClick={() => handle("EN")}
        className={`rounded-full px-3 py-1 transition ${
          locale === "EN" ? "bg-white text-slate-900 shadow" : "text-white/70 hover:text-white"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => handle("ID")}
        className={`rounded-full px-3 py-1 transition ${
          locale === "ID" ? "bg-white text-slate-900 shadow" : "text-white/70 hover:text-white"
        }`}
      >
        ID
      </button>
    </div>
  )
}
