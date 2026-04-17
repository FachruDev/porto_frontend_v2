import { apiFetch } from "./api";
import type {
  About,
  BlogCategory,
  BlogPost,
  Certificate,
  ContactInformation,
  Experience,
  Hero,
  Project,
  Skill,
  SocialMedia,
  WebConfig,
} from "./types";

export type LandingBlogPostsResponse =
  | BlogPost[]
  | {
      data: BlogPost[];
      meta?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    };

export type LandingBlogPostsQuery = {
  categoryId?: number;
  categorySlug?: string;
  authorId?: number;
  page?: number;
  limit?: number;
  sort?: "old" | "new";
  search?: string;
};

export const getLandingWebConfig = () => apiFetch<WebConfig | null>("/landing/web-config");
export const getLandingHero = () => apiFetch<Hero | null>("/landing/hero");
export const getLandingAbout = () => apiFetch<About | null>("/landing/about");
export const listLandingExperiences = () => apiFetch<Experience[]>("/landing/experiences");
export const listLandingSkills = () => apiFetch<Skill[]>("/landing/skills");
export const listLandingCertificates = () => apiFetch<Certificate[]>("/landing/certificates");
export const listLandingProjects = () => apiFetch<Project[]>("/landing/projects");
export const listLandingSocials = () => apiFetch<SocialMedia[]>("/landing/socials");
export const getLandingContactInfo = () => apiFetch<ContactInformation | null>("/landing/contact-info");
export const listLandingBlogCategories = () => apiFetch<BlogCategory[]>("/landing/blog/categories");
export const listLandingBlogPosts = (query?: LandingBlogPostsQuery) => {
  const searchParams = new URLSearchParams();
  if (query?.categoryId != null) searchParams.set("categoryId", String(query.categoryId));
  if (query?.categorySlug) searchParams.set("categorySlug", query.categorySlug);
  if (query?.authorId != null) searchParams.set("authorId", String(query.authorId));
  if (query?.page != null) searchParams.set("page", String(query.page));
  if (query?.limit != null) searchParams.set("limit", String(query.limit));
  if (query?.sort) searchParams.set("sort", query.sort);
  if (query?.search) searchParams.set("search", query.search);

  const queryString = searchParams.toString();
  return apiFetch<LandingBlogPostsResponse>(
    `/landing/blog/posts${queryString ? `?${queryString}` : ""}`,
  );
};
