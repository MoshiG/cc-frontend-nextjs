import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CertificateCard } from "@/components/CertificateCard"
import { apiFetch } from "@/lib/api"
import type { Certificate } from "@/lib/types"

interface Props {
  params: Promise<{ id: string }>
}

async function getStudentCerts(studentId: string): Promise<Certificate[]> {
  try {
    return await apiFetch<Certificate[]>(`/certificates/student/${studentId}`)
  } catch {
    return []
  }
}

export default async function StudentPublicPage({ params }: Props) {
  const { id } = await params
  const certs = await getStudentCerts(id)

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Home
          </Link>
        </Button>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Student Certificates</h1>
        <p className="text-muted-foreground text-sm">
          Student ID: <span className="font-mono">{id}</span>
        </p>
      </div>

      {certs.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>No certificates found for this student.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certs.map((cert) => (
            <CertificateCard key={cert.certificate_id} cert={cert} />
          ))}
        </div>
      )}
    </div>
  )
}
