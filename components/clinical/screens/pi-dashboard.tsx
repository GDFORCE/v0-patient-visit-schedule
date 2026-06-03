"use client"

import { useState } from "react"
import { AppBar } from "../app-bar"
import { BottomNav } from "../bottom-nav"
import {
  CheckCircle, Clock, AlertTriangle, FileText, ChevronRight,
  Eye, PenLine, Users, Activity, Shield, Calendar, TrendingUp, Info
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PIDashboardProps {
  onNavigate: (screen: string) => void
}

type PiTab = "dashboard" | "patients" | "chat" | "notifs" | "me"
type ApprovalSubTab = "deviations" | "ecrf" | "enrolments"

const patients = [
  { id: "SUBJ-001", name: "Priya Krishnan", age: 45, nextVisit: "Visit 7 · 23 May", status: "on-track" },
  { id: "SUBJ-002", name: "Rahul Mehta", age: 52, nextVisit: "Visit 4 · 28 May", status: "overdue" },
  { id: "SUBJ-003", name: "Anita Patel", age: 38, nextVisit: "Visit 2 · 01 Jun", status: "on-track" },
  { id: "SUBJ-004", name: "Vijay Sharma", age: 61, nextVisit: "Visit 5 · 05 Jun", status: "on-track" },
  { id: "SUBJ-005", name: "Deepa Nair", age: 44, nextVisit: "—", status: "withdrawn" },
]

const deviations = [
  { id: "DEV-001", patient: "SUBJ-002", desc: "Visit window exceeded by 3 days", submitted: "22 May", severity: "Minor" },
  { id: "DEV-002", patient: "SUBJ-005", desc: "Concomitant medication undocumented", submitted: "20 May", severity: "Major" },
]

const ecrfItems = [
  { id: "eCRF-014", patient: "SUBJ-001", form: "Vital Signs", visit: "Visit 6", by: "CRC Meera", date: "21 May" },
  { id: "eCRF-015", patient: "SUBJ-003", form: "Adverse Event Log", visit: "Visit 1", by: "RA Suresh", date: "20 May" },
  { id: "eCRF-016", patient: "SUBJ-004", form: "Concomitant Meds", visit: "Visit 4", by: "CRC Meera", date: "19 May" },
]

const enrolments = [
  { id: "ENR-001", name: "Arjun Verma", age: 48, screenId: "SCR-019", screened: "23 May", eligible: true },
  { id: "ENR-002", name: "Kavya Reddy", age: 35, screenId: "SCR-020", screened: "22 May", eligible: false },
]

const piTrials = [
  { id: "Protocol-001", title: "Diabetes Phase II", phase: "Phase II", disease: "Type 2 Diabetes", drug: "Metformin XR", pi: "Dr. Sharma", department: "Endocrinology", status: "Active" },
  { id: "Protocol-005", title: "Asthma Maintenance Study", phase: "Phase III", disease: "Asthma", drug: "Budesonide", pi: "Dr. Sharma", department: "Pulmonology", status: "Active" },
  { id: "Protocol-008", title: "Rheumatoid Arthritis Trial", phase: "Phase II", disease: "Rheumatoid Arthritis", drug: "Methotrexate", pi: "Dr. Sharma", department: "Rheumatology", status: "Completed" },
]

const teamActivity = [
  { actor: "CRC Meera", action: "logged Visit 6 for SUBJ-001", time: "2h ago", type: "visit" },
  { actor: "RA Suresh", action: "submitted eCRF-015 for SUBJ-003", time: "3h ago", type: "ecrf" },
  { actor: "CRC Meera", action: "flagged deviation DEV-002", time: "5h ago", type: "deviation" },
  { actor: "RA Suresh", action: "screened SCR-020 (failed eligibility)", time: "Yesterday", type: "screen" },
]

const weekDays = [
  { day: "Mon", date: "26", visits: 0 },
  { day: "Tue", date: "27", visits: 2 },
  { day: "Wed", date: "28", visits: 1 },
  { day: "Thu", date: "29", visits: 3 },
  { day: "Fri", date: "30", visits: 0 },
]

const statusStyle: Record<string, { label: string; bg: string; text: string }> = {
  "on-track": { label: "On Track", bg: "bg-emerald-100", text: "text-emerald-700" },
  overdue:    { label: "Overdue",  bg: "bg-red-100",     text: "text-red-700" },
  withdrawn:  { label: "Withdrawn",bg: "bg-slate-100",   text: "text-slate-500" },
}

export function PIDashboard({ onNavigate }: PIDashboardProps) {
  const [activeTab, setActiveTab] = useState<PiTab>("dashboard")
  const [approvalTab, setApprovalTab] = useState<ApprovalSubTab>("deviations")
  const [signedDeviations, setSignedDeviations] = useState<Set<string>>(new Set())
  const [signedEcrf, setSignedEcrf] = useState<Set<string>>(new Set())
  const [approvedEnrolments, setApprovedEnrolments] = useState<Set<string>>(new Set())
  const [rejectedEnrolments, setRejectedEnrolments] = useState<Set<string>>(new Set())
  const [selectedTrial, setSelectedTrial] = useState<typeof piTrials[0] | null>(null)
  const [showAllTrials, setShowAllTrials] = useState(false)

  const trialStatusColor: Record<string, string> = {
    Active: "bg-emerald-100 text-emerald-700",
    Completed: "bg-blue-100 text-blue-700",
    Terminated: "bg-red-100 text-red-700",
  }

  // One trial = one clickable panel → Trial Summary
  const TrialPanel = ({ tr }: { tr: typeof piTrials[0] }) => (
    <button onClick={() => setSelectedTrial(tr)} className="w-full text-left bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">{tr.id}</span>
        <div className="flex items-center gap-1.5">
          <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", trialStatusColor[tr.status] || "bg-slate-100 text-slate-600")}>{tr.status}</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>
      <h4 className="font-semibold text-[#0F172A] text-sm mb-2">{tr.title}</h4>
      <div className="grid grid-cols-2 gap-y-1.5 gap-x-3">
        {[
          { label: "Phase", val: tr.phase },
          { label: "Disease", val: tr.disease },
          { label: "Drug", val: tr.drug },
          { label: "PI Name", val: tr.pi },
          { label: "Department", val: tr.department },
        ].map(f => (
          <div key={f.label}>
            <p className="text-[10px] text-slate-400 uppercase tracking-wide">{f.label}</p>
            <p className="text-xs font-medium text-[#0F172A]">{f.val}</p>
          </div>
        ))}
      </div>
    </button>
  )

  const pendingApprovalsCount =
    deviations.filter(d => !signedDeviations.has(d.id)).length +
    ecrfItems.filter(e => !signedEcrf.has(e.id)).length +
    enrolments.filter(e => !approvedEnrolments.has(e.id) && !rejectedEnrolments.has(e.id)).length

  // ── Dashboard tab ────────────────────────────────────────────────────────
  const renderDashboard = () => (
    <div className="flex-1 overflow-auto pb-4 space-y-4 pt-4">
      {/* Hero */}
      <div className="px-4">
        <div className="bg-gradient-to-br from-[#0D1B3E] via-[#1A3872] to-[#2563EB] rounded-2xl p-5 text-white shadow-lg">
          <h2 className="text-xl font-bold mb-0.5 font-[family-name:var(--font-heading)]">Good morning, Dr. Sharma</h2>
          <p className="text-blue-200 text-sm mb-4">Protocol-001 · Site 02</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Active Patients", value: "4", icon: Users },
              { label: "Visits This Week", value: "6", icon: Calendar },
              { label: "Pending Approvals", value: String(pendingApprovalsCount), icon: PenLine, alert: pendingApprovalsCount > 0 },
              { label: "Deviations", value: "2", icon: AlertTriangle, alert: true },
            ].map(({ label, value, icon: Icon, alert }) => (
              <div key={label} className="bg-white/10 rounded-xl p-3 flex items-center gap-3">
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", alert ? "bg-amber-400/20" : "bg-white/20")}>
                  <Icon className={cn("w-4 h-4", alert ? "text-amber-300" : "text-white")} />
                </div>
                <div>
                  <p className="text-xl font-bold leading-none">{value}</p>
                  <p className="text-[10px] text-blue-200 leading-tight mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* This Week */}
      <div className="px-4">
        <h3 className="font-semibold text-[#0F172A] mb-2 font-[family-name:var(--font-heading)]">This Week's Schedule</h3>
        <div className="bg-white rounded-2xl p-4 shadow-sm flex justify-between">
          {weekDays.map((d) => (
            <div key={d.day} className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] text-slate-400 font-medium">{d.day}</span>
              <span className="text-sm font-semibold text-[#0F172A]">{d.date}</span>
              <div className="flex flex-col gap-0.5">
                {d.visits > 0 ? (
                  Array.from({ length: d.visits }).map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-[#2563EB]" />
                  ))
                ) : (
                  <div className="w-2 h-2 rounded-full bg-slate-100" />
                )}
              </div>
              <span className="text-[10px] text-slate-400">{d.visits > 0 ? `${d.visits}v` : "—"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trials Panel */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-[#0F172A] font-[family-name:var(--font-heading)]">My Trials</h3>
          <button onClick={() => setShowAllTrials(true)} className="text-[#2563EB] text-sm font-medium flex items-center gap-1">See All <ChevronRight className="w-4 h-4" /></button>
        </div>
        <div className="space-y-3">
          {piTrials.slice(0, 2).map(tr => <TrialPanel key={tr.id} tr={tr} />)}
        </div>
      </div>

      {/* Needs Your Attention */}
      {pendingApprovalsCount > 0 && (
        <div className="px-4">
          <h3 className="font-semibold text-[#0F172A] mb-2 font-[family-name:var(--font-heading)]">
            Needs Your Attention
          </h3>
          <div className="space-y-2">
            {deviations.filter(d => !signedDeviations.has(d.id)).slice(0, 1).map(d => (
              <div key={d.id} className="bg-white rounded-2xl p-3 shadow-sm border-l-4 border-amber-400 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0F172A]">{d.patient}: {d.desc}</p>
                  <p className="text-xs text-slate-400">Protocol Deviation · {d.severity} · {d.submitted}</p>
                </div>
                <button
                  onClick={() => setActiveTab("approvals")}
                  className="text-[#2563EB] text-xs font-medium shrink-0"
                >
                  Review
                </button>
              </div>
            ))}
            {ecrfItems.filter(e => !signedEcrf.has(e.id)).slice(0, 1).map(e => (
              <div key={e.id} className="bg-white rounded-2xl p-3 shadow-sm border-l-4 border-purple-400 flex items-start gap-3">
                <FileText className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0F172A]">{e.patient}: {e.form}</p>
                  <p className="text-xs text-slate-400">eCRF Sign-off · {e.visit} · by {e.by}</p>
                </div>
                <button
                  onClick={() => { setActiveTab("approvals"); setApprovalTab("ecrf") }}
                  className="text-[#2563EB] text-xs font-medium shrink-0"
                >
                  Sign
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Activity */}
      <div className="px-4">
        <h3 className="font-semibold text-[#0F172A] mb-2 font-[family-name:var(--font-heading)]">Team Activity</h3>
        <div className="bg-white rounded-2xl divide-y divide-slate-50 shadow-sm">
          {teamActivity.map((item, i) => (
            <div key={i} className="p-3 flex items-start gap-3">
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                item.type === "deviation" ? "bg-amber-100" :
                item.type === "ecrf" ? "bg-purple-100" :
                item.type === "visit" ? "bg-teal-100" : "bg-blue-100"
              )}>
                {item.type === "deviation" ? <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> :
                 item.type === "ecrf" ? <FileText className="w-3.5 h-3.5 text-purple-600" /> :
                 item.type === "visit" ? <CheckCircle className="w-3.5 h-3.5 text-teal-600" /> :
                 <Users className="w-3.5 h-3.5 text-blue-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#0F172A]">
                  <span className="font-medium">{item.actor}</span> {item.action}
                </p>
                <p className="text-xs text-slate-400">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // ── Patients tab (read-only) ─────────────────────────────────────────────
  const renderPatients = () => (
    <div className="flex-1 overflow-auto pb-4 pt-4">
      {/* Read-only banner */}
      <div className="mx-4 mb-3 bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2">
        <Eye className="w-4 h-4 text-[#2563EB] mt-0.5 shrink-0" />
        <p className="text-xs text-[#2563EB]">You have view-only access as Principal Investigator. Contact the CRC team to make changes.</p>
      </div>
      <div className="px-4 space-y-2">
        {patients.map((p) => {
          const style = statusStyle[p.status]
          return (
            <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <p className="font-semibold text-[#0F172A]">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.id} · Age {p.age}</p>
                </div>
                <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-medium", style.bg, style.text)}>
                  {style.label}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-500">{p.nextVisit}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  // ── Approvals tab ────────────────────────────────────────────────────────
  const renderApprovals = () => (
    <div className="flex-1 overflow-auto pb-4 pt-4">
      {/* Sub-tabs */}
      <div className="px-4 mb-4">
        <div className="bg-slate-100 rounded-xl p-1 flex gap-1">
          {(["deviations", "ecrf", "enrolments"] as const).map((t) => {
            const labels: Record<ApprovalSubTab, string> = { deviations: "Deviations", ecrf: "eCRF", enrolments: "Enrolments" }
            return (
              <button
                key={t}
                onClick={() => setApprovalTab(t)}
                className={cn(
                  "flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  approvalTab === t ? "bg-white text-[#0D1B3E] shadow-sm" : "text-slate-500"
                )}
              >
                {labels[t]}
              </button>
            )
          })}
        </div>
      </div>

      <div className="px-4 space-y-3">
        {approvalTab === "deviations" && deviations.map((d) => {
          const signed = signedDeviations.has(d.id)
          return (
            <div key={d.id} className={cn("bg-white rounded-2xl p-4 shadow-sm border-l-4", signed ? "border-teal-400" : "border-amber-400")}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0 pr-2">
                  <p className="font-medium text-[#0F172A] text-sm">{d.patient}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{d.desc}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium",
                      d.severity === "Major" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                    )}>{d.severity}</span>
                    <span className="text-[10px] text-slate-400">Submitted {d.submitted}</span>
                  </div>
                </div>
                {signed ? (
                  <div className="flex items-center gap-1 text-teal-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">Signed</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setSignedDeviations(prev => new Set([...prev, d.id]))}
                    className="flex items-center gap-1 bg-[#0D1B3E] text-white px-3 py-1.5 rounded-lg text-xs font-medium shrink-0"
                  >
                    <PenLine className="w-3 h-3" /> Sign Off
                  </button>
                )}
              </div>
            </div>
          )
        })}

        {approvalTab === "ecrf" && ecrfItems.map((e) => {
          const signed = signedEcrf.has(e.id)
          return (
            <div key={e.id} className={cn("bg-white rounded-2xl p-4 shadow-sm border-l-4", signed ? "border-teal-400" : "border-purple-400")}>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-2">
                  <p className="font-medium text-[#0F172A] text-sm">{e.id}: {e.form}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{e.patient} · {e.visit}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Submitted by {e.by} on {e.date}</p>
                </div>
                {signed ? (
                  <div className="flex items-center gap-1 text-teal-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">Signed</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setSignedEcrf(prev => new Set([...prev, e.id]))}
                    className="flex items-center gap-1 bg-[#7C3AED] text-white px-3 py-1.5 rounded-lg text-xs font-medium shrink-0"
                  >
                    <PenLine className="w-3 h-3" /> Sign
                  </button>
                )}
              </div>
            </div>
          )
        })}

        {approvalTab === "enrolments" && enrolments.map((e) => {
          const approved = approvedEnrolments.has(e.id)
          const rejected = rejectedEnrolments.has(e.id)
          return (
            <div key={e.id} className={cn("bg-white rounded-2xl p-4 shadow-sm border-l-4",
              approved ? "border-teal-400" : rejected ? "border-red-400" : "border-blue-400"
            )}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-[#0F172A] text-sm">{e.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{e.screenId} · Age {e.age} · Screened {e.screened}</p>
                  <span className={cn("inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium",
                    e.eligible ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                  )}>{e.eligible ? "Eligible" : "Failed Eligibility"}</span>
                </div>
              </div>
              {(approved || rejected) ? (
                <div className={cn("flex items-center gap-1 text-sm font-medium", approved ? "text-teal-600" : "text-red-500")}>
                  <CheckCircle className="w-4 h-4" />
                  {approved ? "Approved for Enrolment" : "Rejected"}
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setApprovedEnrolments(prev => new Set([...prev, e.id]))}
                    className="flex-1 bg-[#0D9488] text-white py-2 rounded-xl text-xs font-semibold"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setRejectedEnrolments(prev => new Set([...prev, e.id]))}
                    className="flex-1 bg-white border border-red-300 text-red-600 py-2 rounded-xl text-xs font-semibold"
                  >
                    Reject
                  </button>
                </div>
              )}
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
        <div className="w-20 h-20 rounded-full bg-[#1A3872] flex items-center justify-center text-white text-2xl font-bold mb-3">DS</div>
        <h2 className="text-lg font-bold text-[#0F172A] font-[family-name:var(--font-heading)]">Dr. Sharma</h2>
        <p className="text-sm text-slate-500">Principal Investigator · Site 02</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm divide-y divide-slate-50">
        {[
          { label: "Specialisation", value: "Oncology" },
          { label: "Protocol", value: "Protocol-001" },
          { label: "GCP Certification", value: "Valid till Dec 2026" },
          { label: "Site", value: "Apollo Hospital, Chennai" },
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

  // ── Trial Summary (PI view) ──────────────────────────────
  if (selectedTrial) {
    const tr = selectedTrial
    return (
      <div className="h-full flex flex-col bg-[#F8FAFC]">
        <div className="bg-[#0D1B3E] text-white px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSelectedTrial(null)} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
          <span className="font-semibold flex-1">{tr.id}</span>
        </div>
        <div className="flex-1 overflow-auto px-4 py-4 space-y-4">
          <div className="bg-[#0D1B3E] rounded-2xl p-5 text-white">
            <div className="flex items-start justify-between mb-3">
              <span className="px-2 py-0.5 bg-blue-500/30 text-blue-200 text-xs rounded-full font-medium">{tr.id}</span>
              <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", trialStatusColor[tr.status] || "bg-slate-100 text-slate-600")}>{tr.status}</span>
            </div>
            <h2 className="text-lg font-bold mb-3">{tr.title}</h2>
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-3">
              {[
                { label: "Phase", val: tr.phase },
                { label: "Disease", val: tr.disease },
                { label: "Drug", val: tr.drug },
                { label: "PI Name", val: tr.pi },
                { label: "Department", val: tr.department },
                { label: "Status", val: tr.status },
              ].map(f => (
                <div key={f.label}>
                  <p className="text-[10px] text-blue-200/80 uppercase tracking-wide">{f.label}</p>
                  <p className="text-sm font-medium">{f.val}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2">
            <Info className="w-4 h-4 text-[#2563EB] mt-0.5 shrink-0" />
            <p className="text-xs text-[#2563EB]">You have view-only access to this trial as Principal Investigator.</p>
          </div>
        </div>
      </div>
    )
  }

  // ── All Trials list ──────────────────────────────────────
  if (showAllTrials) {
    return (
      <div className="h-full flex flex-col bg-[#F8FAFC]">
        <div className="bg-[#0D1B3E] text-white px-4 py-3 flex items-center gap-3">
          <button onClick={() => setShowAllTrials(false)} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
          <span className="font-semibold flex-1">My Trials</span>
        </div>
        <div className="flex-1 overflow-auto px-4 py-4 space-y-3">
          {piTrials.map(tr => <TrialPanel key={tr.id} tr={tr} />)}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-[#F8FAFC]">
      <AppBar
        title="PI Dashboard"
        subtitle="Dr. Sharma · Protocol-001"
        notificationCount={3}
        avatar="DS"
        onNotificationClick={() => onNavigate("notifications")}
        onAvatarClick={() => setActiveTab("me")}
      />

      {activeTab === "dashboard" && renderDashboard()}
      {activeTab === "patients" && renderPatients()}
      {activeTab === "chat" && (
        <div className="flex-1 overflow-hidden">
          {/* Navigate to full chat screen */}
          {(() => { onNavigate("chat"); return null })()}
        </div>
      )}
      {activeTab === "notifs" && (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
          Notifications coming soon
        </div>
      )}
      {activeTab === "me" && renderMe()}

      <BottomNav
        activeTab={activeTab}
        role="pi"
        notificationCount={3}
        onTabChange={(tab) => {
          if (tab === "chat") { onNavigate("chat"); return }
          setActiveTab(tab as PiTab)
        }}
      />
    </div>
  )
}
