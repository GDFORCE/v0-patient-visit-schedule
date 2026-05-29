"use client"

import { AppBar } from "../app-bar"
import { Smartphone, Clock, ShieldOff } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface OTPScreenProps {
  onVerify: () => void
  onBack: () => void
}

const OTP_DURATION = 300 // 5 minutes
const MAX_RESEND = 3

export function OTPScreen({ onVerify, onBack }: OTPScreenProps) {
  const [otp, setOtp] = useState(["4", "7", "", "", "", ""])
  const [focusedIndex, setFocusedIndex] = useState(2)
  const [timeLeft, setTimeLeft] = useState(OTP_DURATION)
  const [resendCount, setResendCount] = useState(0)
  const [isLocked, setIsLocked] = useState(false)

  useEffect(() => {
    if (timeLeft <= 0 || isLocked) return
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft, isLocked])

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)
      if (value && index < 5) setFocusedIndex(index + 1)
    }
  }

  const handleResend = () => {
    const next = resendCount + 1
    if (next >= MAX_RESEND) {
      setIsLocked(true)
    } else {
      setResendCount(next)
      setTimeLeft(OTP_DURATION)
      setOtp(["", "", "", "", "", ""])
    }
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <AppBar title="Verify OTP" showBack onBack={onBack} />

      <div className="flex-1 px-6 py-8 flex flex-col items-center">
        <div className={cn("w-24 h-24 rounded-full flex items-center justify-center mb-6", isLocked ? "bg-red-100" : "bg-blue-100")}>
          {isLocked ? <ShieldOff className="w-12 h-12 text-red-500" /> : <Smartphone className="w-12 h-12 text-[#1A3872]" />}
        </div>

        {isLocked ? (
          <div className="text-center mb-8">
            <p className="font-bold text-red-600 text-lg mb-2">Account Temporarily Locked</p>
            <p className="text-gray-500 text-sm">Too many resend attempts. Please contact support or try again after 30 minutes.</p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 text-center mb-8">
              {"We've sent a 6-digit OTP to"}<br />
              <span className="font-semibold text-gray-900">+91 98XXXXXXXX</span>
            </p>

            <div className="flex gap-2 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onFocus={() => setFocusedIndex(index)}
                  className={cn(
                    "w-12 h-14 text-center text-xl font-semibold rounded-lg border-2 outline-none transition-all",
                    digit ? "border-[#2563EB] bg-blue-50"
                      : focusedIndex === index ? "border-[#1A3872] bg-white" : "border-gray-300 bg-white"
                  )}
                />
              ))}
            </div>

            {timeLeft > 0 ? (
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <Clock className="w-4 h-4" />
                <span>Expires in <span className="font-semibold text-[#1A3872]">{formatTime(timeLeft)}</span></span>
              </div>
            ) : (
              <p className="text-red-500 text-sm mb-4">OTP expired</p>
            )}

            <div className="flex flex-col items-center gap-1 mb-8">
              <button
                onClick={handleResend}
                disabled={timeLeft > 0}
                className={cn("font-medium", timeLeft > 0 ? "text-slate-400" : "text-[#1A3872]")}
              >
                Resend OTP
              </button>
              <p className="text-xs text-slate-400">{resendCount}/{MAX_RESEND} resend attempts used</p>
            </div>
          </>
        )}
      </div>

      <div className="px-6 py-4">
        <button
          onClick={onVerify}
          disabled={isLocked || otp.some(d => !d)}
          className={cn("w-full py-4 rounded-full font-semibold", isLocked || otp.some(d => !d) ? "bg-slate-200 text-slate-400" : "bg-[#1A3872] text-white")}
        >
          Verify OTP
        </button>
      </div>
    </div>
  )
}
