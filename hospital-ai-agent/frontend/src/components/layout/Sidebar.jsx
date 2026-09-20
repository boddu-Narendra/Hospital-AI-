import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Stethoscope,
  Users,
  UserRound,
  FileText,
  Pill,
  FlaskConical,
  BedDouble,
  CreditCard,
  Bell,
  UserCog,
  ShieldAlert,
  BarChart3,
  Bot,
  X,
  ChevronRight,
} from "lucide-react";
import { useHospital } from "../../context/HospitalContext";

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const navigate = useNavigate();
  const {
    currentRole,
    securityMatrix,
    unreadCount,
    pharmacy,
    labTests,
    beds,
    invoices,
  } = useHospital();

  // Low stock badge
  const lowStockCount = pharmacy.filter((p) => p.status === "low_stock").length;
  // Pending lab tests
  const pendingLabCount = labTests.filter((t) => t.status !== "Completed").length;
  // Available beds
  const availableBedsCount = beds.filter((b) => b.status === "Available").length;
  // Pending invoices
  const pendingInvoicesCount = invoices.filter((i) => i.status === "Pending").length;

  const navSections = [
    {
      label: "Clinical Operations",
      items: [
        {
          to: "/dashboard",
          name: "Dashboard",
          icon: LayoutDashboard,
          moduleKey: "dashboard",
        },
        {
          to: "/appointments",
          name: "Appointments",
          icon: Calendar,
          moduleKey: "appointments",
        },
        {
          to: "/consultation",
          name: "Consultation",
          icon: Stethoscope,
          moduleKey: "consultation",
        },
        {
          to: "/patients",
          name: "Patients",
          icon: Users,
          moduleKey: "patients",
        },
        {
          to: "/doctors",
          name: "Doctors",
          icon: UserRound,
          moduleKey: "doctors",
        },
        {
          to: "/records",
          name: "Medical Records",
          icon: FileText,
          moduleKey: "records",
        },
      ],
    },
    {
      label: "Hospital Facilities",
      items: [
        {
          to: "/pharmacy",
          name: "Pharmacy",
          icon: Pill,
          moduleKey: "pharmacy",
          badge: lowStockCount > 0 ? `${lowStockCount} low` : null,
          badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
        },
        {
          to: "/laboratory",
          name: "Laboratory",
          icon: FlaskConical,
          moduleKey: "laboratory",
          badge: pendingLabCount > 0 ? pendingLabCount : null,
          badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
        },
        {
          to: "/beds",
          name: "Bed Management",
          icon: BedDouble,
          moduleKey: "beds",
          badge: `${availableBedsCount} free`,
          badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
        },
        {
          to: "/billing",
          name: "Billing & Payments",
          icon: CreditCard,
          moduleKey: "billing",
          badge: pendingInvoicesCount > 0 ? pendingInvoicesCount : null,
          badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
        },
      ],
    },
    {
      label: "Management & Intelligence",
      items: [
        {
          to: "/notifications",
          name: "Notifications",
          icon: Bell,
          moduleKey: "notifications",
          badge: unreadCount > 0 ? unreadCount : null,
          badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
        },
        {
          to: "/users",
          name: "User Management",
          icon: UserCog,
          moduleKey: "users",
        },
        {
          to: "/security",
          name: "Security & RBAC",
          icon: ShieldAlert,
          moduleKey: "security",
        },
        {
          to: "/reports",
          name: "Reports & Analytics",
          icon: BarChart3,
          moduleKey: "reports",
        },
        {
          to: "/ai-agent",
          name: "Health AI Agent",
          icon: Bot,
          moduleKey: "aiAgent",
          highlight: true,
        },
      ],
    },
  ];

  const canViewModule = (moduleKey) => {
    if (currentRole === "admin") return true;
    const permissions = securityMatrix[currentRole]?.[moduleKey];
    return permissions ? permissions.view : true;
  };

  const navContent = (
    <div className="flex h-full flex-col justify-between overflow-y-auto px-3 py-4">
      <div className="space-y-6">
        {navSections.map((section, idx) => {
          const visibleItems = section.items.filter((item) => canViewModule(item.moduleKey));
          if (visibleItems.length === 0) return null;

          return (
            <div key={idx}>
              <h4 className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {section.label}
              </h4>
              <nav className="mt-2 space-y-1">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={onCloseMobile}
                      className={({ isActive }) =>
                        `group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                          isActive
                            ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                            : item.highlight
                            ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-100 hover:to-indigo-100"
                            : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-3">
                            <Icon
                              className={`h-4 w-4 transition-colors ${
                                isActive
                                  ? "text-white"
                                  : item.highlight
                                  ? "text-blue-600"
                                  : "text-slate-400 group-hover:text-slate-600"
                              }`}
                            />
                            <span className="truncate">{item.name}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {item.badge && (
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                                  isActive
                                    ? "bg-white/20 text-white border-white/30"
                                    : item.badgeColor || "bg-slate-100 text-slate-700 border-slate-200"
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                            <ChevronRight
                              className={`h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100 ${
                                isActive ? "opacity-100 text-white" : "text-slate-400"
                              }`}
                            />
                          </div>
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          );
        })}
      </div>

      {/* Hospital Quick Status Card at bottom of sidebar */}
      <div className="mt-6 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 to-indigo-50/60 p-3 text-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-blue-900">Hospital Status</span>
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-[10px]">
          <div className="rounded-lg bg-white/80 p-1.5 border border-blue-100/60">
            <span className="text-slate-400 block">Beds Free</span>
            <span className="font-bold text-slate-800 text-xs">{availableBedsCount} of {beds.length}</span>
          </div>
          <button
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              navigate("/login", { state: { role: currentRole } });
            }}
            className="rounded-lg bg-white/80 p-1.5 border border-blue-100/60 hover:bg-white text-left transition group"
            title="Click to switch role and log in"
          >
            <span className="text-slate-400 block text-[9px] group-hover:text-blue-600">Active Role (Switch)</span>
            <span className="font-bold text-blue-700 uppercase tracking-wide flex items-center justify-between">
              {currentRole}
              <ChevronRight className="h-3 w-3 text-slate-400 group-hover:text-blue-600 transition" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden h-[calc(100vh-4rem)] w-64 flex-shrink-0 border-r border-slate-200/80 bg-white/80 backdrop-blur-sm lg:block">
        {navContent}
      </aside>

      {/* Mobile & Tablet Slide-Over Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-white shadow-2xl animate-fade-in">
            <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4">
              <span className="text-base font-bold text-slate-900">Hospital Navigation</span>
              <button
                type="button"
                onClick={onCloseMobile}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">{navContent}</div>
          </div>
        </div>
      )}
    </>
  );
}
