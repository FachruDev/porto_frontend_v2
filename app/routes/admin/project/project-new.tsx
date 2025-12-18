import { useState } from "react";
import type { ClientActionFunction } from "react-router";
import { Form, Link, redirect, useActionData, useNavigation } from "react-router";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { createProject, uploadProjectImages } from "~/lib/cms/projects";

type ActionData = { error?: string };

export const clientAction: ClientActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const slug = String(formData.get("slug") ?? "").trim();
  const order = Number(formData.get("order") ?? "0");
  const titleEn = String(formData.get("title_en") ?? "").trim();
  const subtitleEn = String(formData.get("subtitle_en") ?? "").trim();
  const descEn = String(formData.get("desc_en") ?? "").trim();
  const titleId = String(formData.get("title_id") ?? "").trim();
  const subtitleId = String(formData.get("subtitle_id") ?? "").trim();
  const descId = String(formData.get("desc_id") ?? "").trim();
  const imageFiles = formData.getAll("images");

  if (!titleEn || !titleId) {
    return { error: "Judul EN & ID wajib diisi." };
  }

  try {
    const created = await createProject({
      slug: slug || undefined,
      order: Number.isNaN(order) ? 0 : order,
      translations: [
        { locale: "EN", title: titleEn, subtitle: subtitleEn || undefined, description: descEn || undefined },
        { locale: "ID", title: titleId, subtitle: subtitleId || undefined, description: descId || undefined },
      ],
    });

    const files = imageFiles.filter((f): f is File => f instanceof File && f.size > 0);
    if (files.length) {
      await uploadProjectImages(created.id, files);
    }

    throw redirect("/admin/project");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menyimpan project.";
    return { error: message };
  }
};

export default function ProjectNew() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const handleSlugChange = (value: string) => {
    setSlug(value);
    setSlugTouched(true);
  };

  const syncSlugFromTitle = (title: string) => {
    if (!slugTouched || slug.trim() === "") {
      setSlug(slugify(title));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Project Baru</h1>
          <p className="text-sm text-muted-foreground">Buat project baru beserta gambar dan terjemahan.</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/admin/project">Kembali</Link>
        </Button>
      </div>

      <Separator />

      <Form method="post" encType="multipart/form-data" className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Slug (opsional)</label>
            <Input
              name="slug"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="auto-from-title"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Order</label>
            <Input name="order" type="number" min={0} defaultValue={0} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Upload Images</label>
            <Input type="file" name="images" accept="image/*" multiple />
            <p className="text-xs text-muted-foreground">Bisa pilih beberapa file sekaligus.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <fieldset className="space-y-4 rounded-xl border p-4">
            <legend className="px-2 text-sm font-semibold text-muted-foreground">English (EN)</legend>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Title</label>
              <Input
                name="title_en"
                placeholder="Project title"
                required
                onChange={(e) => syncSlugFromTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Subtitle</label>
              <Input name="subtitle_en" placeholder="Optional subtitle" />
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
              <Input name="title_id" placeholder="Judul project" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Subjudul</label>
              <Input name="subtitle_id" placeholder="Subjudul opsional" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Deskripsi</label>
              <Textarea name="desc_id" placeholder="Deskripsi opsional" rows={4} />
            </div>
          </fieldset>
        </div>

        {actionData?.error ? <p className="text-sm text-red-600">{actionData.error}</p> : null}

        <div className="flex justify-end gap-3">
          <Button asChild variant="outline">
            <Link to="/admin/project">Batal</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
