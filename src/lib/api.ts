// src/lib/api.ts
// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for the API base URL.
// VITE_API_URL = http://localhost:5000  (no trailing slash, no /api)
// All fetch calls must use:  apiFetch("/students")  → http://localhost:5000/api/students
// ─────────────────────────────────────────────────────────────────────────────

export const BASE = (import.meta.env.VITE_API_URL ?? "http://localhost:5000").replace(/\/$/, "");
export const API  = `${BASE}/api`;

export function getToken(key = "token") {
  return localStorage.getItem(key);
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
  tokenKey = "token"
) {
  const token = getToken(tokenKey);
  const res = await fetch(`${API}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Request failed");
  return data;
}
