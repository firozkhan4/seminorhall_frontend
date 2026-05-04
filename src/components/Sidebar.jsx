import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Building2,
  FileText,
  AlertCircle,
  CheckCircle2,
  Info,
  ShieldCheck,
} from "lucide-react";
import { motion } from "motion/react";

export default function Sidebar({ user }) {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetch("/api/notifications", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAlerts(data.slice(0, 3));
        } else {
          setAlerts([]);
        }
      })
      .catch(() => setAlerts([]));
  }, []);

  return (
    <aside className="w-[260px] border-r border-line bg-surface hidden lg:flex flex-col flex-shrink-0 font-sans">
      <div className="p-6 pb-2">
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em]">
          Navigation
        </span>
      </div>

      <nav className="flex flex-col py-2">
        <SidebarLink
          to="/"
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
        />
        <SidebarLink
          to="/bookings"
          icon={<CalendarDays size={18} />}
          label="My Bookings"
        />
        <SidebarLink
          to="/halls"
          icon={<Building2 size={18} />}
          label="Hall Directory"
        />
        {user?.role === "admin" && (
          <SidebarLink
            to="/admin"
            icon={<ShieldCheck size={18} className="text-accent" />}
            label="Admin Panel"
          />
        )}
      </nav>

      <div className="mt-auto p-6 border-t border-line">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em]">
            System Alerts
          </span>
        </div>

        <div className="space-y-3">
          {alerts.map((alert, i) => (
            <div
              key={i}
              className="p-2 border border-line rounded-md bg-[#FDFDFD] transition-all hover:bg-neutral-50"
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${alert.type === "booking_confirmed" ? "bg-green-500" : "bg-amber-500"}`}
                />
                <span className="text-[10px] font-bold uppercase">
                  {alert.type === "booking_confirmed" ? "Confirmed" : "Alert"}
                </span>
              </div>
              <p className="text-[11px] text-neutral-600 leading-tight line-clamp-2">
                {alert.message}
              </p>
            </div>
          ))}
          {alerts.length === 0 && (
            <div className="p-3 text-center border border-line border-dashed rounded-md text-[11px] text-neutral-400 italic">
              No recent alerts
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex items-center gap-3 px-6 py-3 text-[13px] transition-all border-l-[3px]
        ${
          isActive
            ? "bg-neutral-50 border-accent text-ink font-semibold"
            : "border-transparent text-neutral-500 hover:text-ink hover:bg-neutral-50"
        }
      `}
    >
      <span className="text-neutral-400">{icon}</span>
      {label}
    </NavLink>
  );
}
