import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Bot,
  Grid,
} from "lucide-react";

export default function MobileBottomBar({ onOpenMore }) {
  const links = [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/appointments", label: "Appts", icon: Calendar },
    { to: "/patients", label: "Patients", icon: Users },
    { to: "/ai-agent", label: "AI Agent", icon: Bot, highlight: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-slate-200 bg-white/95 px-2 backdrop-blur-md lg:hidden">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 transition ${
                isActive
                  ? "text-blue-600 font-bold"
                  : link.highlight
                  ? "text-indigo-600 font-semibold"
                  : "text-slate-500 hover:text-slate-900"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px]">{link.label}</span>
          </NavLink>
        );
      })}

      {/* "More" button to trigger full navigation drawer */}
      <button
        type="button"
        onClick={onOpenMore}
        className="flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-slate-500 hover:text-slate-900 transition"
      >
        <Grid className="h-5 w-5" />
        <span className="text-[10px]">All Modules</span>
      </button>
    </nav>
  );
}
