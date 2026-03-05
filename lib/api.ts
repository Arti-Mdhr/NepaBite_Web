import Cookies from "js-cookie";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

type ApiFetchOptions = RequestInit & {
  auth?: boolean;
};

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const token = Cookies.get("token");

  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  // Auto stringify only plain objects
  let body = options.body as any;
  if (body && !isFormData && typeof body !== "string") {
    body = JSON.stringify(body);
  }

  const headers = new Headers(options.headers);

  // Only set JSON header if NOT FormData and Content-Type isn't already set
  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (options.auth && token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    body,
    cache: "no-store",
  });

  const text = await res.text();
  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text; // in case backend returns plain text
  }

  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data as T;
}

export function resolveImageUrl(src?: string) {
  if (!src) return "";
  if (src.startsWith("http") || src.startsWith("data:") || src.startsWith("blob:")) return src;
  return `${API_BASE}${src}`;
}