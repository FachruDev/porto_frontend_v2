import { apiFetch } from "../api";
import type { Skill, SkillLevel } from "../types";

export const listSkills = () => apiFetch<Skill[]>("/cms/skills");

export const createSkill = (payload: {
  title: string;
  level: SkillLevel;
  order?: number;
  image?: string;
}) =>
  apiFetch<Skill>("/cms/skills", {
    method: "POST",
    auth: true,
    body: payload,
  });

export const updateSkill = (id: number, payload: Partial<{ title: string; level: SkillLevel; order?: number; image?: string }>) =>
  apiFetch<Skill>(`/cms/skills/${id}`, {
    method: "PUT",
    auth: true,
    body: payload,
  });

export const deleteSkill = (id: number) =>
  apiFetch<null>(`/cms/skills/${id}`, {
    method: "DELETE",
    auth: true,
  });

export const uploadSkillImage = async (id: number, file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  return apiFetch<Skill>(`/cms/skills/${id}/image`, {
    method: "POST",
    auth: true,
    body: formData,
  });
};
