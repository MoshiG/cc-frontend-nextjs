"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

const schema = z.object({
  code: z.string().min(2).max(10),
  name: z.string().min(3).max(200),
  registration_number: z.string().min(3).max(100),
  country: z.string().optional(),
  contact_email: z.string().email().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  notes: z.string().optional(),
})
type FormValues = z.infer<typeof schema>

export default function RegisterUniversityPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(values: FormValues) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/proxy/universities/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Registration failed" }))
        const msg = Array.isArray(err.detail)
          ? err.detail.map((e: { msg: string }) => e.msg).join(", ")
          : (err.detail ?? "Registration failed")
        throw new Error(msg)
      }
      router.push("/admin/universities")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/universities">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Universities
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold">Register University</h1>
        <p className="text-sm text-muted-foreground">
          Adds the university on-chain and to the database
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">University Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="code">Code *</Label>
                <Input id="code" placeholder="udsm" {...register("code")} />
                {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" placeholder="University of…" {...register("name")} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
            </div>

            <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
              The gateway will mint a fresh keystore wallet for this university,
              unlock it, and fund it from the Novaya admin key. The address is
              shown on the university detail page after registration.
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="registration_number">Registration Number *</Label>
              <Input
                id="registration_number"
                placeholder="UDSM-TZ-2000-REG-001"
                {...register("registration_number")}
              />
              <p className="text-xs text-muted-foreground">
                sha256 of this is stored as the accreditationId on-chain
              </p>
              {errors.registration_number && (
                <p className="text-xs text-destructive">{errors.registration_number.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="country">Country</Label>
                <Input id="country" placeholder="Tanzania" {...register("country")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input id="contact_email" type="email" {...register("contact_email")} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="website">Website</Label>
              <Input id="website" placeholder="https://…" {...register("website")} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" {...register("notes")} rows={3} />
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Registering…" : "Register University"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/universities">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
