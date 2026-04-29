"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { QRScanner } from "@/components/QRScanner"
import { VerifyResultPanel } from "@/components/VerifyResult"
import type { VerifyResult } from "@/lib/types"
import { formatDateTime } from "@/lib/utils"

const schema = z.object({
  token_id: z.string().min(1, "Token ID required"),
  manifest_hash: z.string().min(1, "Manifest hash required for Tier-2 verification"),
})
type FormValues = z.infer<typeof schema>

interface SessionEntry {
  token_id: string
  result: VerifyResult
  at: string
}

export default function VerifierDashboardPage() {
  const [result, setResult] = useState<VerifyResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<SessionEntry[]>([])

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(values: FormValues) {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch(`/api/proxy/certificates/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token_id: values.token_id,
          manifest_hash: values.manifest_hash,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Verification failed" }))
        throw new Error(err.detail ?? "Verification failed")
      }
      const data: VerifyResult = await res.json()
      setResult(data)
      setHistory((prev) => [{ token_id: values.token_id, result: data, at: new Date().toISOString() }, ...prev])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed")
    } finally {
      setLoading(false)
    }
  }

  function handleQRScan(tokenId: string, manifestHash?: string) {
    setValue("token_id", tokenId)
    if (manifestHash) setValue("manifest_hash", manifestHash)
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12 space-y-8">
      <div className="text-center space-y-1">
        <ShieldCheck className="h-10 w-10 text-primary mx-auto" />
        <h1 className="text-2xl font-bold">Tier-2 Verification</h1>
        <p className="text-sm text-muted-foreground">
          Full cryptographic verification with audit trail. Results include student name and document hash check.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Verify Certificate</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="token_id">Certificate Token ID</Label>
              <div className="flex gap-2">
                <Input
                  id="token_id"
                  placeholder="e.g. 10001"
                  {...register("token_id")}
                />
                <QRScanner onScan={handleQRScan} />
              </div>
              {errors.token_id && (
                <p className="text-xs text-destructive">{errors.token_id.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="manifest_hash">Document Manifest Hash</Label>
              <Input
                id="manifest_hash"
                placeholder="0xabc123…"
                className="font-mono text-sm"
                {...register("manifest_hash")}
              />
              <p className="text-xs text-muted-foreground">
                The sha256 hash of the certificate document provided by the candidate
              </p>
              {errors.manifest_hash && (
                <p className="text-xs text-destructive">{errors.manifest_hash.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verifying…" : "Verify (Tier 2)"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {result && <VerifyResultPanel result={result} />}

      {/* Session history */}
      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Session History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Token ID</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Hash Match</TableHead>
                  <TableHead>When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((entry, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono">#{entry.token_id}</TableCell>
                    <TableCell>
                      <Badge variant={entry.result.valid ? "default" : "destructive"}>
                        {entry.result.valid ? "Valid" : "Invalid"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {entry.result.manifest_hash_matched === null ? "—" : (
                        <Badge variant={entry.result.manifest_hash_matched ? "default" : "destructive"}>
                          {entry.result.manifest_hash_matched ? "✓ Match" : "✗ Mismatch"}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">{formatDateTime(entry.at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
