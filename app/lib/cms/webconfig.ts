import { apiFetch } from "../api";
import type { WebConfig } from "../types";

export const getWebConfig = async () => {
  const config = await apiFetch<WebConfig | Record<string, never> | null>("/cms/config/web");
  return config && "metaTitle" in config ? (config as WebConfig) : null;
};

export const updateWebConfig = async (payload: Partial<Pick<WebConfig, "logo" | "favicon" | "metaDescription" | "metaTitle" | "copyright">>) => {
  return apiFetch<WebConfig>("/cms/config/web", {
    method: "PUT",
    auth: true,
    body: payload,
  });
};

export const uploadWebAssets = async (files: { logo?: File | null; favicon?: File | null }) => {
  const formData = new FormData();
  if (files.logo) formData.append("logo", files.logo);
  if (files.favicon) formData.append("favicon", files.favicon);

  return apiFetch<WebConfig>("/cms/config/web/upload", {
    method: "POST",
    auth: true,
    body: formData,
  });
};
