"use client"

import { AppBar } from "../app-bar"
import { Building2, FlaskConical, Building, Hotel, User, Check, Info } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface RegistrationScreenProps {
  onSubmit: () => void
  onBack: () => void
  entityType?: string | null
}

const entityConfig: Record<string, { label: string; icon: typeof Building2; color: string }> = {
  sponsor: { label: "Sponsor", icon: Building2, color: "bg-blue-100 text-blue-700" },
  cro: { label: "CRO", icon: FlaskConical, color: "bg-purple-100 text-purple-700" },
  smo: { label: "SMO", icon: Building, color: "bg-teal-100 text-teal-700" },
  site: { label: "Site/Hospital", icon: Hotel, color: "bg-amber-100 text-amber-700" },
  patient: { label: "Patient", icon: User, color: "bg-green-100 text-green-700" },
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}{required && " *"}</label>
      {children}
    </div>
  )
}

function Input({ placeholder, defaultValue, type = "text" }: { placeholder?: string; defaultValue?: string; type?: string }) {
  return (
    <input type={type} defaultValue={defaultValue} placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100 outline-none text-sm text-[#0F172A]" />
  )
}

function PhoneInput({ defaultValue }: { defaultValue?: string }) {
  return (
    <div className="flex gap-2">
      <div className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 text-sm font-medium">+91</div>
      <input type="tel" defaultValue={defaultValue} placeholder="98XXXXXXXX"
        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100 outline-none text-sm" />
    </div>
  )
}

function SectionHeader({ title }: { title: string }) {
  return <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider pt-2 pb-1 border-b border-slate-100">{title}</p>
}

// ── Sponsor / CRO form ──────────────────────────────────
function SponsorForm({ entityType }: { entityType?: string | null }) {
  const entityLabel = entityType === "cro" ? "CRO" : "Sponsor"
  return (
    <div className="space-y-4">
      <Field label="Full Name" required><Input defaultValue="John Doe" /></Field>
      <Field label="Designation" required><Input defaultValue="Clinical Research Manager" /></Field>
      <Field label="Email ID" required>
        <Input type="email" defaultValue="john.doe@pharmaco.com" />
      </Field>
      <Field label="Phone Number" required><PhoneInput defaultValue="98765 43210" /></Field>

      {/* Entity Type — auto-populated */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between">
        <span className="text-sm text-slate-500">Entity Type</span>
        <span className="text-sm font-semibold text-[#0D1B3E]">{entityLabel}</span>
      </div>

      <SectionHeader title="Organization" />
      <Field label="Organization Name" required><Input defaultValue="PharmaCo Ltd" /></Field>
      <Field label="Organization Address" required>
        <textarea rows={2} defaultValue="21 Business Park, Mumbai 400001"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100 resize-none" />
      </Field>
    </div>
  )
}

// ── Site / SMO form ──────────────────────────────────────
function SiteForm({ entityType }: { entityType?: string | null }) {
  const [role, setRole] = useState<"PI" | "Research Team">("PI")
  const [sites, setSites] = useState([{ name: "", address: "" }])

  const addSite = () => setSites(prev => [...prev, { name: "", address: "" }])
  const removeSite = (i: number) => setSites(prev => prev.filter((_, idx) => idx !== i))

  return (
    <div className="space-y-4">
      {/* Personal Details */}
      <Field label="Full Name" required><Input defaultValue="Dr. Rajesh Kumar" /></Field>
      <Field label="Designation" required><Input defaultValue="Principal Investigator" /></Field>
      <Field label="Work Email" required><Input type="email" defaultValue="r.kumar@apollo.com" /></Field>
      <Field label="Phone Number" required><PhoneInput defaultValue="98100 12345" /></Field>

      {/* Entity Type — auto-populated chip shown in parent, but display read-only here */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between">
        <span className="text-sm text-slate-500">Entity Type</span>
        <span className="text-sm font-semibold text-[#0D1B3E]">
          {entityType === "smo" ? "SMO" : "Site / Hospital"}
        </span>
      </div>

      {/* Role: PI / Research Team */}
      <Field label="Role" required>
        <div className="flex rounded-xl border border-gray-200 overflow-hidden">
          {(["PI", "Research Team"] as const).map(r => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={cn("flex-1 py-2.5 text-sm font-medium", role === r ? "bg-[#1A3872] text-white" : "bg-white text-gray-600")}
            >
              {r}
            </button>
          ))}
        </div>
      </Field>

      {/* Department — only when PI */}
      {role === "PI" && (
        <Field label="Department">
          <Input placeholder="e.g. Oncology, Cardiology" />
        </Field>
      )}

      {/* Medical Registration */}
      <Field label="Medical Registration No. (MCI/NMC)"><Input placeholder="MCI-XXXXXXXX" /></Field>

      {/* Organization */}
      <SectionHeader title="Organization" />
      <Field label="Organization Name" required><Input defaultValue="Apollo Hospitals Mumbai" /></Field>
      <Field label="Organization Address" required><Input placeholder="Building / Street" /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="City" required><Input defaultValue="Mumbai" /></Field>
        <Field label="State" required><Input defaultValue="Maharashtra" /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="PIN Code"><Input placeholder="400001" /></Field>
        <Field label="Country"><Input defaultValue="India" /></Field>
      </div>

      {/* Add Sites — SMO only */}
      {entityType === "smo" && (
        <>
          <SectionHeader title="Sites Under SMO" />
          <p className="text-xs text-slate-500">Add the hospital / site locations managed by this SMO.</p>
          {sites.map((site, i) => (
            <div key={i} className="bg-slate-50 rounded-xl border border-slate-200 p-3 space-y-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-500">Site {i + 1}</span>
                {sites.length > 1 && (
                  <button onClick={() => removeSite(i)} className="text-red-400 text-xs font-medium">Remove</button>
                )}
              </div>
              <input
                placeholder="Site / Hospital Name *"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#1A3872]"
                defaultValue={i === 0 ? "Apollo Hospitals Mumbai" : ""}
              />
              <input
                placeholder="Site Address"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#1A3872]"
                defaultValue={i === 0 ? "Jubilee Hills, Hyderabad" : ""}
              />
            </div>
          ))}
          <button onClick={addSite}
            className="w-full py-2.5 border-2 border-dashed border-slate-300 rounded-xl text-sm text-slate-500 font-medium hover:border-[#1A3872] hover:text-[#1A3872] transition-colors">
            + Add Another Site
          </button>
        </>
      )}

      {/* Trial Assignment */}
      <SectionHeader title="Trial Assignment" />
      <Field label="Assign to Trial(s)">
        <div className="space-y-2 mt-1">
          {[
            { id: "P001", label: "Protocol-001 Diabetes Phase II", checked: true },
            { id: "P002", label: "Protocol-002 Hypertension Study", checked: true },
            { id: "P003", label: "Protocol-003 Oncology Trial", checked: false },
          ].map(t => (
            <label key={t.id} className="flex items-center gap-3">
              <div className={cn("w-5 h-5 rounded border-2 flex items-center justify-center", t.checked ? "border-[#0D9488] bg-[#0D9488]" : "border-slate-300 bg-white")}>
                {t.checked && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-sm text-[#0F172A]">{t.label}</span>
            </label>
          ))}
        </div>
      </Field>
      <Field label="Max Enrollment Target"><Input placeholder="100" /></Field>
    </div>
  )
}

// ── Patient self-registration form ───────────────────────
function PatientForm() {
  return (
    <div className="space-y-4">
      <SectionHeader title="Personal Information" />

      <Field label="Full Name" required><Input defaultValue="Priya Kapoor" /></Field>

      {/* Entity Type — auto-populated */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between">
        <span className="text-sm text-slate-500">Entity Type</span>
        <span className="text-sm font-semibold text-[#0D1B3E]">Patient</span>
      </div>

      <Field label="Phone Number" required><PhoneInput defaultValue="98765 43210" /></Field>
      <Field label="Email ID" required><Input type="email" placeholder="patient@example.com" /></Field>

      <Field label="Gender" required>
        <select className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#1A3872] bg-white">
          <option value="">Select gender</option>
          <option>Female</option>
          <option>Male</option>
          <option>Other</option>
          <option>Prefer not to say</option>
        </select>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Date of Birth" required>
          <Input type="date" defaultValue="1985-06-15" />
        </Field>
        <Field label="Age">
          <div className="px-4 py-3 rounded-xl border border-gray-200 bg-slate-50 text-sm text-slate-600 font-medium">
            39 yrs
          </div>
        </Field>
      </div>

      <Field label="Preferred Language">
        <select className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#1A3872] bg-white">
          <option>English</option>
          <option>Hindi</option>
          <option>Tamil</option>
          <option>Telugu</option>
          <option>Kannada</option>
          <option>Marathi</option>
        </select>
      </Field>

      {/* Info note */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700">Your trial assignment and visit schedule will be set up by your site coordinator after verification.</p>
      </div>
    </div>
  )
}

export function RegistrationScreen({ onSubmit, onBack, entityType }: RegistrationScreenProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [termsScrolled, setTermsScrolled] = useState(false)
  const entity = entityType && entityConfig[entityType] ? entityConfig[entityType] : entityConfig.sponsor
  const Icon = entity.icon

  const handleTermsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 8) setTermsScrolled(true)
  }

  const handleAccept = () => {
    setAgreedToTerms(true)
    setShowTermsModal(false)
  }

  const handleCheckboxClick = () => {
    if (agreedToTerms) {
      // Allow unchecking
      setAgreedToTerms(false)
      setTermsScrolled(false)
    } else {
      // Open modal to read T&C
      setShowTermsModal(true)
    }
  }

  const renderForm = () => {
    switch (entityType) {
      case "site":
      case "smo":
        return <SiteForm entityType={entityType} />
      case "patient":
        return <PatientForm />
      case "sponsor":
      case "cro":
      default:
        return <SponsorForm entityType={entityType} />
    }
  }

  return (
    <div className="h-full flex flex-col bg-[#F8FAFC]">
      <AppBar title="Registration" showBack onBack={onBack} />

      <div className="flex-1 px-4 py-5 overflow-auto space-y-4">
        {/* Entity Chip */}
        <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium", entity.color)}>
          <Icon className="w-4 h-4" />
          {entity.label}
        </div>

        {/* Progress */}
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#0D1B3E] rounded-full" style={{ width: "40%" }} />
        </div>
        <p className="text-xs text-slate-400">Step 2 of 5 — Account details</p>

        {/* Role-specific form */}
        {renderForm()}

        {/* Terms checkbox — clicking opens the modal */}
        <div className="pt-2">
          <button onClick={handleCheckboxClick} className="flex items-start gap-3 w-full text-left cursor-pointer">
            <div className={cn(
              "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors",
              agreedToTerms ? "border-[#0D1B3E] bg-[#0D1B3E]" : "border-slate-300 bg-white"
            )}>
              {agreedToTerms && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className="text-sm text-gray-600">
              I have read and agree to the{" "}
              <span className="text-[#1A3872] font-medium">Terms &amp; Conditions</span>
              {" "}and{" "}
              <span className="text-[#1A3872] font-medium">Privacy Policy</span>
            </span>
          </button>
        </div>
      </div>

      {/* Submit */}
      <div className="px-4 py-4 bg-white border-t border-slate-100">
        <button
          onClick={onSubmit}
          className={cn("w-full py-3.5 rounded-xl font-semibold text-sm transition-all", agreedToTerms ? "bg-[#0D1B3E] text-white" : "bg-slate-200 text-slate-400")}
        >
          {entityType === "patient" ? "Add Patient →" : "Continue →"}
        </button>
      </div>

      {/* Terms & Conditions Modal */}
      {showTermsModal && (
        <div className="absolute inset-0 bg-black/60 flex items-end z-50">
          <div className="bg-white w-full rounded-t-2xl flex flex-col" style={{ maxHeight: "85%" }}>
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-bold text-[#0D1B3E] text-base">Terms &amp; Conditions</h2>
              <button
                onClick={() => setShowTermsModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Scroll hint */}
            {!termsScrolled && (
              <div className="bg-amber-50 border-b border-amber-100 px-5 py-2 flex items-center gap-2">
                <span className="text-xs text-amber-600 font-medium">↓ Please scroll through all content to accept</span>
              </div>
            )}
            {termsScrolled && (
              <div className="bg-green-50 border-b border-green-100 px-5 py-2 flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-green-600" />
                <span className="text-xs text-green-700 font-medium">You have read all terms — you may now accept</span>
              </div>
            )}

            {/* Scrollable Content */}
            <div
              onScroll={handleTermsScroll}
              className="flex-1 overflow-auto px-5 py-4 text-sm text-slate-600 leading-relaxed space-y-4"
            >
              <div className="space-y-1">
                <p className="font-bold text-slate-800">1. Acceptance of Terms</p>
                <p>By registering, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree, do not proceed with registration.</p>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-800">2. Data Privacy &amp; PDPA Compliance</p>
                <p>All personal and clinical data collected is handled in accordance with applicable data protection laws. Your data will be used solely for the purposes of clinical trial management and communications related to your participation.</p>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-800">3. Data Security</p>
                <p>We employ industry-standard security measures including encryption at rest and in transit. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-800">4. Use of Platform</p>
                <p>Access is granted strictly for clinical trial management purposes. Any misuse, sharing of credentials, or unauthorized access is prohibited and may result in immediate account termination and legal action.</p>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-800">5. Audit &amp; Compliance</p>
                <p>All actions performed on the platform are logged for audit and regulatory compliance purposes. These logs may be shared with authorized regulators upon request and are retained as per applicable regulations.</p>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-800">6. Consent for Communications</p>
                <p>By registering, you consent to receive communications related to your trial participation including visit reminders, medication alerts, and important protocol updates via SMS, email, or in-app notifications.</p>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-800">7. Contact &amp; Support</p>
                <p>For any questions regarding these terms, contact support@mtb-pvs.com. By scrolling through and tapping Accept, you confirm you have read and understood all terms above in full.</p>
              </div>
            </div>

            {/* Accept Button */}
            <div className="px-5 py-4 border-t border-slate-100">
              <button
                onClick={handleAccept}
                disabled={!termsScrolled}
                className={cn(
                  "w-full py-3.5 rounded-xl font-semibold text-sm transition-all",
                  termsScrolled ? "bg-[#0D1B3E] text-white" : "bg-slate-200 text-slate-400 cursor-not-allowed"
                )}
              >
                {termsScrolled ? "Accept & Continue" : "Scroll to read all terms"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
