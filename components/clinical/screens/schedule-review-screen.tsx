"use client"

import { useState } from "react"
import { ChevronLeft, FileText, Eye, Download, Check, X, PenLine } from "lucide-react"
import { cn } from "@/lib/utils"

interface ScheduleReviewScreenProps {
  onBack: () => void
  onApprove: () => void
  onReject: () => void
}

const scheduleData = {
  docName:     "Protocol-001 v2.1.pdf",
  docSize:     "2.4 MB",
  fromSponsor: "PharmaCo Ltd",
  fromUser:    "Rajesh Kumar",
  sharedDate:  "19 May 2025",
  sharedTime:  "11:32 AM",
  message:     "Please review the updated visit schedule and confirm receipt.",
  versionNote: "v2.1 — Updated visit window for Visit 7",
  prevVersion: "v2.0",
}

const visitSchedule = [
  { visit: "Visit 1",  name: "Screening",   day: "Day -7",  window: "±2 days", updated: false },
  { visit: "Visit 2",  name: "Baseline",    day: "Day 0",   window: "±1 day",  updated: false },
  { visit: "Visit 3",  name: "Follow-Up 1", day: "Day 14",  window: "±3 days", updated: false },
  { visit: "Visit 4",  name: "Follow-Up 2", day: "Day 28",  window: "±3 days", updated: false },
  { visit: "Visit 5",  name: "Safety Check",day: "Day 42",  window: "±3 days", updated: false },
  { visit: "Visit 6",  name: "Mid-Study",   day: "Day 56",  window: "±3 days", updated: false },
  { visit: "Visit 7",  name: "Follow-Up 5", day: "Day 84",  window: "±5 days", updated: true  },
  { visit: "Visit 8",  name: "Follow-Up 6", day: "Day 112", window: "±5 days", updated: false },
  { visit: "Visit 9",  name: "Lab & Vitals",day: "Day 140", window: "±3 days", updated: false },
  { visit: "Visit 10", name: "End of Study",day: "Day 168", window: "±5 days", updated: false },
]

export function ScheduleReviewScreen({ onBack, onApprove, onReject }: ScheduleReviewScreenProps) {
  const [piNotes, setPiNotes] = useState("")
  const [showRejectSheet, setShowRejectSheet] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [approved, setApproved] = useState(false)
  const [rejected, setRejected] = useState(false)
  const [showAllVisits, setShowAllVisits] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMsg, setToastMsg] = useState("")

  const displayedVisits = showAllVisits ? visitSchedule : visitSchedule.slice(0, 4)

  const fireToast = (msg: string, cb: () => void) => {
    setToastMsg(msg)
    setShowToast(true)
    setTimeout(() => { setShowToast(false); cb() }, 2200)
  }

  const handleApprove = () => {
    setApproved(true)
    fireToast("Schedule v2.1 approved and now active for your site", onApprove)
  }

  const handleSendRejection = () => {
    if (!rejectReason.trim()) return
    setRejected(true)
    setShowRejectSheet(false)
    fireToast("Rejection sent to PharmaCo Ltd", onReject)
  }

  return (
    <div className="h-full flex flex-col bg-[#F8FAFC] relative">
      {/* App Bar */}
      <div className="bg-[#0D1B3E] text-white px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-1"><ChevronLeft className="w-6 h-6" /></button>
        <span className="font-semibold flex-1">Review Schedule</span>
        <span className="text-blue-300 text-xs">← Dashboard</span>
      </div>

      <div className="flex-1 overflow-auto pb-24 px-4 pt-4 space-y-4">
        {/* Sender info card */}
        <div className="bg-[#0D1B3E] rounded-2xl p-4 text-white">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-500/30 rounded-xl flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-blue-200" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-base leading-tight">{scheduleData.docName}</p>
              <p className="text-blue-200 text-xs mt-0.5">From: {scheduleData.fromSponsor} · {scheduleData.fromUser}</p>
              <p className="text-blue-300 text-xs">Shared: {scheduleData.sharedDate} at {scheduleData.sharedTime}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-xs text-blue-300 mb-0.5">Version note</p>
            <p className="text-sm text-white font-medium">{scheduleData.versionNote}</p>
          </div>
          <div className="mt-2">
            <p className="text-xs text-blue-300 mb-0.5">Message from sponsor</p>
            <p className="text-sm text-blue-100 italic">"{scheduleData.message}"</p>
          </div>
        </div>

        {/* Document preview */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-[#0F172A] text-sm">{scheduleData.docName}</p>
              <p className="text-xs text-slate-400">{scheduleData.docSize}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-[#2563EB] py-2.5 rounded-xl text-sm font-semibold">
              <Eye className="w-4 h-4" /> Preview
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-slate-50 text-slate-700 py-2.5 rounded-xl text-sm font-semibold border border-slate-200">
              <Download className="w-4 h-4" /> Download
            </button>
          </div>
        </div>

        {/* Version Notes */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <PenLine className="w-4 h-4 text-amber-600" />
            <p className="font-semibold text-amber-800 text-sm">Version Notes</p>
          </div>
          <p className="text-sm text-amber-700">{scheduleData.versionNote}</p>
          <p className="text-xs text-amber-500 mt-0.5">Previous version: {scheduleData.prevVersion}</p>
        </div>

        {/* Visit Schedule Summary */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <p className="font-semibold text-[#0F172A] text-sm">Schedule Summary</p>
            <span className="text-xs text-slate-400">18 visits total</span>
          </div>
          {displayedVisits.map((v, i) => (
            <div
              key={v.visit}
              className={cn(
                "px-4 py-2.5 flex items-center gap-2",
                v.updated ? "bg-amber-50" : i % 2 === 0 ? "bg-white" : "bg-slate-50/40",
                i > 0 && "border-t border-slate-100"
              )}
            >
              <span className="text-[10px] font-medium text-slate-400 w-12 shrink-0">{v.visit}</span>
              <span className="text-sm text-[#0F172A] flex-1">{v.name}</span>
              <span className="text-xs text-slate-400 w-12 text-right">{v.day}</span>
              <div className="flex items-center gap-1.5 w-20 justify-end">
                <span className="text-xs text-slate-500">{v.window}</span>
                {v.updated && <span className="px-1.5 py-0.5 bg-amber-400 text-white text-[9px] font-bold rounded-full shrink-0">UPDATED</span>}
              </div>
            </div>
          ))}
          {!showAllVisits && (
            <button onClick={() => setShowAllVisits(true)} className="w-full py-2.5 text-[#2563EB] text-xs font-medium border-t border-slate-100">
              View All 18 Visits ›
            </button>
          )}
        </div>

        {/* PI Notes */}
        <div>
          <p className="text-sm text-slate-600 mb-2">PI Notes (optional — visible in audit log)</p>
          <textarea
            value={piNotes}
            onChange={e => setPiNotes(e.target.value)}
            placeholder="Reviewed and approved on 19 May 2025."
            rows={3}
            className="w-full bg-white rounded-xl border border-slate-200 p-3 text-sm outline-none resize-none"
          />
        </div>
      </div>

      {/* Sticky bottom bar */}
      {!approved && !rejected && (
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-3 bg-white border-t border-slate-100 flex gap-3">
          <button onClick={() => setShowRejectSheet(true)} className="flex-1 border-2 border-red-400 text-red-600 py-3 rounded-xl text-sm font-semibold">
            Reject with Comments
          </button>
          <button onClick={handleApprove} className="flex-1 bg-[#0D1B3E] text-white py-3 rounded-xl text-sm font-semibold">
            Approve & Activate →
          </button>
        </div>
      )}

      {(approved || rejected) && (
        <div className={cn(
          "absolute bottom-0 left-0 right-0 px-4 pb-4 pt-3 flex items-center justify-center gap-2",
          approved ? "bg-teal-50 border-t border-teal-100" : "bg-red-50 border-t border-red-100"
        )}>
          {approved ? <Check className="w-5 h-5 text-teal-600" /> : <X className="w-5 h-5 text-red-500" />}
          <span className={cn("text-sm font-semibold", approved ? "text-teal-700" : "text-red-600")}>
            {approved ? "Schedule approved and activated" : "Rejection sent to sponsor"}
          </span>
        </div>
      )}

      {/* Rejection bottom sheet */}
      {showRejectSheet && (
        <div className="absolute inset-0 bg-black/40 flex items-end z-10">
          <div className="bg-white w-full rounded-t-2xl p-5">
            <h3 className="font-bold text-[#0F172A] text-lg mb-1">Reject Schedule</h3>
            <p className="text-xs text-slate-400 mb-4">This will notify the sponsor with your reason.</p>
            <p className="text-sm text-slate-700 mb-2 font-medium">Reason for rejection*</p>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Visit 7 window change conflicts with our site's holiday schedule."
              rows={4}
              autoFocus
              className="w-full bg-slate-50 rounded-xl border border-slate-200 p-3 text-sm outline-none resize-none mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => setShowRejectSheet(false)} className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-xl text-sm font-semibold">
                Cancel
              </button>
              <button
                onClick={handleSendRejection}
                disabled={!rejectReason.trim()}
                className={cn("flex-1 py-3 rounded-xl text-sm font-semibold",
                  rejectReason.trim() ? "bg-red-500 text-white" : "bg-slate-200 text-slate-400 cursor-not-allowed"
                )}
              >
                Send Rejection →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div className={cn(
          "absolute bottom-24 left-4 right-4 rounded-xl px-4 py-3 flex items-center gap-2 shadow-lg z-20",
          approved ? "bg-[#0D9488]" : "bg-red-500"
        )}>
          <Check className="w-4 h-4 text-white" />
          <span className="text-sm font-medium text-white">{toastMsg}</span>
        </div>
      )}
    </div>
  )
}
