"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: CURRENT_YEAR - 1950 + 1 }, (_, i) => CURRENT_YEAR - i)

const schema = z.object({
  student_id: z.string().min(3).max(50),
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  email: z.string().email(),
  university_code: z.string().min(2),
  program: z.string().min(2).max(200),
  graduation_year: z.string().optional(),
})
type FormValues = z.infer<typeof schema>

interface University {
  university_code: string
  name: string
  is_active: boolean
}

const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"

export default function RegisterStudentPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [universities, setUniversities] = useState<University[]>([])

  useEffect(() => {
    fetch("/api/proxy/universities/")
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
    try {
      const res = await fetch(`/api/proxy/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          graduation_year:
            values.graduation_year && values.graduation_year !== ""
              ? parseInt(values.graduation_year)
              : null,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Registration failed" }))
        const msg = Array.isArray(err.detail)
          ? err.detail.map((e: { msg: string }) => e.msg).join(", ")
          : (err.detail ?? "Registration failed")
        throw new Error(msg)
      }
      router.push("/admin/students")
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
          <Link href="/admin/students">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Students
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold">Register Student</h1>
        <p className="text-sm text-muted-foreground">Creates student record and generates an Ethereum wallet</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Student Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="student_id">Student ID *</Label>
              <Input id="student_id" placeholder="UDSM2024001" {...register("student_id")} />
              {errors.student_id && <p className="text-xs text-destructive">{errors.student_id.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="first_name">First Name *</Label>
                <Input id="first_name" {...register("first_name")} />
                {errors.first_name && <p className="text-xs text-destructive">{errors.first_name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input id="last_name" {...register("last_name")} />
                {errors.last_name && <p className="text-xs text-destructive">{errors.last_name.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="university_code">University *</Label>
                <select id="university_code" className={selectClass} {...register("university_code")}>
                  <option value="">— Select university —</option>
                  {universities.map((u) => (
                    <option key={u.university_code} value={u.university_code}>
                      {u.name} ({u.university_code.toUpperCase()})
                    </option>
                  ))}
                </select>
                {errors.university_code && <p className="text-xs text-destructive">{errors.university_code.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="graduation_year">Graduation Year</Label>
                <select id="graduation_year" className={selectClass} {...register("graduation_year")}>
                  <option value="">— Select year —</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="program">Program *</Label>
              <Input id="program" placeholder="Bachelor of Science in Computer Science" {...register("program")} />
              {errors.program && <p className="text-xs text-destructive">{errors.program.message}</p>}
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Registering…" : "Register Student"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/students">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
