"use client"

import { useState } from "react"
import { ArrowLeft, Send, User, Mail, Phone, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface InvitePatientScreenProps {
  onBack?: () => void
  onSuccess?: () => void
}

const siteTrials = [
  { id: "Protocol-001", name: "Diabetes Phase II Study" },
  { id: "Protocol-002", name: "Hypertension Phase III Study" },
  { id: "Protocol-003", name: "Cardiology Phase II Study" },
]

export function InvitePatientScreen({ onBack, onSuccess }: InvitePatientScreenProps) {
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [protocol, setProtocol] = useState("")
  const [subjectId, setSubjectId] = useState("SUBJ-")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const canSend = (phone || email) && protocol && subjectId.length > 5

  const handleSendInvitation = () => {
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setSent(true)
    }, 1500)
  }

  if (sent) {
    return (
      <div className="flex flex-col h-full bg-white">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-[#0D1B3E] font-[family-name:var(--font-heading)]">
            Invite Patient
          </h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
            <Send className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-xl font-semibold text-[#0D1B3E] mb-2 font-[family-name:var(--font-heading)]">
            Invitation Sent!
          </h2>
          <p className="text-gray-500 text-center text-sm mb-6">
            The patient will receive an SMS/email with a registration link to join the trial.
          </p>

          <div className="w-full bg-gray-50 rounded-xl p-4 mb-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Protocol:</span>
                <span className="text-gray-700 font-medium">{protocol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Subject ID:</span>
                <span className="text-gray-700 font-medium">{subjectId}</span>
              </div>
              {phone && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone:</span>
                  <span className="text-gray-700 font-medium">+91 {phone}</span>
                </div>
              )}
              {email && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="text-gray-700 font-medium">{email}</span>
                </div>
              )}
            </div>
          </div>

          <Button
            onClick={() => {
              setSent(false)
              setPhone("")
              setEmail("")
              setSubjectId("SUBJ-")
              setProtocol("")
            }}
            variant="outline"
            className="w-full h-11 border-[#2563EB] text-[#2563EB] rounded-xl"
          >
            Invite Another Patient
          </Button>
          <Button
            onClick={onSuccess || onBack}
            className="w-full mt-3 h-11 bg-[#2563EB] hover:bg-[#1A3872] text-white rounded-xl"
          >
            Done
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-[#0D1B3E] font-[family-name:var(--font-heading)]">
          Invite Patient
        </h1>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {/* Info Notice */}
        <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3 mb-6">
          <AlertCircle className="w-5 h-5 text-[#2563EB] mt-0.5 flex-shrink-0" />
          <p className="text-sm text-[#1A3872]">
            Patient will receive an SMS/email with a registration link. They can complete their profile and consent process through the app.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {/* Phone Number */}
          <div>
            <Label className="text-sm text-gray-600 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Patient Phone Number
            </Label>
            <div className="flex mt-1.5">
              <div className="flex items-center px-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg text-sm text-gray-500">
                +91
              </div>
              <Input
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-11 rounded-l-none rounded-r-lg border-gray-200"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <Label className="text-sm text-gray-600 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Patient Email
            </Label>
            <Input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 mt-1.5 rounded-lg border-gray-200"
            />
          </div>

          {/* Protocol Selection */}
          <div>
            <Label className="text-sm text-gray-600">Protocol ID</Label>
            <Select value={protocol} onValueChange={setProtocol}>
              <SelectTrigger className="w-full h-11 mt-1.5 bg-white rounded-lg border-gray-200">
                <SelectValue placeholder="Select trial" />
              </SelectTrigger>
              <SelectContent>
                {siteTrials.map((trial) => (
                  <SelectItem key={trial.id} value={trial.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{trial.id}</span>
                      <span className="text-xs text-gray-500">{trial.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject ID */}
          <div>
            <Label className="text-sm text-gray-600 flex items-center gap-2">
              <User className="w-4 h-4" />
              Subject ID
            </Label>
            <Input
              type="text"
              placeholder="SUBJ-XXX"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="h-11 mt-1.5 rounded-lg border-gray-200"
            />
            <p className="text-xs text-gray-400 mt-1">
              Pre-assigned subject ID for this patient
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="p-4 border-t border-gray-100">
        <Button
          onClick={handleSendInvitation}
          disabled={!canSend || sending}
          className="w-full h-12 bg-[#2563EB] hover:bg-[#1A3872] text-white rounded-xl font-medium disabled:bg-gray-300"
        >
          {sending ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending...
            </div>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Invitation
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
