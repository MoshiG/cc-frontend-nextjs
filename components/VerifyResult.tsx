import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { VerifyResult } from "@/lib/types"
import { formatDate, formatDateTime, truncateHash } from "@/lib/utils"

interface Props {
  result: VerifyResult
}

export function VerifyResultPanel({ result }: Props) {
  const isRevoked = result.revoked
  const isValid = result.valid && !isRevoked
  // "not found" = invalid with no chain or DB data at all
  const isNotFound = !result.valid && !isRevoked && !result.issuer_university && !result.on_chain_issuer

  const statusColor = isRevoked
    ? "bg-amber-100 border-amber-400 text-amber-800"
    : isValid
      ? "bg-green-100 border-green-500 text-green-900"
      : "bg-red-100 border-red-500 text-red-900"

  const Icon = isRevoked ? AlertTriangle : isValid ? CheckCircle2 : XCircle
  const label = isRevoked ? "REVOKED" : isValid ? "VALID ✓" : isNotFound ? "NOT FOUND" : "INVALID ✗"

  return (
    <Card className={`border-2 ${statusColor}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Icon className="h-6 w-6" />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isNotFound && (
          <p className="text-sm">
            No certificate with Token ID <span className="font-mono font-medium">{result.token_id}</span> was found.
            Please check the ID and try again.
          </p>
        )}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          {!isNotFound && (
            <>
              <span className="text-muted-foreground">Token ID</span>
              <span className="font-mono">{result.token_id}</span>
            </>
          )}

          {result.issuer_university && (
            <>
              <span className="text-muted-foreground">Issuer University</span>
              <span className="font-medium uppercase">{result.issuer_university}</span>
            </>
          )}

          {result.certificate_type && (
            <>
              <span className="text-muted-foreground">Certificate Type</span>
              <span>{result.certificate_type}</span>
            </>
          )}

          {result.student_name && (
            <>
              <span className="text-muted-foreground">Student</span>
              <span className="font-medium">{result.student_name}</span>
            </>
          )}

          {result.issued_at && (
            <>
              <span className="text-muted-foreground">Issued</span>
              <span>{formatDate(result.issued_at)}</span>
            </>
          )}

          {result.on_chain_manifest_hash && (
            <>
              <span className="text-muted-foreground">On-chain Hash</span>
              <span className="font-mono text-xs">{truncateHash(result.on_chain_manifest_hash)}</span>
            </>
          )}

          {result.manifest_hash_matched !== null && result.manifest_hash_matched !== undefined && (
            <>
              <span className="text-muted-foreground">Document Hash</span>
              <span>
                {result.manifest_hash_matched ? (
                  <Badge className="bg-green-600 text-white">
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    Verified ✓
                  </Badge>
                ) : (
                  <Badge variant="destructive">Mismatch ✗</Badge>
                )}
              </span>
            </>
          )}

          {isRevoked && result.revoke_reason && (
            <>
              <span className="text-muted-foreground">Revoke Reason</span>
              <span className="text-amber-700">{result.revoke_reason}</span>
            </>
          )}
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          Verified at {formatDateTime(result.verified_at)}
        </p>
      </CardContent>
    </Card>
  )
}
