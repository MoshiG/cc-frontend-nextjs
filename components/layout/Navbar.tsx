"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ShieldCheck, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NavbarProps {
  isAdmin?: boolean
  isVerifier?: boolean
  username?: string
}

export function Navbar({ isAdmin, isVerifier, username }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
    router.refresh()
  }

  const links = [
    { href: "/", label: "Home" },
    { href: "/verify", label: "Verify" },
    { href: "/verifier", label: "Employer Portal" },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
          <ShieldCheck className="h-5 w-5" />
          MyChetiChain
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === l.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              {l.label}
            </Link>
          ))}
          {(isAdmin || isVerifier) && (
            <div className="flex items-center gap-3">
              {username && (
                <span className="text-xs text-muted-foreground font-mono border rounded px-2 py-0.5">
                  {username}
                </span>
              )}
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t bg-background px-4 py-3 flex flex-col gap-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium"
            >
              {l.label}
            </Link>
          ))}
          {(isAdmin || isVerifier) && (
            <div className="flex flex-col gap-2">
              {username && (
                <span className="text-xs text-muted-foreground font-mono">Logged in as: {username}</span>
              )}
              <button onClick={handleLogout} className="text-sm text-left text-destructive">
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
