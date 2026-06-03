import * as React from "react"
import type { LucideIcon } from "lucide-react"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type KpiTone = "default" | "primary" | "success" | "warning" | "destructive"

const toneClasses: Record<KpiTone, { card: string; icon: string; value: string; label: string }> = {
  default: {
    card: "bg-card border-border",
    icon: "bg-muted text-muted-foreground",
    value: "text-foreground",
    label: "text-muted-foreground",
  },
  primary: {
    card: "bg-primary border-primary text-primary-foreground",
    icon: "bg-primary-foreground/15 text-primary-foreground",
    value: "text-primary-foreground",
    label: "text-primary-foreground/70",
  },
  success: {
    card: "bg-success/5 border-success/20",
    icon: "bg-success/10 text-success",
    value: "text-foreground",
    label: "text-muted-foreground",
  },
  warning: {
    card: "bg-warning/5 border-warning/20",
    icon: "bg-warning/10 text-warning",
    value: "text-foreground",
    label: "text-muted-foreground",
  },
  destructive: {
    card: "bg-destructive/5 border-destructive/20",
    icon: "bg-destructive/10 text-destructive",
    value: "text-destructive",
    label: "text-muted-foreground",
  },
}

interface KpiCardProps extends React.ComponentProps<"div"> {
  icon?: LucideIcon
  value: React.ReactNode
  label: string
  hint?: string
  tone?: KpiTone
}

export function KpiCard({
  icon: Icon,
  value,
  label,
  hint,
  tone = "default",
  className,
  ...props
}: KpiCardProps) {
  const t = toneClasses[tone]
  return (
    <Card
      className={cn(
        "shadow-none gap-3 rounded-xl p-4 py-4",
        t.card,
        className,
      )}
      {...props}
    >
      {Icon && (
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-md", t.icon)}>
          <Icon className="h-4 w-4" />
        </div>
      )}
      <div className="space-y-0.5">
        <p className={cn("font-heading text-2xl font-semibold leading-none", t.value)}>{value}</p>
        <p className={cn("text-xs", t.label)}>{label}</p>
        {hint && <p className={cn("text-xs", t.label, "opacity-80")}>{hint}</p>}
      </div>
    </Card>
  )
}
