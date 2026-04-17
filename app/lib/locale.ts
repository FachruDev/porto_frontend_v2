import type { Locale } from "./types";

export const alternateLocale = (locale: Locale): Locale => (locale === "EN" ? "ID" : "EN");

export const pickTranslation = <T extends { locale: Locale }>(
  list: T[] | undefined,
  locale: Locale,
) => list?.find((entry) => entry.locale === locale) ?? list?.[0] ?? null;

