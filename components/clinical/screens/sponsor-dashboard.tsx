"use client"

import { useState } from "react"
import {
  LayoutDashboard, FlaskConical, MapPin, Bell, User, MessageCircle,
  ChevronRight, ChevronDown, Plus, Search, TrendingUp,
  BarChart2, Building2, Users, Download, Phone, Mail,
  X, Check, AlertTriangle, Info, SlidersHorizontal,
  FileText, UserPen, Lock, LogOut, Camera,
  UserCheck
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SponsorDashboardProps {
  onNavigate: (screen: string) => void
}

const mockData = {
  user: { name: "Rajesh Kumar", initials: "RK", role: "Sponsor Admin", org: "PharmaCo Ltd", email: "rajesh.kumar@pharmaco.com", phone: "+91 98765 43210" },
  trials: [
    { id: "Protocol-001", name: "Diabetes Phase II", phase: "Phase II", indication: "Type 2 Diabetes", sponsor: "PharmaCo Ltd", status: "Active", sites: 3, screened: 48, enrolled: 45, target: 100, completed: 12, screenFail: 8, withdrawn: 3, dropouts: 2, scheduleVersion: "v3", lastModified: "12 May 2025", modifiedBy: "Dr. Sharma" },
    { id: "Protocol-002", name: "Hypertension Study", phase: "Phase III", indication: "Hypertension", sponsor: "PharmaCo Ltd", status: "Active", sites: 2, screened: 32, enrolled: 28, target: 60, completed: 5, screenFail: 4, withdrawn: 1, dropouts: 0, scheduleVersion: "v1", lastModified: "8 May 2025", modifiedBy: "Dr. Rao" },
    { id: "Protocol-003", name: "Oncology Phase I", phase: "Phase I", indication: "NSCLC", sponsor: "PharmaCo Ltd", status: "Completed", sites: 1, screened: 20, enrolled: 18, target: 20, completed: 18, screenFail: 2, withdrawn: 0, dropouts: 0, scheduleVersion: "v2", lastModified: "1 May 2025", modifiedBy: "Admin" },
    { id: "Protocol-004", name: "Cardiology Trial", phase: "Phase II", indication: "Heart Failure", sponsor: "PharmaCo Ltd", status: "Terminated", sites: 2, screened: 15, enrolled: 12, target: 40, completed: 0, screenFail: 3, withdrawn: 4, dropouts: 2, scheduleVersion: "v1", lastModified: "10 Apr 2025", modifiedBy: "Admin" },
  ],
  sites: [
    { id: "SITE-001", name: "Apollo Mumbai", hospital: "Apollo Hospitals Mumbai", city: "Mumbai", state: "Maharashtra", status: "Active", pi: "Dr. Rajesh Sharma", piEmail: "r.sharma@apollo.com", piPhone: "+91 98100 12345", crc: "Ms. Priya Desai", enrolled: 72, target: 85, enrollmentPct: 85, trials: ["Protocol-001", "Protocol-002"], patients: 72, visitCompliance: 89, overdueVisits: 3 },
    { id: "SITE-002", name: "Max Delhi", hospital: "Max Super Speciality Hospital", city: "New Delhi", state: "Delhi", status: "Active", pi: "Dr. Sunita Rao", piEmail: "s.rao@maxhealthcare.com", piPhone: "+91 98200 23456", crc: "Mr. Amit Singh", enrolled: 43, target: 60, enrollmentPct: 72, trials: ["Protocol-001"], patients: 43, visitCompliance: 94, overdueVisits: 1 },
    { id: "SITE-003", name: "Fortis Bangalore", hospital: "Fortis Hospital Bangalore", city: "Bengaluru", state: "Karnataka", status: "Completed", pi: "Dr. Anand Krishnan", piEmail: "a.krishnan@fortishealthcare.com", piPhone: "+91 98300 34567", crc: "Ms. Kavitha Nair", enrolled: 32, target: 50, enrollmentPct: 65, trials: ["Protocol-003"], patients: 32, visitCompliance: 87, overdueVisits: 0 },
    { id: "SITE-004", name: "AIIMS Delhi", hospital: "All India Institute of Medical Sciences", city: "New Delhi", state: "Delhi", status: "Terminated", pi: "Dr. Meera Pillai", piEmail: "m.pillai@aiims.ac.in", piPhone: "+91 98400 45678", crc: "Dr. Rajan Verma", enrolled: 12, target: 40, enrollmentPct: 30, trials: ["Protocol-004"], patients: 12, visitCompliance: 60, overdueVisits: 0 },
  ],
  notifications: [
    { id: 1, type: "trial", title: "Protocol-002 shared with Apollo Mumbai", message: "Hypertension Study has been assigned to the site. PI Dr. Sharma has been notified.", time: "2h ago", unread: true },
    { id: 2, type: "milestone", title: "Recruitment milestone reached", message: "Protocol-001: 50% enrollment target achieved. 45 of 100 patients enrolled.", time: "5h ago", unread: true },
    { id: 3, type: "overdue", title: "Site visit overdue — Apollo Mumbai", message: "3 visits are currently outside the scheduled visit window. Review required.", time: "1d ago", unread: false },
    { id: 4, type: "site", title: "Site activation confirmed", message: "Max Delhi site is now active for Protocol-001. Enrollment can begin.", time: "2d ago", unread: false },
    { id: 5, type: "system", title: "Schedule updated — Protocol-001", message: "Visit schedule v3 uploaded by Dr. Sharma. 18 visits confirmed.", time: "3d ago", unread: false },
  ],
}

function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    Active: "bg-green-100 text-green-700",
    Completed: "bg-blue-100 text-blue-700",
    Terminated: "bg-red-100 text-red-700",
    Inactive: "bg-slate-100 text-slate-600",
  }
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", colorMap[status] || "bg-slate-100 text-slate-600")}>
      {status === "Active" ? "● " : ""}{status}
    </span>
  )
}

function ProgressBar({ value, color = "bg-[#2563EB]" }: { value: number; color?: string }) {
  return (
    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
      <div className={cn("h-full rounded-full", color)} style={{ width: `${value}%` }} />
    </div>
  )
}

export function SponsorDashboard({ onNavigate }: SponsorDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [trialFilter, setTrialFilter] = useState("All")
  const [siteFilter, setSiteFilter] = useState("All")
  const [notifFilter, setNotifFilter] = useState("All")
  const [selectedTrial, setSelectedTrial] = useState<typeof mockData.trials[0] | null>(null)
  const [selectedSite, setSelectedSite] = useState<typeof mockData.sites[0] | null>(null)
  const [trialSearch, setTrialSearch] = useState("")
  const [siteSearch, setSiteSearch] = useState("")
  const [notifications, setNotifications] = useState(mockData.notifications)
  const [meSection, setMeSection] = useState<string | null>(null)

  const unreadCount = notifications.filter(n => n.unread).length

  const filteredTrials = mockData.trials.filter(t => {
    const matchesFilter = trialFilter === "All" || t.status === trialFilter
    const matchesSearch = t.name.toLowerCase().includes(trialSearch.toLowerCase()) || t.id.toLowerCase().includes(trialSearch.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const filteredSites = mockData.sites.filter(s => {
    const matchesFilter = siteFilter === "All" || s.status === siteFilter
    const matchesSearch = s.name.toLowerCase().includes(siteSearch.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const notifIconMap: Record<string, { icon: typeof Bell; bg: string; color: string }> = {
    trial: { icon: FlaskConical, bg: "bg-blue-100", color: "text-blue-600" },
    milestone: { icon: TrendingUp, bg: "bg-green-100", color: "text-green-600" },
    overdue: { icon: AlertTriangle, bg: "bg-red-100", color: "text-red-600" },
    site: { icon: MapPin, bg: "bg-teal-100", color: "text-teal-600" },
    system: { icon: Info, bg: "bg-slate-100", color: "text-slate-600" },
  }

  // ── Trial Detail ────────────────────────────────────────
  if (selectedTrial) {
    const t = selectedTrial
    const enrolled = t.enrolled; const target = t.target
    return (
      <div className="h-full flex flex-col bg-[#F8FAFC]">
        <div className="bg-[#0D1B3E] text-white px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSelectedTrial(null)} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
          <span className="font-semibold flex-1">{t.id}</span>
          <Download className="w-5 h-5" />
        </div>
        <div className="flex-1 overflow-auto pb-24 px-4 py-4 space-y-4">
          {/* Hero */}
          <div className="bg-[#0D1B3E] rounded-2xl p-5 text-white">
            <div className="flex items-start justify-between mb-3">
              <span className="px-2 py-0.5 bg-blue-500/30 text-blue-200 text-xs rounded-full font-medium">{t.id}</span>
              <StatusBadge status={t.status} />
            </div>
            <h2 className="text-lg font-bold mb-1">{t.name}</h2>
            <p className="text-blue-200 text-sm mb-1">Sponsor: {t.sponsor}</p>
            <p className="text-blue-200 text-xs">Phase: {t.phase} · CTRI: CTRI/2024/001</p>
            <p className="text-blue-200 text-xs">Duration: 18 months · 18 visits total</p>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Total Sites", val: t.sites },
              { label: "Screened", val: t.screened },
              { label: "Enrolled", val: t.enrolled },
              { label: "Completed", val: t.completed },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl p-2.5 text-center border border-slate-100">
                <p className="text-lg font-bold text-[#0D1B3E]">{s.val}</p>
                <p className="text-[10px] text-slate-500 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Screen Fail", val: t.screenFail, color: "text-red-600" },
              { label: "Withdrawn", val: t.withdrawn, color: "text-amber-600" },
              { label: "Dropouts", val: (t as any).dropouts ?? 0, color: "text-orange-600" },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl p-2.5 text-center border border-slate-100">
                <p className={`text-lg font-bold ${s.color}`}>{s.val}</p>
                <p className="text-[10px] text-slate-500 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
          {/* Sites on trial */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-sm text-[#0F172A]">Sites on this Trial</p>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {mockData.sites.filter(s => s.trials.includes(t.id)).map(site => (
                <div key={site.id} className="flex-shrink-0 w-44 bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="font-medium text-sm text-[#0F172A] truncate">{site.name}</p>
                  <p className="text-xs text-slate-500">PI: {site.pi.split(" ").slice(-1)[0]}</p>
                  <p className="text-xs text-slate-500 mb-2">{site.enrolled}/{site.target} enrolled</p>
                  <ProgressBar value={site.enrollmentPct} />
                  <p className="text-xs text-slate-400 mt-1">{site.enrollmentPct}%</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 border border-[#2563EB] text-[#2563EB] rounded-xl py-2 text-sm font-semibold">+ Add Site to Trial</button>
          </div>
          {/* Enrollment */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <p className="font-semibold text-sm text-[#0F172A] mb-3">Enrollment Progress</p>
            <ProgressBar value={Math.round((enrolled / target) * 100)} />
            <p className="text-xs text-slate-500 mt-1">{enrolled} / {target} enrolled ({Math.round((enrolled / target) * 100)}%)</p>
            <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
              {[{ label: "Screen Fail", val: t.screenFail, color: "text-red-600" }, { label: "Withdrawn", val: t.withdrawn, color: "text-slate-600" }].map(s => (
                <div key={s.label}><span className="text-slate-500">{s.label}: </span><span className={cn("font-semibold", s.color)}>{s.val}</span></div>
              ))}
            </div>
          </div>
          {/* Documents */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <p className="font-semibold text-sm text-[#0F172A] mb-3">Documents</p>
            {["Protocol Document", "Patient Information Sheet"].map(doc => (
              <div key={doc} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="flex-1 text-sm text-[#0F172A]">{doc}</span>
                <Download className="w-4 h-4 text-[#2563EB]" />
              </div>
            ))}
            <button className="w-full mt-3 border border-[#2563EB] text-[#2563EB] rounded-xl py-2 text-sm font-semibold">+ Upload Document</button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-3 bg-white border-t border-slate-100 flex gap-3">
          <button className="flex-1 border border-slate-300 text-slate-700 rounded-xl py-3 text-sm font-semibold">Edit Trial Details</button>
          <button className="flex-1 bg-[#2563EB] text-white rounded-xl py-3 text-sm font-semibold">Share with Site ›</button>
        </div>
      </div>
    )
  }

  // ── Site Detail ─────────────────────────────────────────
  if (selectedSite) {
    const s = selectedSite
    return (
      <div className="h-full flex flex-col bg-[#F8FAFC]">
        <div className="bg-[#0D1B3E] text-white px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSelectedSite(null)} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
          <span className="font-semibold flex-1 truncate">{s.name}</span>
        </div>
        <div className="flex-1 overflow-auto pb-4 px-4 py-4 space-y-4">
          {/* Header */}
          <div className="bg-[#0D9488] rounded-2xl p-5 text-white">
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-lg font-bold">{s.name}</h2>
              <StatusBadge status={s.status} />
            </div>
            <p className="text-teal-100 text-xs">📍 {s.city}, {s.state}</p>
            <p className="text-teal-100 text-xs">{s.hospital}</p>
          </div>
          {/* Contacts */}
          <div className="grid grid-cols-2 gap-3">
            {[{ title: "Principal Investigator", name: s.pi, email: s.piEmail, phone: s.piPhone },
              { title: "Coordinator", name: s.crc, email: "", phone: "" }].map(c => (
              <div key={c.title} className="bg-white rounded-xl p-3 border border-slate-100">
                <p className="text-xs text-slate-400 mb-1">{c.title}</p>
                <p className="font-semibold text-sm text-[#0F172A] leading-tight">{c.name}</p>
                <div className="flex gap-2 mt-2">
                  <button className="p-1.5 bg-teal-50 rounded-lg"><Phone className="w-3.5 h-3.5 text-[#0D9488]" /></button>
                  <button className="p-1.5 bg-blue-50 rounded-lg"><Mail className="w-3.5 h-3.5 text-[#2563EB]" /></button>
                </div>
              </div>
            ))}
          </div>
          {/* Enrollment */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-sm">Patient Enrollment</p>
              <span className="text-xs font-bold text-[#0D1B3E]">{s.enrolled}/{s.target}</span>
            </div>
            <ProgressBar value={s.enrollmentPct} color="bg-[#0D9488]" />
            <div className="mt-3 p-3 bg-slate-50 rounded-xl flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-500">Patient-level data is managed by the site investigator</p>
            </div>
          </div>
          {/* Performance */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <p className="font-semibold text-sm mb-3">Performance Metrics</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[{ label: "Enrollment Rate", val: `${s.enrollmentPct}%` },
                { label: "Visit Compliance", val: `${s.visitCompliance}%` },
                { label: "Screen Fail", val: "8%" }].map(m => (
                <div key={m.label} className="bg-slate-50 rounded-xl p-2">
                  <p className="text-lg font-bold text-[#0D1B3E]">{m.val}</p>
                  <p className="text-[10px] text-slate-500 leading-tight">{m.label}</p>
                </div>
              ))}
            </div>
            {s.overdueVisits > 0 && (
              <div className="mt-3 flex items-center gap-2 text-red-600 text-xs">
                <AlertTriangle className="w-4 h-4" /><span>Overdue: {s.overdueVisits} visits</span>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── MAIN TABS ───────────────────────────────────────────
  return (
    <div className="h-full flex flex-col bg-[#F8FAFC]">
      {/* App Bar */}
      <div className="bg-[#0D1B3E] text-white px-4 py-3 flex items-center justify-between">
        <div>
          <p className="font-bold text-base">Good morning, Rajesh ☀️</p>
          <p className="text-blue-200 text-xs">{mockData.user.org}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative" onClick={() => setActiveTab("notifs")}>
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{unreadCount}</span>}
          </button>
          <button onClick={() => setActiveTab("me")} className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">{mockData.user.initials}</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto pb-20">

        {/* ── DASHBOARD TAB ── */}
        {activeTab === "dashboard" && (
          <div>
            {/* KPI Strip */}
            <div className="px-4 pt-4 pb-2">
              <div className="flex gap-3 overflow-x-auto pb-2">
                {[
                  { icon: FlaskConical, val: "12", label: "Trials", sub: "+2 this month", bg: "bg-blue-50", iconColor: "text-[#2563EB]" },
                  { icon: MapPin, val: "8", label: "Sites", sub: "6 active", bg: "bg-teal-50", iconColor: "text-[#0D9488]" },
                ].map(c => {
                  const Icon = c.icon
                  return (
                    <div key={c.label} className={cn("flex-shrink-0 w-32 rounded-2xl p-4 border border-slate-100", c.bg)}>
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={cn("w-4 h-4", c.iconColor)} />
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      </div>
                      <p className="text-2xl font-bold text-[#0F172A]">{c.val}</p>
                      <p className="text-xs text-slate-500">{c.label}</p>
                      <p className="text-xs text-slate-400">{c.sub}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Recruitment Overview */}
            <div className="px-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-[#0F172A]">Recruitment Overview</h3>
                <button onClick={() => setActiveTab("trials")} className="text-[#2563EB] text-sm font-medium flex items-center gap-1">See All <ChevronRight className="w-4 h-4" /></button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {mockData.trials.filter(t => t.status === "Active").map(t => (
                  <div key={t.id} onClick={() => setSelectedTrial(t)} className="flex-shrink-0 w-72 bg-white rounded-2xl border border-slate-100 p-4 shadow-sm cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">{t.id}</span>
                      <StatusBadge status={t.status} />
                    </div>
                    <h4 className="font-semibold text-[#0F172A] mb-1">{t.name}</h4>
                    <p className="text-xs text-slate-500 mb-2">{t.sponsor} · {t.sites} Sites</p>
                    <ProgressBar value={Math.round((t.enrolled / t.target) * 100)} />
                    <p className="text-xs text-slate-500 mt-1">{t.enrolled}/{t.target} enrolled</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Share Schedule — prominent action card */}
            <div className="px-4 mb-3">
              <button
                onClick={() => onNavigate("share-schedule")}
                className="w-full bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-center gap-3 text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-[#7C3AED] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#7C3AED] text-sm">Share Schedule</p>
                  <p className="text-xs text-purple-400">Send protocol documents to sites</p>
                </div>
                <ChevronRight className="w-4 h-4 text-purple-400 shrink-0" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="px-4 mb-4">
              <div className="flex gap-2">
                {[
                  { label: "+ Add Trial", icon: Plus, onClick: () => onNavigate("add-trial"), color: "border-[#2563EB] text-[#2563EB]" },
                  { label: "+ Add Site", icon: Plus, onClick: () => setActiveTab("sites"), color: "border-[#2563EB] text-[#2563EB]" },
                  { label: "↗ Reports", icon: BarChart2, onClick: () => setActiveTab("me"), color: "border-slate-300 text-slate-600" },
                ].map(a => {
                  const Icon = a.icon
                  return (
                    <button key={a.label} onClick={a.onClick} className={cn("flex-1 flex items-center justify-center gap-1 border rounded-xl py-2.5 text-xs font-semibold", a.color)}>
                      <Icon className="w-3.5 h-3.5" />{a.label.replace(/^[+↗] /, "")}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Site Performance */}
            <div className="px-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-[#0F172A]">Site Performance</h3>
                <button onClick={() => setActiveTab("sites")} className="text-[#2563EB] text-sm font-medium flex items-center gap-1">View All <ChevronRight className="w-4 h-4" /></button>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-4">
                {mockData.sites.map(s => (
                  <div key={s.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-[#0F172A]">{s.name}</span>
                      <span className="text-xs font-bold text-[#0D1B3E]">{s.enrollmentPct}%</span>
                    </div>
                    <ProgressBar value={s.enrollmentPct} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TRIALS TAB ── */}
        {activeTab === "trials" && (
          <div className="px-4 pt-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2">
                <Search className="w-4 h-4 text-slate-400" />
                <input value={trialSearch} onChange={e => setTrialSearch(e.target.value)} placeholder="Search trials..." className="flex-1 text-sm outline-none" />
              </div>
              <button className="p-2 bg-white border border-slate-200 rounded-xl"><SlidersHorizontal className="w-4 h-4 text-slate-500" /></button>
              <button onClick={() => onNavigate("add-trial")} className="p-2 bg-[#2563EB] rounded-xl"><Plus className="w-4 h-4 text-white" /></button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
              {["All (13)", "Active (9)", "Completed (2)", "Terminated (2)"].map(f => {
                const val = f.split(" (")[0]
                return (
                  <button key={f} onClick={() => setTrialFilter(val)} className={cn("flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border", trialFilter === val ? "bg-[#2563EB] text-white border-[#2563EB]" : "bg-white text-slate-600 border-slate-200")}>{f}</button>
                )
              })}
            </div>
            <div className="space-y-3">
              {filteredTrials.map(t => (
                <div key={t.id} onClick={() => setSelectedTrial(t)} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">{t.id}</span>
                    <div className="flex items-center gap-2"><StatusBadge status={t.status} /><ChevronRight className="w-4 h-4 text-slate-400" /></div>
                  </div>
                  <h4 className="font-semibold text-[#0F172A] text-sm mb-1">{t.name}</h4>
                  <p className="text-xs text-slate-500 mb-2">{t.sponsor} · {t.sites} Sites</p>
                  <ProgressBar value={Math.round((t.enrolled / t.target) * 100)} />
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-slate-500">{t.enrolled}/{t.target} enrolled</p>
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded-full">{t.phase}</span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded-full">{t.indication}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SITES TAB ── */}
        {activeTab === "sites" && (
          <div className="px-4 pt-4">
            {/* Summary */}
            <div className="flex gap-3 mb-4">
              <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3 flex-1">
                <MapPin className="w-5 h-5 text-[#0D9488]" />
                <div><p className="text-lg font-bold text-[#0D1B3E]">8</p><p className="text-xs text-slate-500">Total Sites</p></div>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2">
                <Search className="w-4 h-4 text-slate-400" />
                <input value={siteSearch} onChange={e => setSiteSearch(e.target.value)} placeholder="Search sites..." className="flex-1 text-sm outline-none" />
              </div>
              <button className="p-2 bg-[#2563EB] rounded-xl"><Plus className="w-4 h-4 text-white" /></button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
              {["All (4)", "Active (2)", "Completed (1)", "Terminated (1)"].map(f => {
                const val = f.split(" (")[0]
                return (
                  <button key={f} onClick={() => setSiteFilter(val)} className={cn("flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border", siteFilter === val ? "bg-[#2563EB] text-white border-[#2563EB]" : "bg-white text-slate-600 border-slate-200")}>{f}</button>
                )
              })}
            </div>
            <div className="space-y-3">
              {filteredSites.map(s => (
                <div key={s.id} onClick={() => setSelectedSite(s)} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-[#0F172A]">{s.name}</p>
                      <p className="text-xs text-slate-500">📍 {s.city}, {s.state}</p>
                    </div>
                    <div className="flex items-center gap-2"><StatusBadge status={s.status} /><ChevronRight className="w-4 h-4 text-slate-400" /></div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#0F172A] mb-1">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400" /><span>PI: {s.pi}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                    <span>Trials: {s.trials.length}</span><span>·</span><span>Patients: {s.patients}</span>
                  </div>
                  <ProgressBar value={s.enrollmentPct} color="bg-[#0D9488]" />
                  <p className="text-xs text-slate-500 mt-1">{s.enrolled}/{s.target} enrolled</p>
                </div>
              ))}
            </div>
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
              {["All", "Trials", "Sites", "Recruitment", "System"].map(f => (
                <button key={f} onClick={() => setNotifFilter(f)} className={cn("flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border", notifFilter === f ? "bg-[#2563EB] text-white border-[#2563EB]" : "bg-white text-slate-600 border-slate-200")}>{f}</button>
              ))}
            </div>
            <div className="space-y-2">
              {notifications.map(n => {
                const iconInfo = notifIconMap[n.type] || notifIconMap.system
                const Icon = iconInfo.icon
                return (
                  <div key={n.id} onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, unread: false } : x))} className={cn("bg-white rounded-xl border p-3 flex gap-3 cursor-pointer", n.unread ? "border-blue-100 bg-slate-50" : "border-slate-100")}>
                    {n.unread && <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />}
                    <div className={cn("w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0", iconInfo.bg, !n.unread && "opacity-70")}>
                      <Icon className={cn("w-4 h-4", iconInfo.color)} />
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
            {/* Profile Header */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-18 h-18 w-[72px] h-[72px] rounded-full bg-[#0D1B3E] flex items-center justify-center text-white text-xl font-bold mb-3">{mockData.user.initials}</div>
                <div className="absolute bottom-3 right-0 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center"><Camera className="w-3 h-3 text-slate-500" /></div>
              </div>
              <p className="font-bold text-lg text-[#0F172A]">{mockData.user.name}</p>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold mt-1">{mockData.user.role}</span>
              <p className="text-sm text-slate-500 flex items-center gap-1 mt-1"><Building2 className="w-3.5 h-3.5" />{mockData.user.org}</p>
            </div>
            {/* Info card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-4">
              {[{ label: "Email", val: mockData.user.email }, { label: "Phone", val: mockData.user.phone }, { label: "Entity Type", val: "Sponsor" }, { label: "Role", val: "Admin" }].map(r => (
                <div key={r.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <p className="text-xs text-slate-400">{r.label}</p>
                  <p className="text-sm text-[#0F172A] font-medium">{r.val}</p>
                </div>
              ))}
            </div>
            {/* Menu */}
            {[
              { section: "ACCOUNT", items: [{ icon: UserPen, label: "Edit Profile" }, { icon: Lock, label: "Change Password" }, { icon: Bell, label: "Notification Preferences" }] },
              { section: "TRIAL MANAGEMENT", items: [{ icon: FlaskConical, label: "My Trials", onClick: () => setActiveTab("trials") }, { icon: MapPin, label: "My Sites", onClick: () => setActiveTab("sites") }, { icon: Users, label: "Team Members" }, { icon: FileText, label: "Documents" }] },
              { section: "REPORTS", items: [{ icon: BarChart2, label: "Recruitment Reports" }, { icon: Download, label: "Export Data" }] },
            ].map(group => (
              <div key={group.section} className="mb-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{group.section}</p>
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                  {group.items.map((item, i) => {
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
                <span className="flex-1 text-sm text-red-500 text-left font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-100 flex items-center">
        {[
          { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
          { id: "trials", icon: FlaskConical, label: "Trials" },
          { id: "chat", icon: MessageCircle, label: "Messages" },
          { id: "notifs", icon: Bell, label: "Notifs", badge: unreadCount },
          { id: "me", icon: User, label: "Me" },
        ].map(tab => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button key={tab.id} onClick={() => { if (tab.id === "chat") { onNavigate("chat"); return } setActiveTab(tab.id) }} className="flex-1 flex flex-col items-center gap-0.5 relative">
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
