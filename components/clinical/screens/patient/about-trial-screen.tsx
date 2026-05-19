"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, FileText, MapPin, User, Phone, Mail, Calendar, Clock, AlertCircle, Download, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface AboutTrialScreenProps {
  onBack?: () => void;
}

type Section = "overview" | "purpose" | "schedule" | "responsibilities" | "medication" | "risks" | "benefits" | "contacts" | "withdrawal";

const trialInfo = {
  title: "Phase III Study of Novel Cancer Treatment in Non-Small Cell Lung Cancer",
  protocolId: "ONCO-2024-001",
  sponsor: "PharmaCo Research Inc.",
  purpose: "This study is being conducted to evaluate the safety and effectiveness of a new combination treatment (Pembrolizumab + Novel Agent) for patients with non-small cell lung cancer (NSCLC). The study aims to determine if this combination can improve outcomes compared to standard treatment.",
  summary: "You are invited to participate in this research study because you have been diagnosed with non-small cell lung cancer. This study will compare a new combination of medications to the current standard treatment. The study will last approximately 12 months and will involve regular visits to the study site.",
  duration: "12 months (approximately 52 weeks)",
  totalVisits: 15,
  visitSchedule: [
    { visit: "Screening", timepoint: "Week -2 to 0", type: "Hospital" },
    { visit: "Baseline", timepoint: "Week 0", type: "Hospital" },
    { visit: "Week 2", timepoint: "Week 2", type: "Telephonic" },
    { visit: "Week 4", timepoint: "Week 4", type: "Hospital" },
    { visit: "Week 8", timepoint: "Week 8", type: "Hospital" },
    { visit: "Week 12", timepoint: "Week 12", type: "Home" },
    { visit: "Week 16", timepoint: "Week 16", type: "Hospital" },
    { visit: "Week 24", timepoint: "Week 24", type: "Hospital" },
    { visit: "Week 36", timepoint: "Week 36", type: "Hospital" },
    { visit: "Week 52", timepoint: "Week 52", type: "Hospital" },
  ],
  responsibilities: [
    "Attend all scheduled study visits",
    "Take study medication as directed",
    "Complete daily medication diary",
    "Report any side effects or health changes promptly",
    "Follow dietary and lifestyle guidelines provided",
    "Keep all study materials confidential",
    "Inform study team of any other medications",
    "Attend follow-up appointments after treatment",
  ],
  medication: {
    name: "Pembrolizumab + Novel Agent XY-123",
    description: "The study medication consists of two drugs: Pembrolizumab (an approved immunotherapy) and Novel Agent XY-123 (an investigational drug). You will receive both medications according to the dosing schedule provided by your study team.",
    instructions: [
      "Take Pembrolizumab 200mg orally once daily",
      "Take Novel Agent XY-123 50mg orally twice daily",
      "Take with food to minimize stomach upset",
      "Do not crush or chew tablets",
      "Store at room temperature away from moisture",
    ],
  },
  risks: [
    { risk: "Fatigue", frequency: "Common (>10%)" },
    { risk: "Nausea", frequency: "Common (>10%)" },
    { risk: "Decreased appetite", frequency: "Common (>10%)" },
    { risk: "Rash", frequency: "Uncommon (1-10%)" },
    { risk: "Diarrhea", frequency: "Uncommon (1-10%)" },
    { risk: "Liver enzyme changes", frequency: "Uncommon (1-10%)" },
    { risk: "Thyroid problems", frequency: "Rare (<1%)" },
    { risk: "Severe allergic reaction", frequency: "Rare (<1%)" },
  ],
  benefits: [
    "Access to a potentially effective new treatment",
    "Close medical monitoring throughout the study",
    "Regular health assessments at no cost",
    "Potential to help future patients with similar conditions",
    "Reimbursement for travel expenses",
  ],
  contacts: {
    pi: {
      name: "Dr. Sarah Johnson",
      role: "Principal Investigator",
      phone: "+1 (555) 123-4567",
      email: "s.johnson@citymedical.com",
    },
    coordinator: {
      name: "Emily Chen",
      role: "Research Coordinator",
      phone: "+1 (555) 234-5678",
      email: "e.chen@citymedical.com",
    },
    site: {
      name: "City Medical Center",
      address: "123 Medical Drive, Suite 500, New York, NY 10001",
      phone: "+1 (555) 345-6789",
    },
    emergency: {
      phone: "1-800-TRIAL-ER",
      available: "24/7",
    },
  },
  withdrawal: "Your participation in this study is completely voluntary. You may withdraw from the study at any time, for any reason, without penalty or loss of benefits. If you decide to withdraw, please inform your study team so they can ensure your safety and provide appropriate follow-up care. Withdrawing from the study will not affect your relationship with your healthcare providers or your access to standard medical care.",
};

const sections: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <FileText className="h-4 w-4" /> },
  { id: "purpose", label: "Trial Purpose", icon: <AlertCircle className="h-4 w-4" /> },
  { id: "schedule", label: "Visit Schedule", icon: <Calendar className="h-4 w-4" /> },
  { id: "responsibilities", label: "Your Responsibilities", icon: <User className="h-4 w-4" /> },
  { id: "medication", label: "Medication Info", icon: <FileText className="h-4 w-4" /> },
  { id: "risks", label: "Risks & Side Effects", icon: <AlertCircle className="h-4 w-4" /> },
  { id: "benefits", label: "Benefits", icon: <FileText className="h-4 w-4" /> },
  { id: "contacts", label: "Contact Details", icon: <Phone className="h-4 w-4" /> },
  { id: "withdrawal", label: "Withdrawal Info", icon: <FileText className="h-4 w-4" /> },
];

export function AboutTrialScreen({ onBack }: AboutTrialScreenProps) {
  const [activeSection, setActiveSection] = useState<Section>("overview");

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-3">{trialInfo.title}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Protocol ID</span>
                  <span className="font-medium text-[#2563EB]">{trialInfo.protocolId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Sponsor</span>
                  <span className="text-gray-900">{trialInfo.sponsor}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Duration</span>
                  <span className="text-gray-900">{trialInfo.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Total Visits</span>
                  <span className="text-gray-900">{trialInfo.totalVisits}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
              <h4 className="font-medium text-gray-900 mb-2">Study Summary</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{trialInfo.summary}</p>
            </div>

            <button className="w-full bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-red-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Patient Information Sheet</p>
                  <p className="text-xs text-gray-500">Full document (PDF)</p>
                </div>
              </div>
              <Download className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        );

      case "purpose":
        return (
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Why This Study Is Being Conducted</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{trialInfo.purpose}</p>
          </div>
        );

      case "schedule":
        return (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-[#DBEAFE] px-4 py-2">
              <h3 className="font-semibold text-[#1A3872]">Visit Schedule Overview</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {trialInfo.visitSchedule.map((visit, index) => (
                <div key={index} className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{visit.visit}</p>
                    <p className="text-xs text-gray-500">{visit.timepoint}</p>
                  </div>
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    visit.type === "Hospital" ? "bg-blue-100 text-blue-700" :
                    visit.type === "Telephonic" ? "bg-emerald-100 text-emerald-700" :
                    "bg-amber-100 text-amber-700"
                  )}>
                    {visit.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case "responsibilities":
        return (
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Your Responsibilities</h3>
            <ul className="space-y-3">
              {trialInfo.responsibilities.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#DBEAFE] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-[#1A3872]">{index + 1}</span>
                  </div>
                  <p className="text-sm text-gray-700">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        );

      case "medication":
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{trialInfo.medication.name}</h3>
              <p className="text-sm text-gray-600">{trialInfo.medication.description}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
              <h4 className="font-medium text-gray-900 mb-3">Dosing Instructions</h4>
              <ul className="space-y-2">
                {trialInfo.medication.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-2" />
                    <p className="text-sm text-gray-700">{instruction}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case "risks":
        return (
          <div className="space-y-4">
            <div className="bg-amber-50 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                Please report any side effects to your study team immediately. Contact emergency services if you experience severe symptoms.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-red-50 px-4 py-2">
                <h3 className="font-semibold text-red-800">Possible Side Effects</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {trialInfo.risks.map((item, index) => (
                  <div key={index} className="p-3 flex items-center justify-between">
                    <p className="text-sm text-gray-900">{item.risk}</p>
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      item.frequency.includes("Common") ? "bg-amber-100 text-amber-700" :
                      item.frequency.includes("Uncommon") ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-700"
                    )}>
                      {item.frequency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "benefits":
        return (
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Potential Benefits</h3>
            <ul className="space-y-3">
              {trialInfo.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-sm text-gray-700">{benefit}</p>
                </li>
              ))}
            </ul>
          </div>
        );

      case "contacts":
        return (
          <div className="space-y-4">
            {/* PI Contact */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#DBEAFE] flex items-center justify-center">
                  <User className="h-5 w-5 text-[#1A3872]" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{trialInfo.contacts.pi.name}</p>
                  <p className="text-xs text-gray-500">{trialInfo.contacts.pi.role}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{trialInfo.contacts.pi.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{trialInfo.contacts.pi.email}</span>
                </div>
              </div>
            </div>

            {/* Coordinator Contact */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{trialInfo.contacts.coordinator.name}</p>
                  <p className="text-xs text-gray-500">{trialInfo.contacts.coordinator.role}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{trialInfo.contacts.coordinator.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{trialInfo.contacts.coordinator.email}</span>
                </div>
              </div>
            </div>

            {/* Site Info */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{trialInfo.contacts.site.name}</p>
                  <p className="text-xs text-gray-500">Study Site</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-gray-700">{trialInfo.contacts.site.address}</p>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{trialInfo.contacts.site.phone}</span>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-red-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-red-800">24/7 Emergency Line</p>
                  <p className="text-lg font-bold text-red-600">{trialInfo.contacts.emergency.phone}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "withdrawal":
        return (
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Withdrawal Information</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{trialInfo.withdrawal}</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-[#1A3872] text-white px-4 py-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="p-1">
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <h1 className="text-lg font-semibold">About Trial</h1>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 overflow-x-auto">
        <div className="flex gap-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                activeSection === section.id
                  ? "bg-[#1A3872] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {section.icon}
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {renderContent()}
      </div>

      {/* Language Selector */}
      <div className="bg-white border-t border-gray-200 p-3">
        <button className="w-full flex items-center justify-center gap-2 text-sm text-gray-600">
          <Globe className="h-4 w-4" />
          <span>Change Language</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
