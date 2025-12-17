import { apiFetch } from "../api";
import type { Experience } from "../types";

export const listExperiences = () => apiFetch<Experience[]>("/cms/experiences");

export const createExperience = (payload: {
  institution: string;
  years: string;
  order?: number;
  translations: Array<{ locale: "EN" | "ID"; title: string; description?: string }>;
}) =>
  apiFetch<Experience>("/cms/experiences", {
    method: "POST",
    auth: true,
    body: payload,
  });

export const updateExperience = (id: number, payload: Partial<{
  institution: string;
  years: string;
  order?: number;
  translations: Array<{ locale: "EN" | "ID"; title: string; description?: string }>;
}>) =>
  apiFetch<Experience>(`/cms/experiences/${id}`, {
    method: "PUT",
    auth: true,
    body: payload,
  });

export const deleteExperience = (id: number) =>
  apiFetch<null>(`/cms/experiences/${id}`, {
    method: "DELETE",
    auth: true,
  });
