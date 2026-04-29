"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { Search, Briefcase, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QRScanner } from "@/components/QRScanner"
import { VerifyResultPanel } from "@/components/VerifyResult"
import type { VerifyResult } from "@/lib/types"

const publicSchema = z.object({
  token_id: z.string().min(1, "Token ID is required"),
})

const verifierSchema = z.object({
  token_id: z.string().min(1, "Token ID is required"),
  manifest_hash: z.string().optional(),
})

type PublicFormValues = z.infer<typeof publicSchema>
type VerifierFormValues = z.infer<typeof verifierSchema>

export function VerifyClient({ isVerifier }: { isVerifier: boolean }) {
  const [result, setResult] = useState<VerifyResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const schema = isVerifier ? verifierSchema : publicSchema
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<VerifierFormValues>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(values: VerifierFormValues) {
    setLoading(true)
    setError(null)
    setResult(null)

    const API = process.env.NEXT_PUBLIC_API_URL ?? "http://192.168.2.8:8000"
    const body: Record<string, string> = { token_id: values.token_id }
    if (isVerifier && values.manifest_hash?.trim()) {
      body.manifest_hash = values.manifest_hash.trim()
    }

    try {
      const res = await fetch(`${API}/api/v1/certificates/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Verification failed" }))
        throw new Error(err.detail ?? "Verification failed")
      }

      const data: VerifyResult = await res.json()
      setResult(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed")
    } finally {
      setLoading(false)
    }
  }

  function handleQRScan(tokenId: string, manifestHash?: string) {
    setValue("token_id", tokenId)
    if (isVerifier && manifestHash) setValue("manifest_hash", manifestHash)
    handleSubmit(onSubmit)()
  }

  return (
    <div className="container mx-auto max-w-lg px-4 py-12 space-y-8">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold">Verify a Certificate</h1>
        <p className="text-sm text-muted-foreground">
          Enter the token ID or scan the QR code on the certificate
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Search className="h-4 w-4" />
            Certificate Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="token_id">Certificate Token ID</Label>
              <div className="flex gap-2">
                <Input
                  id="token_id"
                  placeholder="e.g. AB12345"
                  {...register("token_id")}
                />
                <QRScanner onScan={handleQRScan} />
              </div>
              <p className="text-xs text-muted-foreground">
                Found on the printed certificate or in the verification URL
              </p>
              {errors.token_id && (
                <p className="text-xs text-destructive">{errors.token_id.message}</p>
              )}
            </div>

            {/* Manifest hash — only shown to authenticated verifiers */}
            {isVerifier && (
              <div className="space-y-1.5">
                <Label htmlFor="manifest_hash">Document Manifest Hash</Label>
                <Input
                  id="manifest_hash"
                  placeholder="0xabc123…"
                  className="font-mono text-sm"
                  {...register("manifest_hash")}
                />
                <p className="text-xs text-muted-foreground">
                  SHA-256 hash of the candidate&apos;s certificate document. Enables full Tier-2 verification with an audit trail.
                </p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verifying…" : "Verify Certificate"}
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

      {/* Upsell: shown to public users after any result */}
      {!isVerifier && result && (
        <Card className="border-dashed">
          <CardContent className="pt-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <ShieldCheck className="h-8 w-8 text-primary shrink-0" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">Need to verify the actual document?</p>
              <p className="text-xs text-muted-foreground">
                Employers can log in to compare the document hash and get a cryptographically
                verified result — with a full audit trail.
              </p>
            </div>
            <Button asChild size="sm" className="shrink-0">
              <Link href="/verifier">
                <Briefcase className="h-3.5 w-3.5 mr-1.5" />
                Log in as Employer
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
