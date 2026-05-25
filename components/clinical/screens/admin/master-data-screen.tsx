"use client"

import { useState } from "react"
import { ArrowLeft, AlertCircle, FileText, Check, X } from "lucide-react"
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

interface MasterDataScreenProps {
  onBack?: () => void
}

const customValues = [
  {
    id: "1",
    fieldType: "Disease/Indication",
    value: "Idiopathic Pulmonary Fibrosis",
    submittedBy: "Dr. Sharma",
    organization: "AIIMS Delhi",
    dateSubmitted: "22 May 2025",
    status: "pending",
  },
  {
    id: "2",
    fieldType: "Therapeutic Area",
    value: "Rare Genetic Disorders",
    submittedBy: "Dr. Patel",
    organization: "PGI Chandigarh",
    dateSubmitted: "21 May 2025",
    status: "pending",
  },
  {
    id: "3",
    fieldType: "Disease/Indication",
    value: "Non-Alcoholic Steatohepatitis (NASH)",
    submittedBy: "Dr. Kumar",
    organization: "KEM Mumbai",
    dateSubmitted: "20 May 2025",
    status: "approved",
    actionBy: "Admin",
    actionDate: "21 May 2025",
  },
  {
    id: "4",
    fieldType: "Study Drug Route",
    value: "Intrathecal Injection",
    submittedBy: "Dr. Singh",
    organization: "AIIMS Delhi",
    dateSubmitted: "19 May 2025",
    status: "rejected",
    actionBy: "Admin",
    actionDate: "20 May 2025",
    rejectReason: "Value already exists as 'Intrathecal'",
  },
  {
    id: "5",
    fieldType: "Adverse Event Term",
    value: "Infusion-related hypersensitivity",
    submittedBy: "Dr. Reddy",
    organization: "CMC Vellore",
    dateSubmitted: "18 May 2025",
    status: "pending",
  },
]

export function MasterDataScreen({ onBack }: MasterDataScreenProps) {
  const [filter, setFilter] = useState("all")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [values, setValues] = useState(customValues)

  const filteredValues = values.filter((v) => {
    if (filter === "all") return true
    return v.status === filter
  })

  const handleApprove = (id: string) => {
    setValues((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, status: "approved", actionBy: "Admin", actionDate: "25 May 2025" }
          : v
      )
    )
  }

  const handleEditApprove = (id: string) => {
    if (editingId === id) {
      // Save the edit
      setValues((prev) =>
        prev.map((v) =>
          v.id === id
            ? {
                ...v,
                value: editValue,
                status: "approved",
                actionBy: "Admin",
                actionDate: "25 May 2025",
              }
            : v
        )
      )
      setEditingId(null)
      setEditValue("")
    } else {
      // Start editing
      const item = values.find((v) => v.id === id)
      if (item) {
        setEditingId(id)
        setEditValue(item.value)
      }
    }
  }

  const handleReject = (id: string) => {
    setValues((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              status: "rejected",
              actionBy: "Admin",
              actionDate: "25 May 2025",
              rejectReason: "Value not suitable for global use",
            }
          : v
      )
    )
  }

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-[#0D1B3E] font-[family-name:var(--font-heading)]">
          Master Data
        </h1>
      </div>

      {/* Info Banner */}
      <div className="mx-4 mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#2563EB] mt-0.5 flex-shrink-0" />
        <p className="text-sm text-[#1A3872]">
          Review custom values submitted by users under &apos;Others / Specify&apos; fields. Approved values become globally available.
        </p>
      </div>

      {/* Filter */}
      <div className="px-4 mt-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full h-11 bg-white rounded-lg border-gray-200">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Custom Values List */}
      <div className="flex-1 overflow-auto px-4 py-4 space-y-3">
        {filteredValues.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
          >
            {/* Field Type Badge */}
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                {item.fieldType}
              </span>
              <span
                className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                  item.status === "pending"
                    ? "bg-amber-100 text-amber-700"
                    : item.status === "approved"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </span>
            </div>

            {/* Value */}
            {editingId === item.id ? (
              <div className="mb-3">
                <Label className="text-xs text-gray-500">Edit Value</Label>
                <Textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="mt-1 text-sm"
                  rows={2}
                />
              </div>
            ) : (
              <div className="mb-3">
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                  <p className="text-sm font-medium text-[#0D1B3E]">{item.value}</p>
                </div>
              </div>
            )}

            {/* Submitted By */}
            <div className="text-xs text-gray-500 mb-3">
              <p>
                Submitted by: <span className="text-gray-700">{item.submittedBy}</span> &middot;{" "}
                {item.organization}
              </p>
              <p>Date: {item.dateSubmitted}</p>
            </div>

            {/* Action Result (for approved/rejected) */}
            {item.status !== "pending" && (
              <div
                className={`text-xs p-2 rounded-lg mb-3 ${
                  item.status === "approved" ? "bg-emerald-50" : "bg-red-50"
                }`}
              >
                <p className={item.status === "approved" ? "text-emerald-700" : "text-red-700"}>
                  {item.status === "approved" ? "Approved" : "Rejected"} by {item.actionBy} on{" "}
                  {item.actionDate}
                </p>
                {item.rejectReason && (
                  <p className="text-red-600 mt-1">Reason: {item.rejectReason}</p>
                )}
              </div>
            )}

            {/* Action Buttons (only for pending) */}
            {item.status === "pending" && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleApprove(item.id)}
                  className="flex-1 h-9 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs"
                >
                  <Check className="w-3.5 h-3.5 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditApprove(item.id)}
                  className="flex-1 h-9 border-[#2563EB] text-[#2563EB] hover:bg-blue-50 rounded-lg text-xs"
                >
                  {editingId === item.id ? "Save Edit" : "Edit & Approve"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReject(item.id)}
                  className="flex-1 h-9 border-red-500 text-red-500 hover:bg-red-50 rounded-lg text-xs"
                >
                  <X className="w-3.5 h-3.5 mr-1" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        ))}

        {filteredValues.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <FileText className="w-12 h-12 mb-3" />
            <p>No custom values found</p>
          </div>
        )}
      </div>
    </div>
  )
}
