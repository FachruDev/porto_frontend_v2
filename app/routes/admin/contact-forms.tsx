import type { ClientLoaderFunction } from "react-router";
import { useLoaderData } from "react-router";

import { Separator } from "~/components/ui/separator";
import type { ContactForm } from "~/lib/types";
import { listContactForms } from "~/lib/contactForms";
import { Button } from "~/components/ui/button";

type LoaderData = { forms: ContactForm[] };

export const clientLoader: ClientLoaderFunction = async () => {
  const forms = await listContactForms();
  return { forms };
};

export default function ContactFormsPage() {
  const { forms } = useLoaderData<LoaderData>();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Contact Forms</h1>
          <p className="text-sm text-muted-foreground">Pesan yang masuk dari landing page.</p>
        </div>
        <Button variant="outline" asChild>
          <a href="#contact-section">Lihat section</a>
        </Button>
      </div>

      <Separator />

      <div className="overflow-hidden rounded-xl border bg-card">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Nama</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Subject</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Message</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Tanggal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {forms.map((form) => (
              <tr key={form.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 text-sm font-medium">{form.name}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{form.email}</td>
                <td className="px-4 py-3 text-sm">{form.subject || "-"}</td>
                <td className="px-4 py-3 text-sm max-w-xl whitespace-pre-wrap text-muted-foreground">
                  {form.description}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {new Date(form.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {forms.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-muted-foreground">
                  Belum ada pesan.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
