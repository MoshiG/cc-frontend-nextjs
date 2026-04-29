import Link from "next/link"
import { Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VerifyResultPanel } from "@/components/VerifyResult"
import { apiFetch } from "@/lib/api"
import type { VerifyResult } from "@/lib/types"

interface Props {
  searchParams: Promise<{ t?: string; h?: string }>
}

async function verify(tokenId: string, manifestHash?: string): Promise<VerifyResult | null> {
  try {
    return await apiFetch<VerifyResult>("/certificates/verify", {
      method: "POST",
      body: JSON.stringify({ token_id: tokenId, manifest_hash: manifestHash ?? null }),
    })
  } catch {
    return null
  }
}

export default async function QRLandingPage({ searchParams }: Props) {
  const params = await searchParams
  const tokenId = params.t
  const manifestHash = params.h

  if (!tokenId) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Invalid QR Code</h1>
        <p className="text-muted-foreground mb-6">
          This QR code does not contain a valid certificate token ID.
        </p>
        <Button asChild>
          <Link href="/verify">Manual Verification</Link>
        </Button>
      </div>
    )
  }

  const result = await verify(tokenId, manifestHash)

  return (
    <div className="container mx-auto max-w-lg px-4 py-12 space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold">Certificate Verification</h1>
        <p className="text-sm text-muted-foreground">
          Token ID: <span className="font-mono">#{tokenId}</span>
        </p>
      </div>

      {result ? (
        <VerifyResultPanel result={result} />
      ) : (
        <div className="rounded-md border border-destructive bg-destructive/10 p-6 text-center">
          <p className="font-semibold text-destructive">Verification failed</p>
          <p className="text-sm text-muted-foreground mt-1">
            Unable to connect to the blockchain. Please try again later.
          </p>
        </div>
      )}

      {result?.valid && (
        <div className="rounded-md border bg-muted/40 p-4 text-sm text-center space-y-2">
          <p className="text-muted-foreground">
            Want full document hash verification with an audit trail?
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/verifier">
              <Briefcase className="h-3.5 w-3.5 mr-1" />
              Login as Employer →
            </Link>
          </Button>
        </div>
      )}

      <div className="text-center">
        <Button asChild variant="ghost" size="sm">
          <Link href="/verify">← Manual verification</Link>
        </Button>
      </div>
    </div>
  )
}
