import type { ClientActionFunction, ClientLoaderFunction } from "react-router";
import { Form, Link, useLoaderData, useNavigation } from "react-router";

import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { deleteBlogPost, listBlogPosts } from "~/lib/cms/blogPosts";
import type { BlogPost, Locale } from "~/lib/types";

const pick = (post: BlogPost, locale: Locale) =>
  post.translations.find((t) => t.locale === locale) ?? { locale, title: "" };

export const clientLoader: ClientLoaderFunction = async () => {
  try {
    const posts = await listBlogPosts();
    return { posts };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memuat data blog.";
    return { posts: [], error: message };
  }
};

export const clientAction: ClientActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const intent = String(formData.get("intent"));
  const id = Number(formData.get("id"));
  if (intent === "delete" && id) {
    await deleteBlogPost(id);
  }
  return null;
};

type LoaderData = { posts: BlogPost[]; error?: string };

export default function BlogPostsPage() {
  const { posts, error } = useLoaderData<LoaderData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Blog Posts</h1>
          <p className="text-sm text-muted-foreground">Kelola artikel blog.</p>
        </div>
        <Button asChild>
          <Link to="/admin/blog/new">Tambah Post</Link>
        </Button>
      </div>

      <Separator />

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-xl border bg-card">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Slug</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Title (EN)</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Title (ID)</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Category ID</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {posts.map((post) => {
              const en = pick(post, "EN");
              const id = pick(post, "ID");
              return (
                <tr key={post.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm">{post.status}</td>
                  <td className="px-4 py-3 text-sm font-mono text-muted-foreground">{post.slug}</td>
                  <td className="px-4 py-3 text-sm">{en.title}</td>
                  <td className="px-4 py-3 text-sm">{id.title}</td>
                  <td className="px-4 py-3 text-sm">{post.blogCategoryId}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link to={`/admin/blog/${post.id}`}>Edit</Link>
                      </Button>
                      <Form method="post">
                        <input type="hidden" name="intent" value="delete" />
                        <input type="hidden" name="id" value={post.id} />
                        <Button
                          size="sm"
                          variant="destructive"
                          type="submit"
                          disabled={isSubmitting}
                          onClick={(e) => {
                            if (!confirm("Hapus post ini?")) e.preventDefault();
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
            {posts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-sm text-muted-foreground">
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
