import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Check,
  Trash2,
  ExternalLink,
  Filter,
} from "lucide-react";
import { useHospital } from "../../context/HospitalContext";

export default function NotificationsModule() {
  const navigate = useNavigate();
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    unreadCount,
  } = useHospital();

  const [categoryFilter, setCategoryFilter] = useState("All");

  const categories = ["All", "Unread", "Laboratory", "Pharmacy", "Appointments", "Bed Management", "Billing"];

  const filteredNotifications = notifications.filter((n) => {
    if (categoryFilter === "Unread") return !n.read;
    if (categoryFilter === "All") return true;
    return n.category === categoryFilter;
  });

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case "urgent":
        return <span className="badge-rose animate-pulse">Urgent Action</span>;
      case "warning":
        return <span className="badge-amber">Warning</span>;
      case "success":
        return <span className="badge-emerald">Resolved</span>;
      default:
        return <span className="badge-blue">Information</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Notification & Alert Center
            </h1>
            {unreadCount > 0 && (
              <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-700">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 sm:text-sm">
            Critical laboratory results, clinical reminders, stock warnings, and payment confirmations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="btn-secondary text-xs"
            >
              <Check className="h-3.5 w-3.5" /> Mark All Read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearNotifications}
              className="btn-secondary text-xs text-rose-600 hover:bg-rose-50 border-rose-200"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear All
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
              categoryFilter === cat
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="card p-12 text-center text-slate-400">
            <Bell className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="font-semibold text-sm">No notifications to display</p>
            <p className="text-xs text-slate-400 mt-1">All hospital systems operating normally.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationRead(notif.id)}
              className={`card card-hover p-4 transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
                !notif.read ? "bg-blue-50/40 border-l-4 border-l-blue-600" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl flex-shrink-0 mt-0.5 ${
                    notif.severity === "urgent"
                      ? "bg-rose-100 text-rose-700"
                      : notif.severity === "warning"
                      ? "bg-amber-100 text-amber-700"
                      : notif.severity === "success"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  <Bell className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{notif.title}</h3>
                    {getSeverityBadge(notif.severity)}
                    <span className="text-[11px] text-slate-400">• {notif.timestamp}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">{notif.message}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {notif.link && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markNotificationRead(notif.id);
                      navigate(notif.link);
                    }}
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition"
                  >
                    View Details <ExternalLink className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
