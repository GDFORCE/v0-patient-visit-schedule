"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Camera, User, Calendar, Phone, Mail, Globe, Lock, FileText, HelpCircle, LogOut, Shield, MessageSquare, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileSettingsScreenProps {
  onBack?: () => void;
  onLogout?: () => void;
}

type ActiveSection = "main" | "edit-profile" | "change-password" | "terms" | "help";

export function ProfileSettingsScreen({ onBack, onLogout }: ProfileSettingsScreenProps) {
  const [activeSection, setActiveSection] = useState<ActiveSection>("main");
  const [profile, setProfile] = useState({
    fullName: "John Smith",
    dateOfBirth: "1985-03-15",
    gender: "Male",
    phoneNumber: "+1 (555) 123-4567",
    email: "john.smith@email.com",
    preferredLanguage: "English",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [passwordStrength, setPasswordStrength] = useState(0);

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (value: string) => {
    setPasswords({ ...passwords, new: value });
    checkPasswordStrength(value);
  };

  if (activeSection === "edit-profile") {
    return (
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        <div className="bg-[#1A3872] text-white px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveSection("main")} className="p-1">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold">Edit Profile</h1>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {/* Profile Photo */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-[#DBEAFE] flex items-center justify-center">
                <User className="h-12 w-12 text-[#1A3872]" />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center shadow-lg">
                <Camera className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={profile.dateOfBirth}
                onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                value={profile.gender}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <input
                  type="tel"
                  value={profile.phoneNumber}
                  onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-amber-600">Requires verification</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
              <div className="relative">
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-amber-600">Requires verification</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
              <select
                value={profile.preferredLanguage}
                onChange={(e) => setProfile({ ...profile, preferredLanguage: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none bg-white"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Chinese">Chinese</option>
                <option value="Japanese">Japanese</option>
              </select>
            </div>
          </div>

          <button className="w-full mt-6 bg-[#1A3872] text-white py-3 rounded-xl font-medium">
            Save Changes
          </button>
        </div>
      </div>
    );
  }

  if (activeSection === "change-password") {
    return (
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        <div className="bg-[#1A3872] text-white px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveSection("main")} className="p-1">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold">Change Password</h1>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                placeholder="Enter current password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={passwords.new}
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none"
              />
              {/* Password Strength Indicator */}
              <div className="mt-2">
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={cn(
                        "h-1 flex-1 rounded-full",
                        passwordStrength >= level
                          ? level <= 2
                            ? "bg-red-500"
                            : level <= 3
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                          : "bg-gray-200"
                      )}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  {passwordStrength <= 2 ? "Weak" : passwordStrength <= 3 ? "Medium" : "Strong"}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                placeholder="Confirm new password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none"
              />
              {passwords.confirm && passwords.new !== passwords.confirm && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>

            {/* Password Rules */}
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm font-medium text-[#1A3872] mb-2">Password Requirements:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className={cn("flex items-center gap-2", passwords.new.length >= 8 && "text-emerald-600")}>
                  <div className={cn("w-1.5 h-1.5 rounded-full", passwords.new.length >= 8 ? "bg-emerald-500" : "bg-gray-300")} />
                  Minimum 8 characters
                </li>
                <li className={cn("flex items-center gap-2", /[A-Z]/.test(passwords.new) && "text-emerald-600")}>
                  <div className={cn("w-1.5 h-1.5 rounded-full", /[A-Z]/.test(passwords.new) ? "bg-emerald-500" : "bg-gray-300")} />
                  Uppercase letter
                </li>
                <li className={cn("flex items-center gap-2", /[a-z]/.test(passwords.new) && "text-emerald-600")}>
                  <div className={cn("w-1.5 h-1.5 rounded-full", /[a-z]/.test(passwords.new) ? "bg-emerald-500" : "bg-gray-300")} />
                  Lowercase letter
                </li>
                <li className={cn("flex items-center gap-2", /[0-9]/.test(passwords.new) && "text-emerald-600")}>
                  <div className={cn("w-1.5 h-1.5 rounded-full", /[0-9]/.test(passwords.new) ? "bg-emerald-500" : "bg-gray-300")} />
                  Numeric character
                </li>
                <li className={cn("flex items-center gap-2", /[^A-Za-z0-9]/.test(passwords.new) && "text-emerald-600")}>
                  <div className={cn("w-1.5 h-1.5 rounded-full", /[^A-Za-z0-9]/.test(passwords.new) ? "bg-emerald-500" : "bg-gray-300")} />
                  Special character
                </li>
              </ul>
            </div>
          </div>

          <button
            disabled={passwordStrength < 5 || passwords.new !== passwords.confirm || !passwords.current}
            className="w-full mt-6 bg-[#1A3872] text-white py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Update Password
          </button>
        </div>
      </div>
    );
  }

  if (activeSection === "terms") {
    return (
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        <div className="bg-[#1A3872] text-white px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveSection("main")} className="p-1">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold">Terms & Conditions</h1>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-3">Terms of Service</h2>
            <div className="text-sm text-gray-600 space-y-3">
              <p>
                Welcome to the Patient Visit Schedule application. By using this application, you agree to the following terms and conditions.
              </p>
              <h3 className="font-medium text-gray-800">1. Use of Application</h3>
              <p>
                This application is designed to help patients manage their clinical trial visit schedules, medication reminders, and communication with research teams.
              </p>
              <h3 className="font-medium text-gray-800">2. Privacy</h3>
              <p>
                Your personal health information is protected and handled in accordance with applicable privacy laws and regulations including HIPAA.
              </p>
              <h3 className="font-medium text-gray-800">3. Data Security</h3>
              <p>
                We implement industry-standard security measures to protect your data. All communications are encrypted.
              </p>
              <h3 className="font-medium text-gray-800">4. Medical Disclaimer</h3>
              <p>
                This application is for informational purposes only and does not replace professional medical advice. Always consult with your healthcare provider.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm mt-4">
            <h2 className="font-semibold text-gray-900 mb-3">Privacy Policy</h2>
            <div className="text-sm text-gray-600 space-y-3">
              <p>
                We are committed to protecting your privacy. This policy describes how we collect, use, and safeguard your information.
              </p>
              <h3 className="font-medium text-gray-800">Information We Collect</h3>
              <p>
                We collect information you provide directly, including contact details, health information relevant to your trial participation, and usage data.
              </p>
              <h3 className="font-medium text-gray-800">How We Use Information</h3>
              <p>
                Your information is used to manage your trial participation, send reminders, and facilitate communication with your research team.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeSection === "help") {
    return (
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        <div className="bg-[#1A3872] text-white px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveSection("main")} className="p-1">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold">Help & Support</h1>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          {/* FAQ */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button className="w-full p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <HelpCircle className="h-5 w-5 text-[#2563EB]" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">FAQ</p>
                  <p className="text-sm text-gray-500">Frequently asked questions</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {/* Contact Support */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button className="w-full p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Contact Support</p>
                  <p className="text-sm text-gray-500">Get help from our team</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {/* Report Issue */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button className="w-full p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Report Issue</p>
                  <p className="text-sm text-gray-500">Report a bug or problem</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {/* Contact Info */}
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-sm font-medium text-[#1A3872] mb-2">Contact Information</p>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Email: support@patientvisit.app</p>
              <p>Phone: 1-800-TRIAL-HELP</p>
              <p>Hours: Mon-Fri, 9AM-6PM EST</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Profile Screen
  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <div className="bg-[#1A3872] text-white px-4 py-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="p-1">
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <h1 className="text-lg font-semibold">Profile & Settings</h1>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Profile Header */}
        <div className="bg-white p-6 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-[#DBEAFE] flex items-center justify-center mb-3">
            <User className="h-10 w-10 text-[#1A3872]" />
          </div>
          <h2 className="font-semibold text-gray-900">{profile.fullName}</h2>
          <p className="text-sm text-gray-500">{profile.email}</p>
        </div>

        {/* Profile Fields Preview */}
        <div className="bg-white mt-2 divide-y divide-gray-100">
          <button
            onClick={() => setActiveSection("edit-profile")}
            className="w-full p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-400" />
              <span className="text-gray-700">Edit Profile</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>

          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Date of Birth</p>
                <p className="text-sm text-gray-900">{profile.dateOfBirth}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Phone Number</p>
                <p className="text-sm text-gray-900">{profile.phoneNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm text-gray-900">{profile.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Preferred Language</p>
                <p className="text-sm text-gray-900">{profile.preferredLanguage}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white mt-2 divide-y divide-gray-100">
          <button
            onClick={() => setActiveSection("change-password")}
            className="w-full p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-gray-400" />
              <span className="text-gray-700">Change Password</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>

          <button
            onClick={() => setActiveSection("terms")}
            className="w-full p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-gray-400" />
              <span className="text-gray-700">Terms & Conditions</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>

          <button
            onClick={() => setActiveSection("help")}
            className="w-full p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="h-5 w-5 text-gray-400" />
              <span className="text-gray-700">Help & Support</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Security Info */}
        <div className="bg-white mt-2 p-4">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-emerald-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Security Status</p>
              <p className="text-xs text-gray-500">Last login: Today at 9:30 AM</p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="p-4">
          <button
            onClick={onLogout}
            className="w-full p-4 bg-white rounded-xl flex items-center justify-center gap-2 text-red-600 font-medium shadow-sm"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
