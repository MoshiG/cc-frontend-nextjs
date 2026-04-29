import { University } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Props {
  code: string
  name?: string
  active?: boolean
  className?: string
}

export function UniversityBadge({ code, name, active = true, className }: Props) {
  return (
    <Badge
      variant={active ? "secondary" : "outline"}
      className={cn("gap-1 font-mono text-xs uppercase", className)}
    >
      <University className="h-3 w-3" />
      {name ?? code}
    </Badge>
  )
}
