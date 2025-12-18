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
    <div className="flex items-center gap-0.5 rounded-lg border border-stone-300 bg-stone-50 p-0.5 text-xs backdrop-blur-sm">
      <button
        type="button"
        onClick={() => handle("EN")}
        className={`rounded-md px-2.5 py-1 font-medium transition-all duration-200 md:px-3 md:py-1.5 ${
          locale === "EN"
            ? "bg-stone-900 text-stone-50 shadow-sm"
            : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => handle("ID")}
        className={`rounded-md px-2.5 py-1 font-medium transition-all duration-200 md:px-3 md:py-1.5 ${
          locale === "ID"
            ? "bg-stone-900 text-stone-50 shadow-sm"
            : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
        }`}
      >
        ID
      </button>
    </div>
  )
}
