"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, Send, Mic, Paperclip, Image, FileText, MoreVertical, Phone, Video, Check, CheckCheck, Play, Pause, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatScreenProps {
  onBack?: () => void;
}

interface Message {
  id: string;
  sender: string;
  senderRole: "patient" | "pi" | "coordinator";
  content: string;
  type: "text" | "voice" | "document" | "image";
  timestamp: string;
  status: "sent" | "delivered" | "read";
  attachmentName?: string;
  duration?: number;
}

const initialMessages: Message[] = [
  {
    id: "1",
    sender: "Dr. Sarah Johnson",
    senderRole: "pi",
    content: "Good morning! How are you feeling today after your last visit?",
    type: "text",
    timestamp: "9:00 AM",
    status: "read",
  },
  {
    id: "2",
    sender: "You",
    senderRole: "patient",
    content: "Good morning Dr. Johnson! I'm feeling much better. The new medication seems to be working well.",
    type: "text",
    timestamp: "9:15 AM",
    status: "read",
  },
  {
    id: "3",
    sender: "Emily Chen",
    senderRole: "coordinator",
    content: "That's great to hear! Just a reminder that your next visit is scheduled for February 26th at 2:00 PM. It will be a telephonic visit.",
    type: "text",
    timestamp: "9:20 AM",
    status: "read",
  },
  {
    id: "4",
    sender: "Dr. Sarah Johnson",
    senderRole: "pi",
    content: "Excellent progress! Please continue to monitor any side effects and let us know if anything changes.",
    type: "text",
    timestamp: "9:25 AM",
    status: "read",
  },
  {
    id: "5",
    sender: "You",
    senderRole: "patient",
    content: "",
    type: "voice",
    timestamp: "9:30 AM",
    status: "delivered",
    duration: 15,
  },
  {
    id: "6",
    sender: "Emily Chen",
    senderRole: "coordinator",
    content: "",
    type: "document",
    timestamp: "9:35 AM",
    status: "read",
    attachmentName: "Visit_Instructions.pdf",
  },
];

const chatParticipants = [
  { name: "Dr. Sarah Johnson", role: "Principal Investigator", avatar: "SJ", online: true },
  { name: "Emily Chen", role: "Research Coordinator", avatar: "EC", online: true },
  { name: "Dr. Michael Park", role: "Sub-Investigator", avatar: "MP", online: false },
];

export function ChatScreen({ onBack }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showParticipants, setShowParticipants] = useState(false);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "You",
      senderRole: "patient",
      content: inputText,
      type: "text",
      timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      status: "sent",
    };
    
    setMessages([...messages, newMessage]);
    setInputText("");
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    recordingInterval.current = setInterval(() => {
      setRecordingTime((t) => t + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
    }
    
    if (recordingTime > 0) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: "You",
        senderRole: "patient",
        content: "",
        type: "voice",
        timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
        status: "sent",
        duration: recordingTime,
      };
      setMessages([...messages, newMessage]);
    }
    setRecordingTime(0);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "pi":
        return "text-[#2563EB]";
      case "coordinator":
        return "text-emerald-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <Check className="h-3 w-3 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-[#2563EB]" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-[#1A3872] text-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <button onClick={onBack} className="p-1">
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <div>
              <h1 className="text-base font-semibold">Trial Chat</h1>
              <p className="text-xs text-blue-200">ONCO-2024-001 - 3 participants</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white/10 rounded-full">
              <Phone className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full">
              <Video className="h-5 w-5" />
            </button>
            <button 
              onClick={() => setShowParticipants(!showParticipants)}
              className="p-2 hover:bg-white/10 rounded-full"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Participants Panel */}
      {showParticipants && (
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Participants</h3>
            <button onClick={() => setShowParticipants(false)}>
              <X className="h-4 w-4 text-gray-400" />
            </button>
          </div>
          <div className="space-y-2">
            {chatParticipants.map((participant) => (
              <div key={participant.name} className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-[#DBEAFE] flex items-center justify-center text-xs font-medium text-[#1A3872]">
                    {participant.avatar}
                  </div>
                  {participant.online && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                  <p className="text-xs text-gray-500">{participant.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message) => {
          const isPatient = message.senderRole === "patient";
          
          return (
            <div
              key={message.id}
              className={cn("flex", isPatient ? "justify-end" : "justify-start")}
            >
              <div className={cn("max-w-[80%]", isPatient ? "order-1" : "order-2")}>
                {!isPatient && (
                  <p className={cn("text-xs font-medium mb-1", getRoleColor(message.senderRole))}>
                    {message.sender}
                  </p>
                )}
                
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2",
                    isPatient
                      ? "bg-[#1A3872] text-white rounded-br-sm"
                      : "bg-white text-gray-900 rounded-bl-sm shadow-sm"
                  )}
                >
                  {message.type === "text" && (
                    <p className="text-sm">{message.content}</p>
                  )}
                  
                  {message.type === "voice" && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setPlayingVoice(playingVoice === message.id ? null : message.id)}
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          isPatient ? "bg-white/20" : "bg-[#DBEAFE]"
                        )}
                      >
                        {playingVoice === message.id ? (
                          <Pause className={cn("h-4 w-4", isPatient ? "text-white" : "text-[#1A3872]")} />
                        ) : (
                          <Play className={cn("h-4 w-4", isPatient ? "text-white" : "text-[#1A3872]")} />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className={cn("h-1 rounded-full", isPatient ? "bg-white/30" : "bg-gray-200")}>
                          <div className={cn("h-1 rounded-full w-1/3", isPatient ? "bg-white" : "bg-[#2563EB]")} />
                        </div>
                      </div>
                      <span className={cn("text-xs", isPatient ? "text-white/70" : "text-gray-500")}>
                        {formatDuration(message.duration || 0)}
                      </span>
                    </div>
                  )}
                  
                  {message.type === "document" && (
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        isPatient ? "bg-white/20" : "bg-red-100"
                      )}>
                        <FileText className={cn("h-5 w-5", isPatient ? "text-white" : "text-red-600")} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{message.attachmentName}</p>
                        <p className={cn("text-xs", isPatient ? "text-white/70" : "text-gray-500")}>
                          Tap to download
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className={cn("flex items-center gap-1 mt-1", isPatient ? "justify-end" : "justify-start")}>
                  <span className="text-xs text-gray-400">{message.timestamp}</span>
                  {isPatient && getStatusIcon(message.status)}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="bg-red-50 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm text-red-600">Recording... {formatDuration(recordingTime)}</span>
          </div>
          <button
            onClick={stopRecording}
            className="text-sm text-red-600 font-medium"
          >
            Stop
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-3">
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Paperclip className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Image className="h-5 w-5" />
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="w-full px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
            />
          </div>
          
          {inputText.trim() ? (
            <button
              onClick={handleSend}
              className="p-2 bg-[#1A3872] text-white rounded-full"
            >
              <Send className="h-5 w-5" />
            </button>
          ) : (
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onMouseLeave={stopRecording}
              className={cn(
                "p-2 rounded-full transition-colors",
                isRecording ? "bg-red-500 text-white" : "bg-gray-100 text-gray-600"
              )}
            >
              <Mic className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
