"use client"

import { useState } from "react"
import { AppBar } from "../app-bar"
import { BottomNav } from "../bottom-nav"
import {
  CheckCircle, Clock, AlertTriangle, ChevronRight, CheckSquare,
  Square, Users, FileText, Circle, ClipboardList, Calendar, Pill
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ResearchTeamDashboardProps {
  onNavigate: (screen: string) => void
}

type CrcTab = "dashboard" | "patients" | "chat" | "notifs" | "me"
type TaskFilter = "today" | "week" | "overdue" | "completed"

interface Task {
  id: string
  title: string
  patient: string
  priority: "high" | "medium" | "low"
  due: string
  done: boolean
  category: "visit" | "ecrf" | "medication" | "screening"
}

const initialTasks: Task[] = [
  { id: "T1", title: "Log Visit 6 vitals", patient: "SUBJ-001", priority: "high", due: "Today", done: false, category: "visit" },
  { id: "T2", title: "Submit eCRF AE form", patient: "SUBJ-003", priority: "high", due: "Today", done: false, category: "ecrf" },
  { id: "T3", title: "Confirm medication adherence", patient: "SUBJ-002", priority: "medium", due: "Today", done: false, category: "medication" },
  { id: "T4", title: "Screen candidate SCR-021", patient: "New Patient", priority: "medium", due: "Today", done: false, category: "screening" },
  { id: "T5", title: "Prepare Visit 7 checklist", patient: "SUBJ-001", priority: "low", due: "Thu 29", done: false, category: "visit" },
  { id: "T6", title: "Update concomitant meds", patient: "SUBJ-004", priority: "medium", due: "Thu 29", done: false, category: "ecrf" },
  { id: "T7", title: "Follow up deviation DEV-001", patient: "SUBJ-002", priority: "high", due: "Overdue", done: false, category: "visit" },
  { id: "T8", title: "Lab sample collection", patient: "SUBJ-005", priority: "high", due: "Overdue", done: false, category: "visit" },
  { id: "T9", title: "Reviewed ICF for SCR-018", patient: "SCR-018", priority: "low", due: "22 May", done: true, category: "screening" },
]

const todayVisits = [
  { id: "V1", patient: "SUBJ-001", name: "Priya Krishnan", visit: "Visit 6", time: "9:00 AM", type: "Efficacy Assessment", done: false },
  { id: "V2", patient: "SUBJ-003", name: "Anita Patel", visit: "Visit 2", time: "11:30 AM", type: "Safety Follow-up", done: false },
  { id: "V3", patient: "SUBJ-004", name: "Vijay Sharma", visit: "Visit 5", time: "2:00 PM", type: "Lab & Vitals", done: true },
]

const overduePatients = [
  { id: "SUBJ-002", name: "Rahul Mehta", visit: "Visit 4", daysOverdue: 3, lastContact: "19 May" },
]

const pendingSubmissions = [
  { id: "eCRF-014", form: "Vital Signs", patient: "SUBJ-001", visit: "Visit 6", status: "Awaiting PI Review" },
  { id: "DEV-001", form: "Deviation Report", patient: "SUBJ-002", visit: "Visit 3", status: "Awaiting PI Sign-off" },
]

const patients = [
  { id: "SUBJ-001", name: "Priya Krishnan", age: 45, nextVisit: "Visit 7 · 23 May", status: "on-track" },
  { id: "SUBJ-002", name: "Rahul Mehta", age: 52, nextVisit: "Visit 4 · OVERDUE", status: "overdue" },
  { id: "SUBJ-003", name: "Anita Patel", age: 38, nextVisit: "Visit 2 · Today", status: "on-track" },
  { id: "SUBJ-004", name: "Vijay Sharma", age: 61, nextVisit: "Visit 5 · Today", status: "on-track" },
  { id: "SUBJ-005", name: "Deepa Nair", age: 44, nextVisit: "—", status: "withdrawn" },
]

const statusStyle: Record<string, { label: string; bg: string; text: string }> = {
  "on-track": { label: "On Track", bg: "bg-emerald-100", text: "text-emerald-700" },
  overdue:    { label: "Overdue",  bg: "bg-red-100",     text: "text-red-700" },
  withdrawn:  { label: "Withdrawn",bg: "bg-slate-100",   text: "text-slate-500" },
}

const priorityStyle: Record<string, { dot: string; badge: string; badgeText: string }> = {
  high:   { dot: "bg-red-500",   badge: "bg-red-100",   badgeText: "text-red-700" },
  medium: { dot: "bg-amber-400", badge: "bg-amber-100", badgeText: "text-amber-700" },
  low:    { dot: "bg-teal-400",  badge: "bg-teal-100",  badgeText: "text-teal-700" },
}

const categoryIcon: Record<string, React.FC<{ className?: string }>> = {
  visit: Calendar,
  ecrf: FileText,
  medication: Pill,
  screening: Users,
}

export function ResearchTeamDashboard({ onNavigate }: ResearchTeamDashboardProps) {
  const [activeTab, setActiveTab] = useState<CrcTab>("dashboard")
  const [taskFilter, setTaskFilter] = useState<TaskFilter>("today")
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [completedVisits, setCompletedVisits] = useState<Set<string>>(new Set(
    todayVisits.filter(v => v.done).map(v => v.id)
  ))

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const markVisitDone = (id: string) => {
    setCompletedVisits(prev => new Set([...prev, id]))
  }

  const filteredTasks = tasks.filter(t => {
    if (taskFilter === "today") return t.due === "Today" && !t.done
    if (taskFilter === "week") return (t.due !== "Overdue" && t.due !== "Today") && !t.done
    if (taskFilter === "overdue") return t.due === "Overdue" && !t.done
    if (taskFilter === "completed") return t.done
    return true
  })

  const todayTasksDone = tasks.filter(t => t.due === "Today" && t.done).length
  const todayTasksTotal = tasks.filter(t => t.due === "Today").length

  // ── Dashboard tab ────────────────────────────────────────────────────────
  const renderDashboard = () => (
    <div className="flex-1 overflow-auto pb-4 space-y-4 pt-4">
      {/* Hero */}
      <div className="px-4">
        <div className="bg-gradient-to-br from-[#0D1B3E] via-[#1A3872] to-[#2563EB] rounded-2xl p-5 text-white shadow-lg">
          <h2 className="text-xl font-bold mb-0.5 font-[family-name:var(--font-heading)]">Good morning, Meera</h2>
          <p className="text-blue-200 text-sm mb-4">CRC · Protocol-001 · Site 02</p>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-1.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-400 to-teal-300 transition-all duration-500"
              style={{ width: `${todayTasksTotal > 0 ? (todayTasksDone / todayTasksTotal) * 100 : 0}%` }}
            />
          </div>
          <p className="text-xs text-blue-200">{todayTasksDone}/{todayTasksTotal} tasks done today</p>
        </div>
      </div>

      {/* My Tasks Today */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-[#0F172A] font-[family-name:var(--font-heading)]">My Tasks Today</h3>
          <button
            onClick={() => setActiveTab("tasks")}
            className="text-xs text-[#2563EB] font-medium flex items-center gap-0.5"
          >
            All Tasks <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="space-y-2">
          {tasks.filter(t => t.due === "Today").map((task) => {
            const style = priorityStyle[task.priority]
            const Icon = categoryIcon[task.category]
            return (
              <div
                key={task.id}
                className={cn("bg-white rounded-2xl p-3 shadow-sm flex items-center gap-3 transition-opacity", task.done && "opacity-50")}
              >
                <button onClick={() => toggleTask(task.id)} className="shrink-0">
                  {task.done
                    ? <CheckSquare className="w-5 h-5 text-teal-500" />
                    : <Square className="w-5 h-5 text-slate-300" />
                  }
                </button>
                <div className={cn("w-1 h-8 rounded-full shrink-0", style.dot)} />
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm font-medium text-[#0F172A]", task.done && "line-through text-slate-400")}>
                    {task.title}
                  </p>
                  <p className="text-xs text-slate-400">{task.patient}</p>
                </div>
                <Icon className="w-4 h-4 text-slate-300 shrink-0" />
              </div>
            )
          })}
        </div>
      </div>

      {/* Today's Visits */}
      <div className="px-4">
        <h3 className="font-semibold text-[#0F172A] mb-2 font-[family-name:var(--font-heading)]">Today's Visits</h3>
        <div className="space-y-2">
          {todayVisits.map((visit) => {
            const done = completedVisits.has(visit.id)
            return (
              <div key={visit.id} className={cn("bg-white rounded-2xl p-4 shadow-sm border-l-4 transition-all", done ? "border-teal-400" : "border-[#2563EB]")}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#0F172A] text-sm">{visit.name}</p>
                    <p className="text-xs text-slate-400">{visit.patient} · {visit.visit}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {visit.time}
                      </span>
                      <span className="text-xs text-slate-500">{visit.type}</span>
                    </div>
                  </div>
                  {done ? (
                    <div className="flex items-center gap-1 text-teal-600 text-xs font-medium">
                      <CheckCircle className="w-4 h-4" /> Done
                    </div>
                  ) : (
                    <button
                      onClick={() => markVisitDone(visit.id)}
                      className="bg-[#0D1B3E] text-white px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0"
                    >
                      Mark Done
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Overdue */}
      {overduePatients.length > 0 && (
        <div className="px-4">
          <h3 className="font-semibold text-[#0F172A] mb-2 font-[family-name:var(--font-heading)]">Overdue</h3>
          {overduePatients.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-red-400">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-[#0F172A] text-sm">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.id} · {p.visit}</p>
                  <p className="text-xs text-red-500 mt-1">{p.daysOverdue} days overdue · Last: {p.lastContact}</p>
                </div>
                <button className="bg-red-50 border border-red-200 text-red-700 px-3 py-1.5 rounded-xl text-xs font-semibold">
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pending Submissions */}
      <div className="px-4">
        <h3 className="font-semibold text-[#0F172A] mb-2 font-[family-name:var(--font-heading)]">Pending Submissions</h3>
        <div className="space-y-2">
          {pendingSubmissions.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-3 shadow-sm flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#0F172A]">{item.id}: {item.form}</p>
                <p className="text-xs text-slate-400">{item.patient} · {item.visit}</p>
              </div>
              <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium shrink-0">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // ── Patients tab (operational) ───────────────────────────────────────────
  const renderPatients = () => (
    <div className="flex-1 overflow-auto pb-4 pt-4 px-4 space-y-2">
      {patients.map((p) => {
        const style = statusStyle[p.status]
        return (
          <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-[#0F172A]">{p.name}</p>
                <p className="text-xs text-slate-400">{p.id} · Age {p.age}</p>
              </div>
              <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-medium", style.bg, style.text)}>
                {style.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
              <Clock className="w-3 h-3" /> {p.nextVisit}
            </p>
            {p.status !== "withdrawn" && (
              <div className="flex gap-2">
                <button className="flex-1 bg-[#0D1B3E] text-white py-2 rounded-xl text-xs font-semibold">
                  Log Visit
                </button>
                <button className="flex-1 bg-slate-50 border border-slate-200 text-slate-700 py-2 rounded-xl text-xs font-semibold">
                  View Record
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )

  // ── Tasks tab ────────────────────────────────────────────────────────────
  const renderTasks = () => (
    <div className="flex-1 overflow-auto pb-4 pt-4">
      {/* Filter pills */}
      <div className="px-4 mb-4 flex gap-2 overflow-x-auto no-scrollbar">
        {(["today", "week", "overdue", "completed"] as const).map((f) => {
          const labels: Record<TaskFilter, string> = { today: "Today", week: "This Week", overdue: "Overdue", completed: "Completed" }
          const count = tasks.filter(t => {
            if (f === "today") return t.due === "Today" && !t.done
            if (f === "week") return (t.due !== "Overdue" && t.due !== "Today") && !t.done
            if (f === "overdue") return t.due === "Overdue" && !t.done
            if (f === "completed") return t.done
          }).length
          return (
            <button
              key={f}
              onClick={() => setTaskFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0",
                taskFilter === f
                  ? "bg-[#0D1B3E] text-white"
                  : "bg-white text-slate-500 border border-slate-200"
              )}
            >
              {labels[f]} {count > 0 && <span className="ml-1 opacity-70">({count})</span>}
            </button>
          )
        })}
      </div>

      <div className="px-4 space-y-2">
        {filteredTasks.length === 0 && (
          <div className="bg-white rounded-2xl p-6 text-center text-slate-400 text-sm shadow-sm">
            No tasks in this category
          </div>
        )}
        {filteredTasks.map((task) => {
          const style = priorityStyle[task.priority]
          const Icon = categoryIcon[task.category]
          return (
            <div
              key={task.id}
              className={cn("bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3", task.done && "opacity-60")}
            >
              <button onClick={() => toggleTask(task.id)} className="shrink-0">
                {task.done
                  ? <CheckSquare className="w-5 h-5 text-teal-500" />
                  : <Square className="w-5 h-5 text-slate-300" />
                }
              </button>
              <div className={cn("w-1 h-10 rounded-full shrink-0", style.dot)} />
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-medium text-[#0F172A]", task.done && "line-through text-slate-400")}>
                  {task.title}
                </p>
                <p className="text-xs text-slate-400">{task.patient}</p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium", style.badge, style.badgeText)}>
                  {task.priority}
                </span>
                <span className={cn("text-[10px]", task.due === "Overdue" ? "text-red-500 font-medium" : "text-slate-400")}>
                  {task.due}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  // ── Profile / Me tab ─────────────────────────────────────────────────────
  const renderMe = () => (
    <div className="flex-1 overflow-auto pb-4 pt-6 px-4">
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full bg-[#0D9488] flex items-center justify-center text-white text-2xl font-bold mb-3">MC</div>
        <h2 className="text-lg font-bold text-[#0F172A] font-[family-name:var(--font-heading)]">Meera CRC</h2>
        <p className="text-sm text-slate-500">Clinical Research Coordinator · Site 02</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm divide-y divide-slate-50">
        {[
          { label: "Protocol", value: "Protocol-001" },
          { label: "Site", value: "Apollo Hospital, Chennai" },
          { label: "Assigned Patients", value: "4 active" },
          { label: "GCP Certification", value: "Valid till Jun 2026" },
        ].map(({ label, value }) => (
          <div key={label} className="px-4 py-3 flex justify-between">
            <span className="text-sm text-slate-500">{label}</span>
            <span className="text-sm font-medium text-[#0F172A]">{value}</span>
          </div>
        ))}
      </div>
      <button
        onClick={() => onNavigate("welcome")}
        className="mt-6 w-full py-3 rounded-xl border border-red-200 text-red-600 text-sm font-semibold"
      >
        Sign Out
      </button>
    </div>
  )

  return (
    <div className="h-full flex flex-col bg-[#F8FAFC]">
      <AppBar
        title="Research Team"
        subtitle="Meera · CRC · Protocol-001"
        notificationCount={2}
        avatar="MC"
        onNotificationClick={() => onNavigate("notifications")}
        onAvatarClick={() => setActiveTab("me")}
      />

      {activeTab === "dashboard" && renderDashboard()}
      {activeTab === "patients" && renderPatients()}
      {activeTab === "notifs" && (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
          Notifications coming soon
        </div>
      )}
      {activeTab === "me" && renderMe()}

      <BottomNav
        activeTab={activeTab}
        role="crc"
        notificationCount={2}
        onTabChange={(tab) => {
          if (tab === "chat") { onNavigate("chat"); return }
          setActiveTab(tab as CrcTab)
        }}
      />
    </div>
  )
}
