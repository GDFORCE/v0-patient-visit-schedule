"use client"

import { useState } from "react"
import { ArrowLeft, AlertTriangle, Clock, Shield, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface EmergencyAccessScreenProps {
  onBack?: () => void
}

export function EmergencyAccessScreen({ onBack }: EmergencyAccessScreenProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [reason, setReason] = useState("")
  const [justification, setJustification] = useState("")
  const [countdown, setCountdown] = useState(7200) // 2 hours in seconds

  const formatCountdown = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleRequestApproval = () => {
    if (reason && justification) {
      setStep(2)
    }
  }

  const handleApproved = () => {
    setStep(3)
    // Start countdown
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setStep(1)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-[#0D1B3E] font-[family-name:var(--font-heading)]">
          Emergency Access Request
        </h1>
      </div>

      {/* Warning Banner */}
      <div className="mx-4 mt-4 p-4 bg-red-50 rounded-xl border border-red-200 flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-red-700">Restricted Access Area</p>
          <p className="text-xs text-red-600 mt-1">
            Emergency access is intended only for critical situations. All actions are fully logged and audited.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {/* Step 1: Request Form */}
        {step === 1 && (
          <div className="bg-white rounded-xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
            <h2 className="text-base font-semibold text-[#0D1B3E] mb-4 font-[family-name:var(--font-heading)]">
              Step 1: Request Justification
            </h2>

            <div className="space-y-4">
              <div>
                <Label className="text-sm text-gray-600">Reason for Emergency Access</Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger className="w-full h-11 mt-1.5 bg-white rounded-lg border-gray-200">
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Failure</SelectItem>
                    <SelectItem value="security">Security Breach</SelectItem>
                    <SelectItem value="legal">Legal Requirement</SelectItem>
                    <SelectItem value="recovery">Data Recovery</SelectItem>
                    <SelectItem value="court">Court Order</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm text-gray-600">Detailed Justification</Label>
                <Textarea
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="Provide detailed justification for emergency access request..."
                  className="mt-1.5 min-h-[120px] rounded-lg border-gray-200"
                />
              </div>

              <Button
                onClick={handleRequestApproval}
                disabled={!reason || !justification}
                className="w-full h-12 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium"
              >
                <Shield className="w-4 h-4 mr-2" />
                Request Approval
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Pending Approval */}
        {step === 2 && (
          <div className="bg-white rounded-xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.08)] text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-amber-500" />
            </div>
            <h2 className="text-lg font-semibold text-[#0D1B3E] mb-2 font-[family-name:var(--font-heading)]">
              Awaiting Senior Approval
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Your emergency access request has been submitted and is pending approval from a senior administrator.
            </p>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 mb-6">
              <p className="text-sm text-amber-700">
                <span className="font-semibold">Request ID:</span> EMG-2025-0042
              </p>
              <p className="text-xs text-amber-600 mt-1">
                Submitted: 25 May 2025, 10:30 AM
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg text-left">
                <p className="text-xs text-gray-500">Reason</p>
                <p className="text-sm text-gray-700 font-medium">
                  {reason === "technical"
                    ? "Technical Failure"
                    : reason === "security"
                    ? "Security Breach"
                    : reason === "legal"
                    ? "Legal Requirement"
                    : reason === "recovery"
                    ? "Data Recovery"
                    : "Court Order"}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-left">
                <p className="text-xs text-gray-500">Justification</p>
                <p className="text-sm text-gray-700">{justification}</p>
              </div>
            </div>

            {/* For demo, add approve button */}
            <Button
              onClick={handleApproved}
              variant="outline"
              className="w-full mt-6 h-10 border-gray-300 text-gray-600"
            >
              (Demo) Simulate Approval
            </Button>
          </div>
        )}

        {/* Step 3: Access Granted */}
        {step === 3 && (
          <div className="bg-white rounded-xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.08)] text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="text-lg font-semibold text-[#0D1B3E] mb-2 font-[family-name:var(--font-heading)]">
              Emergency Access Granted
            </h2>

            {/* Countdown Timer */}
            <div className="p-4 bg-red-50 rounded-xl border border-red-200 mb-6">
              <p className="text-xs text-red-600 mb-1">Access expires in</p>
              <p className="text-3xl font-bold text-red-600 font-mono">
                {formatCountdown(countdown)}
              </p>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 mb-6 text-left">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
                <div className="text-xs text-amber-700">
                  <p className="font-semibold mb-1">Important Reminders:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>All actions are fully logged and audited</li>
                    <li>Access only what is absolutely necessary</li>
                    <li>Document all actions taken during this session</li>
                    <li>Access will automatically expire after the countdown</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions Log */}
            <div className="p-4 bg-gray-50 rounded-xl text-left">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-gray-500" />
                <p className="text-sm font-medium text-gray-700">Session Log</p>
              </div>
              <div className="space-y-2 text-xs text-gray-500">
                <p>10:35:42 - Emergency session initiated</p>
                <p>10:35:42 - User: admin@pvs.com</p>
                <p>10:35:42 - IP: 192.168.1.100</p>
              </div>
            </div>

            <Button
              onClick={() => setStep(1)}
              variant="outline"
              className="w-full mt-6 h-10 border-gray-300 text-gray-600"
            >
              End Emergency Session
            </Button>
          </div>
        )}
      </div>

      {/* Footer Warning */}
      <div className="p-4 bg-gray-100 border-t border-gray-200">
        <p className="text-xs text-center text-gray-500">
          All actions during emergency access are fully logged and subject to audit.
        </p>
      </div>
    </div>
  )
}
