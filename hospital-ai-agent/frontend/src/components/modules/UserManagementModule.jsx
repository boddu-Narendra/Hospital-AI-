import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Shield,
  Stethoscope,
  HeartPulse,
  UserCheck,
  User,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  Building,
  Filter,
  X,
} from "lucide-react";
import { useHospital } from "../../context/HospitalContext";

export default function UserManagementModule() {
  const { users, addUser, updateUserStatus, currentRole } = useHospital();
  const [activeRoleTab, setActiveRoleTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New user form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "doctor",
    department: "Cardiology",
    phone: "",
    fee: 150,
    specialty: "",
  });

  const roles = [
    { key: "all", label: "All Users", count: users.length },
    { key: "admin", label: "Admins", count: users.filter((u) => u.role === "admin").length },
    { key: "doctor", label: "Doctors", count: users.filter((u) => u.role === "doctor").length },
    { key: "nurse", label: "Nurses", count: users.filter((u) => u.role === "nurse").length },
    { key: "receptionist", label: "Receptionists", count: users.filter((u) => u.role === "receptionist").length },
    { key: "patient", label: "Patients", count: users.filter((u) => u.role === "patient").length },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesRole = activeRoleTab === "all" || user.role === activeRoleTab;
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    addUser(formData);
    setIsAddModalOpen(false);
    setFormData({
      name: "",
      email: "",
      role: "doctor",
      department: "Cardiology",
      phone: "",
      fee: 150,
      specialty: "",
    });
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return <span className="badge-purple"><Shield className="h-3 w-3" /> Admin</span>;
      case "doctor":
        return <span className="badge-blue"><Stethoscope className="h-3 w-3" /> Doctor</span>;
      case "nurse":
        return <span className="badge-rose"><HeartPulse className="h-3 w-3" /> Nurse</span>;
      case "receptionist":
        return <span className="badge-amber"><UserCheck className="h-3 w-3" /> Receptionist</span>;
      default:
        return <span className="badge-emerald"><User className="h-3 w-3" /> Patient</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            User Management
          </h1>
          <p className="text-xs text-slate-500 sm:text-sm">
            Control accounts, role permissions, and staff credentials.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary"
        >
          <UserPlus className="h-4 w-4" /> Add New Staff / User
        </button>
      </div>

      {/* Role Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {roles.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveRoleTab(tab.key)}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
              activeRoleTab === tab.key
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                activeRoleTab === tab.key ? "bg-white/25 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Filter by name, email, department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-9"
        />
      </div>

      {/* Users Table / Cards Container */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Department / Specialty</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"}
                          alt={u.name}
                          className="h-9 w-9 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{u.name}</p>
                          <p className="text-[11px] text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{getRoleBadge(u.role)}</td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-800">{u.department || "General Hospital"}</p>
                      {u.specialty && <p className="text-[11px] text-slate-500">{u.specialty}</p>}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <p>{u.phone || "—"}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                          u.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                      >
                        {u.status === "active" ? (
                          <CheckCircle className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <XCircle className="h-3 w-3 text-slate-400" />
                        )}
                        <span className="capitalize">{u.status || "active"}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() =>
                          updateUserStatus(u.id, u.status === "active" ? "inactive" : "active")
                        }
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold border transition ${
                          u.status === "active"
                            ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                            : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        }`}
                      >
                        {u.status === "active" ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Create Staff / User Account</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Dr. Gregory House"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="user@hospital.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="input-field mt-1"
                  >
                    <option value="doctor">Doctor</option>
                    <option value="nurse">Nurse</option>
                    <option value="receptionist">Receptionist</option>
                    <option value="admin">Administrator</option>
                    <option value="patient">Patient</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Department</label>
                  <input
                    type="text"
                    placeholder="e.g., Cardiology, ICU, Admissions"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
              </div>

              {formData.role === "doctor" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Specialty</label>
                    <input
                      type="text"
                      placeholder="e.g., Pediatric Cardiology"
                      value={formData.specialty}
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      className="input-field mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Consultation Fee ($)</label>
                    <input
                      type="number"
                      placeholder="150"
                      value={formData.fee}
                      onChange={(e) => setFormData({ ...formData, fee: Number(e.target.value) })}
                      className="input-field mt-1"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
