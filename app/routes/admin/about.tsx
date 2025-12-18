import type { ClientActionFunction, ClientLoaderFunction } from "react-router";
import { Form, useActionData, useLoaderData, useNavigation } from "react-router";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { getAbout, updateAbout, uploadAboutProfile } from "~/lib/cms/about";
import type { About, Locale } from "~/lib/types";

type ActionData = { error?: string; about?: About };

const pick = (about: About, locale: Locale) =>
  about.translations.find((t) => t.locale === locale) ?? { locale, title: "", content: "" };

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const clientLoader: ClientLoaderFunction = async () => {
  const about = await getAbout();
  return { about };
};

export const clientAction: ClientActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const profileFile = formData.get("profileFile");

  console.log("[About] FormData entries:", Array.from(formData.entries()).map(([k, v]) => 
    [k, v instanceof File ? `File: ${v.name}, ${v.size}b, ${v.type}` : v]
  ));
  console.log("[About] profileFile raw:", profileFile);
  console.log("[About] profileFile instanceof File:", profileFile instanceof File);
  console.log("[About] profileFile?.constructor.name:", profileFile?.constructor?.name);

  const titleEn = String(formData.get("title_en") ?? "").trim();
  const contentEn = String(formData.get("content_en") ?? "").trim();
  const titleId = String(formData.get("title_id") ?? "").trim();
  const contentId = String(formData.get("content_id") ?? "").trim();

  if (!titleEn || !titleId || !contentEn || !contentId) {
    return { error: "Semua field judul & konten EN/ID wajib diisi." };
  }

  try {
    let profileFileDataUrl: string | undefined;

    // Convert file to base64 data URL if uploaded
    if (profileFile instanceof File && profileFile.size > 0) {
      console.log("[About] Converting file:", {
        name: profileFile.name,
        size: profileFile.size,
        type: profileFile.type,
      });
      profileFileDataUrl = await fileToDataUrl(profileFile);
      console.log("[About] Converted to data URL:", profileFileDataUrl.substring(0, 100));
    } else {
      console.log("[About] No file to upload, profileFile:", profileFile);
    }

    console.log("[About] Sending payload:", {
      hasProfileFile: !!profileFileDataUrl,
      profileFileLength: profileFileDataUrl?.length,
    });

    const updated = await updateAbout({
      profileFile: profileFileDataUrl,
      translations: [
        { locale: "EN", title: titleEn, content: contentEn },
        { locale: "ID", title: titleId, content: contentId },
      ],
    });
    return { about: updated };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menyimpan about.";
    return { error: message };
  }
};

export default function AboutPage() {
  const { about: loaderAbout } = useLoaderData<{ about: About | null }>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const about = actionData?.about ?? loaderAbout;
  const en = about ? pick(about, "EN") : null;
  const id = about ? pick(about, "ID") : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">About</h1>
        <p className="text-sm text-muted-foreground">Konten about bersifat singleton. Edit EN &amp; ID.</p>
      </div>

      <Separator />

      {!about ? (
        <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
          About belum tersedia. Simpan untuk membuat data pertama.
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold">Preview</h2>
          {about?.profile ? (
            <div className="text-sm space-y-2">
              <p className="text-xs uppercase text-muted-foreground mb-1">Profile</p>
              <img
                src={about.profile}
                alt="Profile"
                className="h-32 w-32 rounded-lg object-cover border"
              />
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Belum ada foto profil.</p>
          )}
          <Separator />
          <div className="text-sm space-y-3">
            <div>
              <p className="text-xs uppercase text-muted-foreground">EN</p>
              <p className="font-semibold">{en?.title}</p>
              <p className="text-muted-foreground whitespace-pre-wrap">{en?.content}</p>
            </div>
            <Separator />
            <div>
              <p className="text-xs uppercase text-muted-foreground">ID</p>
              <p className="font-semibold">{id?.title}</p>
              <p className="text-muted-foreground whitespace-pre-wrap">{id?.content}</p>
            </div>
          </div>
          {about?.updatedAt ? (
            <>
              <Separator />
              <p className="text-xs text-muted-foreground">
                Last updated: {new Date(about.updatedAt).toLocaleString()}
              </p>
            </>
          ) : null}
        </div>

        <Form method="post" encType="multipart/form-data" className="lg:col-span-2 grid gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Profile Image</label>
            <Input type="file" name="profileFile" accept="image/*" />
            <p className="text-xs text-muted-foreground">
              Upload image untuk mengganti avatar. Biarkan kosong untuk mempertahankan yang lama.
            </p>
          </div>

          <fieldset className="space-y-4 rounded-xl border p-4">
            <legend className="px-2 text-sm font-semibold text-muted-foreground">English (EN)</legend>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Title</label>
              <Input name="title_en" defaultValue={en?.title ?? ""} placeholder="About me" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Content</label>
              <Textarea
                name="content_en"
                defaultValue={en?.content ?? ""}
                placeholder="Write your story..."
                required
                rows={6}
              />
            </div>
          </fieldset>

          <fieldset className="space-y-4 rounded-xl border p-4">
            <legend className="px-2 text-sm font-semibold text-muted-foreground">Bahasa Indonesia (ID)</legend>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Judul</label>
              <Input name="title_id" defaultValue={id?.title ?? ""} placeholder="Tentang saya" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Konten</label>
              <Textarea
                name="content_id"
                defaultValue={id?.content ?? ""}
                placeholder="Tuliskan cerita kamu..."
                required
                rows={6}
              />
            </div>
          </fieldset>

          {actionData?.error ? <p className="text-sm text-red-600">{actionData.error}</p> : null}

          <div className="flex justify-end gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
