// Server-side (server components, route handlers): must use an absolute URL.
// Client-side (browser): use relative URLs so requests go through Nginx proxy.
const INTERNAL_API = process.env.INTERNAL_API_URL
if (typeof window === "undefined" && !INTERNAL_API) {
  throw new Error("INTERNAL_API_URL is not set — required for server-side calls")
}
const API = typeof window === "undefined"
  ? (INTERNAL_API as string)
  : (process.env.NEXT_PUBLIC_API_URL ?? "")

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export async function apiFetch<T>(
  path: string,
  opts?: RequestInit,
  token?: string,
): Promise<T> {
  const res = await fetch(`${API}/api/v1${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opts?.headers,
    },
    cache: "no-store",
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new ApiError(res.status, err.detail ?? `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

// Raw backend auth call (used by Next.js route handlers)
export async function backendLogin(
  username: string,
  password: string,
): Promise<{ access_token: string; token_type: string; expires_in: number }> {
  const res = await fetch(`${INTERNAL_API}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Login failed" }))
    throw new ApiError(res.status, err.detail ?? "Login failed")
  }
  return res.json()
}

export async function backendVerifierLogin(
  email: string,
  password: string,
): Promise<{ access_token: string; token_type: string; expires_in: number }> {
  const res = await fetch(`${INTERNAL_API}/api/v1/auth/verifier/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Login failed" }))
    throw new ApiError(res.status, err.detail ?? "Login failed")
  }
  return res.json()
}
