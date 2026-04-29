/**
 * Catch-all authenticated proxy.
 * Client components call /api/proxy/<path> instead of /api/v1/<path>.
 * This route handler reads the httpOnly auth cookie and forwards the
 * Bearer token to the backend, which browser JS cannot do directly.
 */
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const BACKEND = process.env.INTERNAL_API_URL || "http://192.168.2.8:8000"

async function proxy(req: NextRequest, params: Promise<{ path: string[] }>) {
  try {
    const { path } = await params
    const backendPath = path.join("/")
    const search = req.nextUrl.search

    const cookieStore = await cookies()
    const token =
      cookieStore.get("admin_token")?.value ??
      cookieStore.get("verifier_token")?.value

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }
    if (token) headers["Authorization"] = `Bearer ${token}`

    const body = ["GET", "HEAD"].includes(req.method) ? undefined : await req.text()

    const res = await fetch(`${BACKEND}/api/v1/${backendPath}${search}`, {
      method: req.method,
      headers,
      body,
    })

    // Parse the backend response based on content type
    const contentType = res.headers.get("Content-Type") ?? ""
    if (contentType.includes("application/json")) {
      const json = await res.json()
      return NextResponse.json(json, { status: res.status })
    }
    // Return binary responses (images, etc.) correctly
    if (contentType.startsWith("image/") || contentType.includes("octet-stream")) {
      const arrayBuffer = await res.arrayBuffer()
      return new NextResponse(Buffer.from(arrayBuffer), {
        status: res.status,
        headers: { "Content-Type": contentType },
      })
    }
    const text = await res.text()
    return new NextResponse(text, { status: res.status })

  } catch (err) {
    console.error("[proxy] error:", err)
    return NextResponse.json(
      { detail: err instanceof Error ? err.message : "Proxy error" },
      { status: 502 },
    )
  }
}

export const GET = (req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) => proxy(req, params)
export const POST = (req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) => proxy(req, params)
export const PUT = (req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) => proxy(req, params)
export const DELETE = (req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) => proxy(req, params)
export const PATCH = (req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) => proxy(req, params)
