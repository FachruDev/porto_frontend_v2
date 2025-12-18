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
export const listLandingBlogPosts = () => apiFetch<BlogPost[]>("/landing/blog/posts");
