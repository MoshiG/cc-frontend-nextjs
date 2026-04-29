import Link from "next/link"
import { cookies } from "next/headers"
import { University, Users, FileText, Plus, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { apiFetch } from "@/lib/api"
import type { HealthDetailed, CertificateListResponse } from "@/lib/types"
import { formatDate } from "@/lib/utils"

async function getDashboardData(token: string) {
  const [health, certs] = await Promise.allSettled([
    apiFetch<HealthDetailed>("/health/detailed"),
    apiFetch<CertificateListResponse>("/certificates?limit=10&offset=0", {}, token),
  ])
  return {
    health: health.status === "fulfilled" ? health.value : null,
    recentCerts: certs.status === "fulfilled" ? certs.value.certificates : [],
  }
}

export default async function AdminDashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value ?? ""

  const { health, recentCerts } = await getDashboardData(token)
  const orchestrator = health?.orchestrator
  const activeUniversities = health?.universities?.filter((u) => u.on_chain_active).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">MyChetiChain administration overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Universities",
            value: orchestrator?.total_universities ?? "—",
            icon: University,
            href: "/admin/universities",
          },
          {
            label: "Students",
            value: orchestrator?.total_students ?? "—",
            icon: Users,
            href: "/admin/students",
          },
          {
            label: "Certificates",
            value: orchestrator?.total_certificates ?? "—",
            icon: FileText,
            href: "/admin/certificates",
          },
          {
            label: "Active Universities",
            value: activeUniversities ?? "—",
            icon: University,
            href: "/admin/universities",
          },
        ].map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href}>
            <Card className="hover:shadow-sm transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild size="sm">
            <Link href="/admin/certificates/issue">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Issue Certificate
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/students/register">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Register Student
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/universities/register">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Register University
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/certificates/batch">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Batch Issue
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Recent certificates */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Certificates</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/certificates">
              View all <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentCerts.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No certificates yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Token ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>University</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Issued</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCerts.map((cert) => (
                  <TableRow key={cert.certificate_id}>
                    <TableCell className="font-mono">
                      <Link href={`/admin/certificates/${cert.token_id}`} className="hover:underline">
                        #{cert.token_id}
                      </Link>
                    </TableCell>
                    <TableCell>{cert.student_name}</TableCell>
                    <TableCell className="uppercase">{cert.issuer_university}</TableCell>
                    <TableCell>{cert.certificate_type}</TableCell>
                    <TableCell>{formatDate(cert.issued_at)}</TableCell>
                    <TableCell>
                      <Badge variant={cert.status === "revoked" ? "destructive" : "default"}>
                        {cert.status}
                      </Badge>
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
