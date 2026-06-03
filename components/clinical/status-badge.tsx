import * as React from "react"
import type { VariantProps } from "class-variance-authority"

import { Badge, badgeVariants } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type StatusTone = "success" | "warning" | "destructive" | "info" | "muted"

const toneClasses: Record<StatusTone, string> = {
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  destructive: "bg-destructive/10 text-destructive border-destructive/20",
  info: "bg-secondary text-secondary-foreground border-secondary",
  muted: "bg-muted text-muted-foreground border-border",
}

const statusToneMap: Record<string, StatusTone> = {
  Active: "success",
  Completed: "success",
  "Screen Pass": "success",
  Overdue: "destructive",
  "Screen Fail": "destructive",
  Terminated: "destructive",
  Failed: "destructive",
  Screening: "warning",
  Pending: "warning",
  Scheduled: "info",
  Upcoming: "info",
  Withdrawn: "muted",
  Inactive: "muted",
  "Drop Out": "muted",
  Dropout: "muted",
}

type ShadcnVariant = VariantProps<typeof badgeVariants>["variant"]

interface StatusBadgeProps
  extends Omit<React.ComponentProps<typeof Badge>, "variant" | "children"> {
  status: string
  tone?: StatusTone
  variant?: ShadcnVariant
  children?: React.ReactNode
}

export function StatusBadge({
  status,
  tone,
  variant = "outline",
  className,
  children,
  ...props
}: StatusBadgeProps) {
  const resolvedTone: StatusTone = tone ?? statusToneMap[status] ?? "muted"
  return (
    <Badge
      variant={variant}
      className={cn(toneClasses[resolvedTone], "font-medium", className)}
      {...props}
    >
      {children ?? status}
    </Badge>
  )
}
