"use client"

import { AppBar } from "../app-bar"
import { FileText, RefreshCw, X, CheckCircle, AlertCircle, HardDrive } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface AddTrialScreenProps {
  onSave: () => void
  onBack: () => void
}

function CompressToggle() {
  const [compress, setCompress] = useState(true)
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-slate-500" />
          <div>
            <p className="text-sm font-semibold text-[#0F172A]">Compress Protocol Document</p>
            <p className="text-xs text-slate-500">Lossless compression — reduces storage cost</p>
          </div>
        </div>
        <button onClick={() => setCompress(!compress)} className={cn("relative w-11 h-6 rounded-full transition-colors flex-shrink-0", compress ? "bg-[#0D9488]" : "bg-slate-300")}>
          <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform", compress ? "translate-x-6" : "translate-x-1")} />
        </button>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-green-600"><CheckCircle className="w-3.5 h-3.5" /><span>Reduces storage cost by ~60–80%</span></div>
        <div className="flex items-center gap-2 text-xs text-green-600"><CheckCircle className="w-3.5 h-3.5" /><span>No impact on visit schedule or medication extraction (lossless)</span></div>
        <div className="flex items-center gap-2 text-xs text-amber-500"><AlertCircle className="w-3.5 h-3.5" /><span>Decompression adds ~1–2s processing time on first access</span></div>
      </div>
      {compress && (
        <div className="mt-3 bg-teal-50 rounded-lg px-3 py-2 text-xs text-teal-700 font-medium">
          Compression enabled — document will be stored in compressed format
        </div>
      )}
    </div>
  )
}

export function AddTrialScreen({ onSave, onBack }: AddTrialScreenProps) {
  const [processing, setProcessing] = useState(true)
  const [selectedIndications, setSelectedIndications] = useState(["Diabetes", "Hypertension"])

  const removeIndication = (indication: string) => {
    setSelectedIndications(selectedIndications.filter((i) => i !== indication))
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <AppBar title="Add New Trial" showBack onBack={onBack} />
      
      <div className="flex-1 overflow-auto px-4 py-4 space-y-4">
        {/* Upload Zone */}
        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 bg-white text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6 text-gray-500" />
          </div>
          <p className="text-gray-600 mb-3">Drop your protocol document here</p>
          <button className="px-4 py-2 border-2 border-[#1A3872] text-[#1A3872] rounded-lg font-medium text-sm">
            Browse Files
          </button>
          <p className="text-xs text-gray-400 mt-2">PDF, DOC, XLS, PNG, JPG</p>
        </div>
        
        {/* Compression Toggle */}
        <CompressToggle />

        {/* AI Processing State */}
        {processing && (
          <div className="bg-blue-50 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-[#1A3872] animate-spin" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Analyzing document…</p>
              <div className="h-2 bg-blue-200 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-[#1A3872] rounded-full" style={{ width: "75%" }} />
              </div>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-gray-500 text-sm">or fill manually</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>
        
        {/* Form Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Protocol ID *</label>
          <input
            type="text"
            placeholder="Enter protocol ID"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100 outline-none bg-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">CTRI Number *</label>
          <input
            type="text"
            placeholder="Enter CTRI number"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100 outline-none bg-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Study Title</label>
          <input
            type="text"
            placeholder="Enter study title"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100 outline-none bg-white"
          />
        </div>
        
        {/* Disease/Indication Multi-select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Disease/Indication *</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedIndications.map((indication) => (
              <span
                key={indication}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-[#1A3872] rounded-full text-sm font-medium"
              >
                {indication}
                <button onClick={() => removeIndication(indication)}>
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Add more..."
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100 outline-none bg-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Study Drug Name</label>
          <input
            type="text"
            placeholder="Enter drug name"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100 outline-none bg-white"
          />
        </div>
      </div>
      
      {/* Save Button */}
      <div className="px-4 py-4 bg-white border-t">
        <button
          onClick={onSave}
          className="w-full py-4 rounded-full font-semibold bg-[#1A3872] text-white"
        >
          Save Trial
        </button>
      </div>
    </div>
  )
}
