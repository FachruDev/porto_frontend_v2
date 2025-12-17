import type { ClientActionFunction, ClientLoaderFunction } from "react-router";
import { Form, Link, redirect, useActionData, useLoaderData, useNavigation } from "react-router";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { listSkills, updateSkill, uploadSkillImage } from "~/lib/cms/skills";
import type { Skill, SkillLevel } from "~/lib/types";

type LoaderData = { skill: Skill };
type ActionData = { error?: string; skill?: Skill };
const levels: SkillLevel[] = ["BEGINNER", "MIDDLE", "PROFESSIONAL"];

export const clientLoader: ClientLoaderFunction = async ({ params }) => {
  const id = Number(params.id);
  if (!id) throw redirect("/admin/skills");
  const skills = await listSkills();
  const skill = skills.find((s) => s.id === id);
  if (!skill) throw redirect("/admin/skills");
  return { skill };
};

export const clientAction: ClientActionFunction = async ({ request, params }) => {
  const id = Number(params.id);
  if (!id) throw redirect("/admin/skills");
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "update");

  try {
    if (intent === "uploadImage") {
      const file = formData.get("image");
      if (!(file instanceof File) || file.size === 0) {
        return { error: "Pilih file image." };
      }
      const skill = await uploadSkillImage(id, file);
      return { skill };
    }

    const title = String(formData.get("title") ?? "").trim();
    const level = String(formData.get("level") ?? "") as SkillLevel;
    const order = Number(formData.get("order") ?? "0");
    if (!title || !level) {
      return { error: "Title dan level wajib diisi." };
    }

    const skill = await updateSkill(id, {
      title,
      level,
      order: Number.isNaN(order) ? undefined : order,
    });
    return { skill };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memperbarui skill.";
    return { error: message };
  }
};

export default function SkillEdit() {
  const { skill: loaderSkill } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const skill = actionData?.skill ?? loaderSkill;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Edit Skill</h1>
          <p className="text-sm text-muted-foreground">Perbarui skill.</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/admin/skills">Kembali</Link>
        </Button>
      </div>

      <Separator />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 space-y-3">
          <h2 className="text-lg font-semibold">Preview</h2>
          {skill.image ? (
            <img src={skill.image} alt={skill.title} className="h-16 w-16 object-contain rounded border" />
          ) : (
            <p className="text-xs text-muted-foreground">Belum ada gambar.</p>
          )}
          <p className="text-sm font-medium">{skill.title}</p>
          <p className="text-xs text-muted-foreground">Level: {skill.level}</p>
          <p className="text-xs text-muted-foreground">Order: {skill.sortOrder}</p>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Form method="post" className="rounded-xl border p-4 space-y-4" encType="multipart/form-data">
            <input type="hidden" name="intent" value="uploadImage" />
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">Upload Image</h3>
                <p className="text-xs text-muted-foreground">PNG/JPG up to 5MB.</p>
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Uploading..." : "Upload"}
              </Button>
            </div>
            <Input type="file" name="image" accept="image/*" />
          </Form>

          <Form method="post" className="rounded-xl border p-4 space-y-4">
            <input type="hidden" name="intent" value="update" />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Title</label>
                <Input name="title" defaultValue={skill.title} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Level</label>
                <Select name="level" defaultValue={skill.level} required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((lvl) => (
                      <SelectItem key={lvl} value={lvl}>
                        {lvl}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Order</label>
              <Input name="order" type="number" min={0} defaultValue={skill.sortOrder} />
            </div>

            {actionData?.error ? <p className="text-sm text-red-600">{actionData.error}</p> : null}

            <div className="flex justify-end gap-3">
              <Button asChild variant="outline">
                <Link to="/admin/skills">Batal</Link>
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
