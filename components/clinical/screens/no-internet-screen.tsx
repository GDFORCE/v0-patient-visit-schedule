"use client"

import { CloudOff, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NoInternetScreenProps {
  onRetry?: () => void
}

export function NoInternetScreen({ onRetry }: NoInternetScreenProps) {
  return (
    <div className="flex flex-col h-full bg-white items-center justify-center p-6">
      <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
        <CloudOff className="w-12 h-12 text-gray-400" />
      </div>
      
      <h1 className="text-2xl font-bold text-[#0D1B3E] mb-2 text-center font-[family-name:var(--font-heading)]">
        No Internet Connection
      </h1>
      
      <p className="text-gray-500 text-center mb-8">
        Please check your network connection and try again.
      </p>

      <Button
        onClick={onRetry}
        className="w-full h-12 bg-[#2563EB] hover:bg-[#1A3872] text-white rounded-xl font-medium"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Retry
      </Button>
    </div>
  )
}
