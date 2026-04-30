import { cookies } from "next/headers"
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
import type { Verifier } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { ApproveButton } from "./ApproveButton"

async function getVerifiers(token: string): Promise<Verifier[]> {
  try {
    return await apiFetch<Verifier[]>("/auth/verifiers", {}, token)
  } catch {
    return []
  }
}

export default async function AdminVerifiersPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value ?? ""
  const verifiers = await getVerifiers(token)

  const pending = verifiers.filter((v) => !v.is_approved)
  const approved = verifiers.filter((v) => v.is_approved)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Verifiers</h1>
        <p className="text-sm text-muted-foreground">
          {pending.length} pending · {approved.length} approved
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pending Approval</CardTitle>
        </CardHeader>
        <CardContent>
          {pending.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No verifiers awaiting approval.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organisation</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pending.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-medium">{v.organisation_name}</TableCell>
                    <TableCell className="font-mono text-xs">{v.email}</TableCell>
                    <TableCell>{formatDate(v.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <ApproveButton verifierId={v.id} email={v.email} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Approved</CardTitle>
        </CardHeader>
        <CardContent>
          {approved.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No approved verifiers yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organisation</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Approved</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approved.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-medium">{v.organisation_name}</TableCell>
                    <TableCell className="font-mono text-xs">{v.email}</TableCell>
                    <TableCell>{v.approved_at ? formatDate(v.approved_at) : "—"}</TableCell>
                    <TableCell>
                      <Badge variant="default">Approved</Badge>
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
