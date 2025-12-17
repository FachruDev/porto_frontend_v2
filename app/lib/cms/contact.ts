import { apiFetch } from "../api";
import type { ContactInformation } from "../types";

export const getContactInfo = async () => {
  const info = await apiFetch<ContactInformation | Record<string, never> | null>("/cms/contact/info");
  return info && ("email" in info || "name" in info || "phoneNumber" in info || "location" in info || "cv" in info)
    ? (info as ContactInformation)
    : null;
};

export const updateContactInfo = async (payload: Partial<Pick<ContactInformation, "name" | "email" | "phoneNumber" | "location" | "cv">>) => {
  return apiFetch<ContactInformation>("/cms/contact/info", {
    method: "PUT",
    auth: true,
    body: payload,
  });
};

export const uploadContactCv = async (file: File) => {
  const formData = new FormData();
  formData.append("cv", file);

  return apiFetch<{ url: string; contact: ContactInformation }>("/cms/contact/info/cv", {
    method: "POST",
    auth: true,
    body: formData,
  });
};
