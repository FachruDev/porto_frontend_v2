export type Locale = "EN" | "ID";

export type HeroTranslation = {
  id?: number;
  locale: Locale;
  title: string;
  subtitle?: string | null;
  heroId?: number;
};

export type Hero = {
  id: number;
  translations: HeroTranslation[];
  createdAt: string;
  updatedAt: string;
};

export type AboutTranslation = {
  id?: number;
  locale: Locale;
  title: string;
  content: string;
  aboutMeId?: number;
};

export type About = {
  id: number;
  profile?: string | null;
  translations: AboutTranslation[];
  createdAt: string;
  updatedAt: string;
};

export type WebConfig = {
  id: number;
  logo?: string | null;
  favicon?: string | null;
  copyright?: string | null;
  metaDescription?: string | null;
  metaTitle?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ContactInformation = {
  id: number;
  name?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  location?: string | null;
  cv?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ContactForm = {
  id: number;
  name: string;
  email: string;
  subject?: string | null;
  description: string;
  createdAt: string;
};

export type ExperienceTranslation = {
  id?: number;
  locale: Locale;
  title: string;
  description?: string | null;
  experienceId?: number;
};

export type Experience = {
  id: number;
  institution: string;
  years: string;
  sortOrder: number;
  translations: ExperienceTranslation[];
  createdAt: string;
  updatedAt: string;
};

export type SkillLevel = "BEGINNER" | "MIDDLE" | "PROFESSIONAL";

export type Skill = {
  id: number;
  title: string;
  image?: string | null;
  level: SkillLevel;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type CertificateTranslation = {
  id?: number;
  locale: Locale;
  title: string;
  description?: string | null;
  certificateId?: number;
};

export type Certificate = {
  id: number;
  file: string;
  previewImg?: string | null;
  issuedBy?: string | null;
  issuedOn?: string | null;
  sortOrder: number;
  translations: CertificateTranslation[];
  createdAt: string;
  updatedAt: string;
};

export type ProjectTranslation = {
  id?: number;
  locale: Locale;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  projectId?: number;
};

export type ProjectImage = {
  id: number;
  url: string;
  alt?: string | null;
  sortOrder: number;
  projectId: number;
};

export type Project = {
  id: number;
  slug: string;
  sortOrder: number;
  images: ProjectImage[];
  translations: ProjectTranslation[];
  createdAt: string;
  updatedAt: string;
};

export type SocialMedia = {
  id: number;
  logo?: string | null;
  link: string;
  title: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type BlogCategoryTranslation = {
  id?: number;
  locale: Locale;
  title: string;
  blogCategoryId?: number;
};

export type BlogCategory = {
  id: number;
  slug: string;
  sortOrder: number;
  translations: BlogCategoryTranslation[];
  createdAt: string;
  updatedAt: string;
};

export type BlogPostTranslation = {
  id?: number;
  locale: Locale;
  title: string;
  content: string;
  blogPostId?: number;
};

export type BlogPost = {
  id: number;
  blogCategoryId: number;
  blogCategory?: {
    id: number;
    slug: string;
    translations: BlogCategoryTranslation[];
  };
  authorId: number;
  slug: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  featuredImage?: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt?: string | null;
  createdBy?: string | null;
  translations: BlogPostTranslation[];
  createdAt: string;
  updatedAt: string;
};
