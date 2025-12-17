import type { ClientActionFunction } from "react-router";
import { Form, Link, redirect, useActionData, useNavigation } from "react-router";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { createSkill, uploadSkillImage } from "~/lib/cms/skills";
import type { SkillLevel } from "~/lib/types";

type ActionData = { error?: string };
const levels: SkillLevel[] = ["BEGINNER", "MIDDLE", "PROFESSIONAL"];

export const clientAction: ClientActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = String(formData.get("title") ?? "").trim();
  const level = String(formData.get("level") ?? "") as SkillLevel;
  const order = Number(formData.get("order") ?? "0");
  const image = String(formData.get("image") ?? "").trim();
  const imageFile = formData.get("imageFile");

  if (!title || !level) {
    return { error: "Title dan level wajib diisi." };
  }

  try {
    const created = await createSkill({
      title,
      level,
      order: Number.isNaN(order) ? 0 : order,
      image: image || undefined,
    });

    if (imageFile instanceof File && imageFile.size > 0) {
      await uploadSkillImage(created.id, imageFile);
    }

    throw redirect("/admin/skills");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menyimpan skill.";
    return { error: message };
  }
};

export default function SkillNew() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Skill Baru</h1>
          <p className="text-sm text-muted-foreground">Tambah skill dengan level dan order.</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/admin/skills">Kembali</Link>
        </Button>
      </div>

      <Separator />

      <Form method="post" className="grid gap-6 md:grid-cols-2" encType="multipart/form-data">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Title</label>
          <Input name="title" placeholder="React, Node.js, etc." required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Level</label>
          <Select name="level" required>
            <SelectTrigger>
              <SelectValue placeholder="Pilih level" />
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
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Order</label>
          <Input name="order" type="number" min={0} defaultValue={0} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-foreground">Upload Image (opsional)</label>
          <Input type="file" name="imageFile" accept="image/*" />
          <p className="text-xs text-muted-foreground">Jika diisi, file akan diunggah setelah record dibuat.</p>
        </div>

        {actionData?.error ? <p className="text-sm text-red-600 md:col-span-2">{actionData.error}</p> : null}

        <div className="md:col-span-2 flex justify-end gap-3">
          <Button asChild variant="outline">
            <Link to="/admin/skills">Batal</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
