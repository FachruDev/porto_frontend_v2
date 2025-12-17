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
