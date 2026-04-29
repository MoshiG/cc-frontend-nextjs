"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"
import type { Certificate } from "@/lib/types"

interface Props {
  cert: Certificate
  universityName?: string
  /** Pass a pre-fetched data URL (e.g. from the issue response qr_code_png field) */
  qrDataUrl?: string
}

export function DownloadCertificateButton({ cert, universityName, qrDataUrl: initialQr }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDownload() {
    setLoading(true)
    setError(null)
    try {
      // Fetch QR as data URL unless already provided
      let qrDataUrl = initialQr
      if (!qrDataUrl) {
        try {
          const qrRes = await fetch(`/api/proxy/certificates/token/${cert.token_id}/qr`)
          if (qrRes.ok) {
            const blob = await qrRes.blob()
            qrDataUrl = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader()
              reader.onload = () => resolve(reader.result as string)
              reader.onerror = reject
              reader.readAsDataURL(blob)
            })
          }
        } catch {
          // QR unavailable — PDF will show placeholder
        }
      }

      // Lazy-load @react-pdf/renderer only at click time (~400 KB)
      const [{ pdf }, { CertificatePDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/CertificatePDF"),
      ])

      const uniName = universityName ?? cert.issuer_university.toUpperCase()

      // CertificatePDF returns a <Document> which satisfies DocumentProps at runtime.
      // The outer wrapper component type doesn't match the strict pdf() signature so cast.
      const element = <CertificatePDF cert={cert} universityName={uniName} qrDataUrl={qrDataUrl} />
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const blob = await pdf(element as any).toBlob()

      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `MyChetiChain-Certificate-${cert.token_id}-${cert.student_id}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("[PDF] generation failed:", err)
      setError("PDF generation failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-1">
      <Button onClick={handleDownload} disabled={loading} size="sm" variant="outline">
        <FileDown className="h-3.5 w-3.5 mr-1" />
        {loading ? "Generating PDF…" : "Download Certificate PDF"}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
