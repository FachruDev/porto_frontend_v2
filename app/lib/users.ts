import { apiFetch } from "./api";
import type { AuthUser } from "./auth";

export const getMe = () =>
  apiFetch<AuthUser>("/users/me", {
    auth: true,
  });

export const updateMe = (payload: Partial<{ name: string; email: string; password: string; bio?: string; profile?: string }>) =>
  apiFetch<AuthUser>("/users/me", {
    method: "PUT",
    auth: true,
    body: payload,
  });

export const uploadMyProfile = (file: File) => {
  const formData = new FormData();
  formData.append("profile", file);
  return apiFetch<AuthUser>("/users/me/profile", {
    method: "POST",
    auth: true,
    body: formData,
  });
};
