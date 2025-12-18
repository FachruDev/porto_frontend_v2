import { apiFetch } from "../api";
import type { SocialMedia } from "../types";

export const listSocials = () => apiFetch<SocialMedia[]>("/cms/socials");

export const createSocial = (payload: { title: string; link: string; order?: number }) =>
  apiFetch<SocialMedia>("/cms/socials", {
    method: "POST",
    auth: true,
    body: payload,
  });

export const updateSocial = (id: number, payload: Partial<{ title: string; link: string; order?: number }>) =>
  apiFetch<SocialMedia>(`/cms/socials/${id}`, {
    method: "PUT",
    auth: true,
    body: payload,
  });

export const deleteSocial = (id: number) =>
  apiFetch<null>(`/cms/socials/${id}`, {
    method: "DELETE",
    auth: true,
  });

export const uploadSocialLogo = (id: number, file: File) => {
  const formData = new FormData();
  formData.append("logo", file);
  return apiFetch<SocialMedia>(`/cms/socials/${id}/logo`, {
    method: "POST",
    auth: true,
    body: formData,
  });
};
