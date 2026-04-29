"use client"

import Link from "next/link"
import { useState } from "react"
import { FileText, QrCode, ShieldCheck, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Certificate } from "@/lib/types"
import { formatDate, truncateHash } from "@/lib/utils"

interface Props {
  cert: Certificate
  showStudentName?: boolean
}

export function CertificateCard({ cert, showStudentName }: Props) {
  const [qrOpen, setQrOpen] = useState(false)
  const isRevoked = cert.status === "revoked"

  const API = process.env.NEXT_PUBLIC_API_URL ?? "http://192.168.2.8:8000"
  const qrSrc = `${API}/api/v1/certificates/token/${cert.token_id}/qr`

  return (
    <>
      <Card className={isRevoked ? "border-amber-400 opacity-75" : ""}>
        <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 shrink-0" />
            {cert.degree_title}
          </CardTitle>
          <Badge variant={isRevoked ? "destructive" : "default"}>
            {isRevoked ? (
              <>
                <AlertTriangle className="h-3 w-3 mr-1" />
                Revoked
              </>
            ) : (
              <>
                <ShieldCheck className="h-3 w-3 mr-1" />
                Valid
              </>
            )}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {showStudentName && (
            <p>
              <span className="text-muted-foreground">Student: </span>
              {cert.student_name}
            </p>
          )}
          <p>
            <span className="text-muted-foreground">Type: </span>
            {cert.certificate_type}
          </p>
          <p>
            <span className="text-muted-foreground">Issued by: </span>
            <span className="font-medium uppercase">{cert.issuer_university}</span>
          </p>
          <p>
            <span className="text-muted-foreground">Graduation: </span>
            {formatDate(cert.graduation_date)}
          </p>
          <p>
            <span className="text-muted-foreground">Token ID: </span>
            <span className="font-mono">#{cert.token_id}</span>
          </p>
          <p>
            <span className="text-muted-foreground">Hash: </span>
            <span className="font-mono text-xs">{truncateHash(cert.manifest_hash)}</span>
          </p>

          <div className="flex gap-2 mt-3">
            <Button variant="outline" size="sm" onClick={() => setQrOpen(true)}>
              <QrCode className="h-3.5 w-3.5 mr-1" />
              QR Code
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`/v?t=${cert.token_id}&h=${cert.manifest_hash}`}
              >
                Verify
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="max-w-xs text-center">
          <DialogHeader>
            <DialogTitle>Verification QR Code</DialogTitle>
          </DialogHeader>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrSrc} alt="QR Code" className="mx-auto w-48 h-48 rounded" />
          <p className="text-xs text-muted-foreground">Token #{cert.token_id}</p>
          <Button asChild size="sm" variant="outline">
            <a href={qrSrc} download={`cert-${cert.token_id}.png`}>
              Download PNG
            </a>
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
