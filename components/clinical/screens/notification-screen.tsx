"use client"

import {
  Bell, AlertTriangle, CheckCircle, Clock, MessageCircle, UserPlus, Share2,
  CalendarClock, BarChart3, Phone, UserCheck, Trash2, BellOff, Check,
  ChevronLeft, RotateCcw, Info,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

// ── Role model ────────────────────────────────────────────────
// Patient → PAT-xx · PI/Research Team → SIT-xx · Sponsor/CRO → SPN-xx
export type NotifRole = "patient" | "pi" | "crc" | "sponsor"

interface NotificationScreenProps {
  onNavigate: (screen: string) => void
  onBack: () => void
  /** Drives which notification set + role-based visibility is shown. */
  role?: NotifRole
}

// The STOP hover/confirmation copy is fixed by the specification.
const STOP_MESSAGE = "Selecting the STOP option will stop all further message alerts related to this activity."

// ── Notification category → icon + colour ─────────────────────
type NotifCategory =
  | "visit-reminder" | "visit-status" | "screening" | "screen-pass"
  | "complete" | "overdue" | "negative" | "chat" | "share"
  | "registration" | "schedule" | "recruitment" | "contact"

const categoryConfig: Record<NotifCategory, { icon: typeof Bell; circleColor: string; iconColor: string }> = {
  "visit-reminder": { icon: Bell,          circleColor: "bg-info/10",        iconColor: "text-info" },
  "visit-status":   { icon: CalendarClock, circleColor: "bg-info/10",        iconColor: "text-info" },
  "screening":      { icon: UserCheck,     circleColor: "bg-info/10",        iconColor: "text-info" },
  "screen-pass":    { icon: CheckCircle,   circleColor: "bg-success/15",     iconColor: "text-success" },
  "complete":       { icon: CheckCircle,   circleColor: "bg-success/15",     iconColor: "text-success" },
  "overdue":        { icon: Clock,         circleColor: "bg-warning/15",     iconColor: "text-warning" },
  "negative":       { icon: AlertTriangle, circleColor: "bg-destructive/10", iconColor: "text-destructive" },
  "chat":           { icon: MessageCircle, circleColor: "bg-sky-100",        iconColor: "text-sky-600" },
  "share":          { icon: Share2,        circleColor: "bg-violet/10",      iconColor: "text-violet" },
  "registration":   { icon: UserPlus,      circleColor: "bg-violet/10",      iconColor: "text-violet" },
  "schedule":       { icon: CalendarClock, circleColor: "bg-warning/15",     iconColor: "text-warning" },
  "recruitment":    { icon: BarChart3,     circleColor: "bg-primary/10",     iconColor: "text-primary" },
  "contact":        { icon: Phone,         circleColor: "bg-muted",          iconColor: "text-muted-foreground" },
}

interface Notification {
  id: string
  /** Spec reference, e.g. SIT-03 / PAT-04 / SPN-01. */
  code: string
  category: NotifCategory
  /** Short human label shown as the detail-screen heading. */
  typeLabel: string
  title: string
  body: string
  /** Sender Details display field. */
  sender: string
  /** Date & Timestamp display field. */
  time: string
  read: boolean
  group: "today" | "yesterday" | "earlier" | "older"
  /** Tap → related activity screen. */
  targetScreen: string
  /** Alerts for this activity have been STOPped. */
  stopped?: boolean
}

// ── Role-based data sets (spec message templates, filled with sample data) ──

const patientNotifications: Notification[] = [
  { id: "p1", code: "PAT-06", category: "visit-reminder", typeLabel: "Visit Reminder – Today", title: "Visit today: Visit 7 Follow-Up", body: "Your (SUBJ-001) next visit Visit 7 · Follow-Up Visit for the Type 2 Diabetes trial DIAB-2024-001 by Dr. A. Sharma at AIIMS Delhi is scheduled for today 24 May 2025.", sender: "System Reminder · 8:00 AM", time: "Today, 8:00 AM", read: false, group: "today", targetScreen: "my-visits" },
  { id: "p2", code: "PAT-12", category: "chat", typeLabel: "Chat Message", title: "New message from Dr. A. Sharma", body: "New message from Dr. A. Sharma (PI) in DIAB-2024-001 – Type 2 Diabetes Study. Tap to open the chat thread.", sender: "Dr. A. Sharma (PI)", time: "Today, 9:15 AM", read: false, group: "today", targetScreen: "chat" },
  { id: "p3", code: "PAT-05", category: "visit-reminder", typeLabel: "Visit Reminder – 1 Day Before", title: "Visit tomorrow: Visit 7", body: "Your (SUBJ-001) next visit Visit 7 · Follow-Up Visit for the Type 2 Diabetes trial DIAB-2024-001 by Dr. A. Sharma at AIIMS Delhi is scheduled for tomorrow 24 May 2025.", sender: "System Reminder · 8:00 AM", time: "Yesterday, 8:00 AM", read: true, group: "yesterday", targetScreen: "my-visits" },
  { id: "p4", code: "PAT-08", category: "complete", typeLabel: "Visit Completed", title: "Visit 6 completed", body: "You (SUBJ-001) have successfully completed Visit 6 in the Type 2 Diabetes trial DIAB-2024-001 by Dr. A. Sharma at AIIMS Delhi and your next visit Visit 7 · Follow-Up is scheduled on 24 May 2025 with window period −2 / +2.", sender: "Dr. A. Sharma (PI)", time: "Yesterday, 3:30 PM", read: true, group: "yesterday", targetScreen: "my-visits" },
  { id: "p5", code: "PAT-11", category: "schedule", typeLabel: "Visit Rescheduled", title: "Visit 8 rescheduled", body: "Your visit Visit 8 · Lab Assessment has been rescheduled to 12 Jun 2025 with window period −2 / +2.", sender: "System", time: "22 May", read: false, group: "earlier", targetScreen: "my-visits" },
  { id: "p6", code: "PAT-04", category: "visit-reminder", typeLabel: "Visit Reminder – 1 Week Before", title: "Visit in 1 week: Visit 7", body: "Your (SUBJ-001) next visit Visit 7 · Follow-Up Visit for the Type 2 Diabetes trial DIAB-2024-001 by Dr. A. Sharma at AIIMS Delhi is scheduled on 24 May 2025 with window period −2 / +2.", sender: "System Reminder · 8:00 AM", time: "17 May", read: true, group: "earlier", targetScreen: "my-visits" },
  { id: "p7", code: "PAT-03", category: "screen-pass", typeLabel: "Eligibility Confirmation", title: "You are eligible to participate", body: "You (SUBJ-001) are eligible to participate in the Type 2 Diabetes clinical trial DIAB-2024-001 by Dr. A. Sharma at AIIMS Delhi and your next visit Visit 2 · Baseline is scheduled on 10 May 2025 with window period −2 / +2.", sender: "Dr. A. Sharma (PI)", time: "8 May", read: true, group: "older", targetScreen: "my-trial" },
  { id: "p8", code: "PAT-02", category: "screening", typeLabel: "Screening Confirmation", title: "Thank you for participating", body: "Thank you for participating in the Type 2 Diabetes clinical trial with Protocol ID DIAB-2024-001 by Dr. A. Sharma at AIIMS Delhi. If you (SUBJ-001) are eligible, your next visit Visit 2 · Baseline is scheduled on 10 May 2025 with window period −2 / +2.", sender: "Dr. A. Sharma (PI)", time: "5 May", read: true, group: "older", targetScreen: "my-trial" },
]

const siteNotifications: Notification[] = [
  { id: "s1", code: "SIT-05", category: "visit-reminder", typeLabel: "Visit – Day of Visit", title: "Visit today — SUBJ-007", body: "Patient Visit: The Visit 4 · Follow-Up · Lipid Panel for Subject SUBJ-007 is scheduled today (24 May 2025) with window period −2 / +2. Kindly update the status of the visit.", sender: "System Reminder · 8:00 AM", time: "Today, 8:00 AM", read: false, group: "today", targetScreen: "patient-list" },
  { id: "s2", code: "SIT-07", category: "overdue", typeLabel: "Overdue Visit Status", title: "Visit status pending — SUBJ-003", body: "Patient Visit: Patient visit status for SUBJ-003 for the Type 2 Diabetes trial DIAB-2024-001 by Dr. A. Sharma at AIIMS Delhi is pending. Kindly update the status of the visit.", sender: "System", time: "Today, 8:00 AM", read: false, group: "today", targetScreen: "patient-list" },
  { id: "s3", code: "SIT-01", category: "screening", typeLabel: "Patient Screened", title: "SUBJ-009 screened", body: "Patient Visit: SUBJ-009 has been screened on 23 May 2025 for the Type 2 Diabetes clinical trial with Protocol ID DIAB-2024-001 by Dr. A. Sharma at AIIMS Delhi. Kindly update the status of the visit in the Patient Visit Details.", sender: "Priya Nair (Research Team)", time: "Today, 11:20 AM", read: false, group: "today", targetScreen: "patient-list" },
  { id: "s4", code: "SIT-17", category: "chat", typeLabel: "Chat Message", title: "New message from Priya Nair", body: "New message from Priya Nair (Research Team) in DIAB-2024-001 – Type 2 Diabetes Study. Tap to open the chat thread.", sender: "Priya Nair (Research Team)", time: "Today, 12:05 PM", read: true, group: "today", targetScreen: "chat" },
  { id: "s5", code: "SIT-02", category: "screen-pass", typeLabel: "Patient Eligible (Screen Pass)", title: "SUBJ-008 eligible — next visit scheduled", body: "Patient Visit: SUBJ-008 is eligible through screening for the Type 2 Diabetes trial DIAB-2024-001 by Dr. A. Sharma at AIIMS Delhi; next visit Visit 2 · Baseline is scheduled on 26 May 2025 with window period −2 / +2. Kindly update the status on the day of the visit.", sender: "Dr. A. Sharma (PI)", time: "Yesterday, 2:40 PM", read: true, group: "yesterday", targetScreen: "patient-list" },
  { id: "s6", code: "SIT-04", category: "visit-reminder", typeLabel: "Visit – 1 Day Before", title: "Visit tomorrow — SUBJ-007", body: "Patient Visit: The Visit 4 · Follow-Up · Lipid Panel for Subject SUBJ-007 is scheduled for tomorrow 24 May 2025 with window period −2 / +2. Kindly update the visit status on the day of the visit.", sender: "System Reminder · 8:00 AM", time: "Yesterday, 8:00 AM", read: true, group: "yesterday", targetScreen: "patient-list" },
  { id: "s7", code: "SIT-06", category: "negative", typeLabel: "Screen Failure", title: "Screen failure — SUBJ-011", body: "Patient Visit: Kindly note that Subject SUBJ-011 in the Type 2 Diabetes trial DIAB-2024-001 by Dr. A. Sharma at AIIMS Delhi is a screen failure due to HbA1c outside inclusion range.", sender: "Dr. A. Sharma (PI)", time: "22 May", read: false, group: "earlier", targetScreen: "patient-list" },
  { id: "s8", code: "SIT-08", category: "complete", typeLabel: "Visit Completed", title: "Visit 3 completed — SUBJ-005", body: "Patient Visit: SUBJ-005 has successfully completed visit 3 and the next visit Visit 4 is scheduled on 28 May 2025 with window period −2 / +2. Kindly update the status on the day of the visit.", sender: "Priya Nair (Research Team)", time: "21 May", read: true, group: "earlier", targetScreen: "patient-list" },
  { id: "s9", code: "SIT-09", category: "negative", typeLabel: "Patient Withdrawn", title: "Withdrawn — SUBJ-004", body: "Patient Visit: Kindly note that Subject SUBJ-004 has been withdrawn due to adverse event (persistent hypoglycaemia).", sender: "Dr. A. Sharma (PI)", time: "20 May", read: false, group: "earlier", targetScreen: "patient-list" },
  { id: "s10", code: "SIT-10", category: "negative", typeLabel: "Patient Dropout", title: "Dropout — SUBJ-012", body: "Patient Visit: Kindly note that Subject SUBJ-012 is a dropout due to relocation / lost to follow-up.", sender: "Priya Nair (Research Team)", time: "19 May", read: true, group: "older", targetScreen: "patient-list" },
  { id: "s11", code: "SIT-11", category: "complete", typeLabel: "Study Completed", title: "Study completed — SUBJ-002", body: "Patient Visit: SUBJ-002 has successfully completed the Type 2 Diabetes clinical trial DIAB-2024-001 by Dr. A. Sharma at AIIMS Delhi.", sender: "Dr. A. Sharma (PI)", time: "18 May", read: true, group: "older", targetScreen: "patient-list" },
  { id: "s12", code: "SIT-15", category: "schedule", typeLabel: "Schedule Modified", title: "Visit schedule updated to v3", body: "Visit schedule for DIAB-2024-001 has been updated to Version 3 by Dr. A. Sharma. Change summary: Visit 7 window extended by 2 days.", sender: "Dr. A. Sharma (PI)", time: "17 May", read: false, group: "older", targetScreen: "about-trial" },
  { id: "s13", code: "SIT-12", category: "share", typeLabel: "Trial Assigned by Sponsor/CRO", title: "Trial shared with you", body: "Trial DIAB-2024-001 has been shared with you by MedTrials CRO with Patient Management access.", sender: "MedTrials CRO", time: "16 May", read: true, group: "older", targetScreen: "about-trial" },
  { id: "s14", code: "SIT-14", category: "registration", typeLabel: "Invited User Registered", title: "Priya Nair registered", body: "Priya Nair (Research Team) has registered on the platform and now has access to DIAB-2024-001.", sender: "System", time: "15 May", read: true, group: "older", targetScreen: "team" },
  { id: "s15", code: "SIT-16", category: "contact", typeLabel: "Patient Contact Change", title: "SUBJ-006 updated contact", body: "SUBJ-006 has updated their phone number.", sender: "System", time: "15 May", read: true, group: "older", targetScreen: "patient-list" },
]

const sponsorNotifications: Notification[] = [
  { id: "n1", code: "SPN-01", category: "recruitment", typeLabel: "Daily Recruitment Digest", title: "Daily recruitment update — DIAB-2024-001", body: "Daily Recruitment Update for DIAB-2024-001 – 24 May 2025. Total across all sites – Screened: 48 | Screen Failures: 6 | Randomized: 31 | Withdrawn: 2 | Dropouts: 1 | Completed: 9 | Follow-up: 12. Tap to view site-wise breakdown.", sender: "System · 8:00 AM", time: "Today, 8:00 AM", read: false, group: "today", targetScreen: "sponsor-dashboard" },
  { id: "n2", code: "SPN-02", category: "chat", typeLabel: "Chat Message", title: "New message from Dr. A. Sharma", body: "New message from Dr. A. Sharma (PI), AIIMS Delhi in DIAB-2024-001 – Type 2 Diabetes Study. Tap to open the chat thread.", sender: "Dr. A. Sharma (PI), AIIMS Delhi", time: "Today, 10:30 AM", read: false, group: "today", targetScreen: "chat" },
  { id: "n3", code: "SPN-05", category: "schedule", typeLabel: "Schedule Modified", title: "Visit schedule updated to v3", body: "Visit schedule for DIAB-2024-001 has been updated to Version 3 by Dr. A. Sharma. Change summary: Visit 7 window extended by 2 days.", sender: "Dr. A. Sharma (PI)", time: "Yesterday, 4:10 PM", read: true, group: "yesterday", targetScreen: "sponsor-dashboard" },
  { id: "n4", code: "SPN-03", category: "share", typeLabel: "Trial Shared (Internal)", title: "DIAB-2024-001 shared with you", body: "DIAB-2024-001 has been shared with you by Michael Chen with Edit access.", sender: "Michael Chen (CRO)", time: "22 May", read: false, group: "earlier", targetScreen: "sponsor-dashboard" },
  { id: "n5", code: "SPN-04", category: "registration", typeLabel: "Invited User Registered", title: "Dr. A. Sharma registered", body: "Dr. A. Sharma has registered on the platform and now has access to DIAB-2024-001.", sender: "System", time: "20 May", read: true, group: "earlier", targetScreen: "sponsor-dashboard" },
  { id: "n6", code: "SPN-06", category: "contact", typeLabel: "Team Member Contact Change", title: "Michael Chen updated contact", body: "Michael Chen has updated their email ID.", sender: "System", time: "18 May", read: true, group: "older", targetScreen: "sponsor-dashboard" },
]

function dataForRole(role: NotifRole): Notification[] {
  if (role === "patient") return patientNotifications
  if (role === "sponsor") return sponsorNotifications
  return siteNotifications // pi + crc share the SIT set
}

const roleHeading: Record<NotifRole, string> = {
  patient: "Notifications",
  pi: "Notifications",
  crc: "Notifications",
  sponsor: "Notifications",
}

type ReadFilter = "all" | "read" | "unread"

export function NotificationScreen({ onNavigate, onBack, role = "patient" }: NotificationScreenProps) {
  const [notifications, setNotifications] = useState<Notification[]>(() => dataForRole(role))
  const [bin, setBin] = useState<Notification[]>([])
  const [activeFilter, setActiveFilter] = useState<ReadFilter>("all")
  const [view, setView] = useState<"list" | "bin">("list")
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null)
  const [bulkMode, setBulkMode] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showStopConfirm, setShowStopConfirm] = useState(false)
  const [showStopHover, setShowStopHover] = useState(false)

  const counts = {
    all: notifications.length,
    read: notifications.filter(n => n.read).length,
    unread: notifications.filter(n => !n.read).length,
  }

  const filters: { id: ReadFilter; label: string }[] = [
    { id: "all", label: `All ${counts.all}` },
    { id: "unread", label: `Unread ${counts.unread}` },
    { id: "read", label: `Read ${counts.read}` },
  ]

  const filtered = notifications.filter(n => {
    if (activeFilter === "read") return n.read
    if (activeFilter === "unread") return !n.read
    return true
  })

  const groups = {
    today: filtered.filter(n => n.group === "today"),
    yesterday: filtered.filter(n => n.group === "yesterday"),
    earlier: filtered.filter(n => n.group === "earlier"),
    older: filtered.filter(n => n.group === "older"),
  }

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  const markRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  const toggleSelect = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  // DELETE → move to bin (restorable). Permanent delete happens from the bin.
  const deleteSelected = () => {
    setNotifications(prev => {
      const removed = prev.filter(n => selected.includes(n.id))
      setBin(b => [...removed, ...b])
      return prev.filter(n => !selected.includes(n.id))
    })
    setSelected([])
    setBulkMode(false)
    setShowDeleteConfirm(false)
  }

  // STOP → silence all further alerts for the selected activities.
  const stopSelected = () => {
    setNotifications(prev => prev.map(n => selected.includes(n.id) ? { ...n, stopped: true } : n))
    setSelected([])
    setBulkMode(false)
    setShowStopConfirm(false)
  }

  const restoreFromBin = (id: string) => {
    setBin(prev => {
      const item = prev.find(n => n.id === id)
      if (item) setNotifications(n => [item, ...n])
      return prev.filter(n => n.id !== id)
    })
  }
  const permanentlyDelete = (id: string) => setBin(prev => prev.filter(n => n.id !== id))
  const emptyBin = () => setBin([])

  // ── NOTIFICATION DETAIL ────────────────────────────────────
  if (selectedNotif) {
    const cfg = categoryConfig[selectedNotif.category]
    const Icon = cfg.icon

    return (
      <div className="h-full flex flex-col bg-surface">
        <div className="bg-card border-b border-border px-4 py-4 flex items-center gap-3">
          <button onClick={() => setSelectedNotif(null)} className="p-1">
            <ChevronLeft className="w-6 h-6 text-primary-deep" />
          </button>
          <span className="flex-1 text-center font-bold text-primary-deep text-[17px]">{selectedNotif.typeLabel}</span>
          <span className="text-[11px] font-mono text-muted-foreground">{selectedNotif.code}</span>
        </div>

        <div className="flex-1 overflow-auto px-4 py-6 space-y-4">
          <div className="flex flex-col items-center gap-2">
            <div className={cn("w-16 h-16 rounded-full flex items-center justify-center", cfg.circleColor)}>
              <Icon className={cn("w-8 h-8", cfg.iconColor)} />
            </div>
            <h2 className="text-xl font-bold text-foreground text-center mt-1">{selectedNotif.title}</h2>
          </div>

          <div className="h-px bg-muted" />
          <p className="text-[15px] text-foreground/80 leading-[1.7]">{selectedNotif.body}</p>
          <div className="h-px bg-muted" />

          {/* Display fields: Sender Details · Date & Timestamp · Read status */}
          <div className="bg-card rounded-xl border border-border p-4 space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Sender</span>
              <span className="font-medium text-foreground">{selectedNotif.sender}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Date &amp; time</span>
              <span className="font-medium text-foreground">{selectedNotif.time}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <span className="font-medium text-info">Read</span>
            </div>
          </div>

          {/* Tap → related activity screen */}
          <button onClick={() => onNavigate(selectedNotif.targetScreen)}
            className="w-full bg-primary-deep text-white py-3.5 rounded-xl font-semibold text-sm">
            Go to related activity →
          </button>

          {/* STOP alerts for this activity (with hover message) */}
          <div className="relative">
            <button
              onClick={() => {
                setNotifications(prev => prev.map(n => n.id === selectedNotif.id ? { ...n, stopped: true } : n))
                setSelectedNotif({ ...selectedNotif, stopped: true })
              }}
              onMouseEnter={() => setShowStopHover(true)}
              onMouseLeave={() => setShowStopHover(false)}
              disabled={selectedNotif.stopped}
              className={cn(
                "w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border",
                selectedNotif.stopped
                  ? "border-border text-muted-foreground bg-muted cursor-default"
                  : "border-warning/40 text-warning bg-warning/10",
              )}
            >
              <BellOff className="w-4 h-4" />
              {selectedNotif.stopped ? "Alerts stopped for this activity" : "Stop alerts for this activity"}
            </button>
            {showStopHover && !selectedNotif.stopped && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full z-10 w-[88%] rounded-lg bg-foreground text-card px-3 py-2 text-xs shadow-lg">
                {STOP_MESSAGE}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setBin(b => [selectedNotif, ...b])
              setNotifications(prev => prev.filter(n => n.id !== selectedNotif.id))
              setSelectedNotif(null)
            }}
            className="w-full text-center text-destructive text-sm font-medium py-2 flex items-center justify-center gap-1.5">
            <Trash2 className="w-4 h-4" /> Delete Notification
          </button>
        </div>
      </div>
    )
  }

  // ── BIN VIEW ──────────────────────────────────────────────
  if (view === "bin") {
    return (
      <div className="h-full flex flex-col bg-surface">
        <div className="bg-card border-b border-border px-4 py-4 flex items-center gap-3">
          <button onClick={() => setView("list")} className="p-1"><ChevronLeft className="w-6 h-6 text-primary-deep" /></button>
          <span className="flex-1 text-center font-bold text-primary-deep text-[17px]">Bin ({bin.length})</span>
          {bin.length > 0
            ? <button onClick={emptyBin} className="text-destructive text-sm font-medium">Empty</button>
            : <div className="w-10" />}
        </div>
        <div className="px-4 py-2 bg-info/5 border-b border-border flex items-start gap-2">
          <Info className="w-4 h-4 text-info flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">Deleted messages can be restored from the bin unless permanently deleted.</p>
        </div>
        <div className="flex-1 overflow-auto">
          {bin.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
              <Trash2 className="w-12 h-12 text-slate-300" />
              <p className="font-semibold text-muted-foreground">Bin is empty</p>
            </div>
          ) : bin.map(notif => {
            const cfg = categoryConfig[notif.category]
            const Icon = cfg.icon
            return (
              <div key={notif.id} className="w-full px-4 py-3.5 flex gap-3 items-center border-b border-border bg-card">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", cfg.circleColor)}>
                  <Icon className={cn("w-5 h-5", cfg.iconColor)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{notif.title}</p>
                  <p className="text-[13px] text-muted-foreground line-clamp-1">{notif.body}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => restoreFromBin(notif.id)} className="p-2 rounded-lg bg-info/10 text-info" title="Restore">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button onClick={() => permanentlyDelete(notif.id)} className="p-2 rounded-lg bg-destructive/10 text-destructive" title="Delete permanently">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ── NOTIFICATION LIST ────────────────────────────────────
  const renderGroup = (label: string, items: Notification[]) => {
    if (items.length === 0) return null
    return (
      <div key={label}>
        <div className="px-4 py-2 bg-surface">
          <span className="text-[11px] text-muted-foreground uppercase font-semibold tracking-[0.8px]">{label}</span>
        </div>
        {items.map(notif => {
          const cfg = categoryConfig[notif.category]
          const Icon = cfg.icon
          const isSelected = selected.includes(notif.id)
          return (
            <button
              key={notif.id}
              onClick={() => {
                if (bulkMode) { toggleSelect(notif.id); return }
                markRead(notif.id)
                setSelectedNotif({ ...notif, read: true })
              }}
              onContextMenu={e => { e.preventDefault(); setBulkMode(true); setSelected([notif.id]) }}
              className={cn(
                "w-full px-4 py-3.5 flex gap-3 text-left border-b border-border",
                isSelected ? "bg-info/15" : notif.read ? "bg-info/5" : "bg-card",
              )}
            >
              <div className="flex items-start pt-0.5">
                {bulkMode ? (
                  <div className={cn("w-5 h-5 rounded border-2 flex items-center justify-center mr-2 flex-shrink-0", isSelected ? "border-primary bg-primary" : "border-border bg-card")}>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                ) : (
                  !notif.read && <div className="w-1.5 h-1.5 bg-info rounded-full mr-2 mt-1.5 flex-shrink-0" />
                )}
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", cfg.circleColor)}>
                  <Icon className={cn("w-5 h-5", cfg.iconColor)} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={cn("text-sm text-foreground flex-1 min-w-0 truncate", !notif.read ? "font-bold" : "font-normal")}>{notif.title}</p>
                  {notif.stopped && <BellOff className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />}
                </div>
                <p className="text-[13px] text-muted-foreground line-clamp-2 mt-0.5">{notif.body}</p>
                <p className="text-[11px] text-muted-foreground/80 mt-1">{notif.sender}</p>
              </div>
              <span className="text-[12px] text-muted-foreground flex-shrink-0 pt-0.5">{notif.time}</span>
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-surface">
      {/* App Bar */}
      <div className="bg-card border-b border-border px-4 py-4 flex items-center gap-3">
        {bulkMode ? (
          <>
            <span className="flex-1 font-bold text-primary-deep text-[17px]">{selected.length} selected</span>
            <button onClick={() => { setBulkMode(false); setSelected([]) }} className="text-info text-sm font-medium">Cancel</button>
          </>
        ) : (
          <>
            <button onClick={onBack} className="p-1"><ChevronLeft className="w-6 h-6 text-primary-deep" /></button>
            <span className="flex-1 text-center font-bold text-primary-deep text-[17px]">{roleHeading[role]}</span>
            <button onClick={markAllRead} className="text-info text-sm font-medium whitespace-nowrap">Mark All Read</button>
          </>
        )}
      </div>

      {/* Filter Chips: ALL / UNREAD / READ + Bin */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto bg-card border-b border-border scrollbar-hide items-center">
        {filters.map(f => (
          <button key={f.id} onClick={() => setActiveFilter(f.id)}
            className={cn("flex-shrink-0 px-3 py-1.5 rounded-full text-sm border",
              activeFilter === f.id
                ? "bg-warning/10 border-primary text-primary font-bold"
                : "bg-card border-border text-muted-foreground font-medium"
            )}>
            {f.label}
          </button>
        ))}
        <div className="flex-1" />
        <button onClick={() => setView("bin")}
          className="flex-shrink-0 px-3 py-1.5 rounded-full text-sm border border-border text-muted-foreground font-medium flex items-center gap-1.5">
          <Trash2 className="w-3.5 h-3.5" /> Bin{bin.length > 0 ? ` ${bin.length}` : ""}
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
            <Bell className="w-12 h-12 text-slate-300" />
            <p className="font-semibold text-muted-foreground">No notifications here</p>
            <p className="text-sm text-muted-foreground/70">You're all caught up!</p>
          </div>
        ) : (
          <>
            {renderGroup("Today", groups.today)}
            {renderGroup("Yesterday", groups.yesterday)}
            {renderGroup("Earlier This Week", groups.earlier)}
            {renderGroup("Older", groups.older)}
          </>
        )}
      </div>

      {/* Bulk Action Bar */}
      {bulkMode && (
        <div className="px-4 py-3 bg-card border-t border-border shadow-lg flex items-center justify-between">
          <button onClick={() => setSelected(filtered.map(n => n.id))}
            className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground">
            Select All
          </button>
          <div className="flex gap-2">
            <button onClick={() => setShowDeleteConfirm(true)} disabled={selected.length === 0}
              className="px-4 py-2 bg-destructive/10 text-destructive rounded-lg text-sm font-medium flex items-center gap-1 disabled:opacity-40">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
            <button onClick={() => setShowStopConfirm(true)} disabled={selected.length === 0}
              onMouseEnter={() => setShowStopHover(true)} onMouseLeave={() => setShowStopHover(false)}
              title={STOP_MESSAGE}
              className="px-4 py-2 bg-warning/15 text-warning rounded-lg text-sm font-medium flex items-center gap-1 disabled:opacity-40">
              <BellOff className="w-4 h-4" /> Stop
            </button>
          </div>
          {showStopHover && (
            <div className="absolute bottom-16 right-4 z-10 w-[80%] max-w-xs rounded-lg bg-foreground text-card px-3 py-2 text-xs shadow-lg">
              {STOP_MESSAGE}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirm Dialog */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-card rounded-2xl p-6 w-full max-w-xs shadow-xl">
            <h3 className="font-bold text-foreground text-lg mb-1">Delete {selected.length} notification{selected.length !== 1 ? "s" : ""}?</h3>
            <p className="text-sm text-muted-foreground mb-5">Deleted messages move to the Bin and can be restored unless permanently deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground/80">Cancel</button>
              <button onClick={deleteSelected} className="flex-1 py-2.5 rounded-xl bg-destructive text-white text-sm font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Stop Confirm Dialog */}
      {showStopConfirm && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-card rounded-2xl p-6 w-full max-w-xs shadow-xl">
            <h3 className="font-bold text-foreground text-lg mb-1">Stop alerts?</h3>
            <p className="text-sm text-muted-foreground mb-5">{STOP_MESSAGE}</p>
            <div className="flex gap-3">
              <button onClick={() => setShowStopConfirm(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground/80">Cancel</button>
              <button onClick={stopSelected} className="flex-1 py-2.5 rounded-xl bg-warning text-white text-sm font-semibold">Stop Alerts</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
