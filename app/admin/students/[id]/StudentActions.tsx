"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Key, Trash2, AlertTriangle } from "lucide-react"

interface Props {
  studentId: string
}

interface HandoverData {
  keystore_json: Record<string, unknown> | string
  decrypt_passphrase: string
  ethereum_address: string
}

export function StudentActions({ studentId }: Props) {
  const router = useRouter()
  const [handoverOpen, setHandoverOpen] = useState(false)
  const [handoverData, setHandoverData] = useState<HandoverData | null>(null)
  const [handoverLoading, setHandoverLoading] = useState(false)
  const [handoverError, setHandoverError] = useState<string | null>(null)

  const [anonymiseOpen, setAnonymiseOpen] = useState(false)
  const [anonymiseLoading, setAnonymiseLoading] = useState(false)
  const [anonymiseError, setAnonymiseError] = useState<string | null>(null)

  async function handleHandover() {
    setHandoverLoading(true)
    setHandoverError(null)
    try {
      const res = await fetch(`/api/proxy/students/${studentId}/handover`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Handover failed" }))
        throw new Error(err.detail)
      }
      const data = await res.json()
      setHandoverData(data)
      setHandoverOpen(true)
    } catch (err: unknown) {
      setHandoverError(err instanceof Error ? err.message : "Handover failed")
    } finally {
      setHandoverLoading(false)
    }
  }

  async function handleAnonymise() {
    setAnonymiseLoading(true)
    setAnonymiseError(null)
    try {
      const res = await fetch(`/api/proxy/students/${studentId}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Anonymisation failed" }))
        throw new Error(err.detail)
      }
      setAnonymiseOpen(false)
      router.push("/admin/students")
    } catch (err: unknown) {
      setAnonymiseError(err instanceof Error ? err.message : "Anonymisation failed")
    } finally {
      setAnonymiseLoading(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      {handoverError && (
        <Alert variant="destructive" className="w-full">
          <AlertDescription>{handoverError}</AlertDescription>
        </Alert>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={handleHandover}
        disabled={handoverLoading}
      >
        <Key className="h-3.5 w-3.5 mr-1" />
        {handoverLoading ? "Generating…" : "Hand Over Account"}
      </Button>

      <Button
        variant="destructive"
        size="sm"
        onClick={() => setAnonymiseOpen(true)}
      >
        <Trash2 className="h-3.5 w-3.5 mr-1" />
        Anonymise (GDPR)
      </Button>

      {/* Handover modal */}
      <Dialog open={handoverOpen} onOpenChange={setHandoverOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Account Handover Credentials</DialogTitle>
          </DialogHeader>
          {handoverData && (
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                Share these with the student securely. The keystore can be imported into MetaMask.
              </p>
              <div>
                <p className="font-medium mb-1">Ethereum Address</p>
                <code className="block bg-muted rounded p-2 text-xs break-all">
                  {handoverData.ethereum_address}
                </code>
              </div>
              <div>
                <p className="font-medium mb-1">Passphrase</p>
                <code className="block bg-muted rounded p-2 text-xs break-all select-all">
                  {handoverData.decrypt_passphrase}
                </code>
              </div>
              <div>
                <p className="font-medium mb-1">Keystore JSON</p>
                <textarea
                  readOnly
                  className="w-full h-32 font-mono text-xs bg-muted rounded p-2 resize-none border select-all"
                  value={typeof handoverData.keystore_json === "string"
                    ? handoverData.keystore_json
                    : JSON.stringify(handoverData.keystore_json, null, 2)}
                />
              </div>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Save these credentials now — they will not be shown again.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Anonymise confirmation */}
      <Dialog open={anonymiseOpen} onOpenChange={setAnonymiseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Anonymise Student (GDPR Right to Erasure)</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently anonymise all personal data for <strong>{studentId}</strong>.
            Certificate records on-chain are not affected. This cannot be undone.
          </p>
          {anonymiseError && (
            <Alert variant="destructive">
              <AlertDescription>{anonymiseError}</AlertDescription>
            </Alert>
          )}
          <div className="flex gap-2">
            <Button
              variant="destructive"
              disabled={anonymiseLoading}
              onClick={handleAnonymise}
            >
              {anonymiseLoading ? "Anonymising…" : "Confirm Anonymisation"}
            </Button>
            <Button variant="outline" onClick={() => setAnonymiseOpen(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
