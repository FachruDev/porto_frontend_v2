import { apiFetch } from "../api";
import type { Certificate } from "../types";

export const listCertificates = () => apiFetch<Certificate[]>("/cms/certificates");

export const createCertificate = (payload: {
  file: string;
  previewImg?: string;
  issuedBy?: string;
  issuedOn?: string;
  order?: number;
  translations: Array<{ locale: "EN" | "ID"; title: string; description?: string }>;
}) =>
  apiFetch<Certificate>("/cms/certificates", {
    method: "POST",
    auth: true,
    body: payload,
  });

export const updateCertificate = (
  id: number,
  payload: Partial<{
    file: string;
    previewImg?: string;
    issuedBy?: string;
    issuedOn?: string;
    order?: number;
    translations: Array<{ locale: "EN" | "ID"; title: string; description?: string }>;
  }>,
) =>
  apiFetch<Certificate>(`/cms/certificates/${id}`, {
    method: "PUT",
    auth: true,
    body: payload,
  });

export const deleteCertificate = (id: number) =>
  apiFetch<null>(`/cms/certificates/${id}`, {
    method: "DELETE",
    auth: true,
  });

export const uploadCertificateFiles = async (id: number, files: { file?: File | null; preview?: File | null }) => {
  const formData = new FormData();
  if (files.file) formData.append("file", files.file);
  if (files.preview) formData.append("preview_img", files.preview);

  return apiFetch<Certificate>(`/cms/certificates/${id}/files`, {
    method: "POST",
    auth: true,
    body: formData,
  });
};
