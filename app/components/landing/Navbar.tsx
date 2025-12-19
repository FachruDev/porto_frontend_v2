"use client"

import { useEffect, useState } from "react"
import { LanguageToggle } from "./LanguageToggle"

const links = [
  { label: "Home", href: "#", labelId: "Beranda" },
  { label: "About", href: "#about", labelId: "Tentang" },
  { label: "Work", href: "#work", labelId: "Karya" },
  { label: "Journal", href: "#journal", labelId: "Jurnal" },
  { label: "Contact", href: "#contact", labelId: "Kontak" },
]

type Props = {
  locale?: "EN" | "ID"
  onLocaleChange?: (locale: "EN" | "ID") => void
}

export function Navbar({ locale = "EN", onLocaleChange }: Props) {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY < 10) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ease-in-out ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <nav className="relative flex items-center justify-between rounded-full border border-stone-200/60 bg-white/70 px-4 py-4 shadow-sm backdrop-blur-xl md:px-6">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-orange-400 to-rose-400 shadow-sm md:h-9 md:w-9">
              <span className="text-xs font-bold text-white">P</span>
            </div>
            <span className="text-sm font-bold tracking-tighter text-stone-800 md:text-base">
              PORTFOLIO.
            </span>
          </div>

          {/* Navigation - Typography Konsisten (Tracking Tight) */}
          <div className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="group relative px-4 py-2 text-sm font-semibold tracking-tight text-stone-500 transition-colors hover:text-orange-500"
              >
                {locale === "EN" ? link.label : link.labelId}
                <span className="absolute bottom-2 left-1/2 h-0.75 w-0 -translate-x-1/2 rounded-full bg-orange-400/40 transition-all duration-300 group-hover:w-1/2" />
              </a>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <LanguageToggle locale={locale} onChange={onLocaleChange} />
            
            <button
              type="button"
              className="hidden rounded-full bg-linear-to-br from-orange-400 to-rose-400 px-5 py-2 text-xs font-bold tracking-widest text-white uppercase transition-all hover:shadow-lg hover:shadow-orange-500/20 active:scale-95 sm:block"
            >
              {locale === "EN" ? "Let's Talk" : "Kontak Kami"}
            </button>

            {/* Mobile Burger - Simplified */}
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 lg:hidden"
              type="button"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
              </svg>
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}