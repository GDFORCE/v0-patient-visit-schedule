"use client"

import { ChevronLeft, Bell, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface AppBarProps {
  title: string
  subtitle?: string
  showBack?: boolean
  onBack?: () => void
  rightContent?: React.ReactNode
  notificationCount?: number
  onNotificationClick?: () => void
  onCalendarClick?: () => void
  avatar?: string
  onAvatarClick?: () => void
  className?: string
}

export function AppBar({
  title,
  subtitle,
  showBack,
  onBack,
  rightContent,
  notificationCount,
  onNotificationClick,
  onCalendarClick,
  avatar,
  onAvatarClick,
  className,
}: AppBarProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between gap-3 bg-primary text-primary-foreground px-4 py-3",
        className,
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        {showBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="-ml-1 flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-primary-foreground/10"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="font-heading text-base font-semibold leading-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-primary-foreground/70 leading-tight truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {rightContent}
        {onCalendarClick && (
          <button
            type="button"
            onClick={onCalendarClick}
            aria-label="Calendar"
            className="relative flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-primary-foreground/10"
          >
            <Calendar className="h-5 w-5" />
          </button>
        )}
        {notificationCount !== undefined && (
          <button
            type="button"
            onClick={onNotificationClick}
            aria-label={
              notificationCount > 0
                ? `Notifications, ${notificationCount} unread`
                : "Notifications"
            }
            className="relative flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-primary-foreground/10"
          >
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <span
                aria-hidden
                className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-none text-white"
              >
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </button>
        )}
        {avatar && (
          <button
            type="button"
            onClick={onAvatarClick}
            aria-label="Account"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/15 text-xs font-semibold transition-colors hover:bg-primary-foreground/25"
          >
            {avatar}
          </button>
        )}
      </div>
    </header>
  )
}
