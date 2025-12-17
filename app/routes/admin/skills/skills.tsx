import type { ClientActionFunction, ClientLoaderFunction } from "react-router";
import { Form, Link, useLoaderData, useNavigation } from "react-router";

import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { deleteSkill, listSkills } from "~/lib/cms/skills";
import type { Skill } from "~/lib/types";

export const clientLoader: ClientLoaderFunction = async () => {
  const skills = await listSkills();
  return { skills };
};

export const clientAction: ClientActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const intent = String(formData.get("intent"));
  const id = Number(formData.get("id"));
  if (intent === "delete" && id) {
    await deleteSkill(id);
  }
  return null;
};

export default function SkillsPage() {
  const { skills } = useLoaderData<{ skills: Skill[] }>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Skills</h1>
          <p className="text-sm text-muted-foreground">Kelola skills dengan level & order.</p>
        </div>
        <Button asChild>
          <Link to="/admin/skills/new">Tambah Skill</Link>
        </Button>
      </div>

      <Separator />

      <div className="overflow-hidden rounded-xl border bg-card">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Order</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Title</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Level</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Image</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {skills.map((skill) => (
              <tr key={skill.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 text-sm">{skill.sortOrder}</td>
                <td className="px-4 py-3 text-sm font-medium">{skill.title}</td>
                <td className="px-4 py-3 text-sm">{skill.level}</td>
                <td className="px-4 py-3 text-sm">
                  {skill.image ? <img src={skill.image} alt={skill.title} className="h-8 w-8 object-contain" /> : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/admin/skills/${skill.id}`}>Edit</Link>
                    </Button>
                    <Form method="post">
                      <input type="hidden" name="intent" value="delete" />
                      <input type="hidden" name="id" value={skill.id} />
                      <Button
                        size="sm"
                        variant="destructive"
                        type="submit"
                        disabled={isSubmitting}
                        onClick={(e) => {
                          if (!confirm("Hapus skill ini?")) e.preventDefault();
                        }}
                      >
                        Hapus
                      </Button>
                    </Form>
                  </div>
                </td>
              </tr>
            ))}
            {skills.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-muted-foreground">
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
