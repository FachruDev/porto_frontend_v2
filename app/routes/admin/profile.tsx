import type { ClientActionFunction, ClientLoaderFunction } from "react-router";
import { Form, useActionData, useLoaderData, useNavigation } from "react-router";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { getMe, updateMe, uploadMyProfile } from "~/lib/users";
import { setUser } from "~/lib/auth";

type LoaderData = { user?: { name?: string | null; email?: string | null; bio?: string | null; profile?: string | null }; error?: string };
type ActionData = { error?: string; success?: string; user?: LoaderData["user"] };

export const clientLoader: ClientLoaderFunction = async () => {
  try {
    const user = await getMe();
    return { user };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memuat data profil.";
    return { user: undefined, error: message };
  }
};

export const clientAction: ClientActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "update");

  try {
    if (intent === "uploadProfile") {
      const file = formData.get("profileFile");
      if (!(file instanceof File) || file.size === 0) {
        return { error: "Pilih file gambar untuk avatar." };
      }
      const updated = await uploadMyProfile(file);
      setUser(updated);
      return { user: updated, success: "Foto profil diperbarui." };
    }

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const bio = String(formData.get("bio") ?? "").trim();
    const password = String(formData.get("password") ?? "").trim();

    if (!name || !email) {
      return { error: "Nama dan email wajib diisi." };
    }

    const updated = await updateMe({
      name,
      email,
      bio: bio || undefined,
      password: password || undefined,
    });
    setUser(updated);
    return { user: updated, success: "Profil berhasil diperbarui." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memperbarui profil.";
    return { error: message };
  }
};

export default function ProfilePage() {
  const { user: loaderUser, error: loadError } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const user = actionData?.user ?? loaderUser;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Profil Akun</h1>
        <p className="text-sm text-muted-foreground">Perbarui informasi akun kamu.</p>
      </div>

      <Separator />

      {loadError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {loadError}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Foto Profil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-3">
              <div className="h-32 w-32 overflow-hidden rounded-full border bg-muted">
                {user?.profile ? (
                  <img src={user.profile} alt={user?.name ?? ""} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Upload gambar baru untuk avatar (maks 5MB, JPG/PNG/WebP).
              </p>
            </div>
            <Form method="post" encType="multipart/form-data" className="space-y-3">
              <input type="hidden" name="intent" value="uploadProfile" />
              <Input type="file" name="profileFile" accept="image/*" />
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Mengunggah..." : "Upload"}
                </Button>
              </div>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detail Akun</CardTitle>
          </CardHeader>
          <CardContent>
            <Form method="post" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Nama</label>
                  <Input name="name" defaultValue={user?.name ?? ""} placeholder="Nama lengkap" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <Input name="email" type="email" defaultValue={user?.email ?? ""} placeholder="you@example.com" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Bio</label>
                <Textarea name="bio" defaultValue={user?.bio ?? ""} placeholder="Tuliskan bio singkat" rows={3} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password Baru (opsional)</label>
                <Input name="password" type="password" placeholder="Biarkan kosong jika tidak berubah" />
              </div>

              {actionData?.error ? (
                <p className="text-sm text-destructive">{actionData.error}</p>
              ) : null}
              {actionData?.success ? (
                <p className="text-sm text-green-600">{actionData.success}</p>
              ) : null}

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
