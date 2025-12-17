import type { ClientActionFunction } from "react-router";
import { Form, Link, redirect, useActionData, useNavigation } from "react-router";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { createExperience } from "~/lib/cms/experiences";

type ActionData = { error?: string };

export const clientAction: ClientActionFunction = async ({ request }) => {
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
    await createExperience({
      institution,
      years,
      order: Number.isNaN(order) ? 0 : order,
      translations: [
        { locale: "EN", title: titleEn, description: descEn || undefined },
        { locale: "ID", title: titleId, description: descId || undefined },
      ],
    });
    throw redirect("/admin/experience/experiences");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menyimpan experience.";
    return { error: message };
  }
};

export default function ExperienceNew() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Experience Baru</h1>
          <p className="text-sm text-muted-foreground">Buat record pengalaman.</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/admin/experiences">Kembali</Link>
        </Button>
      </div>

      <Separator />

      <Form method="post" className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Institution</label>
            <Input name="institution" placeholder="Company / School" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Years</label>
            <Input name="years" placeholder="2020 - 2024" required />
          </div>

          <fieldset className="space-y-4 rounded-xl border p-4">
            <legend className="px-2 text-sm font-semibold text-muted-foreground">English (EN)</legend>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Title</label>
              <Input name="title_en" placeholder="Role title" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <Textarea name="desc_en" placeholder="Optional description" rows={4} />
            </div>
          </fieldset>

          <fieldset className="space-y-4 rounded-xl border p-4">
            <legend className="px-2 text-sm font-semibold text-muted-foreground">Bahasa Indonesia (ID)</legend>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Judul</label>
              <Input name="title_id" placeholder="Judul peran" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Deskripsi</label>
              <Textarea name="desc_id" placeholder="Deskripsi opsional" rows={4} />
            </div>
          </fieldset>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Order</label>
            <Input name="order" type="number" min={0} defaultValue={0} />
          </div>

        {actionData?.error ? <p className="text-sm text-red-600">{actionData.error}</p> : null}

        <div className="md:col-span-2 flex justify-end gap-3">
          <Button asChild variant="outline">
            <Link to="/admin/experiences">Batal</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
