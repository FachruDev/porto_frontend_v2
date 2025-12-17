import type { ClientActionFunction, ClientLoaderFunction } from "react-router";
import { Form, useActionData, useLoaderData, useNavigation } from "react-router";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { getContactInfo, updateContactInfo, uploadContactCv } from "~/lib/cms/contact";
import type { ContactInformation } from "~/lib/types";

type ActionData = { error?: string; contact?: ContactInformation };

export const clientLoader: ClientLoaderFunction = async () => {
  const contact = await getContactInfo();
  return { contact };
};

export const clientAction: ClientActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "update");

  try {
    if (intent === "uploadCv") {
      const cv = formData.get("cv");
      if (!(cv instanceof File) || cv.size === 0) {
        return { error: "Pilih file CV." };
      }
      const { contact } = await uploadContactCv(cv);
      return { contact };
    }

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phoneNumber = String(formData.get("phoneNumber") ?? "").trim();
    const location = String(formData.get("location") ?? "").trim();
    const cv = String(formData.get("cvUrl") ?? "").trim();

    const contact = await updateContactInfo({
      name: name || undefined,
      email: email || undefined,
      phoneNumber: phoneNumber || undefined,
      location: location || undefined,
      cv: cv || undefined,
    });
    return { contact };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menyimpan contact info.";
    return { error: message };
  }
};

export default function ContactInfoPage() {
  const { contact: loaderContact } = useLoaderData<{ contact: ContactInformation | null }>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const contact = actionData?.contact ?? loaderContact;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Contact Information</h1>
        <p className="text-sm text-muted-foreground">Data kontak singleton untuk landing page.</p>
      </div>

      <Separator />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 space-y-3">
          <h2 className="text-lg font-semibold">Preview</h2>
          <div className="text-sm space-y-2">
            <p><span className="text-muted-foreground text-xs uppercase">Name:</span> {contact?.name || "—"}</p>
            <p><span className="text-muted-foreground text-xs uppercase">Email:</span> {contact?.email || "—"}</p>
            <p><span className="text-muted-foreground text-xs uppercase">Phone:</span> {contact?.phoneNumber || "—"}</p>
            <p><span className="text-muted-foreground text-xs uppercase">Location:</span> {contact?.location || "—"}</p>
            <p className="text-xs text-muted-foreground break-all">
              CV: {contact?.cv ? contact.cv : "Belum ada"}
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Form method="post" className="rounded-xl border p-4 space-y-4" encType="multipart/form-data">
            <input type="hidden" name="intent" value="uploadCv" />
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">Upload CV</h3>
                <p className="text-xs text-muted-foreground">PDF/Doc up to 15MB.</p>
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Uploading..." : "Upload"}
              </Button>
            </div>
            <Input type="file" name="cv" accept=".pdf,.doc,.docx" />
          </Form>

          <Form method="post" className="rounded-xl border p-4 space-y-4">
            <input type="hidden" name="intent" value="update" />
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">Kontak</h3>
                <p className="text-xs text-muted-foreground">Perbarui data kontak</p>
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nama</label>
                <Input name="name" defaultValue={contact?.name ?? ""} placeholder="Nama" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input type="email" name="email" defaultValue={contact?.email ?? ""} placeholder="email@domain.com" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone</label>
                <Input name="phoneNumber" defaultValue={contact?.phoneNumber ?? ""} placeholder="+62..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Location</label>
                <Input name="location" defaultValue={contact?.location ?? ""} placeholder="City, Country" />
              </div>
            </div>
          </Form>

          {actionData?.error ? <p className="text-sm text-red-600">{actionData.error}</p> : null}
        </div>
      </div>
    </div>
  );
}
