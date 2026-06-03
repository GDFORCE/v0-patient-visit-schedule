"use client"

import { Lock, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SessionTimeoutScreenProps {
  onSignIn?: () => void
}

export function SessionTimeoutScreen({ onSignIn }: SessionTimeoutScreenProps) {
  return (
    <div className="flex flex-col h-full bg-white items-center justify-center p-6">
      <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
        <Lock className="w-12 h-12 text-gray-400" />
      </div>
      
      <h1 className="text-2xl font-bold text-[#0D1B3E] mb-2 text-center font-[family-name:var(--font-heading)]">
        Session Expired
      </h1>
      
      <p className="text-gray-500 text-center mb-8">
        Your session has expired due to inactivity. Please sign in again to continue.
      </p>

      <Button
        onClick={onSignIn}
        className="w-full h-12 bg-[#2563EB] hover:bg-[#1A3872] text-white rounded-xl font-medium"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Sign In Again
      </Button>
    </div>
  )
}
