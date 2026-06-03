"use client"

import { AppBar } from "../app-bar"
import { BottomNav } from "../bottom-nav"
import { ChevronRight, Check, Pill, Clock, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n"

interface PatientDashboardProps {
  onNavigate: (screen: string) => void
}

interface Medication {
  id: string
  name: string
  dosage: string
  time: string
  status: "pending" | "taken" | "animating"
  takenAt?: string
}

export function PatientDashboard({ onNavigate }: PatientDashboardProps) {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [medications, setMedications] = useState<Medication[]>([
    { id: "med1", name: "Metformin", dosage: "500mg", time: "8:00 AM", status: "pending" },
    { id: "med2", name: "Aspirin", dosage: "75mg", time: "2:00 PM", status: "pending" },
    { id: "med3", name: "Metformin", dosage: "500mg", time: "8:00 PM", status: "pending" },
  ])
  const [showUndo, setShowUndo] = useState<string | null>(null)
  const [collapsingId, setCollapsingId] = useState<string | null>(null)

  const takenCount = medications.filter(m => m.status === "taken").length
  const totalCount = medications.length
  const allDone = takenCount === totalCount && totalCount > 0

  const handleMedicationTick = (medId: string) => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    
    // Step 1: Instantly fill checkbox
    setMedications(prev => prev.map(m => 
      m.id === medId ? { ...m, status: "animating", takenAt: timeStr } : m
    ))
    
    // Show undo option
    setShowUndo(medId)
    
    // Step 5: After 1200ms, collapse the card
    setTimeout(() => {
      setCollapsingId(medId)
      
      // After collapse animation, mark as taken
      setTimeout(() => {
        setMedications(prev => prev.map(m => 
          m.id === medId ? { ...m, status: "taken" } : m
        ))
        setCollapsingId(null)
        setShowUndo(null)
      }, 400)
    }, 1200)
  }

  const handleUndo = (medId: string) => {
    setMedications(prev => prev.map(m => 
      m.id === medId ? { ...m, status: "pending", takenAt: undefined } : m
    ))
    setShowUndo(null)
    setCollapsingId(null)
  }

  const pendingMedications = medications.filter(m => m.status === "pending" || m.status === "animating")

  const recentActivity = [
    { visit: "Visit 6", date: "10 May", status: "Done" },
    { visit: "Visit 5", date: "22 Apr", status: "Done" },
  ]

  return (
    <div className="h-full flex flex-col bg-[#F8FAFC]">
      <AppBar
        title={t("myTrialJourney")}
        notificationCount={2}
        avatar="PK"
        onNotificationClick={() => onNavigate("notifications")}
        onAvatarClick={() => onNavigate("profile-settings")}
      />
      
      <div className="flex-1 overflow-auto pb-4">
        {/* Hero Card */}
        <div className="px-4 py-4">
          <div className="bg-gradient-to-br from-[#0D1B3E] via-[#1A3872] to-[#2563EB] rounded-2xl p-5 text-white shadow-lg">
            <h2 className="text-xl font-bold mb-1 font-[family-name:var(--font-heading)]">{t("hello")} Priya</h2>
            <p className="text-blue-200 text-sm mb-4">Protocol-001 · Dr. Sharma</p>

            <div className="mb-2">
              <span className="text-sm text-blue-200">{t("yourProgress")}</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden mb-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#0D9488] transition-all duration-500"
                style={{ width: "60%" }}
              />
            </div>
            <span className="text-sm text-blue-200">{t("visitOfCompleted", { a: 6, b: 10 })}</span>
          </div>
        </div>
        
        {/* Next Visit Card */}
        <div className="px-4 mb-4">
          <h3 className="font-semibold text-[#0F172A] mb-3 font-[family-name:var(--font-heading)]">{t("nextVisit")}</h3>
          <div className="bg-white rounded-2xl border-l-4 border-[#2563EB] p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-[#0F172A]">Visit 7</span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                {t("upcoming")}
              </span>
            </div>
            <p className="text-sm text-[#64748B] mb-1">{t("followUpVisit")}</p>
            <p className="text-sm text-[#0D1B3E] font-medium mb-1">23 May 2025</p>
            <p className="text-xs text-[#94A3B8] mb-3">{t("window")} 20 May – 26 May</p>
            <button
              onClick={() => onNavigate("my-visits")}
              className="text-[#2563EB] font-medium text-sm flex items-center gap-1 hover:underline"
            >
              {t("viewDetails")} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Medication Section */}
        <div className="px-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-[#0D1B3E]" />
              <h3 className="font-semibold text-[#0F172A] font-[family-name:var(--font-heading)]">{t("medication")}</h3>
            </div>
            {!allDone && (
              <span className="text-sm text-[#64748B]">{takenCount}/{totalCount} {t("taken")}</span>
            )}
            {allDone && (
              <span className="text-sm text-[#0D9488] font-medium flex items-center gap-1">
                {t("allDone")} <Check className="w-4 h-4" />
              </span>
            )}
          </div>
          
          {/* All Done State */}
          {allDone && (
            <div className="bg-green-50 rounded-2xl p-4 border-l-4 border-[#0D9488]">
              <div className="flex flex-col items-center text-center py-2">
                <div className="w-10 h-10 bg-[#D1FAE5] rounded-full flex items-center justify-center mb-3">
                  <CheckCircle className="w-6 h-6 text-[#0D9488]" />
                </div>
                <p className="font-semibold text-[#0F172A] mb-1">{t("allDoneToday")}</p>
                <p className="text-sm text-[#64748B]">{t("noMoreMeds")}</p>
                <p className="text-sm text-[#64748B]">{t("greatJob")}</p>
              </div>
            </div>
          )}

          {/* No Medications State */}
          {totalCount === 0 && (
            <div className="bg-white rounded-2xl p-4 border border-slate-200">
              <div className="flex items-center gap-3">
                <Pill className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="font-medium text-slate-500">{t("noMedsToday")}</p>
                  <p className="text-sm text-slate-400">{t("medFreeDay")}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Pending Medications */}
          {!allDone && pendingMedications.length > 0 && (
            <div className="space-y-3">
              {pendingMedications.map((med) => (
                <div
                  key={med.id}
                  className={cn(
                    "bg-white rounded-2xl p-4 shadow-sm transition-all duration-300",
                    med.status === "animating" && "bg-green-50",
                    collapsingId === med.id && "h-0 opacity-0 overflow-hidden py-0 my-0"
                  )}
                  style={{
                    transition: collapsingId === med.id ? "all 400ms ease-in" : "background-color 200ms ease"
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200",
                        med.status === "animating" ? "bg-[#0D9488]" : "bg-teal-100"
                      )}>
                        <Pill className={cn(
                          "w-5 h-5 transition-colors duration-200",
                          med.status === "animating" ? "text-white" : "text-[#0D9488]"
                        )} />
                      </div>
                      <div>
                        <p className={cn(
                          "font-medium text-[#0F172A] text-[15px]",
                          med.status === "animating" && "animate-strikethrough"
                        )}>
                          {med.name} {med.dosage}
                        </p>
                        <p className="text-sm text-[#64748B] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {med.time}
                        </p>
                        {med.status === "animating" && med.takenAt && (
                          <p className="text-xs text-[#16A34A] mt-1 animate-fade-in">
                            ✓ {t("loggedAt")} {med.takenAt}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {med.status === "animating" && showUndo === med.id && collapsingId !== med.id && (
                        <button
                          onClick={() => handleUndo(med.id)}
                          className="text-[13px] text-[#2563EB] font-medium hover:underline"
                        >
                          {t("undo")}
                        </button>
                      )}
                      <button
                        onClick={() => med.status === "pending" && handleMedicationTick(med.id)}
                        disabled={med.status !== "pending"}
                        className={cn(
                          "flex items-center gap-1.5 cursor-pointer select-none",
                        )}
                      >
                        <div className={cn(
                          "w-[22px] h-[22px] rounded border-2 flex items-center justify-center transition-colors duration-100",
                          med.status === "pending"
                            ? "border-[#CBD5E1] bg-white"
                            : "border-[#0D9488] bg-[#0D9488]"
                        )}>
                          {med.status !== "pending" && (
                            <Check className="w-3.5 h-3.5 text-white" />
                          )}
                        </div>
                        {med.status === "pending" && (
                          <span className="text-[13px] text-[#64748B] leading-tight">
                            {t("confirmTaken")}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Recent Activity */}
        <div className="px-4">
          <h3 className="font-semibold text-[#0F172A] mb-3 font-[family-name:var(--font-heading)]">{t("recentActivity")}</h3>
          <div className="bg-white rounded-2xl divide-y divide-slate-100 shadow-sm">
            {recentActivity.map((activity) => (
              <div key={activity.visit} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-[#0D9488]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#0F172A]">{activity.visit}</p>
                    <p className="text-sm text-[#64748B]">{activity.date}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                  {activity.status === "Done" ? t("done") : activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <BottomNav 
        activeTab={activeTab} 
        role="patient"
        notificationCount={2}
        onTabChange={(tab) => {
          setActiveTab(tab)
          if (tab === "my-trial") onNavigate("my-trial")
          if (tab === "chat")     onNavigate("chat")
          if (tab === "notifs")   onNavigate("notifications")
          if (tab === "me")       onNavigate("profile-settings")
        }} 
      />
    </div>
  )
}
