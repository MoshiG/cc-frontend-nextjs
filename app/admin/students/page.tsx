import { cookies } from "next/headers"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import type { Student } from "@/lib/types"
import { formatDate } from "@/lib/utils"

interface StudentListResp {
  students: Student[]
  total: number
  limit: number
  offset: number
}

async function getStudents(token: string): Promise<StudentListResp> {
  try {
    return await apiFetch<StudentListResp>("/students?limit=100&offset=0", {}, token)
  } catch {
    return { students: [], total: 0, limit: 100, offset: 0 }
  }
}

export default async function AdminStudentsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value ?? ""
  const { students, total } = await getStudents(token)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Students</h1>
          <p className="text-sm text-muted-foreground">{total} total</p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/students/register">
            <Plus className="h-3.5 w-3.5 mr-1" />
            Register Student
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Students</CardTitle>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No students registered yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>University</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((s) => (
                  <TableRow key={s.student_id}>
                    <TableCell className="font-mono text-sm">{s.student_id}</TableCell>
                    <TableCell>{s.first_name} {s.last_name}</TableCell>
                    <TableCell className="text-sm">{s.email}</TableCell>
                    <TableCell className="uppercase">{s.university_code}</TableCell>
                    <TableCell className="text-sm">{s.program}</TableCell>
                    <TableCell className="text-sm">{formatDate(s.created_at)}</TableCell>
                    <TableCell>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/students/${s.student_id}`}>View</Link>
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
