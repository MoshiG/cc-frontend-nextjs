import { NextRequest, NextResponse } from "next/server"
import { backendLogin } from "@/lib/api"

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()
    const data = await backendLogin(username, password)

    const res = NextResponse.json({ success: true, role: "admin" })
    res.cookies.set("admin_token", data.access_token, {
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
