"use client"

import { usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/layout/AdminSidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/admin"

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="flex flex-1">
      <AdminSidebar />
      <div className="flex-1 p-6 overflow-auto">{children}</div>
    </div>
  )
}
