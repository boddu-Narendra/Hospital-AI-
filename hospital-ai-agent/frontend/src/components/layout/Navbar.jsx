import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Search,
  Bot,
  Menu,
  ChevronDown,
  Shield,
  Stethoscope,
  HeartPulse,
  UserCheck,
  User,
  LogOut,
  ExternalLink,
  Check,
} from "lucide-react";
import { useHospital } from "../../context/HospitalContext";
import { clearDemoSession } from "../../supabaseClient";

export default function Navbar({ onMobileMenuToggle }) {
  const navigate = useNavigate();
  const {
    currentRole,
    switchRole,
    currentUser,
    unreadCount,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    searchQuery,
    setSearchQuery,
    toggleAiDrawer,
  } = useHospital();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const roleRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (roleRef.current && !roleRef.current.contains(e.target)) setRoleDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifDropdownOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const roles = [
    { key: "admin", label: "Admin", icon: Shield, color: "text-purple-600 bg-purple-50" },
    { key: "doctor", label: "Doctor", icon: Stethoscope, color: "text-blue-600 bg-blue-50" },
    { key: "nurse", label: "Nurse", icon: HeartPulse, color: "text-rose-600 bg-rose-50" },
    { key: "receptionist", label: "Receptionist", icon: UserCheck, color: "text-amber-600 bg-amber-50" },
    { key: "patient", label: "Patient", icon: User, color: "text-emerald-600 bg-emerald-50" },
  ];

  const handleLogout = () => {
    clearDemoSession();
    localStorage.removeItem("profile");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md lg:px-6">
      {/* Left: Mobile Hamburger & Hospital Logo */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div
          onClick={() => navigate("/dashboard")}
          className="flex cursor-pointer items-center gap-2.5 transition hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/30">
            <HeartPulse className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
              Aura<span className="text-blue-600">Care</span>
            </span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:inline-block sm:ml-1.5">
              Hospital OS
            </span>
          </div>
        </div>
      </div>

      {/* Middle: Global Search Input */}
      <div className="hidden max-w-md flex-1 px-6 md:block">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search patients, doctors, drugs, appointments (Press /)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right: Role Switcher, AI Trigger, Notification Bell, User Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* 1-Click Role Switcher Pill */}
        <div className="relative" ref={roleRef}>
          <button
            type="button"
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 active:scale-95"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden capitalize text-slate-500 sm:inline">Role:</span>
            <span className="font-semibold uppercase tracking-wide text-blue-700">
              {currentRole}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-300/40 animate-fade-in z-50">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Persona & Role
                </p>
                <p className="text-[11px] text-slate-500">Select a role to open its login portal</p>
              </div>
              <div className="mt-1 space-y-0.5">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const isSelected = currentRole === r.key;
                  return (
                    <button
                      key={r.key}
                      onClick={() => {
                        switchRole(r.key);
                        setRoleDropdownOpen(false);
                        navigate("/login", { state: { role: r.key } });
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${
                        isSelected
                          ? "bg-blue-50 font-semibold text-blue-700"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`flex h-6 w-6 items-center justify-center rounded-lg ${r.color}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <div className="text-left">
                          <p className="font-semibold leading-tight">{r.label}</p>
                          <p className="text-[10px] text-slate-400">Switch & open login</p>
                        </div>
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-blue-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* AI Health Assistant Quick Launcher Button */}
        <button
          type="button"
          onClick={toggleAiDrawer}
          className="relative flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 text-xs font-semibold text-white shadow-sm shadow-blue-500/25 transition hover:opacity-95 active:scale-95"
          title="Open AI Symptom Checker & Assistant"
        >
          <Bot className="h-4 w-4" />
          <span className="hidden md:inline">AI Agent</span>
        </button>

        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 active:scale-95"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-300/40 animate-fade-in z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 px-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] font-medium text-blue-600 hover:text-blue-700"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="mt-2 max-h-72 overflow-y-auto space-y-1.5 divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-400">No notifications yet</p>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.link) navigate(n.link);
                        setNotifDropdownOpen(false);
                      }}
                      className={`cursor-pointer rounded-xl p-2.5 transition hover:bg-slate-50 ${
                        !n.read ? "bg-blue-50/40" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.timestamp}</span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-600 line-clamp-2">{n.message}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-2 border-t border-slate-100 pt-2 text-center">
                <button
                  onClick={() => {
                    navigate("/notifications");
                    setNotifDropdownOpen(false);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  View all notifications <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar with Menu */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 rounded-xl p-1 transition hover:bg-slate-100"
          >
            <img
              src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"}
              alt={currentUser?.name || "User Avatar"}
              className="h-8 w-8 rounded-xl object-cover border border-slate-200"
            />
            <div className="hidden text-left lg:block">
              <p className="text-xs font-semibold text-slate-800 line-clamp-1">{currentUser?.name}</p>
              <p className="text-[10px] capitalize text-slate-500">{currentRole}</p>
            </div>
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-300/40 animate-fade-in z-50">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">{currentUser?.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
              </div>
              <div className="mt-1 space-y-0.5">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setProfileDropdownOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  My Profile & History
                </button>
                <button
                  onClick={() => {
                    navigate("/security");
                    setProfileDropdownOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Shield className="h-3.5 w-3.5 text-slate-400" />
                  Security & Audit
                </button>
                <div className="my-1 border-t border-slate-100" />
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
