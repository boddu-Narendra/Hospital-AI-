import React, { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Sparkles, AlertCircle, RefreshCw, CalendarPlus } from "lucide-react";
import { useHospital } from "../../context/HospitalContext";
import { buildDemoResponse, isDemoMode, getDemoSession } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function FloatingAiWidget() {
  const navigate = useNavigate();
  const { isAiDrawerOpen, toggleAiDrawer } = useHospital();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "init",
      role: "assistant",
      text: "Hello! I am your AuraCare AI Health Assistant. Describe any symptoms, ask about medications, or request clinical triage advice.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (isAiDrawerOpen) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isAiDrawerOpen]);

  const quickSymptoms = [
    "High fever with body ache",
    "Severe throbbing headache",
    "Persistent dry cough & cold",
    "Acid reflux & stomach pain",
  ];

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg = { id: crypto.randomUUID(), role: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      if (isDemoMode) {
        setTimeout(() => {
          const reply = buildDemoResponse(query);
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

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: query }),
      });

      if (!res.ok) throw new Error("Backend unavailable");
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", text: data.ai_response },
      ]);
    } catch {
      // Fallback gracefully to demo reasoning
      const fallbackReply = buildDemoResponse(query);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: fallbackReply + " (Offline triage guidance)",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isAiDrawerOpen && (
        <button
          type="button"
          onClick={toggleAiDrawer}
          className="fixed bottom-20 right-4 z-40 flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/30 transition hover:scale-105 active:scale-95 sm:bottom-6 sm:right-6 lg:h-14 lg:w-14"
          aria-label="Open AI Assistant"
        >
          <Bot className="h-7 w-7 animate-bounce" />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-400 border-2 border-white" />
        </button>
      )}

      {/* Slide-over Assistant Drawer */}
      {isAiDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs transition-opacity animate-fade-in">
          <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">AuraCare AI Triage</h3>
                  <p className="text-[10px] text-blue-100 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Real-Time Clinical Decision Support
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={toggleAiDrawer}
                className="rounded-xl p-1.5 text-white/80 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Disclaimer banner */}
            <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 text-[11px] text-amber-800 border-b border-amber-100">
              <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 text-amber-600" />
              <span>For triage guidance only. Consult clinical staff for emergency diagnosis.</span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-xs ${
                      m.role === "user"
                        ? "bg-blue-600 text-white rounded-br-xs"
                        : "bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200/70"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl bg-slate-100 px-3.5 py-2 text-xs text-slate-500">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin text-blue-600" />
                    Analyzing medical knowledge base...
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Quick Symptom Chips */}
            <div className="border-t border-slate-100 p-2.5 bg-slate-50/50">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-500" /> Quick Symptoms
              </p>
              <div className="flex flex-wrap gap-1.5">
                {quickSymptoms.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(chip)}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 hover:border-blue-300 hover:bg-blue-50 transition active:scale-95"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <div className="border-t border-slate-200 p-3 bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask a health or symptom question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="input-field flex-1"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="btn-primary px-3 py-2"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>

              {/* Action button to book appointment */}
              <button
                type="button"
                onClick={() => {
                  toggleAiDrawer();
                  navigate("/appointments");
                }}
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/60 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition"
              >
                <CalendarPlus className="h-3.5 w-3.5" /> Book Consultation with Specialist
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
