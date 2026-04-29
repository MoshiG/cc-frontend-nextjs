import { NextRequest, NextResponse } from "next/server"
import { backendVerifierLogin } from "@/lib/api"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    const data = await backendVerifierLogin(email, password)

    const res = NextResponse.json({ success: true, role: "verifier" })
    res.cookies.set("verifier_token", data.access_token, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      path: "/",
      maxAge: data.expires_in ?? 3600,
    })
    return res
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Login failed"
    return NextResponse.json({ error: message }, { status: 401 })
  }
}
