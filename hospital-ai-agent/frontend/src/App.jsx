import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { HospitalProvider } from "./context/HospitalContext";
import HospitalLayout from "./components/layout/HospitalLayout";
import HomePage from "./components/pages/HomePage";
import AuthForm from "./components/AuthForm";
import Profile from "./components/Profile";

// All 15 Core Modules
import DashboardModule from "./components/modules/DashboardModule";
import UserManagementModule from "./components/modules/UserManagementModule";
import DoctorManagementModule from "./components/modules/DoctorManagementModule";
import PatientManagementModule from "./components/modules/PatientManagementModule";
import AppointmentModule from "./components/modules/AppointmentModule";
import ConsultationModule from "./components/modules/ConsultationModule";
import MedicalRecordsModule from "./components/modules/MedicalRecordsModule";
import PharmacyModule from "./components/modules/PharmacyModule";
import LaboratoryModule from "./components/modules/LaboratoryModule";
import BedManagementModule from "./components/modules/BedManagementModule";
import BillingModule from "./components/modules/BillingModule";
import NotificationsModule from "./components/modules/NotificationsModule";
import SecurityModule from "./components/modules/SecurityModule";
import ReportsAnalyticsModule from "./components/modules/ReportsAnalyticsModule";
import AIHealthAgentModule from "./components/modules/AIHealthAgentModule";

import { supabase, hasSupabaseConfig, isDemoMode, getDemoSession } from "./supabaseClient";

function App() {
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const updateDemoSession = () => {
      const demoSession = getDemoSession();
      setSession(demoSession ?? null);
    };

    if (isDemoMode) {
      updateDemoSession();
      setAuthReady(true);
      window.addEventListener("demo-session-change", updateDemoSession);
      return () => window.removeEventListener("demo-session-change", updateDemoSession);
    }

    if (!hasSupabaseConfig || !supabase) {
      setAuthReady(true);
      return;
    }

    const init = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      setSession(currentSession ?? null);
      setAuthReady(true);
    };
    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!authReady) {
    return (
      <main className="flex h-screen items-center justify-center bg-slate-50 p-6">
        <div className="card px-6 py-4 text-xs font-semibold text-slate-700 shadow-sm animate-pulse">
          Loading AuraCare Hospital OS...
        </div>
      </main>
    );
  }

  return (
    <HospitalProvider>
      <Router>
        <Routes>
          {/* Public Hospital Landing Home Page */}
          <Route path="/" element={<HomePage />} />

          {/* Role-Based Authentication Route */}
          <Route
            path="/login"
            element={
              session ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50/50 to-indigo-100/60 p-3 sm:p-6 flex items-center justify-center">
                  <AuthForm />
                </main>
              )
            }
          />

          {/* Protected Hospital Operations Routes under HospitalLayout */}
          <Route
            element={
              session ? (
                <HospitalLayout />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          >
            {/* 1. Dashboard (Overview) */}
            <Route path="/dashboard" element={<DashboardModule />} />

            {/* 2. User Management */}
            <Route path="/users" element={<UserManagementModule />} />

            {/* 3. Doctor Management */}
            <Route path="/doctors" element={<DoctorManagementModule />} />

            {/* 4. Patient Management */}
            <Route path="/patients" element={<PatientManagementModule />} />

            {/* 5. Appointment Management */}
            <Route path="/appointments" element={<AppointmentModule />} />

            {/* 6. Doctor Consultation */}
            <Route path="/consultation" element={<ConsultationModule />} />

            {/* 7. Medical Records */}
            <Route path="/records" element={<MedicalRecordsModule />} />

            {/* 8. Pharmacy Management */}
            <Route path="/pharmacy" element={<PharmacyModule />} />

            {/* 9. Laboratory Management */}
            <Route path="/laboratory" element={<LaboratoryModule />} />

            {/* 10. Bed Management */}
            <Route path="/beds" element={<BedManagementModule />} />

            {/* 11. Billing & Payments */}
            <Route path="/billing" element={<BillingModule />} />

            {/* 12. Notifications */}
            <Route path="/notifications" element={<NotificationsModule />} />

            {/* 13. Security & RBAC */}
            <Route path="/security" element={<SecurityModule />} />

            {/* 14. Reports & Analytics */}
            <Route path="/reports" element={<ReportsAnalyticsModule />} />

            {/* 15. Integrated AI Health Agent */}
            <Route path="/ai-agent" element={<AIHealthAgentModule />} />

            {/* Backwards compatibility routes */}
            <Route path="/chat" element={<AIHealthAgentModule />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </HospitalProvider>
  );
}

export default App;
