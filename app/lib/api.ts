import { clearToken, getToken } from "./auth";

type ApiOptions = {
  method?: string;
  body?: Record<string, unknown> | FormData;
  auth?: boolean;
  headers?: HeadersInit;
};

const baseUrl = import.meta.env.VITE_API_URL;

const buildHeaders = (opts: ApiOptions) => {
  const headers = new Headers(opts.headers);

  const hasJsonBody = opts.body && !(opts.body instanceof FormData);
  if (hasJsonBody) {
    headers.set("Content-Type", "application/json");
  }

  const token = opts.auth ? getToken() : null;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
};

export async function apiFetch<T = unknown>(path: string, opts: ApiOptions = {}) {
  if (!baseUrl) {
    throw new Error("Missing VITE_API_URL");
  }

  const headers = buildHeaders(opts);
  const response = await fetch(`${baseUrl}${path}`, {
    method: opts.method ?? "GET",
    headers,
    body:
      opts.body instanceof FormData
        ? opts.body
        : opts.body
          ? JSON.stringify(opts.body)
          : undefined,
  });

  if (response.status === 204) {
    return null as T;
  }

  const contentType = response.headers.get("content-type");
  const payload = contentType?.includes("application/json")
    ? await response.json().catch(() => null)
    : await response.text().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      clearToken();
    }
    const message =
      (payload && typeof payload === "object" && "message" in payload && (payload as { message?: string }).message) ||
      (typeof payload === "string" ? payload : response.statusText);
    throw new Error(message || "Request failed");
  }

  return payload as T;
}
