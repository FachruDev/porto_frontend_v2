import { apiFetch } from "../api";
import type { About } from "../types";

export const getAbout = async () => {
  const about = await apiFetch<About | Record<string, never> | null>("/cms/about");
  return about && "translations" in about ? (about as About) : null;
};

export const updateAbout = async (payload: {
  profileFile?: string;
  translations: Array<{ locale: "EN" | "ID"; title: string; content: string }>;
}) => {
  return apiFetch<About>("/cms/about", {
    method: "PUT",
    auth: true,
    body: payload,
  });
};

export const uploadAboutProfile = async (file: File) => {
  const formData = new FormData();
  formData.append("profile", file);

  return apiFetch<{ url: string; about: About }>("/cms/about/profile", {
    method: "POST",
    auth: true,
    body: formData,
  });
};
