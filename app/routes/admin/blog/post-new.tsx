import { useState } from "react";
import type { ClientActionFunction, ClientLoaderFunction } from "react-router";
import { Form, Link, redirect, useActionData, useLoaderData, useNavigation } from "react-router";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { ClientCKEditor } from "~/components/editor/ckeditor";
import { getBlogCategoryOptions } from "~/routes/admin/blog/utils";
import { createBlogPost, uploadFeaturedImage } from "~/lib/cms/blogPosts";
import type { BlogCategory } from "~/lib/types";
import { getUser } from "~/lib/auth";

type ActionData = { error?: string };
type LoaderData = { categories: BlogCategory[] };

export const clientLoader: ClientLoaderFunction = async () => {
  const categories = await getBlogCategoryOptions();
  return { categories };
};

export const clientAction: ClientActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const categoryId = Number(formData.get("blogCategoryId") ?? "");
  const authorIdRaw = formData.get("authorId");
  const authorId = authorIdRaw ? Number(authorIdRaw) : undefined;
  const slug = String(formData.get("slug") ?? "").trim();
  const metaTitle = String(formData.get("metaTitle") ?? "").trim();
  const metaDescription = String(formData.get("metaDescription") ?? "").trim();
  const status = String(formData.get("status") ?? "DRAFT") as "DRAFT" | "PUBLISHED" | "ARCHIVED";
  const publishedAt = String(formData.get("publishedAt") ?? "").trim();
  const createdBy = String(formData.get("createdBy") ?? "").trim();
  const titleEn = String(formData.get("title_en") ?? "").trim();
  const contentEn = String(formData.get("content_en") ?? "").trim();
  const titleId = String(formData.get("title_id") ?? "").trim();
  const contentId = String(formData.get("content_id") ?? "").trim();
  const featuredFile = formData.get("featured");

  if (!categoryId || !titleEn || !titleId || !contentEn || !contentId) {
    return { error: "Kategori, judul & konten EN/ID wajib diisi." };
  }

  try {
    const created = await createBlogPost({
      blogCategoryId: categoryId,
      authorId,
      slug: slug || undefined,
      status,
      publishedAt: publishedAt || undefined,
      createdBy: createdBy || undefined,
      metaTitle: metaTitle || undefined,
      metaDescription: metaDescription || undefined,
      translations: [
        {
          locale: "EN",
          title: titleEn,
          content: contentEn,
        },
        {
          locale: "ID",
          title: titleId,
          content: contentId,
        },
      ],
    });

    if (featuredFile instanceof File && featuredFile.size > 0) {
      await uploadFeaturedImage(created.id, featuredFile);
    }

    throw redirect("/admin/blog");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menyimpan blog post.";
    return { error: message };
  }
};

export default function PostNew() {
  const { categories } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [contentEn, setContentEn] = useState<string>("");
  const [contentId, setContentId] = useState<string>("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const currentUser = getUser();
  const authorId = currentUser?.id ?? "";
  const authorLabel = currentUser?.name || currentUser?.email || `User #${authorId || "-"}`;
  const createdBy = currentUser?.name || currentUser?.email || "";

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
          <h1 className="text-2xl font-semibold">Post Baru</h1>
          <p className="text-sm text-muted-foreground">Buat konten blog dengan editor kaya.</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/admin/blog">Kembali</Link>
        </Button>
      </div>

      <Separator />

      <Form method="post" encType="multipart/form-data" className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Informasi Dasar</h3>
          <input type="hidden" name="authorId" value={authorId} />
          <input type="hidden" name="createdBy" value={createdBy} />
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Kategori *</label>
            <Select name="blogCategoryId" required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.translations.find((t) => t.locale === "EN")?.title ?? cat.slug}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Slug (opsional)</label>
            <Input
              name="slug"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="Akan digenerate otomatis dari judul"
            />
          </div>
        </div>

        <Separator />

        {/* Publishing Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Pengaturan Publikasi</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Status</label>
              <Select name="status" defaultValue="DRAFT">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Tanggal Publikasi</label>
              <Input name="publishedAt" type="datetime-local" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Featured Image</label>
            <Input type="file" name="featured" accept="image/*" />
            <p className="text-xs text-muted-foreground">Format: JPG, PNG, WebP (max 5MB)</p>
          </div>
        </div>

        <Separator />

        {/* SEO Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">SEO Meta Tags</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Meta Title</label>
              <Input name="metaTitle" placeholder="Judul untuk search engine (opsional)" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Meta Description</label>
              <Textarea name="metaDescription" rows={3} placeholder="Deskripsi singkat untuk search engine (opsional)" />
            </div>
          </div>
        </div>

        <Separator />

        {/* English Content */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">🇬🇧 Konten Bahasa Inggris</h3>
          </div>
          <div className="space-y-4 rounded-lg border bg-card p-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Title *</label>
              <Input
                name="title_en"
                placeholder="Enter post title in English"
                required
                onChange={(e) => syncSlugFromTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Content *</label>
              <input type="hidden" name="content_en" value={contentEn} />
              <ClientCKEditor value={contentEn} onChange={setContentEn} />
            </div>
          </div>
        </div>

        <Separator />

        {/* Indonesian Content */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">🇮🇩 Konten Bahasa Indonesia</h3>
          </div>
          <div className="space-y-4 rounded-lg border bg-card p-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Judul *</label>
              <Input name="title_id" placeholder="Masukkan judul post dalam Bahasa Indonesia" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Konten *</label>
              <input type="hidden" name="content_id" value={contentId} />
              <ClientCKEditor value={contentId} onChange={setContentId} />
            </div>
          </div>
        </div>

        {actionData?.error ? <p className="text-sm text-red-600">{actionData.error}</p> : null}

        <div className="flex justify-end gap-3">
          <Button asChild variant="outline">
            <Link to="/admin/blog">Batal</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
