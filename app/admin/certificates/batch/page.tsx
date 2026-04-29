"use client"

import { useState, useEffect } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { toast } from "sonner"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { CertificateBatchResponse } from "@/lib/types"

interface University {
  university_code: string
  name: string
  is_active: boolean
}

const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"

const itemSchema = z.object({
  student_id: z.string().min(3),
  certificate_type: z.string().min(2),
  degree_title: z.string().min(2),
  graduation_date: z.string().min(1),
  gpa: z.string().optional(),
})

const schema = z.object({
  university_code: z.string().min(2),
  certificates: z.array(itemSchema).min(1),
})
type FormValues = z.infer<typeof schema>

export default function BatchIssuePage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CertificateBatchResponse | null>(null)
  const [universities, setUniversities] = useState<University[]>([])

  useEffect(() => {
    fetch("/api/proxy/universities/")
      .then((r) => r.json())
      .then((data: University[]) => setUniversities(data.filter((u) => u.is_active)))
      .catch(() => {})
  }, [])

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      university_code: "",
      certificates: [{ student_id: "", certificate_type: "", degree_title: "", graduation_date: "", gpa: "" }],
    },
  })
  const { fields, append, remove } = useFieldArray({ control, name: "certificates" })

  async function onSubmit(values: FormValues) {
    setLoading(true)
    setError(null)
    setResult(null)
    const count = values.certificates.length
    const toastId = toast.loading(
      `Issuing ${count} certificate${count > 1 ? "s" : ""} on blockchain… this may take up to ${Math.max(15, count * 8)} seconds.`
    )
    try {
      const res = await fetch(`/api/proxy/certificates/batch-issue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          university_code: values.university_code,
          certificates: values.certificates.map((c) => ({
            ...c,
            gpa: c.gpa && c.gpa !== "" ? parseFloat(c.gpa) : null,
          })),
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Batch issue failed" }))
        throw new Error(err.detail ?? "Batch issue failed")
      }
      const data: CertificateBatchResponse = await res.json()
      if (data.failed === 0) {
        toast.success(`${data.successful} certificate${data.successful > 1 ? "s" : ""} issued successfully`, { id: toastId })
      } else {
        toast.warning(`${data.successful} issued, ${data.failed} failed`, { id: toastId })
      }
      setResult(data)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Batch issue failed"
      toast.error(msg, { id: toastId })
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    return (
      <div className="max-w-xl space-y-6">
        <h1 className="text-2xl font-bold">Batch Issue Results</h1>
        <div className="rounded-md border p-4 space-y-2">
          <p><strong>Requested:</strong> {result.total_requested}</p>
          <p><strong>Successful:</strong> <Badge className="bg-green-600">{result.successful}</Badge></p>
          <p><strong>Failed:</strong> <Badge variant="destructive">{result.failed}</Badge></p>
        </div>
        {result.errors.length > 0 && (
          <div className="space-y-2">
            <p className="font-medium text-destructive">Errors</p>
            {result.errors.map((e, i) => (
              <div key={i} className="text-sm border border-destructive/40 rounded p-2">
                <span className="font-mono">{e.student_id}:</span> {e.error}
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/certificates">View Certificates</Link>
          </Button>
          <Button variant="outline" onClick={() => setResult(null)}>Issue Another Batch</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/certificates">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Certificates
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold">Batch Issue Certificates</h1>
        <p className="text-sm text-muted-foreground">Issue up to 100 certificates at once for one university</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Issuing University</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5 max-w-xs">
              <Label>University *</Label>
              <select className={selectClass} {...register("university_code")}>
                <option value="">— Select university —</option>
                {universities.map((u) => (
                  <option key={u.university_code} value={u.university_code}>
                    {u.name} ({u.university_code.toUpperCase()})
                  </option>
                ))}
              </select>
              {errors.university_code && (
                <p className="text-xs text-destructive">{errors.university_code.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Certificate #{index + 1}</CardTitle>
              {fields.length > 1 && (
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Student ID *</Label>
                  <Input placeholder="UDSM2024001" {...register(`certificates.${index}.student_id`)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Certificate Type *</Label>
                  <Input placeholder="Bachelor's Degree" {...register(`certificates.${index}.certificate_type`)} />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Degree Title *</Label>
                <Input {...register(`certificates.${index}.degree_title`)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Graduation Date *</Label>
                  <Input type="date" {...register(`certificates.${index}.graduation_date`)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">GPA (0.0–5.0)</Label>
                  <Input type="number" step="0.01" min="0" max="5" placeholder="e.g. 4.2" {...register(`certificates.${index}.gpa`)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ student_id: "", certificate_type: "", degree_title: "", graduation_date: "", gpa: "" })}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add Certificate
        </Button>

        {error && (
          <div className="rounded-md bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? `Issuing ${fields.length} certificates…` : `Issue ${fields.length} Certificate${fields.length > 1 ? "s" : ""}`}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/certificates">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
