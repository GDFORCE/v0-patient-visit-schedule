"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, User, Calendar, Clock, Phone, Home, Building2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MyVisitsScreenProps {
  onBack?: () => void;
  onVisitClick?: (visitId: string) => void;
}

const trials = [
  {
    id: "trial-1",
    protocolId: "ONCO-2024-001",
    studyTitle: "Phase III Study of Novel Cancer Treatment",
    diseaseIndication: "Non-Small Cell Lung Cancer",
    drugName: "Pembrolizumab + Novel Agent",
    scope: "Global",
    hospitalName: "City Medical Center",
    piName: "Dr. Sarah Johnson",
    status: "active",
  },
  {
    id: "trial-2",
    protocolId: "CARD-2023-015",
    studyTitle: "Cardiovascular Risk Reduction Study",
    diseaseIndication: "Hypertension",
    drugName: "Experimental Drug XYZ",
    scope: "Domestic",
    hospitalName: "Heart Care Hospital",
    piName: "Dr. Michael Chen",
    status: "completed",
  },
];

const visits = [
  {
    id: "v1",
    visitNumber: "Visit 1",
    visitName: "Screening Visit",
    visitType: "Hospital",
    scheduledDate: "2024-01-15",
    scheduledTime: "09:00 AM",
    visitWindow: "Jan 13 - Jan 17",
    hospitalName: "City Medical Center",
    piName: "Dr. Sarah Johnson",
    status: "completed",
    instructions: "Please fast for 12 hours before the visit. Bring all current medications.",
  },
  {
    id: "v2",
    visitNumber: "Visit 2",
    visitName: "Baseline Visit",
    visitType: "Hospital",
    scheduledDate: "2024-01-29",
    scheduledTime: "10:00 AM",
    visitWindow: "Jan 27 - Jan 31",
    hospitalName: "City Medical Center",
    piName: "Dr. Sarah Johnson",
    status: "completed",
    instructions: "Blood samples will be collected. ECG will be performed.",
  },
  {
    id: "v3",
    visitNumber: "Visit 3",
    visitName: "Week 4 Follow-up",
    visitType: "Telephonic",
    scheduledDate: "2024-02-26",
    scheduledTime: "02:00 PM",
    visitWindow: "Feb 24 - Feb 28",
    hospitalName: "City Medical Center",
    piName: "Dr. Sarah Johnson",
    status: "upcoming",
    instructions: "Research coordinator will call to check on your progress and any side effects.",
  },
  {
    id: "v4",
    visitNumber: "Visit 4",
    visitName: "Week 8 Assessment",
    visitType: "Hospital",
    scheduledDate: "2024-03-25",
    scheduledTime: "09:30 AM",
    visitWindow: "Mar 23 - Mar 27",
    hospitalName: "City Medical Center",
    piName: "Dr. Sarah Johnson",
    status: "scheduled",
    instructions: "Full physical examination and lab tests.",
  },
  {
    id: "v5",
    visitNumber: "Visit 5",
    visitName: "Week 12 Home Visit",
    visitType: "Home",
    scheduledDate: "2024-04-22",
    scheduledTime: "11:00 AM",
    visitWindow: "Apr 20 - Apr 24",
    hospitalName: "City Medical Center",
    piName: "Dr. Sarah Johnson",
    status: "scheduled",
    instructions: "Nurse will visit your home for routine checkup.",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-emerald-100 text-emerald-700";
    case "upcoming":
      return "bg-amber-100 text-amber-700";
    case "scheduled":
      return "bg-blue-100 text-blue-700";
    case "missed":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getVisitTypeIcon = (type: string) => {
  switch (type) {
    case "Hospital":
      return <Building2 className="h-4 w-4" />;
    case "Telephonic":
      return <Phone className="h-4 w-4" />;
    case "Home":
      return <Home className="h-4 w-4" />;
    default:
      return <Building2 className="h-4 w-4" />;
  }
};

export function MyVisitsScreen({ onBack, onVisitClick }: MyVisitsScreenProps) {
  const [selectedTrial, setSelectedTrial] = useState<string | null>(null);
  const trial = trials.find((t) => t.id === selectedTrial);
  const upcomingVisit = visits.find((v) => v.status === "upcoming");

  if (!selectedTrial) {
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
            <h1 className="text-lg font-semibold">My Visits</h1>
          </div>
        </div>

        {/* Trial List */}
        <div className="flex-1 overflow-auto p-4">
          <p className="text-sm text-gray-600 mb-4">Select a trial to view your visits</p>
          <div className="space-y-3">
            {trials.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTrial(t.id)}
                className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-left"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-[#2563EB]">{t.protocolId}</span>
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          t.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"
                        )}
                      >
                        {t.status === "active" ? "Active" : "Completed"}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900 text-sm mb-2">{t.studyTitle}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <MapPin className="h-3 w-3" />
                      <span>{t.hospitalName}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-[#1A3872] text-white px-4 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedTrial(null)} className="p-1">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold">My Visits</h1>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Panel 1: Trial Details */}
        <div className="bg-white m-4 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-[#DBEAFE] px-4 py-2">
            <h2 className="text-sm font-semibold text-[#1A3872]">Trial Details</h2>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500 text-xs">Protocol ID</p>
                <p className="font-medium text-gray-900">{trial?.protocolId}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Scope</p>
                <p className="font-medium text-gray-900">{trial?.scope}</p>
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Study Title</p>
              <p className="font-medium text-gray-900 text-sm">{trial?.studyTitle}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500 text-xs">Disease/Indication</p>
                <p className="font-medium text-gray-900">{trial?.diseaseIndication}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Drug Name</p>
                <p className="font-medium text-gray-900">{trial?.drugName}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700">{trial?.hospitalName}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700">{trial?.piName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 2: Upcoming Visit */}
        {upcomingVisit && (
          <div className="bg-white mx-4 mb-4 rounded-xl shadow-sm border border-amber-200 overflow-hidden">
            <div className="bg-amber-50 px-4 py-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <h2 className="text-sm font-semibold text-amber-800">Upcoming Visit</h2>
            </div>
            <button
              onClick={() => onVisitClick?.(upcomingVisit.id)}
              className="w-full p-4 text-left"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{upcomingVisit.visitNumber}</span>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full", getStatusColor(upcomingVisit.status))}>
                      {upcomingVisit.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{upcomingVisit.visitName}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {getVisitTypeIcon(upcomingVisit.visitType)}
                  <span>{upcomingVisit.visitType}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{upcomingVisit.scheduledDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{upcomingVisit.scheduledTime}</span>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Visit Window</p>
                <p className="text-sm font-medium text-[#1A3872]">{upcomingVisit.visitWindow}</p>
              </div>
              {upcomingVisit.instructions && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Instructions</p>
                  <p className="text-sm text-gray-700">{upcomingVisit.instructions}</p>
                </div>
              )}
            </button>
          </div>
        )}

        {/* Panel 3: All Visits */}
        <div className="bg-white mx-4 mb-4 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-[#DBEAFE] px-4 py-2">
            <h2 className="text-sm font-semibold text-[#1A3872]">All Visits</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {visits.map((visit) => (
              <button
                key={visit.id}
                onClick={() => onVisitClick?.(visit.id)}
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 text-sm">{visit.visitNumber}</span>
                      <span className={cn("text-xs px-2 py-0.5 rounded-full capitalize", getStatusColor(visit.status))}>
                        {visit.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{visit.visitName}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        {getVisitTypeIcon(visit.visitType)}
                        <span>{visit.visitType}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{visit.scheduledDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{visit.scheduledTime}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
