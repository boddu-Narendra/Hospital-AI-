import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserCheck,
  Calendar,
  BedDouble,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  PlusCircle,
  Stethoscope,
  Pill,
  Bot,
  Clock,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { useHospital } from "../../context/HospitalContext";

export default function DashboardModule() {
  const navigate = useNavigate();
  const {
    patients,
    doctors,
    appointments,
    beds,
    invoices,
    pharmacy,
    labTests,
    auditLogs,
    currentRole,
    currentUser,
    toggleAiDrawer,
  } = useHospital();

  // Statistics calculation
  const totalPatients = patients.length;
  const activeDoctors = doctors.filter((d) => d.availability === "on_duty").length;
  
  const todayStr = "2026-09-19";
  const todayAppointments = appointments.filter((a) => a.date === todayStr);
  const completedToday = todayAppointments.filter((a) => a.status === "Completed").length;

  const occupiedBeds = beds.filter((b) => b.status === "Occupied").length;
  const bedOccupancyPercent = Math.round((occupiedBeds / beds.length) * 100);

  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
  const pendingRevenue = invoices.reduce(
    (sum, inv) => sum + (inv.status === "Pending" ? inv.totalPayable : 0),
    0
  );

  const lowStockCount = pharmacy.filter((p) => p.status === "low_stock").length;
  const criticalLabCount = labTests.filter((t) =>
    t.results?.some((r) => r.flag === "High" || r.flag === "Critical")
  ).length;
  const totalAlerts = lowStockCount + criticalLabCount;

  const stats = [
    {
      title: "Total Patients",
      value: totalPatients,
      subtext: "+14% this month",
      icon: Users,
      color: "from-blue-600 to-indigo-600",
      link: "/patients",
    },
    {
      title: "Doctors on Duty",
      value: `${activeDoctors}/${doctors.length}`,
      subtext: "Across 4 departments",
      icon: UserCheck,
      color: "from-emerald-600 to-teal-600",
      link: "/doctors",
    },
    {
      title: "Today's Appointments",
      value: todayAppointments.length,
      subtext: `${completedToday} completed`,
      icon: Calendar,
      color: "from-purple-600 to-indigo-600",
      link: "/appointments",
    },
    {
      title: "Bed Occupancy",
      value: `${bedOccupancyPercent}%`,
      subtext: `${beds.length - occupiedBeds} beds available`,
      icon: BedDouble,
      color: "from-amber-500 to-orange-600",
      link: "/beds",
    },
    {
      title: "Revenue Collected",
      value: `$${totalRevenue.toLocaleString()}`,
      subtext: `$${pendingRevenue.toLocaleString()} pending`,
      icon: DollarSign,
      color: "from-sky-600 to-cyan-600",
      link: "/billing",
    },
    {
      title: "Clinical & Stock Alerts",
      value: totalAlerts,
      subtext: `${lowStockCount} low stock, ${criticalLabCount} critical labs`,
      icon: AlertTriangle,
      color: "from-rose-600 to-red-600",
      link: "/notifications",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome & Fast Actions Header */}
      <div className="flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 text-white shadow-xl shadow-blue-600/15 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold backdrop-blur-md">
              Hospital Overview
            </span>
            <span className="text-xs text-blue-100">
              Active Persona: <strong className="uppercase">{currentRole}</strong>
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
            Welcome back, {currentUser?.name}
          </h1>
          <p className="mt-1 text-xs text-blue-100 sm:text-sm">
            Operational dashboard and clinical triage center for AuraCare Hospital.
          </p>
        </div>

        {/* Fast Action Quick Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate("/appointments")}
            className="flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-blue-700 shadow-sm transition hover:bg-blue-50 active:scale-95"
          >
            <PlusCircle className="h-4 w-4" /> Book Appt
          </button>
          <button
            onClick={() => navigate("/consultation")}
            className="flex items-center gap-1.5 rounded-xl bg-blue-500/30 px-3.5 py-2 text-xs font-bold text-white backdrop-blur-md border border-white/20 transition hover:bg-blue-500/40 active:scale-95"
          >
            <Stethoscope className="h-4 w-4" /> New Consult
          </button>
          <button
            onClick={toggleAiDrawer}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-95 active:scale-95"
          >
            <Bot className="h-4 w-4" /> AI Triage
          </button>
        </div>
      </div>

      {/* 6 High-Impact Stat KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              onClick={() => navigate(item.link)}
              className="card card-hover flex cursor-pointer flex-col justify-between p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{item.title}</span>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr ${item.color} text-white shadow-xs`}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold tracking-tight text-slate-800">
                  {item.value}
                </span>
                <p className="mt-1 text-[11px] font-medium text-slate-500">{item.subtext}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Grid: Today's Appointments & Ward Occupancy */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Today's Appointments Queue (2 Cols) */}
        <div className="card flex flex-col p-5 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">Today's Appointment Queue</h3>
              <p className="text-xs text-slate-500">Live scheduling queue for {todayStr}</p>
            </div>
            <button
              onClick={() => navigate("/appointments")}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              View All <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 flex-1 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                  <th className="pb-2">Patient</th>
                  <th className="pb-2">Doctor</th>
                  <th className="pb-2">Time</th>
                  <th className="pb-2">Reason</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {todayAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-6 text-center text-slate-400">
                      No appointments scheduled for today.
                    </td>
                  </tr>
                ) : (
                  todayAppointments.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 font-semibold text-slate-900">{app.patientName}</td>
                      <td className="py-3 text-slate-600">{app.doctorName}</td>
                      <td className="py-3 font-medium text-slate-800">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-400" />
                          {app.time}
                        </div>
                      </td>
                      <td className="py-3 text-slate-500 max-w-[150px] truncate">{app.reason}</td>
                      <td className="py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                            app.status === "In-Progress"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : app.status === "Completed"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-50 text-slate-700 border-slate-200"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => navigate("/consultation", { state: { appointment: app } })}
                          className="rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-100 transition"
                        >
                          Consult
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ward Bed Status Card (1 Col) */}
        <div className="card flex flex-col p-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">Ward Occupancy</h3>
              <p className="text-xs text-slate-500">Live bed allocation by unit</p>
            </div>
            <button
              onClick={() => navigate("/beds")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Manage
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {[
              { ward: "ICU Ventilator & Telemetry", total: 3, occupied: 1, color: "bg-rose-500" },
              { ward: "Emergency Care", total: 2, occupied: 0, color: "bg-amber-500" },
              { ward: "General Ward (Male & Female)", total: 3, occupied: 1, color: "bg-blue-500" },
              { ward: "Pediatric Care Unit", total: 2, occupied: 1, color: "bg-purple-500" },
              { ward: "Maternity & Neonatal", total: 2, occupied: 0, color: "bg-emerald-500" },
            ].map((unit, idx) => {
              const pct = Math.round((unit.occupied / unit.total) * 100);
              return (
                <div key={idx}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700">{unit.ward}</span>
                    <span className="text-slate-500">
                      {unit.occupied}/{unit.total} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full ${unit.color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-3 border border-slate-200/70">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Quick Discharge & Cleaning</span>
              <span className="badge-emerald">{beds.length - occupiedBeds} Ready</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Sanitation protocol verified for 2 beds awaiting intake.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Clinical Activity Feed & Pharmacy Low Stock Alert */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Operational Audit Stream */}
        <div className="card p-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">Live Hospital Activity</h3>
              <p className="text-xs text-slate-500">Recent events logged across clinical units</p>
            </div>
            <button
              onClick={() => navigate("/security")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Audit Log
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-start gap-3 text-xs">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-50 text-blue-600 flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">{log.action}</span>
                    <span className="text-[10px] text-slate-400">{log.timestamp.slice(11, 16)}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    By <strong className="text-slate-700">{log.user}</strong> • {log.module}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pharmacy & Supply Chain Watch */}
        <div className="card p-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">Pharmacy Inventory Alerts</h3>
              <p className="text-xs text-slate-500">Supplies needing restocking or reorder</p>
            </div>
            <button
              onClick={() => navigate("/pharmacy")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Pharmacy
            </button>
          </div>

          <div className="mt-4 space-y-2.5">
            {pharmacy
              .filter((med) => med.status === "low_stock")
              .map((med) => (
                <div
                  key={med.id}
                  className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/60 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                      <Pill className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{med.brand}</p>
                      <p className="text-[11px] text-slate-500">
                        {med.category} • Min: {med.minThreshold}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-rose-600">{med.stock} units</span>
                    <button
                      onClick={() => navigate("/pharmacy")}
                      className="block text-[11px] font-semibold text-blue-600 hover:underline"
                    >
                      Restock
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
