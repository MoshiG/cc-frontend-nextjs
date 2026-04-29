"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import type { Certificate } from "@/lib/types"
import { DownloadCertificateButton } from "@/app/admin/certificates/[tid]/DownloadCertificateButton"

interface University {
  university_code: string
  name: string
  is_active: boolean
}

const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"

const schema = z.object({
  student_id: z.string().min(3).max(50),
  university_code: z.string().min(2),
  certificate_type: z.string().min(2).max(100),
  degree_title: z.string().min(2).max(200),
  graduation_date: z.string().min(1, "Date required"),
  gpa: z.string().optional(),
})
type FormValues = z.infer<typeof schema>

export default function IssueCertificatePage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [issued, setIssued] = useState<Certificate | null>(null)
  const [universities, setUniversities] = useState<University[]>([])

  useEffect(() => {
    fetch("/api/v1/universities/")
      .then((r) => r.json())
      .then((data: University[]) => setUniversities(data.filter((u) => u.is_active)))
      .catch(() => {})
  }, [])

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(values: FormValues) {
    setLoading(true)
    setError(null)
    const toastId = toast.loading("Issuing certificate on blockchain… this can take up to 15 seconds.")
    try {
      const body = {
        ...values,
        gpa: values.gpa && values.gpa !== "" ? parseFloat(values.gpa) : null,
      }
      const res = await fetch(`/api/proxy/certificates/issue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Issuance failed" }))
        const msg = Array.isArray(err.detail)
          ? err.detail.map((e: { msg: string }) => e.msg).join(", ")
          : (err.detail ?? "Issuance failed")
        throw new Error(msg)
      }
      const data: Certificate = await res.json()
      toast.success(`Certificate issued — Token #${data.token_id}`, { id: toastId })
      setIssued(data)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Issuance failed"
      toast.error(msg, { id: toastId })
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  if (issued) {
    const qrDataUrl = issued.qr_code_png
      ? `data:image/png;base64,${issued.qr_code_png}`
      : undefined

    return (
      <div className="max-w-xl space-y-6">
        <div className="rounded-md border border-green-500 bg-green-50 p-6 text-center space-y-3">
          <p className="text-2xl">✓</p>
          <p className="font-semibold text-green-800">Certificate Issued Successfully</p>
          <p className="text-sm text-green-700">Token ID: #{issued.token_id}</p>
          {issued.qr_code_png && (
            <div className="space-y-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl}
                alt="QR Code"
                className="mx-auto w-40 h-40"
              />
              <p className="text-xs text-muted-foreground">Share this QR with the student</p>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href={`/admin/certificates/${issued.token_id}`}>View Certificate</Link>
          </Button>
          <DownloadCertificateButton cert={issued} qrDataUrl={qrDataUrl} />
          <Button variant="outline" onClick={() => { setIssued(null) }}>Issue Another</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/certificates">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Certificates
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold">Issue Certificate</h1>
        <p className="text-sm text-muted-foreground">Issues a soul-bound NFT certificate on-chain</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Certificate Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Student ID *</Label>
                <Input placeholder="UDSM2024001" {...register("student_id")} />
                {errors.student_id && <p className="text-xs text-destructive">{errors.student_id.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>University *</Label>
                <select className={selectClass} {...register("university_code")}>
                  <option value="">— Select university —</option>
                  {universities.map((u) => (
                    <option key={u.university_code} value={u.university_code}>
                      {u.name} ({u.university_code.toUpperCase()})
                    </option>
                  ))}
                </select>
                {errors.university_code && <p className="text-xs text-destructive">{errors.university_code.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Certificate Type *</Label>
              <Input placeholder="Bachelor's Degree" {...register("certificate_type")} />
              {errors.certificate_type && <p className="text-xs text-destructive">{errors.certificate_type.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Degree Title *</Label>
              <Input placeholder="Bachelor of Science in Computer Science" {...register("degree_title")} />
              {errors.degree_title && <p className="text-xs text-destructive">{errors.degree_title.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Graduation Date *</Label>
                <Input type="date" {...register("graduation_date")} />
                {errors.graduation_date && <p className="text-xs text-destructive">{errors.graduation_date.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>GPA (0.0–5.0)</Label>
                <Input type="number" step="0.01" min="0" max="5" placeholder="e.g. 4.2" {...register("gpa")} />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Issuing…" : "Issue Certificate"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/certificates">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
