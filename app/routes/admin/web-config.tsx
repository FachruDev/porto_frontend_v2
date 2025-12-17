import type { ClientActionFunction, ClientLoaderFunction } from "react-router";
import { Form, useActionData, useLoaderData, useNavigation } from "react-router";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { getWebConfig, updateWebConfig, uploadWebAssets } from "~/lib/cms/webconfig";
import type { WebConfig } from "~/lib/types";

type ActionData = { error?: string; config?: WebConfig };

export const clientLoader: ClientLoaderFunction = async () => {
  const config = await getWebConfig();
  return { config };
};

export const clientAction: ClientActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "updateMeta");

  try {
    if (intent === "uploadAssets") {
      const logo = formData.get("logo");
      const favicon = formData.get("favicon");
      if (!(logo instanceof File) && !(favicon instanceof File)) {
        return { error: "Pilih file logo atau favicon." };
      }
      const config = await uploadWebAssets({
        logo: logo instanceof File && logo.size > 0 ? logo : null,
        favicon: favicon instanceof File && favicon.size > 0 ? favicon : null,
      });
      return { config };
    }

    const metaTitle = String(formData.get("metaTitle") ?? "").trim();
    const metaDescription = String(formData.get("metaDescription") ?? "").trim();
    const copyright = String(formData.get("copyright") ?? "").trim();
    const logoUrl = String(formData.get("logoUrl") ?? "").trim();
    const faviconUrl = String(formData.get("faviconUrl") ?? "").trim();

    const config = await updateWebConfig({
      metaTitle: metaTitle || undefined,
      metaDescription: metaDescription || undefined,
      copyright: copyright || undefined,
      logo: logoUrl || undefined,
      favicon: faviconUrl || undefined,
    });
    return { config };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menyimpan web config.";
    return { error: message };
  }
};

export default function WebConfigPage() {
  const { config: loaderConfig } = useLoaderData<{ config: WebConfig | null }>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const config = actionData?.config ?? loaderConfig;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Web Config</h1>
        <p className="text-sm text-muted-foreground">Kelola logo, favicon, dan metadata situs.</p>
      </div>

      <Separator />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold">Preview</h2>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Logo</p>
              {config?.logo ? (
                <img src={config.logo} alt="Logo" className="h-16 rounded border bg-white p-2 object-contain" />
              ) : (
                <p className="text-muted-foreground text-xs">Belum ada logo</p>
              )}
            </div>
            <Separator />
            <div>
              <p className="text-xs uppercase text-muted-foreground">Favicon</p>
              {config?.favicon ? (
                <img src={config.favicon} alt="Favicon" className="h-10 w-10 rounded border bg-white p-1 object-contain" />
              ) : (
                <p className="text-muted-foreground text-xs">Belum ada favicon</p>
              )}
            </div>
            <Separator />
            <div>
              <p className="text-xs uppercase text-muted-foreground">Meta</p>
              <p className="font-semibold">{config?.metaTitle || "—"}</p>
              <p className="text-muted-foreground">{config?.metaDescription || "—"}</p>
            </div>
            <Separator />
            <p className="text-xs text-muted-foreground">Copyright: {config?.copyright || "—"}</p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Form method="post" className="rounded-xl border p-4 space-y-4" encType="multipart/form-data">
            <input type="hidden" name="intent" value="uploadAssets" />
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">Upload Logo/Favicon</h3>
                <p className="text-xs text-muted-foreground">PNG/JPG max 5MB</p>
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Uploading..." : "Upload"}
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Logo</label>
                <Input type="file" name="logo" accept="image/*" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Favicon</label>
                <Input type="file" name="favicon" accept="image/*" />
              </div>
            </div>
          </Form>

          <Form method="post" className="rounded-xl border p-4 space-y-4">
            <input type="hidden" name="intent" value="updateMeta" />
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">Metadata</h3>
                <p className="text-xs text-muted-foreground">Isi teks meta dan link aset bila perlu.</p>
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Meta Title</label>
                <Input name="metaTitle" defaultValue={config?.metaTitle ?? ""} placeholder="Portfolio of John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Copyright</label>
                <Input name="copyright" defaultValue={config?.copyright ?? ""} placeholder="© 2025 Your Name" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Meta Description</label>
              <Textarea
                name="metaDescription"
                defaultValue={config?.metaDescription ?? ""}
                placeholder="Personal portfolio showcasing projects..."
                rows={4}
              />
            </div>
          </Form>

          {actionData?.error ? <p className="text-sm text-red-600">{actionData.error}</p> : null}
        </div>
      </div>
    </div>
  );
}
