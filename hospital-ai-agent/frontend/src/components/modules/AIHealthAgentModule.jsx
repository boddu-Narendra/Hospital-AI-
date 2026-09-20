import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bot,
  Send,
  Sparkles,
  AlertCircle,
  Stethoscope,
  Calendar,
  Clock,
  User,
  CheckCircle,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { useHospital } from "../../context/HospitalContext";
import { buildDemoResponse, isDemoMode, getDemoSession } from "../../supabaseClient";
import { API_ENDPOINTS } from "../../apiConfig";

export default function AIHealthAgentModule() {
  const navigate = useNavigate();
  const { currentUser, currentRole, patients } = useHospital();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "1",
      role: "assistant",
      text: `Hello ${currentUser?.name || "there"}! I am your AuraCare Clinical AI Agent. I provide symptom triage, health guidance, and can connect you directly to our on-duty hospital specialists. What symptoms or medical questions can I help you with today?`,
    },
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const quickSymptoms = [
    "High fever (102°F) with chills and headache",
    "Persistent dry cough with sore throat for 3 days",
    "Chest discomfort radiating to left arm",
    "Severe throbbing migraine with light sensitivity",
    "Sudden sharp lower right abdominal pain",
    "Sprained ankle with swelling after sports",
  ];

  const handleSend = async (queryText) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || isLoading) return;

    const userMessage = { id: crypto.randomUUID(), role: "user", text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      if (isDemoMode) {
        setTimeout(() => {
          const reply = buildDemoResponse(textToSend);
          setMessages((prev) => [
            ...prev,
            { id: crypto.randomUUID(), role: "assistant", text: reply },
          ]);
          setIsLoading(false);
        }, 500);
        return;
      }

      const session = getDemoSession();
      const token = session?.access_token || "demo-token";

      const res = await fetch(API_ENDPOINTS.chat, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: textToSend }),
      });

      if (!res.ok) throw new Error("Backend connection failed");
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", text: data.ai_response },
      ]);
    } catch {
      const fallbackReply = buildDemoResponse(textToSend);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: fallbackReply + "\n\n(Generated via local Clinical Knowledge Engine)",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 p-6 text-white shadow-xl shadow-blue-700/15">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
              <Bot className="h-7 w-7 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">
                  AuraCare AI Health Agent
                </h1>
                <span className="rounded-full bg-emerald-400/25 border border-emerald-300/40 px-2 py-0.5 text-[10px] font-bold text-emerald-100">
                  Online Triage
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-0.5">
                LangGraph-powered clinical triage, symptom analysis, and instant specialist routing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/appointments")}
              className="flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-blue-700 shadow-sm hover:bg-blue-50 transition active:scale-95"
            >
              <Calendar className="h-4 w-4" /> Book Doctor Appt
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Workbench */}
      <div className="card flex flex-col h-[650px] overflow-hidden">
        {/* Top Disclaimer */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-amber-50/70 px-4 py-2 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Clinical Guidance:</strong> For emergency medical conditions, please dial 911 or visit Emergency Trauma Care immediately.
            </span>
          </div>
          <span className="hidden md:inline-flex badge-emerald text-[10px]">
            <ShieldCheck className="h-3 w-3" /> Secure Health Data
          </span>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isAssistant = msg.role === "assistant";
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isAssistant ? "justify-start" : "justify-end"}`}
              >
                {isAssistant && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex-shrink-0 shadow-xs">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                    isAssistant
                      ? "bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200/80 shadow-xs"
                      : "bg-blue-600 text-white rounded-tr-xs shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

                {!isAssistant && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 text-white flex-shrink-0 shadow-xs">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white flex-shrink-0">
                <RefreshCw className="h-4 w-4 animate-spin" />
              </div>
              <div className="rounded-2xl rounded-tl-xs bg-slate-100 px-4 py-2.5 text-xs text-slate-500 border border-slate-200/70">
                Evaluating symptoms against clinical criteria...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Symptom Chips */}
        <div className="border-t border-slate-100 bg-slate-50/70 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-500" /> Common Clinical Inquiries
          </p>
          <div className="flex flex-wrap gap-1.5">
            {quickSymptoms.map((symptom, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(symptom)}
                className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 hover:border-blue-300 hover:bg-blue-50 transition active:scale-95"
              >
                {symptom}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="border-t border-slate-200 p-3 sm:p-4 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Describe your symptoms, vital signs, or health question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input-field py-2.5 text-sm"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="btn-primary px-4 py-2.5"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
