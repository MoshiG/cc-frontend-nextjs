import { cookies } from "next/headers"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { apiFetch } from "@/lib/api"
import type { CertificateListResponse } from "@/lib/types"
import { formatDate } from "@/lib/utils"

async function getCerts(token: string): Promise<CertificateListResponse> {
  try {
    return await apiFetch<CertificateListResponse>("/certificates?limit=100&offset=0", {}, token)
  } catch {
    return { certificates: [], total: 0, limit: 100, offset: 0 }
  }
}

export default async function AdminCertificatesPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value ?? ""
  const { certificates, total } = await getCerts(token)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Certificates</h1>
          <p className="text-sm text-muted-foreground">{total} total</p>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/certificates/batch">Batch Issue</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/admin/certificates/issue">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Issue Certificate
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          {certificates.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No certificates issued yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Token ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>University</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Graduation</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certificates.map((cert) => (
                  <TableRow key={cert.certificate_id}>
                    <TableCell className="font-mono">
                      <Link href={`/admin/certificates/${cert.token_id}`} className="hover:underline">
                        #{cert.token_id}
                      </Link>
                    </TableCell>
                    <TableCell>{cert.student_name}</TableCell>
                    <TableCell className="uppercase">{cert.issuer_university}</TableCell>
                    <TableCell className="text-sm">{cert.certificate_type}</TableCell>
                    <TableCell>{formatDate(cert.graduation_date)}</TableCell>
                    <TableCell>
                      <Badge variant={cert.status === "revoked" ? "destructive" : "default"}>
                        {cert.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/certificates/${cert.token_id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
