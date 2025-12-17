  import { createContext, useContext, useEffect, useMemo, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

const getPreferredSystemTheme = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const initialTheme = useMemo<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme
    const stored = localStorage.getItem(storageKey) as Theme | null
    return stored ?? defaultTheme
  }, [defaultTheme, storageKey])

  const [theme, setThemeState] = useState<Theme>(initialTheme)

  useEffect(() => {
    if (typeof window === "undefined") return
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    const applied = theme === "system" ? getPreferredSystemTheme() : theme
    root.classList.add(applied)
  }, [theme])

  const setTheme = (value: Theme) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, value)
    }
    setThemeState(value)
  }

  const value = { theme, setTheme }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
