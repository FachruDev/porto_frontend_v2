import { apiFetch } from "../api";
import type { BlogPost } from "../types";

export const listBlogPosts = () =>
  apiFetch<BlogPost[]>("/cms/blog/posts", {
    auth: true,
  });

export const getBlogPost = (id: number) =>
  apiFetch<BlogPost>(`/cms/blog/posts/${id}`, {
    auth: true,
  });

export const createBlogPost = (payload: {
  blogCategoryId: number;
  authorId?: number;
  slug?: string;
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt?: string;
  createdBy?: string;
  translations: Array<{
    locale: "EN" | "ID";
    title: string;
    content: string;
  }>;
}) =>
  apiFetch<BlogPost>("/cms/blog/posts", {
    method: "POST",
    auth: true,
    body: payload,
  });

export const updateBlogPost = (
  id: number,
  payload: Partial<{
    blogCategoryId: number;
    authorId?: number;
    slug?: string;
    featuredImage?: string;
    metaTitle?: string;
    metaDescription?: string;
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    publishedAt?: string;
    createdBy?: string;
    translations: Array<{
      locale: "EN" | "ID";
      title: string;
      content: string;
    }>;
  }>,
) =>
  apiFetch<BlogPost>(`/cms/blog/posts/${id}`, {
    method: "PUT",
    auth: true,
    body: payload,
  });

export const deleteBlogPost = (id: number) =>
  apiFetch<null>(`/cms/blog/posts/${id}`, {
    method: "DELETE",
    auth: true,
  });

export const uploadFeaturedImage = (id: number, file: File) => {
  const formData = new FormData();
  formData.append("featured_image", file);
  return apiFetch<BlogPost>(`/cms/blog/posts/${id}/featured-image`, {
    method: "POST",
    auth: true,
    body: formData,
  });
};

export const uploadContentImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  return apiFetch<{ url: string }>(`/cms/blog/posts/content-image`, {
    method: "POST",
    auth: true,
    body: formData,
  });
};
