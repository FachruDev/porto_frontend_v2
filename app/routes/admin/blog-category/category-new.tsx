import type { ClientActionFunction } from "react-router";
import { Form, Link, redirect, useActionData, useNavigation } from "react-router";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { createBlogCategory } from "~/lib/cms/blogCategories";

type ActionData = { error?: string };

export const clientAction: ClientActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const slug = String(formData.get("slug") ?? "").trim();
  const order = Number(formData.get("order") ?? "0");
  const titleEn = String(formData.get("title_en") ?? "").trim();
  const titleId = String(formData.get("title_id") ?? "").trim();

  if (!titleEn || !titleId) {
    return { error: "Judul EN dan ID wajib diisi." };
  }

  try {
    await createBlogCategory({
      slug: slug || undefined,
      order: Number.isNaN(order) ? 0 : order,
      translations: [
        { locale: "EN", title: titleEn },
        { locale: "ID", title: titleId },
      ],
    });
    throw redirect("/admin/blog-category");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menyimpan kategori.";
    return { error: message };
  }
};

export default function BlogCategoryNew() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Kategori Baru</h1>
          <p className="text-sm text-muted-foreground">Tambah kategori blog.</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/admin/blog-category">Kembali</Link>
        </Button>
      </div>

      <Separator />

      <Form method="post" className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Slug (opsional)</label>
            <Input name="slug" placeholder="auto-from-title" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Order</label>
            <Input name="order" type="number" min={0} defaultValue={0} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Title (EN)</label>
            <Input name="title_en" placeholder="Category title" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Judul (ID)</label>
            <Input name="title_id" placeholder="Judul kategori" required />
          </div>
        </div>

        {actionData?.error ? <p className="text-sm text-red-600">{actionData.error}</p> : null}

        <div className="flex justify-end gap-3">
          <Button asChild variant="outline">
            <Link to="/admin/blog-category">Batal</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
