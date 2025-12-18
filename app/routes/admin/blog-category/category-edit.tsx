import type { ClientActionFunction, ClientLoaderFunction } from "react-router";
import { Form, Link, redirect, useActionData, useLoaderData, useNavigation } from "react-router";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { listBlogCategories, updateBlogCategory } from "~/lib/cms/blogCategories";
import type { BlogCategory, Locale } from "~/lib/types";

type LoaderData = { category: BlogCategory };
type ActionData = { error?: string };

const pick = (category: BlogCategory, locale: Locale) =>
  category.translations.find((t) => t.locale === locale) ?? { locale, title: "" };

export const clientLoader: ClientLoaderFunction = async ({ params }) => {
  const id = Number(params.id);
  if (!id) throw redirect("/admin/blog-category");
  const categories = await listBlogCategories();
  const category = categories.find((c) => c.id === id);
  if (!category) throw redirect("/admin/blog-category");
  return { category };
};

export const clientAction: ClientActionFunction = async ({ request, params }) => {
  const id = Number(params.id);
  if (!id) throw redirect("/admin/blog-category");
  const formData = await request.formData();
  const slug = String(formData.get("slug") ?? "").trim();
  const order = Number(formData.get("order") ?? "0");
  const titleEn = String(formData.get("title_en") ?? "").trim();
  const titleId = String(formData.get("title_id") ?? "").trim();

  if (!titleEn || !titleId) {
    return { error: "Judul EN dan ID wajib diisi." };
  }

  try {
    await updateBlogCategory(id, {
      slug: slug || undefined,
      order: Number.isNaN(order) ? undefined : order,
      translations: [
        { locale: "EN", title: titleEn },
        { locale: "ID", title: titleId },
      ],
    });
    throw redirect("/admin/blog-category");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memperbarui kategori.";
    return { error: message };
  }
};

export default function BlogCategoryEdit() {
  const { category } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const en = pick(category, "EN");
  const id = pick(category, "ID");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Edit Kategori</h1>
          <p className="text-sm text-muted-foreground">Perbarui kategori blog.</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/admin/blog-category">Kembali</Link>
        </Button>
      </div>

      <Separator />

      <Form method="post" className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Slug</label>
            <Input name="slug" defaultValue={category.slug} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Order</label>
            <Input name="order" type="number" min={0} defaultValue={category.sortOrder} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Title (EN)</label>
            <Input name="title_en" defaultValue={en.title} required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Judul (ID)</label>
            <Input name="title_id" defaultValue={id.title} required />
          </div>
        </div>

        {actionData?.error ? <p className="text-sm text-red-600">{actionData.error}</p> : null}

        <div className="flex justify-end gap-3">
          <Button asChild variant="outline">
            <Link to="/admin/blog-category">Batal</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Update"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
