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
import {
  deleteBlogPost,
  getBlogPost,
  updateBlogPost,
  uploadFeaturedImage,
} from "~/lib/cms/blogPosts";
import type { BlogCategory, BlogPost, BlogPostTranslation, Locale } from "~/lib/types";
import { getUser } from "~/lib/auth";

type LoaderData = { categories: BlogCategory[]; post?: BlogPost; error?: string };
type ActionData = { error?: string; post?: BlogPost };

const pick = (post: BlogPost, locale: Locale): BlogPostTranslation =>
  post.translations.find((t) => t.locale === locale) ?? { locale, title: "", content: "" };

export const clientLoader: ClientLoaderFunction = async ({ params }) => {
  const id = Number(params.id);
  if (!id) throw redirect("/admin/blog");
  try {
    const [categories, post] = await Promise.all([getBlogCategoryOptions(), getBlogPost(id)]);
    return { categories, post };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memuat data post.";
    return { categories: [], error: message };
  }
};

export const clientAction: ClientActionFunction = async ({ request, params }) => {
  const id = Number(params.id);
  if (!id) throw redirect("/admin/blog");
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "update");

  try {
    if (intent === "uploadFeatured") {
      const file = formData.get("featured");
      if (!(file instanceof File) || file.size === 0) return { error: "Pilih file featured image." };
      const post = await uploadFeaturedImage(id, file);
      return { post };
    }

    if (intent === "deletePost") {
      await deleteBlogPost(id);
      throw redirect("/admin/blog");
    }

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
    const featured = formData.get("featured");

    if (!categoryId || !titleEn || !titleId || !contentEn || !contentId) {
      return { error: "Kategori, judul & konten EN/ID wajib diisi." };
    }

    const post = await updateBlogPost(id, {
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

    if (featured instanceof File && featured.size > 0) {
      await uploadFeaturedImage(id, featured);
    }

    return { post: await getBlogPost(id) };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memproses blog post.";
    return { error: message };
  }
};

export default function PostEdit() {
  const { categories, post: loaderPost, error } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  if (error || !loaderPost) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Edit Post</h1>
            <p className="text-sm text-muted-foreground">Tidak dapat memuat data post.</p>
          </div>
          <Button asChild variant="outline">
            <Link to="/admin/blog">Kembali</Link>
          </Button>
        </div>
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error || "Data tidak ditemukan atau backend error."}
        </div>
      </div>
    );
  }

  const post = actionData?.post ?? loaderPost;
  const en = pick(post, "EN");
  const id = pick(post, "ID");

  const [contentEn, setContentEn] = useState<string>(() => en.content || "");
  const [contentId, setContentId] = useState<string>(() => id.content || "");
  const [slug, setSlug] = useState(post.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(false);
  const currentUser = getUser();
  const authorId = currentUser?.id ?? post.authorId;
  const authorLabel = currentUser?.name || currentUser?.email || `User #${authorId}`;
  const createdBy = currentUser?.name || currentUser?.email || post.createdBy || "";

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
          <h1 className="text-2xl font-semibold">Edit Post</h1>
          <p className="text-sm text-muted-foreground">Kelola konten blog dengan editor kaya.</p>
        </div>
        <div className="flex gap-2">
          <Form method="post">
            <input type="hidden" name="intent" value="deletePost" />
            <Button
              variant="destructive"
              size="sm"
              onClick={(e) => {
                if (!confirm("Hapus post ini?")) e.preventDefault();
              }}
            >
              Delete
            </Button>
          </Form>
          <Button asChild variant="outline">
            <Link to="/admin/blog">Kembali</Link>
          </Button>
        </div>
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
            <Select name="blogCategoryId" defaultValue={String(post.blogCategoryId)} required>
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
            <label className="text-sm font-medium text-foreground">Slug</label>
            <Input
              name="slug"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="URL-friendly slug"
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
              <Select name="status" defaultValue={post.status}>
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
              <Input
                name="publishedAt"
                type="datetime-local"
                defaultValue={post.publishedAt ? post.publishedAt.slice(0, 16) : ""}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Featured Image</label>
            <Input type="file" name="featured" accept="image/*" />
            {post.featuredImage && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium">Current:</span>
                <span className="truncate">{post.featuredImage}</span>
              </div>
            )}
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
              <Input name="metaTitle" defaultValue={post.metaTitle ?? ""} placeholder="Judul untuk search engine (opsional)" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Meta Description</label>
              <Textarea name="metaDescription" defaultValue={post.metaDescription ?? ""} rows={3} placeholder="Deskripsi singkat untuk search engine (opsional)" />
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
                defaultValue={en.title}
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
              <Input name="title_id" defaultValue={id.title} placeholder="Masukkan judul post dalam Bahasa Indonesia" required />
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Update"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
