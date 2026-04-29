import { cookies } from "next/headers"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CertificateCard } from "@/components/CertificateCard"
import { apiFetch } from "@/lib/api"
import type { Student, Certificate } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { StudentActions } from "./StudentActions"

interface Props {
  params: Promise<{ id: string }>
}

async function getData(studentId: string, token: string) {
  const [studentRes, certsRes] = await Promise.allSettled([
    apiFetch<Student>(`/students/${studentId}`, {}, token),
    apiFetch<Certificate[]>(`/certificates/student/${studentId}`),
  ])
  return {
    student: studentRes.status === "fulfilled" ? studentRes.value : null,
    certs: certsRes.status === "fulfilled" ? certsRes.value : [],
  }
}

export default async function AdminStudentDetailPage({ params }: Props) {
  const { id } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value ?? ""

  const { student, certs } = await getData(id, token)

  if (!student) {
    return (
      <div className="space-y-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/students"><ArrowLeft className="h-4 w-4 mr-1" />Students</Link>
        </Button>
        <p className="text-destructive">Student &quot;{id}&quot; not found or access denied.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/students">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Students
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold">{student.first_name} {student.last_name}</h1>
        <p className="text-muted-foreground font-mono text-sm">{student.student_id}</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Profile</CardTitle></CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <dt className="text-muted-foreground">Email</dt>
            <dd>{student.email}</dd>
            <dt className="text-muted-foreground">University</dt>
            <dd className="uppercase">{student.university_code}</dd>
            <dt className="text-muted-foreground">Program</dt>
            <dd>{student.program}</dd>
            <dt className="text-muted-foreground">Year</dt>
            <dd>{student.year ?? "—"}</dd>
            <dt className="text-muted-foreground">Ethereum Address</dt>
            <dd className="font-mono text-xs break-all">{student.ethereum_address}</dd>
            <dt className="text-muted-foreground">Wallet Created</dt>
            <dd>{student.wallet_created ? "Yes" : "No"}</dd>
            <dt className="text-muted-foreground">Registered</dt>
            <dd>{formatDate(student.created_at)}</dd>
          </dl>
        </CardContent>
      </Card>

      <StudentActions studentId={id} />

      {/* Certificates */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Certificates ({certs.length})</h2>
        {certs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No certificates issued yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certs.map((cert) => (
              <CertificateCard key={cert.certificate_id} cert={cert} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
