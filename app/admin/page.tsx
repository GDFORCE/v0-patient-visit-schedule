"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AdminDashboard } from "@/components/clinical/screens/admin/admin-dashboard"
import { TrialMonitoringScreen } from "@/components/clinical/screens/admin/trial-monitoring-screen"
import { AuditLogScreen } from "@/components/clinical/screens/admin/audit-log-screen"
import { InvitationManagementScreen } from "@/components/clinical/screens/admin/invitation-management-screen"
import { TermsManagementScreen } from "@/components/clinical/screens/admin/terms-management-screen"
import { ReportsScreen } from "@/components/clinical/screens/admin/reports-screen"
import { EmergencyAccessScreen } from "@/components/clinical/screens/admin/emergency-access-screen"
import { MyProfileScreen } from "@/components/clinical/screens/admin/my-profile-screen"
import { DelegationScreen } from "@/components/clinical/screens/admin/delegation-screen"
import { MessagesScreen } from "@/components/clinical/screens/admin/messages-screen"
import { AdminPortalShell } from "@/components/clinical/admin/admin-portal-shell"
import { AdminLoginScreen } from "@/components/clinical/admin/admin-login-screen"
import { UserOrgManagementScreen } from "@/components/clinical/admin/user-org-management-screen"
import { ActionCenterScreen } from "@/components/clinical/admin/action-center-screen"
import { LanguageProvider } from "@/lib/i18n"

type AdminScreen =
  | "admin-login"
  | "admin-action-center"
  | "admin-dashboard"
  | "admin-users"
  | "admin-organizations"
  | "admin-trials"
  | "admin-notifications"
  | "admin-support"
  | "admin-audit"
  | "admin-invitations"
  | "admin-terms"
  | "admin-reports"
  | "admin-master-data"
  | "admin-emergency"
  | "admin-system-alerts"
  | "admin-profile"
  | "admin-delegation"
  | "admin-messages"

export default function AdminPortalPage() {
  const router = useRouter()
  const [currentScreen, setCurrentScreen] = useState<AdminScreen>("admin-login")
  const [userFilter, setUserFilter] = useState<string | undefined>(undefined)

  const navigate = (screen: AdminScreen | string) => {
    // Handle admin-users with filter (e.g., "admin-users-Sponsor")
    if (screen.startsWith("admin-users-")) {
      const filter = screen.replace("admin-users-", "")
      setUserFilter(filter)
      setCurrentScreen("admin-users")
      return
    }
    // Reset filter when navigating to admin-users without filter
    if (screen === "admin-users") {
      setUserFilter(undefined)
    }
    setCurrentScreen(screen as AdminScreen)
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "admin-login":
        return (
          <AdminLoginScreen
            onLogin={() => navigate("admin-dashboard")}
            onBack={() => router.push("/")}
          />
        )
      case "admin-dashboard":
        return <AdminDashboard onNavigate={(screen) => navigate(screen)} />
      case "admin-users":
        return <UserOrgManagementScreen defaultTab="users" initialFilter={userFilter} />
      case "admin-organizations":
        return <UserOrgManagementScreen defaultTab="orgs" />
      case "admin-action-center":
        return <ActionCenterScreen defaultTab="approvals" />
      case "admin-trials":
        return <TrialMonitoringScreen onBack={() => navigate("admin-dashboard")} />
      case "admin-notifications":
        return <ActionCenterScreen defaultTab="notifications" />
      case "admin-support":
        return <ActionCenterScreen defaultTab="issues" />
      case "admin-audit":
        return <AuditLogScreen onBack={() => navigate("admin-dashboard")} />
      case "admin-invitations":
        return <InvitationManagementScreen onBack={() => navigate("admin-dashboard")} />
      case "admin-terms":
        return <TermsManagementScreen onBack={() => navigate("admin-dashboard")} />
      case "admin-reports":
        return <ReportsScreen onBack={() => navigate("admin-dashboard")} />
      case "admin-master-data":
        return <ActionCenterScreen defaultTab="approvals" />
      case "admin-emergency":
        return <EmergencyAccessScreen onBack={() => navigate("admin-dashboard")} />
      case "admin-system-alerts":
        return <ActionCenterScreen defaultTab="alerts" />
      case "admin-profile":
        return <MyProfileScreen onBack={() => navigate("admin-dashboard")} />
      case "admin-delegation":
        return <DelegationScreen onBack={() => navigate("admin-dashboard")} />
      case "admin-messages":
        return <MessagesScreen onBack={() => navigate("admin-dashboard")} />
      default:
        return null
    }
  }

  // Page title shown in the admin web portal's top bar (per ADM screen).
  const adminTitleFor = (screen: AdminScreen): string => {
    switch (screen) {
      case "admin-dashboard":     return "Dashboard"
      case "admin-users":         return "Users & Organizations"
      case "admin-organizations": return "Users & Organizations"
      case "admin-action-center": return "Action Center"
      case "admin-master-data":   return "Action Center"
      case "admin-notifications": return "Action Center"
      case "admin-support":       return "Action Center"
      case "admin-system-alerts": return "Action Center"
      case "admin-terms":         return "Terms & Conditions"
      case "admin-trials":        return "Trial Management"
      case "admin-audit":         return "Audit Trail"
      case "admin-emergency":     return "Break-the-Glass Access"
      case "admin-profile":       return "My Profile"
      case "admin-delegation":    return "Delegation"
      case "admin-messages":      return "Messages"
      case "admin-invitations":   return "Invitations"
      case "admin-reports":       return "Reports"
      default:                    return "Platform Admin"
    }
  }

  const renderedScreen = renderScreen()

  // The admin login page takes over the whole window (no portal shell).
  if (currentScreen === "admin-login") {
    return <LanguageProvider>{renderedScreen}</LanguageProvider>
  }

  return (
    <LanguageProvider>
      <AdminPortalShell
        currentScreen={currentScreen}
        title={adminTitleFor(currentScreen)}
        onNavigate={(screen) => navigate(screen)}
      >
        {renderedScreen}
      </AdminPortalShell>
    </LanguageProvider>
  )
}
