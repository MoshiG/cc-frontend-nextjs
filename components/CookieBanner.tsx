"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

const STORAGE_KEY = "cookie_consent"

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Only show banner if the user hasn't dismissed it before
    if (typeof window !== "undefined" && !localStorage.getItem(STORAGE_KEY)) {
      setVisible(true)
    }
  }, [])

  function dismiss() {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, "accepted")
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie notice"
      className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-lg"
    >
      <div className="container mx-auto max-w-5xl px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <p className="text-sm text-muted-foreground flex-1">
          We use strictly necessary session cookies for admin and employer
          authentication. No tracking or advertising cookies are used.{" "}
          <Link href="/privacy#cookies" className="underline hover:text-foreground transition-colors">
            Learn more
          </Link>
          .
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={dismiss}
          className="shrink-0 flex items-center gap-1.5"
        >
          <X className="h-3.5 w-3.5" />
          Got it
        </Button>
      </div>
    </div>
  )
}
