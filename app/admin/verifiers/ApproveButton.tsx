"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ApproveButton({ verifierId, email }: { verifierId: string; email: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function approve() {
    if (!confirm(`Approve verifier ${email}?`)) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/proxy/auth/verifier/${verifierId}/approve`, {
        method: "POST",
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Approval failed" }))
        throw new Error(err.detail ?? "Approval failed")
      }
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Approval failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button size="sm" onClick={approve} disabled={loading}>
        <Check className="h-3.5 w-3.5 mr-1" />
        {loading ? "Approving…" : "Approve"}
      </Button>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  )
}
