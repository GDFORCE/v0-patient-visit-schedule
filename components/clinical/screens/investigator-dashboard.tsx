"use client"

import { useState, useRef } from "react"
import {
  LayoutDashboard, Users, CalendarDays, Bell, User,
  ChevronRight, ChevronDown, Plus, AlertTriangle,
  Clock, FileEdit, Pill, UserPlus, ClipboardCheck,
  AlertOctagon, CheckCircle, X, Phone, MessageSquare,
  FileCheck, Camera, RotateCcw, Package, Eye,
  Building2, Activity, Stethoscope, Droplets, Heart,
  UserPen, Lock, LogOut, Shield, MapPin, Check,
  CalendarCheck, CalendarRange, Search, UserCheck
} from "lucide-react"
import { cn } from "@/lib/utils"

interface InvestigatorDashboardProps {
  onNavigate: (screen: string) => void
}

const mockData = {
  pi: { name: "Dr. Rajesh Kumar", initials: "DR", site: "Apollo Hospitals Mumbai", email: "r.kumar@apollo.com" },
  protocols: [
    { id: "Protocol-A", name: "Diabetes Phase II", indication: "Type 2 Diabetes" },
    { id: "Protocol-B", name: "Hypertension Study", indication: "Hypertension" },
    { id: "Protocol-C", name: "Oncology Phase I", indication: "NSCLC" },
  ],
  weekStrip: [
    { day: "Mon", date: 19, visits: 2, isToday: true },
    { day: "Tue", date: 20, visits: 0, isToday: false },
    { day: "Wed", date: 21, visits: 3, isToday: false },
    { day: "Thu", date: 22, visits: 1, isToday: false },
    { day: "Fri", date: 23, visits: 3, isToday: false },
  ],
  todayVisits: [
    { subjectId: "SUBJ-001", protocol: "Protocol-A", visitName: "Follow-Up 3", visitNum: 3, time: "09:00", status: "Scheduled", type: "Hospital", window: "17–24 May 2025" },
    { subjectId: "SUBJ-007", protocol: "Protocol-B", visitName: "Screening", visitNum: 1, time: "11:30", status: "Screening", type: "Hospital", window: "15–22 May 2025" },
    { subjectId: "SUBJ-011", protocol: "Protocol-A", visitName: "Follow-Up 5", visitNum: 5, time: "14:00", status: "Scheduled", type: "Telephonic", window: "18–25 May 2025" },
  ],
  overduePatients: [
    { subjectId: "SUBJ-003", protocol: "Protocol-C", visitName: "Visit 5", daysOverdue: 4, windowClosed: "15 May 2025" },
    { subjectId: "SUBJ-009", protocol: "Protocol-A", visitName: "Visit 7", daysOverdue: 1, windowClosed: "today" },
  ],
  pendingEcrfList: [
    { subjectId: "SUBJ-001", visitName: "Visit 2", completedDate: "14 May 2025" },
    { subjectId: "SUBJ-007", visitName: "Visit 1", completedDate: "17 May 2025" },
    { subjectId: "SUBJ-003", visitName: "Visit 4", completedDate: "18 May 2025" },
  ],
  patients: [
    { subjectId: "SUBJ-001", initials: "PS", name: "Priya S.", protocol: "Protocol-A", status: "Active", visitProgress: "7/10", nextVisit: "Follow-Up 3", nextDate: "28 May", window: "25 May – 1 Jun", avatarColor: "bg-blue-500" },
    { subjectId: "SUBJ-003", initials: "AK", name: "Anand K.", protocol: "Protocol-C", status: "Overdue", visitProgress: "5/8", nextVisit: "Visit 5", nextDate: "overdue", window: "closed 15 May", avatarColor: "bg-red-500" },
    { subjectId: "SUBJ-007", initials: "MR", name: "Meena R.", protocol: "Protocol-B", status: "Screening", visitProgress: "1/12", nextVisit: "Screening", nextDate: "Today", window: "15–22 May", avatarColor: "bg-amber-500" },
    { subjectId: "SUBJ-009", initials: "VT", name: "Vijay T.", protocol: "Protocol-A", status: "Overdue", visitProgress: "7/10", nextVisit: "Visit 7", nextDate: "overdue", window: "closes today", avatarColor: "bg-red-400" },
    { subjectId: "SUBJ-011", initials: "SP", name: "Sonal P.", protocol: "Protocol-A", status: "Active", visitProgress: "5/10", nextVisit: "Follow-Up 5", nextDate: "21 May", window: "18–25 May", avatarColor: "bg-teal-500" },
    { subjectId: "SUBJ-014", initials: "RM", name: "Rajan M.", protocol: "Protocol-B", status: "Active", visitProgress: "3/12", nextVisit: "Follow-Up 1", nextDate: "25 May", window: "22–29 May", avatarColor: "bg-purple-500" },
  ],
  notifications: [
    { id: 1, type: "overdue", icon: AlertTriangle, color: "bg-red-100 text-red-600", title: "SUBJ-003 — Visit overdue", message: "Visit 5 was due 4 days ago. Window closed 15 May. Protocol deviation risk.", time: "2h ago", unread: true, action: "View Visit" },
    { id: 2, type: "ecrf", icon: FileEdit, color: "bg-purple-100 text-purple-600", title: "eCRF pending — SUBJ-001", message: "Visit 2 completed 14 May. eCRF not yet submitted to the system.", time: "5h ago", unread: true, action: "Open eCRF" },
    { id: 3, type: "complete", icon: Check, color: "bg-teal-100 text-teal-600", title: "SUBJ-007 Visit 1 completed", message: "Screening visit marked complete. Next visit: Visit 2 on 1 Jun 2025.", time: "1d ago", unread: false, action: "View Patient" },
    { id: 4, type: "trial", icon: Bell, color: "bg-blue-100 text-blue-600", title: "Protocol-D assigned to your site", message: "Oncology Phase II has been added to Apollo Mumbai. 30 patients target.", time: "2d ago", unread: false, action: "View Trial" },
    { id: 5, type: "medication", icon: Pill, color: "bg-amber-100 text-amber-600", title: "Medication non-compliance — SUBJ-011", message: "Patient reported medication not taken on 18 May. Scheduled 8:00 PM.", time: "3d ago", unread: false, action: "View Patient" },
  ],
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Active: "bg-teal-100 text-teal-700", Overdue: "bg-red-100 text-red-700",
    Screening: "bg-amber-100 text-amber-700", "Screen Fail": "bg-red-100 text-red-700",
    Withdrawn: "bg-slate-100 text-slate-600", Completed: "bg-green-100 text-green-700", Scheduled: "bg-blue-100 text-blue-700",
  }
  return <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", map[status] || "bg-slate-100 text-slate-600")}>{status}</span>
}

export function InvestigatorDashboard({ onNavigate }: InvestigatorDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedProtocol, setSelectedProtocol] = useState("all")
  const [showProtocolSheet, setShowProtocolSheet] = useState(false)
  const [fabOpen, setFabOpen] = useState(false)
  const [patientFilter, setPatientFilter] = useState("All")
  const [notifFilter, setNotifFilter] = useState("All")
  const [notifications, setNotifications] = useState(mockData.notifications)
  const [selectedPatient, setSelectedPatient] = useState<typeof mockData.patients[0] | null>(null)
  const [selectedVisit, setSelectedVisit] = useState<typeof mockData.todayVisits[0] | null>(null)
  const [completedVisits, setCompletedVisits] = useState<string[]>([])
  const [visitTasks, setVisitTasks] = useState({ vitals: false, blood: false, ecg: false, exam: false, visual: false })
  const [visitNotes, setVisitNotes] = useState("")
  const [deviationFlagged, setDeviationFlagged] = useState(false)
  const [visitStatus, setVisitStatus] = useState<string | null>(null)
  const [meScreen, setMeScreen] = useState<"main" | "editProfile" | "notifPrefs" | "deviations" | "crcTeam">("main")

  const unreadCount = notifications.filter(n => n.unread).length
  const visitStatusOptions = ["Completed", "Scheduled", "Screen Pass", "Screen Fail", "Withdrawn", "Drop Out"]

  const statusBorderMap: Record<string, string> = {
    Scheduled: "border-[#2563EB]", Screening: "border-amber-400", Completed: "border-[#0D9488]", Overdue: "border-red-500",
  }

  // ── Visit Detail ─────────────────────────────────────
  if (selectedVisit) {
    const v = selectedVisit
    return (
      <div className="h-full flex flex-col bg-[#F8FAFC]">
        <div className="bg-[#0D1B3E] text-white px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSelectedVisit(null)}><ChevronRight className="w-5 h-5 rotate-180" /></button>
          <span className="font-semibold flex-1">Visit Detail</span>
          <button><UserPen className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-auto pb-24 px-4 py-4 space-y-4">
          {/* Info Card */}
          <div className="bg-[#0D1B3E] rounded-2xl p-5 text-white">
            <h2 className="font-bold text-base mb-1">{v.visitName}</h2>
            <p className="text-blue-200 text-sm">{v.subjectId} · {v.protocol}</p>
            <p className="text-blue-200 text-sm">Apollo Mumbai</p>
            <div className="mt-3 space-y-1 text-sm">
              <p className="text-blue-100">📅 19 May 2025 · {v.time} AM</p>
              <p className="text-blue-100">🪟 Window: {v.window}</p>
              <p className="text-blue-100">{v.type === "Hospital" ? "🏥 Hospital Visit" : "📞 Telephonic"}</p>
              <p className="text-blue-100">👤 PI: {mockData.pi.name}</p>
            </div>
          </div>
          {/* Visit Status */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Visit Status</p>
            <div className="grid grid-cols-2 gap-2">
              {visitStatusOptions.map(s => (
                <button key={s} onClick={() => setVisitStatus(s)} className={cn("border-2 rounded-xl p-3 text-sm font-medium text-center transition-all", visitStatus === s ? "border-[#2563EB] bg-blue-50 text-[#2563EB]" : "border-slate-100 bg-white text-slate-600")}>
                  {visitStatus === s && <CheckCircle className="w-3.5 h-3.5 inline-block mr-1 text-[#2563EB]" />}{s}
                </button>
              ))}
            </div>
          </div>
          {/* Clinical Tasks */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Clinical Tasks</p>
            <div className="space-y-3">
              {[
                { key: "vitals", icon: Activity, label: "Vital signs" },
                { key: "blood", icon: Droplets, label: "Blood draw" },
                { key: "ecg", icon: Heart, label: "ECG" },
                { key: "exam", icon: Stethoscope, label: "Physical exam" },
                { key: "visual", icon: Eye, label: "Visual acuity" },
              ].map(task => {
                const checked = visitTasks[task.key as keyof typeof visitTasks]
                const Icon = task.icon
                return (
                  <button key={task.key} onClick={() => setVisitTasks(prev => ({ ...prev, [task.key]: !checked }))} className={cn("w-full flex items-center gap-3 p-2 rounded-xl transition-colors", checked ? "bg-teal-50" : "")}>
                    <div className={cn("w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0", checked ? "border-[#0D9488] bg-[#0D9488]" : "border-slate-300")}>{checked && <Check className="w-3 h-3 text-white" />}</div>
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span className={cn("text-sm flex-1 text-left", checked && "line-through text-slate-400")}>{task.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
          {/* Notes */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Clinical Notes</p>
            <textarea value={visitNotes} onChange={e => setVisitNotes(e.target.value)} rows={4} placeholder="Add clinical notes, observations, deviations..." className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none resize-none focus:ring-2 focus:ring-blue-100" />
            <p className="text-xs text-slate-400 text-right mt-1">{visitNotes.length}/500</p>
          </div>
          {/* Deviation Flag */}
          <div className={cn("rounded-2xl border p-4", deviationFlagged ? "bg-red-50 border-red-200" : "bg-white border-slate-100")}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertOctagon className={cn("w-4 h-4", deviationFlagged ? "text-red-500" : "text-slate-400")} />
                <span className="text-sm font-medium text-[#0F172A]">Flag as Protocol Deviation</span>
              </div>
              <button onClick={() => setDeviationFlagged(!deviationFlagged)} className={cn("relative w-11 h-6 rounded-full transition-colors", deviationFlagged ? "bg-red-500" : "bg-slate-300")}>
                <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform", deviationFlagged ? "translate-x-6" : "translate-x-1")} />
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-3 bg-white border-t border-slate-100 flex gap-3">
          <button onClick={() => setSelectedVisit(null)} className="px-4 py-3 border border-slate-300 text-slate-600 rounded-xl text-sm font-semibold">Cancel</button>
          <button onClick={() => { if (visitStatus) { setCompletedVisits(prev => [...prev, v.subjectId]); setSelectedVisit(null) } }} className={cn("flex-1 py-3 rounded-xl text-sm font-semibold text-white", visitStatus ? "bg-[#2563EB]" : "bg-slate-300")}>Update Visit Status →</button>
        </div>
      </div>
    )
  }

  // ── Patient Timeline ─────────────────────────────────
  if (selectedPatient) {
    const p = selectedPatient
    return (
      <div className="h-full flex flex-col bg-[#F8FAFC]">
        <div className="bg-[#0D1B3E] text-white px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSelectedPatient(null)}><ChevronRight className="w-5 h-5 rotate-180" /></button>
          <span className="font-semibold flex-1">{p.subjectId}</span>
        </div>
        <div className="flex-1 overflow-auto pb-4 px-4 py-4 space-y-4">
          <div className="bg-[#0D1B3E] rounded-2xl p-5 text-white">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-bold text-base">{p.subjectId} · {p.name}</p>
                <p className="text-blue-200 text-sm">{p.protocol}</p>
                <p className="text-blue-200 text-sm">Apollo Mumbai</p>
              </div>
              <StatusBadge status={p.status} />
            </div>
            <p className="text-blue-200 text-xs mb-2">Visit Progress: {p.visitProgress}</p>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-[#0D9488]" style={{ width: `${(parseInt(p.visitProgress) / parseInt(p.visitProgress.split("/")[1])) * 100}%` }} />
            </div>
          </div>
          <div className="bg-white rounded-xl p-3 flex items-center gap-3 border border-slate-100">
            <Phone className="w-4 h-4 text-slate-400" />
            <span className="flex-1 text-sm text-[#0F172A]">+91 98100 ****</span>
            <button className="p-1.5 bg-teal-50 rounded-lg"><MessageSquare className="w-4 h-4 text-[#0D9488]" /></button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <p className="font-semibold text-sm mb-4">Visit Timeline</p>
            <div className="space-y-3">
              {[
                { visit: "Visit 1 — Screening", date: "14 Jan 2025", status: "Completed", ecrf: true },
                { visit: "Visit 2 — Baseline", date: "1 Feb 2025", status: "Completed", ecrf: false },
                { visit: "Visit 3 — Follow-Up 1", date: "15 Feb 2025", status: "Scheduled", ecrf: null },
                { visit: "Visit 7 — Follow-Up 5", date: "28 May 2025", status: "Upcoming", ecrf: null },
              ].map((v, i) => (
                <div key={i} className="flex gap-3">
                  <div className={cn("w-3 h-3 rounded-full mt-1 flex-shrink-0", v.status === "Completed" ? "bg-[#0D9488]" : v.status === "Upcoming" ? "bg-amber-400" : "bg-[#2563EB]")} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-[#0F172A]">{v.visit}</p>
                      {v.ecrf === false && <span className="text-xs text-purple-600 font-medium">eCRF pending</span>}
                      {v.ecrf === true && <span className="text-xs text-teal-600">eCRF ✓</span>}
                    </div>
                    <p className="text-xs text-slate-500">{v.date} · {v.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <p className="font-semibold text-sm mb-2">Medication Adherence · Last 30 days</p>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-1">
              <div className="h-full rounded-full bg-[#0D9488]" style={{ width: "87%" }} />
            </div>
            <p className="text-xs text-slate-500">Taken: 26/30 days (87%)</p>
          </div>
        </div>
      </div>
    )
  }

  // ── MAIN TABS ────────────────────────────────────────
  return (
    <div className="h-full flex flex-col bg-[#F8FAFC]">
      {/* App Bar */}
      <div className="bg-[#0D1B3E] text-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-base text-white">Investigator Dashboard</p>
            <p className="text-blue-200 text-xs">Mon, 19 May 2025</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative" onClick={() => setActiveTab("notifs")}>
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{unreadCount}</span>}
            </button>
            <button onClick={() => setActiveTab("me")} className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">{mockData.pi.initials}</button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto pb-20 relative">

        {/* ── DASHBOARD TAB ── */}
        {activeTab === "dashboard" && (
          <div>
            {/* Protocol Selector */}
            <div className="px-4 pt-3">
              <button onClick={() => setShowProtocolSheet(true)} className="w-full flex items-center gap-3 bg-slate-50 border-l-4 border-[#0D9488] rounded-xl px-4 py-2.5">
                <span className="flex-1 text-sm font-medium text-[#0F172A] text-left">
                  {selectedProtocol === "all" ? "All Protocols" : mockData.protocols.find(p => p.id === selectedProtocol)?.name || selectedProtocol}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* KPI Cards */}
            <div className="px-4 pt-3 pb-1">
              <div className="flex gap-3 overflow-x-auto pb-2">
                {[
                  { icon: Users, val: "12", label: "Patients", sub: "10 active · 2 screen fail", bg: "bg-blue-50", iconBg: "bg-blue-100", iconColor: "text-[#2563EB]", textColor: "" },
                  { icon: CalendarCheck, val: "3", label: "Today", sub: "2 scheduled · 1 screening", bg: "bg-[#0D1B3E]", iconBg: "bg-white/10", iconColor: "text-white", textColor: "text-white" },
                  { icon: AlertTriangle, val: "2", label: "Overdue", sub: "Tap to review", bg: "bg-red-50", iconBg: "bg-red-100", iconColor: "text-red-500", textColor: "text-red-600" },
                  { icon: CalendarDays, val: "9", label: "This Week", sub: "Mon–Fri", bg: "bg-purple-50", iconBg: "bg-purple-100", iconColor: "text-purple-600", textColor: "" },
                ].map(c => {
                  const Icon = c.icon
                  return (
                    <div key={c.label} className={cn("flex-shrink-0 w-32 rounded-2xl p-3 border border-white/50", c.bg)}>
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-2", c.iconBg)}>
                        <Icon className={cn("w-4 h-4", c.iconColor)} />
                      </div>
                      <p className={cn("text-2xl font-bold", c.textColor || "text-[#0F172A]")}>{c.val}</p>
                      <p className={cn("text-xs mt-0.5", c.textColor ? "text-blue-200" : "text-slate-500")}>{c.label}</p>
                      <p className={cn("text-[10px]", c.textColor ? "text-blue-300" : "text-slate-400")}>{c.sub}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Week Strip */}
            <div className="px-4 mb-3">
              <div className="bg-white rounded-xl border border-slate-100 p-3 flex gap-2">
                {mockData.weekStrip.map(d => (
                  <button key={d.day} onClick={() => setActiveTab("calendar")} className={cn("flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-lg transition-colors", d.isToday ? "bg-[#0D1B3E] text-white" : d.visits > 0 ? "bg-white border border-slate-200" : "bg-slate-100")}>
                    <span className={cn("text-[10px]", d.isToday ? "text-blue-200" : "text-slate-400")}>{d.day}</span>
                    <span className={cn("text-sm font-bold", d.isToday ? "text-white" : d.visits > 0 ? "text-[#0D1B3E]" : "text-slate-300")}>{d.visits}</span>
                    <span className={cn("text-[10px]", d.isToday ? "text-blue-300" : "text-slate-400")}>{d.date}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Today's Visits */}
            <div className="px-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-[#0F172A]">{"Today's Visits"}</h3>
                <button onClick={() => setActiveTab("calendar")} className="text-[#2563EB] text-sm font-medium flex items-center gap-1">View All <ChevronRight className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                {mockData.todayVisits.map(v => (
                  <div key={v.subjectId} onClick={() => setSelectedVisit(v)} className={cn("bg-white rounded-2xl border-l-4 p-4 shadow-sm cursor-pointer", statusBorderMap[v.status] || "border-slate-300")}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#2563EB] text-sm">{v.subjectId}</span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full">{v.protocol}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {v.type === "Hospital" ? <Building2 className="w-3.5 h-3.5 text-slate-400" /> : <Phone className="w-3.5 h-3.5 text-slate-400" />}
                        <StatusBadge status={v.status} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                      <span>{v.visitName} · Visit {v.visitNum}</span>
                      <span>·</span>
                      <Clock className="w-3.5 h-3.5" /><span>{v.time}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
                      <CalendarRange className="w-3.5 h-3.5" />
                      <span>Window: {v.window}</span>
                    </div>
                    <div className="flex justify-end">
                      <button onClick={e => { e.stopPropagation(); setSelectedVisit(v) }} className={cn("border rounded-lg py-1 px-3 text-xs font-medium", completedVisits.includes(v.subjectId) ? "border-[#0D9488] text-[#0D9488] bg-teal-50" : "border-[#0D9488] text-[#0D9488]")}>
                        {completedVisits.includes(v.subjectId) ? "✓ Marked Complete" : "✓ Mark Complete"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attention Needed */}
            <div className="px-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="font-semibold text-[#0F172A]">Attention Needed</h3>
              </div>
              <div className="space-y-3">
                {mockData.overduePatients.map(p => (
                  <div key={p.subjectId} className="bg-white rounded-2xl border-l-4 border-red-500 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#2563EB] text-sm">{p.subjectId}</span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full">{p.protocol}</span>
                      </div>
                      <span className="text-xs font-semibold text-red-600">{p.daysOverdue} days overdue</span>
                    </div>
                    <p className="text-xs text-red-400 mb-1">{p.visitName} · Window closed {p.windowClosed}</p>
                    <p className="text-xs text-amber-600 mb-3">⚠ Protocol deviation risk if not resolved</p>
                    <div className="flex justify-end">
                      <button onClick={() => setSelectedVisit(mockData.todayVisits[0])} className="bg-amber-400 text-white rounded-xl py-1.5 px-4 text-sm font-semibold">Review & Update →</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending eCRF */}
            <div className="px-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <FileEdit className="w-4 h-4 text-purple-600" />
                <h3 className="font-semibold text-[#0F172A]">Pending eCRF Entries</h3>
                <span className="w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{mockData.pendingEcrfList.length}</span>
              </div>
              <div className="bg-purple-50 rounded-2xl border-l-4 border-purple-600 p-4">
                <p className="text-sm text-purple-700 mb-3">{mockData.pendingEcrfList.length} visits completed but eCRF not yet submitted</p>
                <div className="space-y-1 mb-3">
                  {mockData.pendingEcrfList.map(e => (
                    <p key={e.subjectId} className="text-sm text-[#0F172A]">{e.subjectId} · {e.visitName} · Completed {e.completedDate}</p>
                  ))}
                </div>
                <div className="flex justify-end">
                  <button className="bg-purple-600 text-white rounded-xl py-2 px-4 text-sm font-semibold">Open eCRF Portal →</button>
                </div>
              </div>
            </div>

            {/* Medication Compliance */}
            <div className="px-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Pill className="w-4 h-4 text-[#0D1B3E]" />
                <h3 className="font-semibold text-[#0F172A]">{"Today's Medication Compliance"}</h3>
              </div>
              <div className="bg-white rounded-2xl border-t-4 border-[#0D9488] p-4 shadow-sm">
                <p className="text-sm text-slate-600 mb-2">8 / 12 patients reported medication taken</p>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                  <div className="h-full rounded-full bg-[#0D9488]" style={{ width: "67%" }} />
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-lg text-xs font-medium">✓ Taken: 8</span>
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium">✗ Not reported: 4</span>
                </div>
              </div>
            </div>

            {/* Screening Pipeline */}
            <div className="px-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <UserPlus className="w-4 h-4 text-[#0D1B3E]" />
                <h3 className="font-semibold text-[#0F172A]">{"This Week's Screening"}</h3>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                <div className="flex items-center justify-around">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#0D1B3E]">5</p>
                    <p className="text-xs text-slate-500">Screened</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#0D9488]">3</p>
                    <p className="text-xs text-slate-500">Passed</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">2</p>
                    <p className="text-xs text-slate-500">Failed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── MY PATIENTS TAB ── */}
        {activeTab === "patients" && (
          <div className="px-4 pt-4">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
                <Users className="w-5 h-5 text-[#2563EB]" />
                <div><p className="text-lg font-bold text-[#0D1B3E]">12</p><p className="text-xs text-slate-500">Total</p></div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
                <UserCheck className="w-4 h-4 text-[#0D9488]" />
                <div><p className="text-lg font-bold text-[#0D1B3E]">10</p><p className="text-xs text-slate-500">Active</p></div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 mb-3">
              <Search className="w-4 h-4 text-slate-400" />
              <input placeholder="Search by Subject ID, name..." className="flex-1 text-sm outline-none" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
              {["All (12)", "Active (10)", "Screening (2)", "Screen Fail (2)", "Overdue (2)"].map(f => {
                const val = f.split(" (")[0]
                return (
                  <button key={f} onClick={() => setPatientFilter(val)} className={cn("flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border", patientFilter === val ? "bg-[#2563EB] text-white border-[#2563EB]" : "bg-white text-slate-600 border-slate-200")}>{f}</button>
                )
              })}
            </div>
            <div className="space-y-3">
              {mockData.patients.map(p => (
                <div key={p.subjectId} onClick={() => setSelectedPatient(p)} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center gap-3 cursor-pointer">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0", p.avatarColor)}>{p.initials}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-semibold text-[#0D1B3E] text-sm">{p.subjectId}</span>
                      <StatusBadge status={p.status} />
                    </div>
                    <p className="text-xs text-slate-500">{p.name} · {p.protocol} · Visit {p.visitProgress}</p>
                    <p className="text-xs text-slate-500">Next: {p.nextVisit} · {p.nextDate}</p>
                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                      <CalendarRange className="w-3 h-3" /><span>Window: {p.window}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CALENDAR TAB ── */}
        {activeTab === "calendar" && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-2">
            <CalendarDays className="w-12 h-12 opacity-30" />
            <p className="text-sm">Calendar view</p>
            <button onClick={() => onNavigate("calendar")} className="text-[#2563EB] text-sm font-medium">Open Full Calendar</button>
          </div>
        )}

        {/* ── NOTIFS TAB ── */}
        {activeTab === "notifs" && (
          <div className="px-4 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-lg text-[#0F172A]">Notifications</h2>
              <button onClick={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))} className="text-[#2563EB] text-sm font-medium">Mark All Read</button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
              {["All", "Visits", "Overdue", "eCRF", "Medication", "System"].map(f => (
                <button key={f} onClick={() => setNotifFilter(f)} className={cn("flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border", notifFilter === f ? "bg-[#2563EB] text-white border-[#2563EB]" : "bg-white text-slate-600 border-slate-200")}>{f}</button>
              ))}
            </div>
            <div className="space-y-2">
              {notifications.map(n => {
                const Icon = n.icon
                return (
                  <div key={n.id} onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, unread: false } : x))} className={cn("bg-white rounded-xl border p-3 flex gap-3 cursor-pointer", n.unread ? "border-blue-100 bg-slate-50" : "border-slate-100")}>
                    {n.unread && <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />}
                    <div className={cn("w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0", n.color.split(" ")[0])}>
                      <Icon className={cn("w-4 h-4", n.color.split(" ")[1])} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-sm text-[#0F172A] leading-tight">{n.title}</p>
                        <p className="text-xs text-slate-400 flex-shrink-0">{n.time}</p>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{n.message}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── ME TAB ── */}
        {activeTab === "me" && (
          <div className="px-4 pt-4">
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-[72px] h-[72px] rounded-full bg-[#0D1B3E] flex items-center justify-center text-white text-xl font-bold mb-3">{mockData.pi.initials}</div>
                <div className="absolute bottom-3 right-0 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center"><Camera className="w-3 h-3 text-slate-500" /></div>
              </div>
              <p className="font-bold text-lg text-[#0F172A]">{mockData.pi.name}</p>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold mt-1">Principal Investigator</span>
              <p className="text-sm text-slate-500 flex items-center gap-1 mt-1"><Building2 className="w-3.5 h-3.5" />{mockData.pi.site}</p>
            </div>
            {[
              { section: "ACCOUNT", items: [{ icon: UserPen, label: "Edit Profile" }, { icon: Lock, label: "Change Password" }, { icon: Bell, label: "Notification Preferences" }] },
              { section: "MY WORK", items: [{ icon: Users, label: "My Patients", onClick: () => setActiveTab("patients") }, { icon: CalendarDays, label: "My Schedule", onClick: () => setActiveTab("calendar") }, { icon: FileEdit, label: "Pending eCRF (3)" }, { icon: AlertOctagon, label: "Protocol Deviations" }] },
              { section: "DELEGATION", items: [{ icon: UserCheck, label: "My CRC Team" }, { icon: Shield, label: "Delegation Log" }] },
            ].map(group => (
              <div key={group.section} className="mb-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{group.section}</p>
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                  {group.items.map(item => {
                    const Icon = item.icon
                    return (
                      <button key={item.label} onClick={(item as any).onClick} className="w-full flex items-center gap-3 px-4 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50">
                        <Icon className="w-4 h-4 text-slate-400" />
                        <span className="flex-1 text-sm text-[#0F172A] text-left">{item.label}</span>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden mb-6">
              <button onClick={() => onNavigate("welcome")} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50">
                <LogOut className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-500 font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* FAB */}
        {activeTab === "dashboard" && (
          <>
            {fabOpen && <div onClick={() => setFabOpen(false)} className="absolute inset-0 bg-black/20" />}
            <div className="absolute bottom-4 right-4 flex flex-col items-end gap-3">
              {fabOpen && (
                <>
                  {[
                    { icon: AlertOctagon, label: "Record Deviation", bg: "bg-red-500" },
                    { icon: ClipboardCheck, label: "Log Visit", bg: "bg-[#0D9488]", onClick: () => { setSelectedVisit(mockData.todayVisits[0]); setFabOpen(false) } },
                    { icon: UserPlus, label: "Add Patient", bg: "bg-[#2563EB]", onClick: () => { onNavigate("add-patient"); setFabOpen(false) } },
                  ].map((a, i) => {
                    const Icon = a.icon
                    return (
                      <div key={a.label} onClick={(a as any).onClick} className="flex items-center gap-2 cursor-pointer">
                        <span className="bg-white rounded-xl px-3 py-1.5 text-sm font-medium text-[#0F172A] shadow-md">{a.label}</span>
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shadow-lg", a.bg)}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )
                  })}
                </>
              )}
              <button onClick={() => setFabOpen(!fabOpen)} className={cn("w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all", fabOpen ? "bg-slate-600" : "bg-[#2563EB]")}>
                {fabOpen ? <X className="w-6 h-6 text-white" /> : <Plus className="w-6 h-6 text-white" />}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Protocol Sheet */}
      {showProtocolSheet && (
        <div className="absolute inset-0 bg-black/40 flex items-end z-50">
          <div className="w-full bg-white rounded-t-3xl p-5">
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-5" />
            <p className="font-bold text-[#0F172A] mb-4">Select Protocol</p>
            <div className="space-y-2">
              {[{ id: "all", name: "All Protocols", indication: "" }, ...mockData.protocols].map(p => (
                <button key={p.id} onClick={() => { setSelectedProtocol(p.id); setShowProtocolSheet(false) }} className={cn("w-full flex items-center gap-3 p-3 rounded-xl border transition-colors", selectedProtocol === p.id ? "border-[#2563EB] bg-blue-50" : "border-slate-100 bg-white")}>
                  {selectedProtocol === p.id && <div className="w-2 h-2 rounded-full bg-[#2563EB] flex-shrink-0" />}
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-sm text-[#0F172A]">{p.id === "all" ? "All Protocols" : p.id}</p>
                    {p.name && <p className="text-xs text-slate-500">{p.name}</p>}
                  </div>
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", p.id !== "all" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500")}>{p.id !== "all" ? "Active" : ""}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-100 flex items-center">
        {[
          { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
          { id: "patients", icon: Users, label: "My Patients" },
          { id: "calendar", icon: CalendarDays, label: "Calendar" },
          { id: "notifs", icon: Bell, label: "Notifs", badge: unreadCount },
          { id: "me", icon: User, label: "Me" },
        ].map(tab => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="flex-1 flex flex-col items-center gap-0.5 relative">
              {active && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#2563EB] rounded-full" />}
              <div className="relative">
                <Icon className={cn("w-5 h-5", active ? "text-[#2563EB]" : "text-slate-400")} />
                {tab.badge && tab.badge > 0 && <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">{tab.badge}</span>}
              </div>
              <span className={cn("text-[10px] font-medium", active ? "text-[#2563EB]" : "text-slate-400")}>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
