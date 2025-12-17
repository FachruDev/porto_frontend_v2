import type { ClientActionFunction } from "react-router";
import { Form, Link, redirect, useActionData, useNavigation } from "react-router";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { createCertificate, uploadCertificateFiles } from "~/lib/cms/certificates";

type ActionData = { error?: string };

export const clientAction: ClientActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const fileUrl = ""; // force upload flow
  const previewImg = "";
  const issuedBy = String(formData.get("issuedBy") ?? "").trim();
  const issuedOn = String(formData.get("issuedOn") ?? "").trim();
  const order = Number(formData.get("order") ?? "0");
  const titleEn = String(formData.get("title_en") ?? "").trim();
  const descEn = String(formData.get("desc_en") ?? "").trim();
  const titleId = String(formData.get("title_id") ?? "").trim();
  const descId = String(formData.get("desc_id") ?? "").trim();
  const fileFile = formData.get("fileUpload");
  const previewFile = formData.get("previewUpload");

  if (!(fileFile instanceof File) || fileFile.size === 0 || !titleEn || !titleId) {
    return { error: "Upload file wajib dan judul EN/ID wajib diisi." };
  }

  try {
    const created = await createCertificate({
      file: fileUrl || "uploading...",
      previewImg: previewImg || undefined,
      issuedBy: issuedBy || undefined,
      issuedOn: issuedOn || undefined,
      order: Number.isNaN(order) ? 0 : order,
      translations: [
        { locale: "EN", title: titleEn, description: descEn || undefined },
        { locale: "ID", title: titleId, description: descId || undefined },
      ],
    });
    await uploadCertificateFiles(created.id, {
      file: fileFile,
      preview: previewFile instanceof File && previewFile.size > 0 ? previewFile : null,
    });
    throw redirect("/admin/certificates");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menyimpan certificate.";
    return { error: message };
  }
};

export default function CertificateNew() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Certificate Baru</h1>
          <p className="text-sm text-muted-foreground">Tambahkan sertifikat baru.</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/admin/certificates">Kembali</Link>
        </Button>
      </div>

      <Separator />

      <Form method="post" className="grid gap-6 md:grid-cols-2" encType="multipart/form-data">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Upload File</label>
          <Input type="file" name="fileUpload" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Upload Preview Image</label>
          <Input type="file" name="previewUpload" accept="image/*" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Issued By</label>
          <Input name="issuedBy" placeholder="Issuer" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Issued On</label>
          <Input name="issuedOn" type="date" />
        </div>

        <fieldset className="space-y-4 rounded-xl border p-4">
          <legend className="px-2 text-sm font-semibold text-muted-foreground">English (EN)</legend>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Title</label>
            <Input name="title_en" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description</label>
            <Textarea name="desc_en" rows={4} />
          </div>
        </fieldset>

        <fieldset className="space-y-4 rounded-xl border p-4">
          <legend className="px-2 text-sm font-semibold text-muted-foreground">Bahasa Indonesia (ID)</legend>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Judul</label>
            <Input name="title_id" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Deskripsi</label>
            <Textarea name="desc_id" rows={4} />
          </div>
        </fieldset>

        <div>
          <label className="text-sm font-medium text-foreground">Order</label>
          <Input name="order" type="number" min={0} defaultValue={0} />
        </div>

        {actionData?.error ? <p className="text-sm text-red-600 md:col-span-2">{actionData.error}</p> : null}

        <div className="md:col-span-2 flex justify-end gap-3">
          <Button asChild variant="outline">
            <Link to="/admin/certificates">Batal</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
