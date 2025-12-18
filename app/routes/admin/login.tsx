import type { ClientActionFunction, ClientLoaderFunction } from "react-router";
import { Form, redirect, useActionData, useNavigation } from "react-router";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { apiFetch } from "~/lib/api";
import { isAuthenticated, setToken, setUser } from "~/lib/auth";

type ActionError = { error?: string };

export const clientLoader: ClientLoaderFunction = () => {
  if (isAuthenticated()) {
    throw redirect("/admin/heroes");
  }
  return null;
};

export const clientAction: ClientActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  try {
    const result = await apiFetch<{ token: string; user: { id: number; name?: string; email: string; bio?: string; profile?: string | null } }>("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    setUser(result.user);
    setToken(result.token);
    throw redirect("/admin/heroes");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login gagal.";
    return { error: message };
  }
};

export default function Login() {
  const actionData = useActionData<ActionError>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white/70 p-8 shadow-xl backdrop-blur">
        <div className="mb-8 text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white font-bold">
            CMS
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Masuk Admin</h1>
            <p className="text-sm text-gray-500">Kelola konten portofolio kamu.</p>
          </div>
        </div>

        <Form method="post" className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <Input type="email" name="email" placeholder="you@example.com" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <Input type="password" name="password" placeholder="••••••••" required />
          </div>
          {actionData?.error ? <p className="text-sm text-red-600">{actionData.error}</p> : null}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Memproses..." : "Masuk"}
          </Button>
        </Form>
      </div>
    </div>
  );
}
