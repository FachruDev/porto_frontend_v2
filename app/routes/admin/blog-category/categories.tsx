import type { ClientActionFunction, ClientLoaderFunction } from "react-router";
import { Form, Link, useLoaderData, useNavigation } from "react-router";

import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { deleteBlogCategory, listBlogCategories } from "~/lib/cms/blogCategories";
import type { BlogCategory, Locale } from "~/lib/types";

const pick = (category: BlogCategory, locale: Locale) =>
  category.translations.find((t) => t.locale === locale) ?? { locale, title: "" };

export const clientLoader: ClientLoaderFunction = async () => {
  const categories = await listBlogCategories();
  return { categories };
};

export const clientAction: ClientActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const intent = String(formData.get("intent"));
  const id = Number(formData.get("id"));
  if (intent === "delete" && id) {
    await deleteBlogCategory(id);
  }
  return null;
};

export default function CategoriesPage() {
  const { categories } = useLoaderData<{ categories: BlogCategory[] }>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Blog Categories</h1>
          <p className="text-sm text-muted-foreground">Kelola kategori blog.</p>
        </div>
        <Button asChild>
          <Link to="/admin/blog-category/new">Tambah Category</Link>
        </Button>
      </div>

      <Separator />

      <div className="overflow-hidden rounded-xl border bg-card">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Order</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Slug</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Title (EN)</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Title (ID)</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.map((cat) => {
              const en = pick(cat, "EN");
              const id = pick(cat, "ID");
              return (
                <tr key={cat.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm">{cat.sortOrder}</td>
                  <td className="px-4 py-3 text-sm font-mono text-muted-foreground">{cat.slug}</td>
                  <td className="px-4 py-3 text-sm">{en.title}</td>
                  <td className="px-4 py-3 text-sm">{id.title}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link to={`/admin/blog-category/${cat.id}`}>Edit</Link>
                      </Button>
                      <Form method="post">
                        <input type="hidden" name="intent" value="delete" />
                        <input type="hidden" name="id" value={cat.id} />
                        <Button
                          size="sm"
                          variant="destructive"
                          type="submit"
                          disabled={isSubmitting}
                          onClick={(e) => {
                            if (!confirm("Hapus kategori ini?")) e.preventDefault();
                          }}
                        >
                          Hapus
                        </Button>
                      </Form>
                    </div>
                  </td>
                </tr>
              );
            })}
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-muted-foreground">
                  Belum ada data.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
