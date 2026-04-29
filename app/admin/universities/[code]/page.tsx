import { cookies } from "next/headers"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
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
import type { University, UniversityHistoryEntry } from "@/lib/types"
import { formatDate, formatDateTime, truncateHash } from "@/lib/utils"
import { UniversityActions } from "./UniversityActions"

interface Props {
  params: Promise<{ code: string }>
}

async function getData(code: string, token: string) {
  const [uni, history] = await Promise.allSettled([
    apiFetch<University>(`/universities/${code}`),
    apiFetch<UniversityHistoryEntry[]>(`/universities/${code}/history?limit=20`, {}, token),
  ])
  return {
    uni: uni.status === "fulfilled" ? uni.value : null,
    history: history.status === "fulfilled" ? history.value : [],
  }
}

export default async function UniversityDetailPage({ params }: Props) {
  const { code } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value ?? ""

  const { uni, history } = await getData(code, token)

  if (!uni) {
    return (
      <div className="space-y-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/universities"><ArrowLeft className="h-4 w-4 mr-1" />Universities</Link>
        </Button>
        <p className="text-destructive">University &quot;{code}&quot; not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/universities">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Universities
          </Link>
        </Button>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{uni.name}</h1>
          <p className="text-muted-foreground font-mono uppercase text-sm">{uni.university_code}</p>
        </div>
        <Badge variant={uni.is_active ? "default" : "secondary"} className="text-sm">
          {uni.is_active ? "Active" : "Inactive"}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <dt className="text-muted-foreground">Ethereum Address</dt>
            <dd className="font-mono text-xs break-all">{uni.ethereum_address}</dd>
            <dt className="text-muted-foreground">Accreditation ID</dt>
            <dd className="font-mono text-xs">{truncateHash(uni.accreditation_id)}</dd>
            <dt className="text-muted-foreground">Registration Number</dt>
            <dd>{(uni as University & { registration_number?: string }).registration_number ?? "—"}</dd>
            <dt className="text-muted-foreground">FireFly DID</dt>
            <dd className="font-mono text-xs">{uni.firefly_did}</dd>
            <dt className="text-muted-foreground">Registered</dt>
            <dd>{formatDate(uni.created_at)}</dd>
            <dt className="text-muted-foreground">Can Issue</dt>
            <dd>{uni.can_issue_certificates ? "Yes" : "No"}</dd>
          </dl>
        </CardContent>
      </Card>

      <UniversityActions code={code} isActive={uni.is_active} token={token} />

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Audit History</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No history</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>By</TableHead>
                  <TableHead>Tx Hash</TableHead>
                  <TableHead>When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((h) => (
                  <TableRow key={h.id}>
                    <TableCell>
                      <Badge variant="outline">{h.action}</Badge>
                    </TableCell>
                    <TableCell className="text-xs">{h.performed_by}</TableCell>
                    <TableCell className="font-mono text-xs">{truncateHash(h.transaction_hash, 6)}</TableCell>
                    <TableCell className="text-xs">{formatDateTime(h.created_at)}</TableCell>
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
