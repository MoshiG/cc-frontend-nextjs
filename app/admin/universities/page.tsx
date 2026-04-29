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
import type { University } from "@/lib/types"
import { formatDate } from "@/lib/utils"

async function getUniversities(): Promise<University[]> {
  try {
    return await apiFetch<University[]>("/universities")
  } catch {
    return []
  }
}

export default async function AdminUniversitiesPage() {
  const universities = await getUniversities()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Universities</h1>
          <p className="text-sm text-muted-foreground">{universities.length} registered</p>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/universities/contract-status">Contract Status</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/admin/universities/register">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Register
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Universities</CardTitle>
        </CardHeader>
        <CardContent>
          {universities.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No universities registered yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Ethereum Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {universities.map((uni) => (
                  <TableRow key={uni.university_code}>
                    <TableCell className="font-mono font-medium uppercase">
                      {uni.university_code}
                    </TableCell>
                    <TableCell>{uni.name}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {uni.ethereum_address.slice(0, 10)}…{uni.ethereum_address.slice(-6)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={uni.is_active ? "default" : "secondary"}>
                        {uni.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(uni.created_at)}</TableCell>
                    <TableCell>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/universities/${uni.university_code}`}>View</Link>
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
