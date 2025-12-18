import { apiFetch } from "../api";
import type { BlogCategory } from "../types";

export const listBlogCategories = () => apiFetch<BlogCategory[]>("/cms/blog/categories");

export const createBlogCategory = (payload: {
  slug?: string;
  order?: number;
  translations: Array<{ locale: "EN" | "ID"; title: string }>;
}) =>
  apiFetch<BlogCategory>("/cms/blog/categories", {
    method: "POST",
    auth: true,
    body: payload,
  });

export const updateBlogCategory = (
  id: number,
  payload: Partial<{ slug: string; order?: number; translations: Array<{ locale: "EN" | "ID"; title: string }> }>,
) =>
  apiFetch<BlogCategory>(`/cms/blog/categories/${id}`, {
    method: "PUT",
    auth: true,
    body: payload,
  });

export const deleteBlogCategory = (id: number) =>
  apiFetch<null>(`/cms/blog/categories/${id}`, {
    method: "DELETE",
    auth: true,
  });
