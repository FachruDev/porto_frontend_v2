import type { ClientActionFunction, ClientLoaderFunction } from "react-router";
import { Form, Link, useLoaderData, useNavigation } from "react-router";

import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { deleteSocial, listSocials } from "~/lib/cms/socials";
import type { SocialMedia } from "~/lib/types";

export const clientLoader: ClientLoaderFunction = async () => {
  const socials = await listSocials();
  return { socials };
};

export const clientAction: ClientActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const intent = String(formData.get("intent"));
  const id = Number(formData.get("id"));
  if (intent === "delete" && id) {
    await deleteSocial(id);
  }
  return null;
};

export default function SocialsPage() {
  const { socials } = useLoaderData<{ socials: SocialMedia[] }>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Social Media</h1>
          <p className="text-sm text-muted-foreground">Kelola link sosial dengan logo.</p>
        </div>
        <Button asChild>
          <Link to="/admin/social-media/new">Tambah Social</Link>
        </Button>
      </div>

      <Separator />

      <div className="overflow-hidden rounded-xl border bg-card">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Order</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Logo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Title</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Link</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {socials.map((item) => (
              <tr key={item.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 text-sm">{item.sortOrder}</td>
                <td className="px-4 py-3 text-sm">
                  {item.logo ? <img src={item.logo} alt={item.title} className="h-8 w-8 rounded" /> : "—"}
                </td>
                <td className="px-4 py-3 text-sm font-medium">{item.title}</td>
                <td className="px-4 py-3 text-sm text-blue-600 break-all">{item.link}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/admin/social-media/${item.id}`}>Edit</Link>
                    </Button>
                    <Form method="post">
                      <input type="hidden" name="intent" value="delete" />
                      <input type="hidden" name="id" value={item.id} />
                      <Button
                        size="sm"
                        variant="destructive"
                        type="submit"
                        disabled={isSubmitting}
                        onClick={(e) => {
                          if (!confirm("Hapus social ini?")) e.preventDefault();
                        }}
                      >
                        Hapus
                      </Button>
                    </Form>
                  </div>
                </td>
              </tr>
            ))}
            {socials.length === 0 ? (
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
