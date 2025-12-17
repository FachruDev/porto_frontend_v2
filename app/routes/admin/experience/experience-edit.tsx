import type { ClientActionFunction, ClientLoaderFunction } from "react-router";
import { Form, Link, redirect, useActionData, useLoaderData, useNavigation } from "react-router";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { listExperiences, updateExperience } from "~/lib/cms/experiences";
import type { Experience, Locale } from "~/lib/types";

type LoaderData = { experience: Experience };
type ActionData = { error?: string };

const pick = (experience: Experience, locale: Locale) =>
  experience.translations.find((t) => t.locale === locale) ?? { locale, title: "", description: "" };

export const clientLoader: ClientLoaderFunction = async ({ params }) => {
  const id = Number(params.id);
  if (!id) throw redirect("/admin/experience/experiences");
  const experiences = await listExperiences();
  const experience = experiences.find((e) => e.id === id);
  if (!experience) throw redirect("/admin/experience/experiences");
  return { experience };
};

export const clientAction: ClientActionFunction = async ({ request, params }) => {
  const id = Number(params.id);
  if (!id) throw redirect("/admin/experience/experiences");
  const formData = await request.formData();
  const institution = String(formData.get("institution") ?? "").trim();
  const years = String(formData.get("years") ?? "").trim();
  const order = Number(formData.get("order") ?? "0");
  const titleEn = String(formData.get("title_en") ?? "").trim();
  const descEn = String(formData.get("desc_en") ?? "").trim();
  const titleId = String(formData.get("title_id") ?? "").trim();
  const descId = String(formData.get("desc_id") ?? "").trim();

  if (!institution || !years || !titleEn || !titleId) {
    return { error: "Institution, years, dan judul EN/ID wajib diisi." };
  }

  try {
    await updateExperience(id, {
      institution,
      years,
      order: Number.isNaN(order) ? undefined : order,
      translations: [
        { locale: "EN", title: titleEn, description: descEn || undefined },
        { locale: "ID", title: titleId, description: descId || undefined },
      ],
    });
    throw redirect("/admin/experiences");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memperbarui experience.";
    return { error: message };
  }
};

export default function ExperienceEdit() {
  const { experience } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const en = pick(experience, "EN");
  const id = pick(experience, "ID");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Edit Experience</h1>
          <p className="text-sm text-muted-foreground">Perbarui data pengalaman.</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/admin/experiences">Kembali</Link>
        </Button>
      </div>

      <Separator />

      <Form method="post" className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Institution</label>
            <Input name="institution" defaultValue={experience.institution} required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Years</label>
            <Input name="years" defaultValue={experience.years} required />
          </div>

          <fieldset className="space-y-4 rounded-xl border p-4">
            <legend className="px-2 text-sm font-semibold text-muted-foreground">English (EN)</legend>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Title</label>
              <Input name="title_en" defaultValue={en.title} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <Textarea name="desc_en" defaultValue={en.description ?? ""} rows={4} />
            </div>
          </fieldset>

          <fieldset className="space-y-4 rounded-xl border p-4">
            <legend className="px-2 text-sm font-semibold text-muted-foreground">Bahasa Indonesia (ID)</legend>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Judul</label>
              <Input name="title_id" defaultValue={id.title} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Deskripsi</label>
              <Textarea name="desc_id" defaultValue={id.description ?? ""} rows={4} />
            </div>
          </fieldset>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Order</label>
            <Input name="order" type="number" min={0} defaultValue={experience.sortOrder} />
          </div>

        {actionData?.error ? <p className="text-sm text-red-600">{actionData.error}</p> : null}

        <div className="md:col-span-2 flex justify-end gap-3">
          <Button asChild variant="outline">
            <Link to="/admin/experiences">Batal</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Update"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
