import type { ClientActionFunction } from "react-router";
import { Form, Link, redirect, useActionData, useNavigation } from "react-router";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { createSocial, uploadSocialLogo } from "~/lib/cms/socials";

type ActionData = { error?: string };

export const clientAction: ClientActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = String(formData.get("title") ?? "").trim();
  const link = String(formData.get("link") ?? "").trim();
  const order = Number(formData.get("order") ?? "0");
  const logoFile = formData.get("logo");

  if (!title || !link) {
    return { error: "Title dan link wajib diisi." };
  }

  try {
    const created = await createSocial({
      title,
      link,
      order: Number.isNaN(order) ? 0 : order,
    });

    if (logoFile instanceof File && logoFile.size > 0) {
      await uploadSocialLogo(created.id, logoFile);
    }

    throw redirect("/admin/social-media");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menyimpan social.";
    return { error: message };
  }
};

export default function SocialNew() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Social Baru</h1>
          <p className="text-sm text-muted-foreground">Tambah link sosial dengan logo.</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/admin/social-media">Kembali</Link>
        </Button>
      </div>

      <Separator />

      <Form method="post" encType="multipart/form-data" className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Title</label>
            <Input name="title" placeholder="LinkedIn" required />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-foreground">Link</label>
            <Input name="link" placeholder="https://..." required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Order</label>
            <Input name="order" type="number" min={0} defaultValue={0} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Logo</label>
            <Input type="file" name="logo" accept="image/*" />
          </div>
        </div>

        {actionData?.error ? <p className="text-sm text-red-600">{actionData.error}</p> : null}

        <div className="flex justify-end gap-3">
          <Button asChild variant="outline">
            <Link to="/admin/social-media">Batal</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
