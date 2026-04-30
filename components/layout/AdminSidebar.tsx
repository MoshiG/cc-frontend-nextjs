"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  University,
  Users,
  FileText,
  ClipboardList,
  ShieldCheck,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/universities", label: "Universities", icon: University },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/certificates", label: "Certificates", icon: FileText },
  { href: "/admin/verifiers", label: "Verifiers", icon: ShieldCheck },
  { href: "/admin/audit-log", label: "Audit Log", icon: ClipboardList },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 border-r min-h-[calc(100vh-3.5rem)] bg-muted/30 hidden md:block">
      <nav className="p-3 flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
              {active && <ChevronRight className="h-3 w-3 ml-auto" />}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
