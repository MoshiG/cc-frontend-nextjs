import { NextRequest, NextResponse } from "next/server"

const ADMIN_PATHS = [
  "/admin/dashboard",
  "/admin/universities",
  "/admin/students",
  "/admin/certificates",
  "/admin/verifiers",
  "/admin/audit-log",
]

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname

  const isAdminProtected = ADMIN_PATHS.some((p) => path.startsWith(p))
  if (isAdminProtected) {
    const token = req.cookies.get("admin_token")
    if (!token) {
      return NextResponse.redirect(new URL("/admin", req.url))
    }
  }

  if (path.startsWith("/verifier/dashboard")) {
    const token = req.cookies.get("verifier_token")
    if (!token) {
      return NextResponse.redirect(new URL("/verifier", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/admin/universities/:path*",
    "/admin/students/:path*",
    "/admin/certificates/:path*",
    "/admin/verifiers/:path*",
    "/admin/audit-log/:path*",
    "/verifier/dashboard/:path*",
  ],
}
