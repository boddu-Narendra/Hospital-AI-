import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MobileBottomBar from "./MobileBottomBar";
import FloatingAiWidget from "./FloatingAiWidget";
import { useHospital } from "../../context/HospitalContext";
import { CheckCircle, AlertTriangle, Info, AlertOctagon } from "lucide-react";

export default function HospitalLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toastMessage } = useHospital();

  const getToastIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />;
      case "error":
        return <AlertOctagon className="h-4 w-4 text-rose-600 flex-shrink-0" />;
      default:
        return <Info className="h-4 w-4 text-blue-600 flex-shrink-0" />;
    }
  };

  const getToastBg = (type) => {
    switch (type) {
      case "success":
        return "border-emerald-200 bg-emerald-50/95 text-emerald-900";
      case "warning":
        return "border-amber-200 bg-amber-50/95 text-amber-900";
      case "error":
        return "border-rose-200 bg-rose-50/95 text-rose-900";
      default:
        return "border-blue-200 bg-blue-50/95 text-blue-900";
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Top Navbar */}
      <Navbar onMobileMenuToggle={() => setMobileMenuOpen(true)} />

      {/* Main App Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto pb-24 pt-4 px-3 sm:px-6 lg:pb-8 lg:pt-6">
          <div className="mx-auto max-w-7xl animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Phones/Tablets) */}
      <MobileBottomBar onOpenMore={() => setMobileMenuOpen(true)} />

      {/* Floating AI Health Assistant */}
      <FloatingAiWidget />

      {/* Global Action Toast Notification */}
      {toastMessage && (
        <aside
          aria-live="polite"
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0"
        >
          <div
            className={`flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-xs font-medium shadow-xl shadow-slate-900/10 backdrop-blur-md animate-fade-in ${getToastBg(
              toastMessage.type
            )}`}
          >
            {getToastIcon(toastMessage.type)}
            <span>{toastMessage.message}</span>
          </div>
        </aside>
      )}
    </div>
  );
}
