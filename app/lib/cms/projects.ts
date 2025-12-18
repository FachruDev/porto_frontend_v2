import { apiFetch } from "../api";
import type { Project, ProjectImage } from "../types";

export const listProjects = () => apiFetch<Project[]>("/cms/projects");

export const getProject = (id: number) => apiFetch<Project>(`/cms/projects/${id}`);

export const createProject = (payload: {
  slug?: string;
  order?: number;
  images?: Array<{ url: string; alt?: string; order?: number }>;
  translations: Array<{ locale: "EN" | "ID"; title: string; subtitle?: string; description?: string }>;
}) =>
  apiFetch<Project>("/cms/projects", {
    method: "POST",
    auth: true,
    body: payload,
  });

export const updateProject = (
  id: number,
  payload: Partial<{
    slug: string;
    order?: number;
    translations: Array<{ locale: "EN" | "ID"; title: string; subtitle?: string; description?: string }>;
  }>,
) =>
  apiFetch<Project>(`/cms/projects/${id}`, {
    method: "PUT",
    auth: true,
    body: payload,
  });

export const deleteProject = (id: number) =>
  apiFetch<null>(`/cms/projects/${id}`, {
    method: "DELETE",
    auth: true,
  });

export const addProjectImage = (id: number, image: { url: string; alt?: string; order?: number }) =>
  apiFetch<ProjectImage>(`/cms/projects/${id}/images`, {
    method: "POST",
    auth: true,
    body: image,
  });

export const deleteProjectImage = (projectId: number, imageId: number) =>
  apiFetch<null>(`/cms/projects/${projectId}/images/${imageId}`, {
    method: "DELETE",
    auth: true,
  });

export const uploadProjectImages = (projectId: number, files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));
  return apiFetch<ProjectImage[]>(`/cms/projects/${projectId}/images/upload`, {
    method: "POST",
    auth: true,
    body: formData,
  });
};

export const replaceProjectImage = (projectId: number, imageId: number, file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  return apiFetch<ProjectImage>(`/cms/projects/${projectId}/images/${imageId}/upload`, {
    method: "POST",
    auth: true,
    body: formData,
  });
};
