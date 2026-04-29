import { cookies } from "next/headers"
import Link from "next/link"
import { ArrowLeft, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiFetch } from "@/lib/api"
import type { Certificate, University } from "@/lib/types"
import { formatDate, formatDateTime, truncateHash } from "@/lib/utils"
import { CertificateRevoke } from "./CertificateRevoke"
import { DownloadCertificateButton } from "./DownloadCertificateButton"

interface Props {
  params: Promise<{ tid: string }>
}

async function getCert(tid: string, token: string): Promise<Certificate | null> {
  try {
    return await apiFetch<Certificate>(`/certificates/token/${tid}`, {}, token)
  } catch {
    return null
  }
}

async function getUniversityName(code: string, token: string): Promise<string> {
  try {
    const uni = await apiFetch<University>(`/universities/${code}`, {}, token)
    return uni.name
  } catch {
    return code.toUpperCase()
  }
}

export default async function CertificateDetailPage({ params }: Props) {
  const { tid } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value ?? ""

  const cert = await getCert(tid, token)

  if (!cert) {
    return (
      <div className="space-y-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/certificates"><ArrowLeft className="h-4 w-4 mr-1" />Certificates</Link>
        </Button>
        <p className="text-destructive">Certificate #{tid} not found.</p>
      </div>
    )
  }

  const universityName = await getUniversityName(cert.issuer_university, token)
  const qrSrc = `/api/proxy/certificates/token/${tid}/qr`

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/certificates">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Certificates
          </Link>
        </Button>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{cert.degree_title}</h1>
          <p className="text-muted-foreground font-mono text-sm">Token #{cert.token_id}</p>
        </div>
        <Badge variant={cert.status === "revoked" ? "destructive" : "default"} className="text-sm">
          {cert.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Certificate Info</CardTitle></CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              {[
                ["Student", cert.student_name],
                ["Student ID", cert.student_id],
                ["Type", cert.certificate_type],
                ["University", cert.issuer_university.toUpperCase()],
                ["Graduation", formatDate(cert.graduation_date)],
                ["GPA", cert.gpa?.toString() ?? "—"],
                ["Honors", cert.honors ?? "—"],
                ["Issued", formatDateTime(cert.issued_at)],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-2">
                  <dt className="text-muted-foreground w-28 shrink-0">{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Blockchain Info</CardTitle></CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              {[
                ["Manifest Hash", truncateHash(cert.manifest_hash)],
                ["Transaction", truncateHash(cert.transaction_hash)],
                ["IPFS Hash", truncateHash(cert.ipfs_hash)],
                ["Holder Address", truncateHash(cert.ethereum_address)],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-2">
                  <dt className="text-muted-foreground w-28 shrink-0">{label}</dt>
                  <dd className="font-mono text-xs">{value}</dd>
                </div>
              ))}
              {cert.status === "revoked" && cert.revoke_reason && (
                <div className="flex gap-2">
                  <dt className="text-muted-foreground w-28 shrink-0">Revoke Reason</dt>
                  <dd className="text-amber-700">{cert.revoke_reason}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* QR Code */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Verification QR Code</CardTitle>
        </CardHeader>
        <CardContent className="flex items-start gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrSrc} alt="QR Code" className="w-36 h-36 rounded border" />
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Scan this QR to verify the certificate at{" "}
              <span className="font-mono text-xs">
                /v?t={cert.token_id}&amp;h={truncateHash(cert.manifest_hash, 6)}
              </span>
            </p>
            <Button asChild size="sm" variant="outline">
              <a href={qrSrc} download={`cert-${cert.token_id}-qr.png`}>
                <Download className="h-3.5 w-3.5 mr-1" />
                Download QR PNG
              </a>
            </Button>
            <DownloadCertificateButton cert={cert} universityName={universityName} />
          </div>
        </CardContent>
      </Card>

      {/* Revoke */}
      {cert.status !== "revoked" && (
        <CertificateRevoke tokenId={tid} />
      )}
    </div>
  )
}
