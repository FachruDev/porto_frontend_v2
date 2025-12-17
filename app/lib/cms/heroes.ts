import { apiFetch } from "../api";
import type { Hero } from "../types";

export const getHero = async () => {
  const hero = await apiFetch<Hero | Hero[] | Record<string, never> | null>("/cms/heroes");
  if (Array.isArray(hero)) return hero[0] ?? null;
  return hero && "translations" in hero ? (hero as Hero) : null;
};

export const upsertHero = async (payload: {
  translations: Array<{ locale: "EN" | "ID"; title: string; subtitle?: string }>;
}) => {
  return apiFetch<Hero>("/cms/heroes", {
    method: "PUT",
    auth: true,
    body: payload,
  });
};
