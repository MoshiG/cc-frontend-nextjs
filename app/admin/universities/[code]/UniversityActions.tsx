"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Props {
  code: string
  isActive: boolean
  token: string
}

export function UniversityActions({ code, isActive, token }: Props) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  // Update accreditation
  const accredSchema = z.object({
    new_registration_number: z.string().min(3),
    reason: z.string().min(3),
  })
  const { register: regAccred, handleSubmit: submitAccred, formState: { errors: errAccred } } = useForm({
    resolver: zodResolver(accredSchema),
  })
  const [accredLoading, setAccredLoading] = useState(false)

  // Deactivate
  const [deactivateOpen, setDeactivateOpen] = useState(false)
  const [deactivateReason, setDeactivateReason] = useState("")
  const [deactivateLoading, setDeactivateLoading] = useState(false)

  async function handleUpdateAccreditation(values: { new_registration_number: string; reason: string }) {
    setAccredLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/v1/universities/${code}/accreditation`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Update failed" }))
        throw new Error(err.detail)
      }
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Update failed")
    } finally {
      setAccredLoading(false)
    }
  }

  async function handleDeactivate() {
    setDeactivateLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/v1/universities/${code}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: deactivateReason }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Deactivation failed" }))
        throw new Error(err.detail)
      }
      setDeactivateOpen(false)
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Deactivation failed")
    } finally {
      setDeactivateLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Update accreditation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Update Accreditation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitAccred(handleUpdateAccreditation)} className="space-y-3">
            <div className="space-y-1.5">
              <Label>New Registration Number</Label>
              <Input {...regAccred("new_registration_number")} placeholder="NEW-REG-001" />
              {errAccred.new_registration_number && (
                <p className="text-xs text-destructive">{errAccred.new_registration_number.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Reason</Label>
              <Input {...regAccred("reason")} placeholder="Accreditation renewal" />
              {errAccred.reason && (
                <p className="text-xs text-destructive">{errAccred.reason.message}</p>
              )}
            </div>
            <Button type="submit" size="sm" disabled={accredLoading}>
              {accredLoading ? "Updating…" : "Update Accreditation"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Deactivate */}
      {isActive && (
        <div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeactivateOpen(true)}
          >
            Deactivate University
          </Button>
        </div>
      )}

      <Dialog open={deactivateOpen} onOpenChange={setDeactivateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate University</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will remove the university from the blockchain. This action cannot be easily undone.
          </p>
          <div className="space-y-1.5">
            <Label>Reason *</Label>
            <Textarea
              value={deactivateReason}
              onChange={(e) => setDeactivateReason(e.target.value)}
              placeholder="Reason for deactivation"
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              disabled={deactivateLoading || !deactivateReason.trim()}
              onClick={handleDeactivate}
            >
              {deactivateLoading ? "Deactivating…" : "Confirm Deactivation"}
            </Button>
            <Button variant="outline" onClick={() => setDeactivateOpen(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
