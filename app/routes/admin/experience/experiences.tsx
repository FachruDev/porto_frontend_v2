import type { ClientActionFunction, ClientLoaderFunction } from "react-router";
import { Form, Link, useLoaderData, useNavigation } from "react-router";

import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { listExperiences, deleteExperience } from "~/lib/cms/experiences";
import type { Experience, Locale } from "~/lib/types";

const pick = (experience: Experience, locale: Locale) =>
  experience.translations.find((t) => t.locale === locale) ?? { locale, title: "", description: "" };

export const clientLoader: ClientLoaderFunction = async () => {
  const experiences = await listExperiences();
  return { experiences };
};

export const clientAction: ClientActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const intent = String(formData.get("intent"));
  const id = Number(formData.get("id"));
  if (intent === "delete" && id) {
    await deleteExperience(id);
  }
  return null;
};

export default function ExperiencesPage() {
  const { experiences } = useLoaderData<{ experiences: Experience[] }>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Experiences</h1>
          <p className="text-sm text-muted-foreground">Kelola daftar pengalaman (multi record).</p>
        </div>
        <Button asChild>
          <Link to="/admin/experiences/new">Tambah Experience</Link>
        </Button>
      </div>

      <Separator />

      <div className="overflow-hidden rounded-xl border bg-card">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Order</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Institution</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Years</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Title (EN)</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Title (ID)</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {experiences.map((item) => {
              const en = pick(item, "EN");
              const id = pick(item, "ID");
              return (
                <tr key={item.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm">{item.sortOrder}</td>
                  <td className="px-4 py-3 text-sm font-medium">{item.institution}</td>
                  <td className="px-4 py-3 text-sm">{item.years}</td>
                  <td className="px-4 py-3 text-sm">{en.title}</td>
                  <td className="px-4 py-3 text-sm">{id.title}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link to={`/admin/experiences/${item.id}`}>Edit</Link>
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
                            if (!confirm("Hapus experience ini?")) e.preventDefault();
                          }}
                        >
                          Hapus
                        </Button>
                      </Form>
                    </div>
                  </td>
                </tr>
              );
            })}
            {experiences.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-sm text-muted-foreground">
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
