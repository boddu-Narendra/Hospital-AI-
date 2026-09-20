import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HeartPulse,
  Stethoscope,
  Calendar,
  Bot,
  Shield,
  Clock,
  PhoneCall,
  ArrowRight,
  Star,
  Users,
  BedDouble,
  Pill,
  FlaskConical,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  MapPin,
  Building,
  Heart,
  UserPlus,
  LogIn,
} from "lucide-react";
import { useHospital } from "../../context/HospitalContext";
import { getDemoSession } from "../../supabaseClient";

export default function HomePage() {
  const navigate = useNavigate();
  const { doctors, beds, pharmacy, toggleAiDrawer, currentRole, currentUser } = useHospital();
  const session = getDemoSession();

  const [searchDocTerm, setSearchDocTerm] = useState("");

  const activeSpecialists = doctors.filter((d) => d.availability === "on_duty");
  const availableBeds = beds.filter((b) => b.status === "Available").length;

  const filteredDoctors = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(searchDocTerm.toLowerCase()) ||
      d.specialty.toLowerCase().includes(searchDocTerm.toLowerCase()) ||
      d.department.toLowerCase().includes(searchDocTerm.toLowerCase())
  );

  const departments = [
    {
      name: "Cardiovascular Sciences",
      icon: Heart,
      color: "from-rose-500 to-red-600",
      description: "Comprehensive cardiac interventions, catheterization, ECG, and echocardiography.",
      doctorCount: doctors.filter((d) => d.department?.includes("Cardio") || d.specialty?.includes("Cardio")).length || 2,
    },
    {
      name: "Neurosciences & Surgery",
      icon: Stethoscope,
      color: "from-blue-600 to-indigo-600",
      description: "Advanced neurological diagnostics, stroke care, brain MRI, and microsurgical procedures.",
      doctorCount: doctors.filter((d) => d.department?.includes("Neuro") || d.specialty?.includes("Neuro")).length || 1,
    },
    {
      name: "Pediatrics & Child Health",
      icon: Users,
      color: "from-purple-500 to-pink-600",
      description: "Dedicated neonatal intensive care, pediatric wellness, developmental screening, and vaccination.",
      doctorCount: doctors.filter((d) => d.department?.includes("Pediatric") || d.specialty?.includes("Pediatric")).length || 1,
    },
    {
      name: "Orthopedic Care & Rehab",
      icon: ActivityIcon,
      color: "from-amber-500 to-orange-600",
      description: "Joint replacements, sports injury arthroscopy, spine therapies, and post-op physical rehabilitation.",
      doctorCount: doctors.filter((d) => d.department?.includes("Ortho") || d.specialty?.includes("Ortho")).length || 1,
    },
    {
      name: "24/7 Emergency Trauma",
      icon: PhoneCall,
      color: "from-red-600 to-rose-700",
      description: "Immediate triage resuscitation, multi-organ trauma stabilization, and rapid air/ground intake.",
      doctorCount: "Round-the-clock",
    },
    {
      name: "Pathology & Diagnostics",
      icon: FlaskConical,
      color: "from-emerald-500 to-teal-600",
      description: "Accredited bio-chemistry analyzers, hematology, digital radiography, and automated PCR assays.",
      doctorCount: "Automated Lab",
    },
  ];

  function ActivityIcon(props) {
    return <HeartPulse {...props} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-800">
      {/* Top Public Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex cursor-pointer items-center gap-3 transition hover:opacity-90"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25">
              <HeartPulse className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Aura<span className="text-blue-600">Care</span>
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Hospital & Clinical AI System
              </span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden items-center gap-7 text-xs font-semibold text-slate-600 md:flex">
            <a href="#departments" className="hover:text-blue-600 transition">
              Departments
            </a>
            <a href="#doctors" className="hover:text-blue-600 transition">
              Find Doctors
            </a>
            <a href="#facilities" className="hover:text-blue-600 transition">
              Facilities & Beds
            </a>
            <a href="#ai-triage" className="hover:text-blue-600 transition flex items-center gap-1 text-indigo-600 font-bold">
              <Bot className="h-3.5 w-3.5" /> AI Triage
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {session ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="btn-primary"
              >
                Go to Dashboard ({currentRole.toUpperCase()}) <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login", { state: { role: "patient" } })}
                  className="btn-secondary hidden sm:inline-flex"
                >
                  <LogIn className="h-4 w-4" /> Portal Sign In
                </button>
                <button
                  onClick={() => navigate("/login", { state: { role: "patient", register: true } })}
                  className="btn-primary"
                >
                  <Calendar className="h-4 w-4" /> Book Appointment
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Hero Content (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/90 px-3.5 py-1 text-xs font-bold text-blue-800 shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <span>Next-Gen Hospital Care Powered by Advanced Clinical AI</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.12]">
                Compassionate Care. <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Intelligent Healing.
                </span>
              </h1>

              <p className="max-w-xl text-base text-slate-600 leading-relaxed sm:text-lg">
                Welcome to AuraCare Hospital. Seamless appointments, top specialist doctors, live bed
                occupancy tracking, electronic health records, and real-time AI triage designed around you.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => navigate("/login", { state: { role: "patient", register: true } })}
                  className="btn-primary px-5 py-3 text-sm shadow-md shadow-blue-500/25"
                >
                  <Calendar className="h-4 w-4" /> Book an Appointment
                </button>
                <button
                  onClick={toggleAiDrawer}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/80 px-5 py-3 text-sm font-bold text-indigo-700 hover:bg-indigo-100 transition active:scale-95"
                >
                  <Bot className="h-4 w-4 text-indigo-600" /> Check Symptoms with AI
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="btn-secondary px-4 py-3 text-sm"
                >
                  Staff Portal
                </button>
              </div>

              {/* Hospital Live Metric Badges */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-200/80 text-xs">
                <div>
                  <span className="text-xl font-black text-slate-900">{doctors.length} Specialists</span>
                  <p className="text-slate-500 text-[11px]">On Faculty & Duty</p>
                </div>
                <div>
                  <span className="text-xl font-black text-emerald-600">{availableBeds} Beds Ready</span>
                  <p className="text-slate-500 text-[11px]">ICU & Wards Free</p>
                </div>
                <div>
                  <span className="text-xl font-black text-slate-900">24/7 Care</span>
                  <p className="text-slate-500 text-[11px]">Emergency Response</p>
                </div>
                <div>
                  <span className="text-xl font-black text-blue-600">99.4%</span>
                  <p className="text-slate-500 text-[11px]">Patient Satisfaction</p>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xl shadow-slate-300/50">
                {/* Emergency Hotline Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                      <PhoneCall className="h-5 w-5 animate-bounce" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                        24/7 Emergency Hotline
                      </p>
                      <h4 className="text-sm font-extrabold text-slate-900">+1 (800) 555-AURA</h4>
                    </div>
                  </div>
                  <span className="badge-rose animate-pulse text-[10px]">Live Dispatch</span>
                </div>

                {/* Quick Consultation Request Form on Home Page */}
                <div className="mt-5 space-y-3">
                  <h3 className="text-sm font-bold text-slate-800">Fast Appointment Request</h3>
                  <p className="text-xs text-slate-500">
                    Select an on-duty specialist to schedule immediate care.
                  </p>

                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="font-semibold text-slate-600">Select Specialist:</label>
                      <select
                        onChange={(e) =>
                          navigate("/login", { state: { role: "patient", doctorId: e.target.value } })
                        }
                        className="input-field mt-1 font-semibold text-slate-800"
                        defaultValue=""
                      >
                        <option value="" disabled>Choose a Doctor</option>
                        {doctors.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name} ({d.specialty}) • ${d.fee}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* AI Symptom Shortcut */}
                    <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-3 border border-blue-100">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
                          <Bot className="h-4 w-4 text-blue-600" /> Need instant triage?
                        </span>
                        <button
                          onClick={toggleAiDrawer}
                          className="text-xs font-bold text-blue-700 hover:underline"
                        >
                          Ask AI
                        </button>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-600">
                        Ask about fever, headache, palpitations, or medications for immediate AI guidance.
                      </p>
                    </div>

                    <button
                      onClick={() => navigate("/login", { state: { role: "patient" } })}
                      className="btn-primary w-full py-2.5 text-xs font-bold shadow-sm"
                    >
                      Continue to Patient Portal
                    </button>
                  </div>
                </div>

                {/* Doctor On Duty mini preview */}
                <div className="mt-5 border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                  <div className="flex -space-x-2">
                    {doctors.slice(0, 4).map((d, i) => (
                      <img
                        key={i}
                        src={d.avatar}
                        alt={d.name}
                        className="h-7 w-7 rounded-full object-cover border-2 border-white"
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600">
                    {activeSpecialists.length} Specialists on Active Shift
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive AI Symptom Checker Banner Section */}
      <section id="ai-triage" className="py-12 bg-white border-y border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-8 text-white shadow-xl">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8 space-y-2">
                <span className="badge-emerald bg-emerald-500/20 text-emerald-200 border-emerald-400/30 text-xs">
                  AI Symptom Checker
                </span>
                <h2 className="text-2xl font-extrabold sm:text-3xl">
                  Analyze Your Symptoms in Real-Time
                </h2>
                <p className="text-xs text-blue-100 sm:text-sm max-w-2xl leading-relaxed">
                  Our clinical AI agent compares your presenting complaints with standard medical protocols to give you reliable first-step guidance and connect you directly to the right specialist.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {[
                    "Fever & Chills",
                    "Migraine Headache",
                    "Persistent Cough",
                    "Chest Tightness",
                    "Stomach Pain",
                  ].map((symptom, i) => (
                    <button
                      key={i}
                      onClick={toggleAiDrawer}
                      className="rounded-xl bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/20 hover:bg-white/25 transition"
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 flex justify-start lg:justify-end">
                <button
                  onClick={toggleAiDrawer}
                  className="flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-extrabold text-blue-700 shadow-xl hover:bg-blue-50 transition active:scale-95"
                >
                  <Bot className="h-5 w-5 text-blue-600" /> Start AI Health Consult
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Departments Grid */}
      <section id="departments" className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Centers of Clinical Excellence
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Multi-disciplinary medical departments equipped with advanced diagnostic and therapeutic infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((dept, idx) => {
              const Icon = dept.icon;
              return (
                <div
                  key={idx}
                  className="card card-hover flex flex-col justify-between p-6 transition"
                >
                  <div>
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${dept.color} text-white shadow-md`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-slate-900">{dept.name}</h3>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                      {dept.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
                    <span className="font-semibold text-slate-500">
                      {typeof dept.doctorCount === "number"
                        ? `${dept.doctorCount} Doctors Available`
                        : dept.doctorCount}
                    </span>
                    <button
                      onClick={() => navigate("/login", { state: { role: "patient" } })}
                      className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      Consult <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Meet Our Specialist Doctors Section */}
      <section id="doctors" className="py-16 bg-slate-100/60 border-t border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
                Our Leading Medical Specialists
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Board-certified physicians and surgeons available for consultation.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/login", { state: { role: "doctor" } })}
                className="btn-secondary text-xs"
              >
                <UserPlus className="h-4 w-4" /> Doctor & Staff Portal
              </button>
            </div>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredDoctors.slice(0, 8).map((doc) => (
              <div
                key={doc.id}
                className="card card-hover flex flex-col justify-between overflow-hidden p-5"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="h-16 w-16 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
                    />
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                        doc.availability === "on_duty"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          doc.availability === "on_duty" ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      />
                      {doc.availability === "on_duty" ? "On Duty" : "Off Duty"}
                    </span>
                  </div>

                  <h3 className="mt-3 text-base font-bold text-slate-900">{doc.name}</h3>
                  <span className="badge-blue mt-1">{doc.specialty}</span>
                  <p className="mt-1 text-[11px] text-slate-500">{doc.department}</p>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-2">
                    <span>Exp: {doc.experience || "10+ yrs"}</span>
                    <span className="font-bold text-slate-900">${doc.fee || 150}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() =>
                      navigate("/login", { state: { role: "patient", doctorId: doc.id } })
                    }
                    className="btn-primary w-full text-xs py-2"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities & Bed Overview Section */}
      <section id="facilities" className="py-16 bg-white border-t border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="badge-purple">Smart Hospital Infrastructure</span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
                Real-Time Bed Monitoring & Automated Facilities
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                AuraCare features fully digitalized hospital rooms, high-acuity telemetry, negative-pressure isolation bays, and an automated pharmacy replenishment formulary.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Live Ward & Bed Availability</h4>
                    <p className="text-[11px] text-slate-500">
                      Instantly monitor ICU, Emergency, and General Ward beds with zero manual delay.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">In-House Clinical Pharmacy</h4>
                    <p className="text-[11px] text-slate-500">
                      Connected formulary with low-stock alerts, automated dispensing, and e-prescriptions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Digital Pathology & Diagnostics</h4>
                    <p className="text-[11px] text-slate-500">
                      Rapid blood panels, ECG, and MRI results with verified physician signatures.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: Ward Status Overview */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Live Bed Tracker</h3>
                    <p className="text-xs text-slate-500">Real-time facility occupancy</p>
                  </div>
                  <span className="badge-emerald">{availableBeds} of {beds.length} Available</span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-2xl bg-white p-3 border border-slate-200/80">
                    <span className="text-slate-400 block text-[11px]">ICU Ventilator Beds</span>
                    <span className="text-base font-bold text-slate-900">
                      {beds.filter((b) => b.ward.includes("ICU") && b.status === "Available").length} Ready
                    </span>
                  </div>
                  <div className="rounded-2xl bg-white p-3 border border-slate-200/80">
                    <span className="text-slate-400 block text-[11px]">Emergency Care Beds</span>
                    <span className="text-base font-bold text-slate-900">
                      {beds.filter((b) => b.ward.includes("Emergency") && b.status === "Available").length} Ready
                    </span>
                  </div>
                  <div className="rounded-2xl bg-white p-3 border border-slate-200/80">
                    <span className="text-slate-400 block text-[11px]">General Ward Beds</span>
                    <span className="text-base font-bold text-slate-900">
                      {beds.filter((b) => b.ward.includes("General") && b.status === "Available").length} Ready
                    </span>
                  </div>
                  <div className="rounded-2xl bg-white p-3 border border-slate-200/80">
                    <span className="text-slate-400 block text-[11px]">Pediatric Care Unit</span>
                    <span className="text-base font-bold text-slate-900">
                      {beds.filter((b) => b.ward.includes("Pediatric") && b.status === "Available").length} Ready
                    </span>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-blue-50/70 p-3 border border-blue-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-blue-900">Need Immediate Admission?</p>
                    <p className="text-[11px] text-blue-700">Contact Front Desk or Emergency Intake</p>
                  </div>
                  <button
                    onClick={() => navigate("/login")}
                    className="btn-primary text-xs py-1.5"
                  >
                    Intake Portal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hospital Footer */}
      <footer className="border-t border-slate-200 bg-slate-900 text-slate-400 py-12 text-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white">
                <HeartPulse className="h-5 w-5 text-blue-500" />
                <span className="text-lg font-bold">AuraCare Hospital</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Accredited clinical healthcare center delivering personalized medicine, surgical care, and AI-assisted health triage.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-3">Quick Navigation</h4>
              <ul className="space-y-2">
                <li><a href="#departments" className="hover:text-white">Clinical Departments</a></li>
                <li><a href="#doctors" className="hover:text-white">Specialist Directory</a></li>
                <li><a href="#facilities" className="hover:text-white">Ward & Bed Status</a></li>
                <li><button onClick={toggleAiDrawer} className="hover:text-white text-left">AI Triage Checker</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-3">Hospital Portals</h4>
              <ul className="space-y-2">
                <li><button onClick={() => navigate("/login", { state: { role: "patient" } })} className="hover:text-white">Patient Passcode Portal</button></li>
                <li><button onClick={() => navigate("/login", { state: { role: "doctor" } })} className="hover:text-white">Physician & Clinical Portal</button></li>
                <li><button onClick={() => navigate("/login", { state: { role: "nurse" } })} className="hover:text-white">Nursing & Bed Management</button></li>
                <li><button onClick={() => navigate("/login", { state: { role: "admin" } })} className="hover:text-white">Hospital Administration</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-3">Emergency Contact</h4>
              <p className="text-white font-bold text-sm">+1 (800) 555-AURA</p>
              <p className="mt-1">742 Healthcare Boulevard, Metro City</p>
              <p className="mt-1">24 Hours / 7 Days a Week</p>
            </div>
          </div>

          <div className="mt-10 border-t border-slate-800 pt-6 text-center text-[11px] text-slate-500">
            © {new Date().getFullYear()} AuraCare Health System. All rights reserved. HIPAA & EHR Protected.
          </div>
        </div>
      </footer>
    </div>
  );
}
