import type { ClientActionFunction, ClientLoaderFunction } from "react-router";
import { Form, useActionData, useLoaderData, useNavigation } from "react-router";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { apiFetch } from "~/lib/api";
import type { Hero, Locale } from "~/lib/types";

type ActionData = { error?: string; hero?: Hero };

const pick = (hero: Hero, locale: Locale) =>
  hero.translations.find((t) => t.locale === locale) ?? { locale, title: "", subtitle: "" };

export const clientLoader: ClientLoaderFunction = async () => {
  const hero = await apiFetch<Hero | Hero[] | Record<string, never> | null>("/cms/heroes");
  if (Array.isArray(hero)) {
    return { hero: hero[0] ?? null };
  }
  return { hero: hero && "translations" in hero ? (hero as Hero) : null };
};

export const clientAction: ClientActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const titleEn = String(formData.get("title_en") ?? "").trim();
  const subtitleEn = String(formData.get("subtitle_en") ?? "").trim();
  const titleId = String(formData.get("title_id") ?? "").trim();
  const subtitleId = String(formData.get("subtitle_id") ?? "").trim();

  if (!titleEn || !titleId) {
    return { error: "Judul EN dan ID wajib diisi." };
  }

  try {
    const updated = await apiFetch<Hero>(`/cms/heroes`, {
      method: "PUT",
      auth: true,
      body: {
        translations: [
          { locale: "EN", title: titleEn, subtitle: subtitleEn || undefined },
          { locale: "ID", title: titleId, subtitle: subtitleId || undefined },
        ],
      },
    });
    return { hero: updated };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memperbarui hero.";
    return { error: message };
  }
};

export default function HeroesPage() {
  const { hero: loaderHero } = useLoaderData<{ hero: Hero | null }>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const hero = actionData?.hero ?? loaderHero;
  const en = hero ? pick(hero, "EN") : null;
  const id = hero ? pick(hero, "ID") : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Hero Section</h1>
          <p className="text-sm text-muted-foreground">
            Satu hero saja. Edit copy EN &amp; ID lalu simpan.
          </p>
        </div>
      </div>

      <Separator />

      {!hero ? (
        <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
          Belum ada hero. Isi form di bawah untuk membuatnya pertama kali.
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 lg:col-span-1 space-y-3">
          <h2 className="text-lg font-semibold">Preview</h2>
          <div className="space-y-2 text-sm">
            <div>
              <p className="text-xs uppercase text-muted-foreground">EN</p>
              <p className="font-medium">{en?.title || "—"}</p>
              <p className="text-muted-foreground">{en?.subtitle || "—"}</p>
            </div>
            <Separator />
            <div>
              <p className="text-xs uppercase text-muted-foreground">ID</p>
              <p className="font-medium">{id?.title || "—"}</p>
              <p className="text-muted-foreground">{id?.subtitle || "—"}</p>
            </div>
            <Separator />
            {hero?.updatedAt ? (
              <p className="text-xs text-muted-foreground">
                Last updated: {new Date(hero.updatedAt).toLocaleString()}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">Belum pernah disimpan.</p>
            )}
          </div>
        </div>

        <Form method="post" className="lg:col-span-2 grid gap-6">
          <fieldset className="space-y-4 rounded-xl border p-4">
            <legend className="px-2 text-sm font-semibold text-muted-foreground">English (EN)</legend>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Title</label>
              <Input name="title_en" defaultValue={en?.title ?? ""} placeholder="Bold headline" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Subtitle</label>
              <Input name="subtitle_en" defaultValue={en?.subtitle ?? ""} placeholder="Supportive subtitle" />
            </div>
          </fieldset>

          <fieldset className="space-y-4 rounded-xl border p-4">
            <legend className="px-2 text-sm font-semibold text-muted-foreground">Bahasa Indonesia (ID)</legend>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Judul</label>
              <Input name="title_id" defaultValue={id?.title ?? ""} placeholder="Judul utama" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Subjudul</label>
              <Input name="subtitle_id" defaultValue={id?.subtitle ?? ""} placeholder="Subjudul pendukung" />
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
