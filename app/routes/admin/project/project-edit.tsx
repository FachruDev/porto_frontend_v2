import type { ClientActionFunction, ClientLoaderFunction } from "react-router";
import { Form, Link, redirect, useActionData, useLoaderData, useNavigation } from "react-router";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import {
  addProjectImage,
  deleteProject,
  deleteProjectImage,
  getProject,
  updateProject,
  uploadProjectImages,
} from "~/lib/cms/projects";
import type { Project, ProjectImage, Locale } from "~/lib/types";

type LoaderData = { project: Project };
type ActionData = { error?: string; project?: Project };

const pick = (project: Project, locale: Locale) =>
  project.translations.find((t) => t.locale === locale) ?? { locale, title: "", subtitle: "", description: "" };

export const clientLoader: ClientLoaderFunction = async ({ params }) => {
  const id = Number(params.id);
  if (!id) throw redirect("/admin/project");
  const project = await getProject(id);
  return { project };
};

export const clientAction: ClientActionFunction = async ({ request, params }) => {
  const id = Number(params.id);
  if (!id) throw redirect("/admin/project");
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "update");

  try {
    if (intent === "uploadImages") {
      const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
      if (!files.length) return { error: "Pilih minimal satu gambar." };
      const images = await uploadProjectImages(id, files);
      const project = await getProject(id);
      return { project: { ...project, images } };
    }

    if (intent === "addImageUrl") {
      const url = String(formData.get("url") ?? "").trim();
      const alt = String(formData.get("alt") ?? "").trim();
      const order = Number(formData.get("order") ?? "0");
      if (!url) return { error: "URL gambar wajib diisi." };
      await addProjectImage(id, { url, alt: alt || undefined, order: Number.isNaN(order) ? 0 : order });
      const project = await getProject(id);
      return { project };
    }

    if (intent === "deleteImage") {
      const imageId = Number(formData.get("imageId"));
      if (imageId) {
        await deleteProjectImage(id, imageId);
      }
      const project = await getProject(id);
      return { project };
    }

    if (intent === "deleteProject") {
      await deleteProject(id);
      throw redirect("/admin/project");
    }

    const slug = String(formData.get("slug") ?? "").trim();
    const order = Number(formData.get("order") ?? "0");
    const titleEn = String(formData.get("title_en") ?? "").trim();
    const subtitleEn = String(formData.get("subtitle_en") ?? "").trim();
    const descEn = String(formData.get("desc_en") ?? "").trim();
    const titleId = String(formData.get("title_id") ?? "").trim();
    const subtitleId = String(formData.get("subtitle_id") ?? "").trim();
    const descId = String(formData.get("desc_id") ?? "").trim();

    if (!titleEn || !titleId) {
      return { error: "Judul EN & ID wajib diisi." };
    }

    const project = await updateProject(id, {
      slug: slug || undefined,
      order: Number.isNaN(order) ? undefined : order,
      translations: [
        { locale: "EN", title: titleEn, subtitle: subtitleEn || undefined, description: descEn || undefined },
        { locale: "ID", title: titleId, subtitle: subtitleId || undefined, description: descId || undefined },
      ],
    });
    return { project };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memproses project.";
    return { error: message };
  }
};

export default function ProjectEdit() {
  const { project: loaderProject } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const project = actionData?.project ?? loaderProject;
  const en = pick(project, "EN");
  const id = pick(project, "ID");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Edit Project</h1>
          <p className="text-sm text-muted-foreground">Kelola detail project dan gambar.</p>
        </div>
        <div className="flex gap-2">
          <Form method="post">
            <input type="hidden" name="intent" value="deleteProject" />
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              onClick={(e) => {
                if (!confirm("Hapus project ini?")) e.preventDefault();
              }}
            >
              Delete
            </Button>
          </Form>
          <Button asChild variant="outline">
            <Link to="/admin/project">Kembali</Link>
          </Button>
        </div>
      </div>

      <Separator />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 space-y-3">
          <h2 className="text-lg font-semibold">Info</h2>
          <p className="text-sm font-medium">{en.title}</p>
          <p className="text-xs text-muted-foreground">Slug: {project.slug}</p>
          <p className="text-xs text-muted-foreground">Order: {project.sortOrder}</p>
          <p className="text-xs text-muted-foreground">Images: {project.images.length}</p>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Form method="post" className="rounded-xl border p-4 space-y-4">
            <input type="hidden" name="intent" value="update" />
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Slug</label>
                <Input name="slug" defaultValue={project.slug} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Order</label>
                <Input name="order" type="number" min={0} defaultValue={project.sortOrder} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <fieldset className="space-y-4 rounded-xl border p-4">
                <legend className="px-2 text-sm font-semibold text-muted-foreground">English (EN)</legend>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Title</label>
                  <Input name="title_en" defaultValue={en.title} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Subtitle</label>
                  <Input name="subtitle_en" defaultValue={en.subtitle ?? ""} />
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
                  <label className="text-sm font-medium text-foreground">Subjudul</label>
                  <Input name="subtitle_id" defaultValue={id.subtitle ?? ""} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Deskripsi</label>
                  <Textarea name="desc_id" defaultValue={id.description ?? ""} rows={4} />
                </div>
              </fieldset>
            </div>

            {actionData?.error ? <p className="text-sm text-red-600">{actionData.error}</p> : null}

            <div className="flex justify-end gap-3">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Update"}
              </Button>
            </div>
          </Form>

          <div className="rounded-xl border p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">Upload Images</h3>
                <p className="text-xs text-muted-foreground">Tambah gambar baru (multi-upload).</p>
              </div>
            </div>
            <Form method="post" encType="multipart/form-data" className="space-y-3">
              <input type="hidden" name="intent" value="uploadImages" />
              <Input type="file" name="images" accept="image/*" multiple />
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </Form>
          </div>

          <div className="rounded-xl border p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">Tambah Gambar via URL</h3>
              </div>
            </div>
            <Form method="post" className="grid gap-4 md:grid-cols-3">
              <input type="hidden" name="intent" value="addImageUrl" />
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-foreground">Image URL</label>
                <Input name="url" placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Order</label>
                <Input name="order" type="number" min={0} defaultValue={project.images.length} />
              </div>
              <div className="space-y-2 md:col-span-3">
                <label className="text-sm font-medium text-foreground">Alt</label>
                <Input name="alt" placeholder="Alt text" />
              </div>
              <div className="md:col-span-3 flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Menyimpan..." : "Tambah"}
                </Button>
              </div>
            </Form>
          </div>

          <div className="rounded-xl border p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">Daftar Gambar</h3>
              <p className="text-xs text-muted-foreground">{project.images.length} file</p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {project.images.map((img: ProjectImage) => (
                <div key={img.id} className="rounded-lg border p-2 space-y-2">
                  <img src={img.url} alt={img.alt ?? ""} className="h-24 w-full rounded object-cover" />
                  <p className="text-xs text-muted-foreground break-all">{img.url}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Order: {img.sortOrder}</span>
                  </div>
                  <Form method="post">
                    <input type="hidden" name="intent" value="deleteImage" />
                    <input type="hidden" name="imageId" value={img.id} />
                    <Button
                      variant="destructive"
                      size="sm"
                      type="submit"
                      disabled={isSubmitting}
                      onClick={(e) => {
                        if (!confirm("Hapus gambar ini?")) e.preventDefault();
                      }}
                      className="w-full"
                    >
                      Hapus
                    </Button>
                  </Form>
                </div>
              ))}
              {project.images.length === 0 ? (
                <p className="text-sm text-muted-foreground md:col-span-3">Belum ada gambar.</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
