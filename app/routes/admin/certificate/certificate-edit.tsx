import type { ClientActionFunction, ClientLoaderFunction } from "react-router";
import { Form, Link, redirect, useActionData, useLoaderData, useNavigation } from "react-router";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { listCertificates, updateCertificate, uploadCertificateFiles } from "~/lib/cms/certificates";
import type { Certificate, Locale } from "~/lib/types";

type LoaderData = { certificate: Certificate };
type ActionData = { error?: string; certificate?: Certificate };

const pick = (certificate: Certificate, locale: Locale) =>
  certificate.translations.find((t) => t.locale === locale) ?? { locale, title: "", description: "" };

export const clientLoader: ClientLoaderFunction = async ({ params }) => {
  const id = Number(params.id);
  if (!id) throw redirect("/admin/certificates");
  const certificates = await listCertificates();
  const certificate = certificates.find((c) => c.id === id);
  if (!certificate) throw redirect("/admin/certificates");
  return { certificate };
};

export const clientAction: ClientActionFunction = async ({ request, params }) => {
  const id = Number(params.id);
  if (!id) throw redirect("/admin/certificates");
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "update");

  try {
    if (intent === "uploadFiles") {
      const file = formData.get("file");
      const preview = formData.get("preview");
      if (!(file instanceof File) && !(preview instanceof File)) {
        return { error: "Pilih file atau preview untuk upload." };
      }
      const certificate = await uploadCertificateFiles(id, {
        file: file instanceof File && file.size > 0 ? file : null,
        preview: preview instanceof File && preview.size > 0 ? preview : null,
      });
      return { certificate };
    }

    const file = String(formData.get("file") ?? "").trim();
    const previewImg = String(formData.get("previewImg") ?? "").trim();
    const issuedBy = String(formData.get("issuedBy") ?? "").trim();
    const issuedOn = String(formData.get("issuedOn") ?? "").trim();
    const order = Number(formData.get("order") ?? "0");
    const titleEn = String(formData.get("title_en") ?? "").trim();
    const descEn = String(formData.get("desc_en") ?? "").trim();
    const titleId = String(formData.get("title_id") ?? "").trim();
    const descId = String(formData.get("desc_id") ?? "").trim();

    if (!titleEn || !titleId) {
      return { error: "Judul EN dan ID wajib diisi." };
    }

    const certificate = await updateCertificate(id, {
      file: file || undefined,
      previewImg: previewImg || undefined,
      issuedBy: issuedBy || undefined,
      issuedOn: issuedOn || undefined,
      order: Number.isNaN(order) ? undefined : order,
      translations: [
        { locale: "EN", title: titleEn, description: descEn || undefined },
        { locale: "ID", title: titleId, description: descId || undefined },
      ],
    });
    return { certificate };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memperbarui certificate.";
    return { error: message };
  }
};

export default function CertificateEdit() {
  const { certificate: loaderCertificate } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const certificate = actionData?.certificate ?? loaderCertificate;
  const en = pick(certificate, "EN");
  const id = pick(certificate, "ID");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Edit Certificate</h1>
          <p className="text-sm text-muted-foreground">Perbarui sertifikat.</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/admin/certificates">Kembali</Link>
        </Button>
      </div>

      <Separator />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 space-y-3">
          <h2 className="text-lg font-semibold">Preview</h2>
          <p className="text-sm font-medium">{en.title}</p>
          <p className="text-xs text-muted-foreground">Issued By: {certificate.issuedBy || "—"}</p>
          <p className="text-xs text-muted-foreground">
            Date: {certificate.issuedOn ? new Date(certificate.issuedOn).toLocaleDateString() : "—"}
          </p>
          <p className="text-xs text-muted-foreground break-all">File: {certificate.file}</p>
          <p className="text-xs text-muted-foreground break-all">Preview: {certificate.previewImg || "—"}</p>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Form method="post" className="rounded-xl border p-4 space-y-4" encType="multipart/form-data">
            <input type="hidden" name="intent" value="uploadFiles" />
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">Upload File/Preview</h3>
                <p className="text-xs text-muted-foreground">PDF/Images up to 15MB.</p>
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Uploading..." : "Upload"}
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">File</label>
                <Input type="file" name="file" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Preview Image</label>
                <Input type="file" name="preview" accept="image/*" />
              </div>
            </div>
          </Form>

          <Form method="post" className="rounded-xl border p-4 space-y-4">
            <input type="hidden" name="intent" value="update" />
            <p className="text-xs text-muted-foreground">
              Untuk mengganti file/preview gunakan form upload di atas.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Issued By</label>
                <Input name="issuedBy" defaultValue={certificate.issuedBy ?? ""} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Issued On</label>
                <Input
                  name="issuedOn"
                  type="date"
                  defaultValue={certificate.issuedOn ? certificate.issuedOn.slice(0, 10) : ""}
                />
              </div>
            </div>

            <fieldset className="space-y-4 rounded-xl border p-4">
              <legend className="px-2 text-sm font-semibold text-muted-foreground">English (EN)</legend>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Title</label>
                <Input name="title_en" defaultValue={en.title} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <Textarea name="desc_en" defaultValue={en.description ?? ""} rows={4} />
              </div>
            </fieldset>

            <fieldset className="space-y-4 rounded-xl border p-4">
              <legend className="px-2 text-sm font-semibold text-muted-foreground">Bahasa Indonesia (ID)</legend>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Judul</label>
                <Input name="title_id" defaultValue={id.title} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Deskripsi</label>
                <Textarea name="desc_id" defaultValue={id.description ?? ""} rows={4} />
              </div>
            </fieldset>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Order</label>
              <Input name="order" type="number" min={0} defaultValue={certificate.sortOrder} />
            </div>

            {actionData?.error ? <p className="text-sm text-red-600">{actionData.error}</p> : null}

            <div className="flex justify-end gap-3">
              <Button asChild variant="outline">
                <Link to="/admin/certificates">Batal</Link>
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
