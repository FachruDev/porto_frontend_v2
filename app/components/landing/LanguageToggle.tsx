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
    <div className="flex items-center gap-1 rounded-full border border-stone-200 bg-stone-50/50 p-1">
      {(["EN", "ID"] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => handle(lang)}
          className={`relative rounded-full px-3 py-1 text-[10px] font-black tracking-tighter transition-all duration-300 ${
            locale === lang
              ? "bg-white text-orange-500 shadow-sm"
              : "text-stone-400 hover:text-stone-600"
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  )
}