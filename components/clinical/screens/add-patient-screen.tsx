"use client"

import { AppBar } from "../app-bar"
import { Calendar, ChevronRight, Sparkles, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface AddPatientScreenProps {
  onAdd: () => void
  onBack: () => void
}

const existingSubjects = ["SUBJ-001", "SUBJ-002", "SUBJ-003", "SUBJ-004", "SUBJ-005"]

export function AddPatientScreen({ onAdd, onBack }: AddPatientScreenProps) {
  const [subjectId, setSubjectId] = useState("")
  const isDuplicate = existingSubjects.includes(`SUBJ-${subjectId}`)

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <AppBar title="Add Patient" showBack onBack={onBack} />

      <div className="flex-1 overflow-auto px-4 py-4 space-y-4">

        {/* Subject ID with duplicate detection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject Number/ID *</label>
          <div className="flex gap-2">
            <div className="px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-600 text-sm font-mono">SUBJ-</div>
            <input
              type="text"
              value={subjectId}
              onChange={e => setSubjectId(e.target.value)}
              placeholder="001"
              className={cn(
                "flex-1 px-4 py-3 rounded-xl border text-sm font-mono outline-none focus:ring-2 focus:ring-blue-100",
                isDuplicate ? "border-red-400 focus:border-red-400 bg-red-50" : "border-gray-300 focus:border-[#1A3872] bg-white"
              )}
            />
          </div>
          {isDuplicate && (
            <div className="mt-2 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-xs text-red-600 font-medium">Duplicate entry detected — SUBJ-{subjectId} already exists. Please verify before proceeding.</p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject Initials</label>
          <input type="text" placeholder="e.g., PK"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100 outline-none bg-white" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
          <input type="text" placeholder="Patient full name"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100 outline-none bg-white" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth *</label>
            <input type="date"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100 outline-none bg-white text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
            <select className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100 outline-none bg-white text-sm appearance-none">
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
              <option>Prefer not to say</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone *</label>
          <div className="flex gap-2">
            <div className="px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-600">+91</div>
            <input type="tel" placeholder="Enter phone number"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100 outline-none bg-white" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <input type="email" placeholder="Enter email"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100 outline-none bg-white" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Language</label>
          <select className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100 outline-none bg-white appearance-none">
            <option>English</option>
            <option>Hindi</option>
            <option>Tamil</option>
            <option>Telugu</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Assign to Trial *</label>
          <select className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100 outline-none bg-white appearance-none">
            <option>Protocol-A — Diabetes Phase II</option>
            <option>Protocol-B — Hypertension Study</option>
            <option>Protocol-C — Oncology Phase I</option>
          </select>
        </div>

        {/* Patient Access Note */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700">The patient will receive an invitation to access the app using the profile created here. Their login is linked to this subject record.</p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 py-2">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-gray-500 text-sm font-medium">Visit Dates</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Baseline Date *</label>
          <div className="relative">
            <input type="text" defaultValue="5 May 2025"
              className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-[#1A3872] focus:ring-2 focus:ring-blue-100 outline-none bg-white" />
            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A3872]" />
          </div>
        </div>

        {/* Auto-calculated Dates */}
        <div className="bg-blue-50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-[#1A3872]" />
            <span className="font-medium text-gray-900">Auto-calculated Dates</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Visit 1</span>
              <span className="text-gray-900 font-medium">5 May 2025</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Visit 2</span>
              <span className="text-gray-900 font-medium">19 May 2025</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Visit 3</span>
              <span className="text-gray-900 font-medium">26 May 2025</span>
            </div>
          </div>
          <button className="mt-3 text-[#0D9488] font-medium text-sm flex items-center gap-1">
            View All 18 Visits <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="px-4 py-4 bg-white border-t">
        <button
          onClick={onAdd}
          disabled={isDuplicate}
          className={cn("w-full py-4 rounded-full font-semibold", isDuplicate ? "bg-slate-200 text-slate-400" : "bg-[#1A3872] text-white")}
        >
          Add Patient
        </button>
      </div>
    </div>
  )
}
