import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const INTERNAL_API = process.env.INTERNAL_API_URL
if (!INTERNAL_API) {
  throw new Error("INTERNAL_API_URL is not set — required by /api/auth/logout")
}

/** Revoke a JWT on the backend blacklist (best-effort — don't fail logout if this errors). */
async function revokeToken(token: string): Promise<void> {
  try {
    await fetch(`${INTERNAL_API}/api/v1/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch {
    // Silently ignore network errors — cookie will be cleared regardless
  }
}

export async function POST() {
  const cookieStore = await cookies()
  const adminToken = cookieStore.get("admin_token")?.value
  const verifierToken = cookieStore.get("verifier_token")?.value

  // Revoke both tokens on the backend so they cannot be replayed before expiry
  const revocations: Promise<void>[] = []
  if (adminToken) revocations.push(revokeToken(adminToken))
  if (verifierToken) revocations.push(revokeToken(verifierToken))
  await Promise.allSettled(revocations)

  const res = NextResponse.json({ success: true })
  res.cookies.set("admin_token", "", { httpOnly: true, maxAge: 0, path: "/" })
  res.cookies.set("verifier_token", "", { httpOnly: true, maxAge: 0, path: "/" })
  return res
}
