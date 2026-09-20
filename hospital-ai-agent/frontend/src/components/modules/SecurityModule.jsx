import React, { useState } from "react";
import {
  ShieldAlert,
  Lock,
  Eye,
  Edit,
  Key,
  CheckCircle2,
  AlertOctagon,
  Search,
  Filter,
  ShieldCheck,
  Clock,
  History,
} from "lucide-react";
import { useHospital } from "../../context/HospitalContext";

export default function SecurityModule() {
  const { securityMatrix, togglePermission, auditLogs, currentRole } = useHospital();
  const [activeRoleTab, setActiveRoleTab] = useState("doctor");
  const [searchTerm, setSearchTerm] = useState("");

  const roles = ["admin", "doctor", "nurse", "receptionist", "patient"];

  const moduleNames = {
    dashboard: "Executive Dashboard",
    users: "User Accounts Management",
    doctors: "Doctor Schedules & Directory",
    patients: "Patient EHR Management",
    appointments: "Appointment Scheduling",
    consultation: "Clinical Consultations & Rx",
    records: "Medical Records & History",
    pharmacy: "Pharmacy Formulary & Stock",
    laboratory: "Laboratory Diagnostics",
    beds: "Bed & Ward Management",
    billing: "Billing & Invoicing",
    notifications: "Notification Center",
    security: "Security & RBAC Matrix",
    reports: "Reports & Hospital Analytics",
    aiAgent: "Health AI Triage Assistant",
  };

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.module.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Security, Permissions & Audit Trail
          </h1>
          <p className="text-xs text-slate-500 sm:text-sm">
            Configure Role-Based Access Control (RBAC), enforce data governance, and inspect system audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge-emerald px-3 py-1 font-mono">
            <ShieldCheck className="h-3.5 w-3.5" /> HIPAA / EHR Compliant
          </span>
        </div>
      </div>

      {/* Security Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card p-4 border-l-4 border-l-blue-600 space-y-1">
          <span className="text-xs font-semibold text-slate-500">Access Control Model</span>
          <p className="text-base font-bold text-slate-900">Role-Based (RBAC Matrix)</p>
          <p className="text-[11px] text-slate-500">5 active personas configured</p>
        </div>

        <div className="card p-4 border-l-4 border-l-emerald-600 space-y-1">
          <span className="text-xs font-semibold text-slate-500">Active Session Protection</span>
          <p className="text-base font-bold text-slate-900">Encrypted JWT + Local Auth</p>
          <p className="text-[11px] text-slate-500">Auto-timeout: 60 minutes of inactivity</p>
        </div>

        <div className="card p-4 border-l-4 border-l-purple-600 space-y-1">
          <span className="text-xs font-semibold text-slate-500">Total Audit Events</span>
          <p className="text-base font-bold text-slate-900">{auditLogs.length} Events Logged</p>
          <p className="text-[11px] text-slate-500">Tamper-evident operational logging</p>
        </div>
      </div>

      {/* RBAC Matrix Configuration Section */}
      <div className="card p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Lock className="h-4 w-4 text-blue-600" /> Interactive RBAC Permission Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Select a persona tab to toggle View and Edit permissions across all modules.
            </p>
          </div>

          {/* Persona Tabs */}
          <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => setActiveRoleTab(r)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold uppercase tracking-wider transition ${
                  activeRoleTab === r
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Permission Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                <th className="py-2.5 px-3">Module Name</th>
                <th className="py-2.5 px-3 text-center">View Access</th>
                <th className="py-2.5 px-3 text-center">Modify / Action Access</th>
                <th className="py-2.5 px-3 text-right">Access Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {Object.keys(moduleNames).map((key) => {
                const perms = securityMatrix[activeRoleTab]?.[key] || { view: false, edit: false };
                return (
                  <tr key={key} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      {moduleNames[key]}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={perms.view}
                        disabled={activeRoleTab === "admin"}
                        onChange={() => togglePermission(activeRoleTab, key, "view")}
                        className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                      />
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={perms.edit}
                        disabled={activeRoleTab === "admin" || !perms.view}
                        onChange={() => togglePermission(activeRoleTab, key, "edit")}
                        className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                      />
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                          perms.view && perms.edit
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : perms.view
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-slate-100 text-slate-400 border-slate-200"
                        }`}
                      >
                        {perms.view && perms.edit
                          ? "Full Access"
                          : perms.view
                          ? "Read Only"
                          : "No Access"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Audit Trail Log */}
      <div className="card p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <History className="h-4 w-4 text-purple-600" /> Security & Action Audit Trail
            </h3>
            <p className="text-xs text-slate-500">
              Live audit logging of logins, clinical updates, dispensations, and permission changes.
            </p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-9 text-xs"
            />
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Log ID</th>
                <th className="py-2.5 px-3">User</th>
                <th className="py-2.5 px-3">Action Description</th>
                <th className="py-2.5 px-3">Module</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-2.5 px-3 font-mono text-slate-400 font-semibold">{log.id}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{log.user}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-700">{log.action}</td>
                  <td className="py-2.5 px-3">
                    <span className="badge-blue">{log.module}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{log.timestamp}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                        log.status === "Success"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
