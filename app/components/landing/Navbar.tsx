"use client"

import { useEffect, useState } from "react"
import { LanguageToggle } from "./LanguageToggle"

const links = [
  { label: "Home", href: "#" },
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Journal", href: "#journal" },
  { label: "Contact", href: "#contact" },
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
      className={`fixed left-0 right-0 top-0 z-50 transition-transform duration-700 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="relative px-4 py-4 md:px-6">
        <nav className="relative mx-auto max-w-7xl rounded-full border border-stone-800/20 bg-white/95 shadow-xl backdrop-blur-md">
          {/* Natural texture overlay */}
          <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-stone-100/50 via-transparent to-stone-50/30" />
          
          <div className="relative flex items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4">
            {/* Logo - minimalist Nordic style */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-300 bg-stone-900 shadow-sm md:h-10 md:w-10">
                <svg className="h-5 w-5 text-stone-100 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium tracking-wide text-stone-900 md:text-base">Portfolio</p>
              </div>
            </div>

            {/* Navigation - clean & minimal */}
            <div className="hidden items-center gap-1 md:gap-2 lg:flex">
              {links.map((link) => (
                <button
                  key={link.label}
                  className="group relative px-3 py-2 text-sm font-medium text-stone-700 transition-colors hover:text-stone-900 md:px-4"
                  type="button"
                >
                  <span className="relative">{link.label}</span>
                  <span className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-stone-900 transition-all duration-300 group-hover:w-3/4" />
                </button>
              ))}
            </div>

            {/* Right section */}
            <div className="flex items-center gap-2 md:gap-3">
              <LanguageToggle locale={locale} onChange={onLocaleChange} />
              
              {/* CTA - simple & organic */}
              <button
                type="button"
                className="hidden rounded-lg border border-stone-900 bg-stone-900 px-4 py-2 text-sm font-medium text-stone-50 transition-all hover:bg-stone-800 sm:block"
              >
                Get in Touch
              </button>

              {/* Mobile menu */}
              <button
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-300 bg-stone-50 text-stone-900 transition-colors hover:bg-stone-100 lg:hidden"
                type="button"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
