import { cookies } from "next/headers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { apiFetch } from "@/lib/api"
import { formatDateTime } from "@/lib/utils"

interface LogEntry {
  id: string
  organisation_name: string
  token_id: string
  tier: number
  result: boolean
  ip_address: string | null
  verified_at: string
}

interface LogResponse {
  entries: LogEntry[]
  total: number
}

async function getLogs(token: string): Promise<LogResponse> {
  try {
    return await apiFetch<LogResponse>("/verification-log/?limit=100&offset=0", {}, token)
  } catch {
    return { entries: [], total: 0 }
  }
}

export default async function AuditLogPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value ?? ""

  const { entries: logs, total } = await getLogs(token)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Verification Audit Log</h1>
        <p className="text-sm text-muted-foreground">{total} total Tier-2 verification events</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Audit Log</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No Tier-2 verification events yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organisation</TableHead>
                  <TableHead>Token ID</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Verified At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.organisation_name ?? "—"}</TableCell>
                    <TableCell className="font-mono">#{log.token_id}</TableCell>
                    <TableCell>
                      <Badge variant={log.result ? "default" : "destructive"}>
                        {log.result ? "Valid" : "Invalid"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-mono">{log.ip_address ?? "—"}</TableCell>
                    <TableCell className="text-sm">{formatDateTime(log.verified_at)}</TableCell>
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
