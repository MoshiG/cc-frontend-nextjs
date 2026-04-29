import type { Metadata } from "next"
import { cookies } from "next/headers"
import "./globals.css"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { CookieBanner } from "@/components/CookieBanner"
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: "MyChetiChain — Blockchain Academic Certificates",
  description:
    "Tamper-proof, soul-bound academic certificate management on Hyperledger FireFly",
}

function decodeJwtSub(token: string): string | null {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString())
    return (payload.sub as string) ?? null
  } catch {
    return null
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const adminToken = cookieStore.get("admin_token")?.value
  const verifierToken = cookieStore.get("verifier_token")?.value

  const isAdmin = !!adminToken
  const isVerifier = !!verifierToken
  const username = adminToken
    ? decodeJwtSub(adminToken)
    : verifierToken
      ? decodeJwtSub(verifierToken)
      : null

  return (
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen">
        <Navbar isAdmin={isAdmin} isVerifier={isVerifier} username={username ?? undefined} />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  )
}
