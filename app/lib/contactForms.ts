import { apiFetch } from "./api";
import type { ContactForm } from "./types";

export const submitContactForm = (payload: {
  name: string;
  email: string;
  subject?: string;
  description: string;
}) =>
  apiFetch<ContactForm>("/cms/contact/forms", {
    method: "POST",
    body: payload,
  });

export const listContactForms = () =>
  apiFetch<ContactForm[]>("/cms/contact/forms", {
    auth: true,
  });
