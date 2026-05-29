"use client"

import { useState } from "react"
import { ArrowLeft, ChevronLeft, ChevronRight, RefreshCw, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CalendarWeekScreenProps {
  onBack?: () => void
  onNavigate?: (screen: string) => void
}

const weekVisits = [
  { id: "1", day: "Mon", date: 19, time: "09:00", subjectId: "SUBJ-001", visit: "Visit 3", protocol: "Protocol-001", status: "scheduled" },
  { id: "2", day: "Mon", date: 19, time: "11:00", subjectId: "SUBJ-003", visit: "Visit 5", protocol: "Protocol-001", status: "overdue" },
  { id: "3", day: "Tue", date: 20, time: "10:00", subjectId: "SUBJ-002", visit: "Visit 2", protocol: "Protocol-002", status: "scheduled" },
  { id: "4", day: "Wed", date: 21, time: "09:30", subjectId: "SUBJ-005", visit: "Visit 4", protocol: "Protocol-001", status: "completed" },
  { id: "5", day: "Wed", date: 21, time: "14:00", subjectId: "SUBJ-006", visit: "Visit 1", protocol: "Protocol-003", status: "scheduled" },
  { id: "6", day: "Thu", date: 22, time: "10:00", subjectId: "SUBJ-004", visit: "Visit 6", protocol: "Protocol-002", status: "scheduled" },
  { id: "7", day: "Fri", date: 23, time: "09:00", subjectId: "SUBJ-007", visit: "Visit 2", protocol: "Protocol-001", status: "scheduled" },
  { id: "8", day: "Fri", date: 23, time: "15:00", subjectId: "SUBJ-008", visit: "Visit 3", protocol: "Protocol-002", status: "completed" },
]

const weekDays = [
  { day: "Sun", date: 18 },
  { day: "Mon", date: 19 },
  { day: "Tue", date: 20 },
  { day: "Wed", date: 21 },
  { day: "Thu", date: 22 },
  { day: "Fri", date: 23 },
  { day: "Sat", date: 24 },
]

type PeriodType = "prev-month" | "prev-week" | "current" | "next-week" | "next-month" | "overall"

const timeSlots = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

const periodLabels: Record<PeriodType, string> = {
  "prev-month": "Prev Month",
  "prev-week": "Prev Week",
  "current": "Current Week",
  "next-week": "Next Week",
  "next-month": "Next Month",
  "overall": "Overall",
}

const weekRanges: Record<PeriodType, string> = {
  "prev-month": "21 Apr – 27 Apr 2025",
  "prev-week": "11–17 May 2025",
  "current": "18–24 May 2025",
  "next-week": "25–31 May 2025",
  "next-month": "22–28 Jun 2025",
  "overall": "All Visits",
}

export function CalendarWeekScreen({ onBack, onNavigate }: CalendarWeekScreenProps) {
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("week")
  const [period, setPeriod] = useState<PeriodType>("current")
  const [showPeriodPicker, setShowPeriodPicker] = useState(false)

  const getVisitsForDayAndTime = (date: number, time: string) => {
    return weekVisits.filter((v) => v.date === date && v.time === time)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return { bg: "bg-teal-100", border: "border-teal-300", text: "text-teal-700" }
      case "overdue":
        return { bg: "bg-red-100", border: "border-red-300", text: "text-red-700" }
      default:
        return { bg: "bg-blue-100", border: "border-blue-300", text: "text-blue-700" }
    }
  }

  const hasEventsOnDay = (date: number) => {
    return weekVisits.some((v) => v.date === date)
  }

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex items-center gap-2 relative">
            <button onClick={() => {
              const order: PeriodType[] = ["prev-month","prev-week","current","next-week","next-month","overall"]
              const idx = order.indexOf(period); if (idx > 0) setPeriod(order[idx - 1])
            }} className="p-1 hover:bg-gray-100 rounded">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button onClick={() => setShowPeriodPicker(!showPeriodPicker)} className="text-center">
              <h1 className="text-sm font-semibold text-[#0D1B3E]">{weekRanges[period]}</h1>
              <p className="text-[10px] text-gray-400">{periodLabels[period]}</p>
            </button>
            <button onClick={() => {
              const order: PeriodType[] = ["prev-month","prev-week","current","next-week","next-month","overall"]
              const idx = order.indexOf(period); if (idx < order.length - 1) setPeriod(order[idx + 1])
            }} className="p-1 hover:bg-gray-100 rounded">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
            {showPeriodPicker && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden min-w-[140px]">
                {(["prev-month","prev-week","current","next-week","next-month","overall"] as PeriodType[]).map(p => (
                  <button key={p} onClick={() => { setPeriod(p); setShowPeriodPicker(false) }}
                    className={cn("w-full px-4 py-2.5 text-left text-xs whitespace-nowrap", period === p ? "bg-[#1A3872] text-white" : "hover:bg-gray-50 text-gray-700")}>
                    {periodLabels[p]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex gap-1 p-2 mx-4 mt-3 bg-gray-100 rounded-xl">
        <Button
          size="sm"
          variant={viewMode === "day" ? "default" : "ghost"}
          onClick={() => onNavigate?.("calendar-day")}
          className={`flex-1 h-8 rounded-lg text-xs font-medium ${
            viewMode === "day" ? "bg-white shadow-sm text-[#0D1B3E]" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Day
        </Button>
        <Button
          size="sm"
          variant={viewMode === "week" ? "default" : "ghost"}
          onClick={() => setViewMode("week")}
          className={`flex-1 h-8 rounded-lg text-xs font-medium ${
            viewMode === "week" ? "bg-white shadow-sm text-[#0D1B3E]" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Week
        </Button>
        <Button
          size="sm"
          variant={viewMode === "month" ? "default" : "ghost"}
          onClick={() => onNavigate?.("calendar-month")}
          className={`flex-1 h-8 rounded-lg text-xs font-medium ${
            viewMode === "month" ? "bg-white shadow-sm text-[#0D1B3E]" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Month
        </Button>
      </div>

      {/* Week Day Headers */}
      <div className="flex px-4 mt-3 pb-2 border-b border-gray-200">
        <div className="w-12 flex-shrink-0" /> {/* Time column spacer */}
        {weekDays.map((day) => (
          <div
            key={day.day}
            className="flex-1 text-center"
          >
            <p className="text-xs text-gray-500">{day.day}</p>
            <div className="relative inline-flex items-center justify-center">
              <p
                className={`text-sm font-semibold ${
                  day.date === 21 ? "text-white" : "text-[#0D1B3E]"
                }`}
              >
                {day.date}
              </p>
              {day.date === 21 && (
                <div className="absolute inset-0 -z-10 w-7 h-7 bg-[#2563EB] rounded-full mx-auto" style={{ left: "50%", transform: "translateX(-50%)" }} />
              )}
              {hasEventsOnDay(day.date) && day.date !== 21 && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#2563EB] rounded-full" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Time Grid */}
      <div className="flex-1 overflow-auto">
        <div className="relative">
          {timeSlots.map((time) => (
            <div key={time} className="flex h-16 border-b border-gray-100">
              {/* Time Label */}
              <div className="w-12 flex-shrink-0 pr-2 text-right">
                <span className="text-xs text-gray-400">{time}</span>
              </div>
              
              {/* Day Columns */}
              {weekDays.map((day) => {
                const visits = getVisitsForDayAndTime(day.date, time)
                return (
                  <div
                    key={`${day.date}-${time}`}
                    className="flex-1 border-l border-gray-100 px-0.5 py-0.5 relative"
                  >
                    {visits.map((visit) => {
                      const colors = getStatusColor(visit.status)
                      return (
                        <div
                          key={visit.id}
                          onClick={() => onNavigate?.("visit-detail")}
                          className={`absolute inset-x-0.5 top-0.5 p-1 rounded ${colors.bg} border ${colors.border} cursor-pointer hover:opacity-80 transition-opacity overflow-hidden`}
                          style={{ height: "calc(100% - 4px)" }}
                        >
                          <p className={`text-[10px] font-medium ${colors.text} truncate`}>
                            {visit.subjectId}
                          </p>
                          <p className={`text-[9px] ${colors.text} truncate opacity-75`}>
                            {visit.visit}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 p-3 bg-white border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
          <span className="text-xs text-gray-500">Scheduled</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#0D9488]" />
          <span className="text-xs text-gray-500">Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
          <span className="text-xs text-gray-500">Overdue</span>
        </div>
      </div>
    </div>
  )
}
