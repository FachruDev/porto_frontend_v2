import type { ClientActionFunction, ClientLoaderFunction } from "react-router";
import { Form, Link, redirect, useActionData, useLoaderData, useNavigation } from "react-router";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { listSocials, updateSocial, uploadSocialLogo } from "~/lib/cms/socials";
import type { SocialMedia } from "~/lib/types";

type LoaderData = { social: SocialMedia };
type ActionData = { error?: string; social?: SocialMedia };

export const clientLoader: ClientLoaderFunction = async ({ params }) => {
  const id = Number(params.id);
  if (!id) throw redirect("/admin/social-media");
  const socials = await listSocials();
  const social = socials.find((s) => s.id === id);
  if (!social) throw redirect("/admin/social-media");
  return { social };
};

export const clientAction: ClientActionFunction = async ({ request, params }) => {
  const id = Number(params.id);
  if (!id) throw redirect("/admin/social-media");
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "update");

  try {
    if (intent === "uploadLogo") {
      const logo = formData.get("logo");
      if (!(logo instanceof File) || logo.size === 0) {
        return { error: "Pilih file logo." };
      }
      const social = await uploadSocialLogo(id, logo);
      return { social };
    }

    const title = String(formData.get("title") ?? "").trim();
    const link = String(formData.get("link") ?? "").trim();
    const order = Number(formData.get("order") ?? "0");

    if (!title || !link) {
      return { error: "Title dan link wajib diisi." };
    }

    const social = await updateSocial(id, {
      title,
      link,
      order: Number.isNaN(order) ? undefined : order,
    });
    return { social };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memperbarui social.";
    return { error: message };
  }
};

export default function SocialEdit() {
  const { social: loaderSocial } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const social = actionData?.social ?? loaderSocial;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Edit Social</h1>
          <p className="text-sm text-muted-foreground">Perbarui link dan logo sosial.</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/admin/social-media">Kembali</Link>
        </Button>
      </div>

      <Separator />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 space-y-3">
          <h2 className="text-lg font-semibold">Preview</h2>
          {social.logo ? (
            <img src={social.logo} alt={social.title} className="h-16 w-16 rounded object-contain border" />
          ) : (
            <p className="text-xs text-muted-foreground">Belum ada logo.</p>
          )}
          <p className="text-sm font-medium">{social.title}</p>
          <p className="text-xs text-muted-foreground break-all">{social.link}</p>
          <p className="text-xs text-muted-foreground">Order: {social.sortOrder}</p>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Form method="post" className="rounded-xl border p-4 space-y-4" encType="multipart/form-data">
            <input type="hidden" name="intent" value="uploadLogo" />
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">Upload Logo</h3>
                <p className="text-xs text-muted-foreground">PNG/JPG up to 5MB.</p>
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Uploading..." : "Upload"}
              </Button>
            </div>
            <Input type="file" name="logo" accept="image/*" />
          </Form>

          <Form method="post" className="rounded-xl border p-4 space-y-4">
            <input type="hidden" name="intent" value="update" />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Title</label>
                <Input name="title" defaultValue={social.title} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Order</label>
                <Input name="order" type="number" min={0} defaultValue={social.sortOrder} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Link</label>
              <Input name="link" defaultValue={social.link} required />
            </div>

            {actionData?.error ? <p className="text-sm text-red-600">{actionData.error}</p> : null}

            <div className="flex justify-end gap-3">
              <Button asChild variant="outline">
                <Link to="/admin/social-media">Batal</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Update"}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
