import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Building2,
  LogOut,
  Bell,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { logout } from "../services/authService";
import { useStore } from "../stores/useStore";

export default function Navbar() {
  const { user, clearUser } = useStore();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    const fetchNotifs = () => {
      fetch("/api/notifications", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setNotifications(data);
          } else {
            setNotifications([]);
          }
        })
        .catch(() => setNotifications([]));
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = Array.isArray(notifications)
    ? notifications.filter((n) => !n.is_read).length
    : 0;

  const handleLogout = async () => {
    try {
      await logout();
      clearUser();
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const markAsRead = () => {
    fetch("/api/notifications/read", {
      method: "PATCH",
      credentials: "include",
    });
    setNotifications(notifications.map((n) => ({ ...n, is_read: 1 })));
  };

  return (
    <nav className="h-[60px] bg-ink text-white flex items-center justify-between px-6 border-b border-line z-50">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center">
          <span className="font-extrabold tracking-tighter text-lg">
            SEMINAR
          </span>
          <span className="font-light opacity-60 tracking-tighter text-lg ml-0.5">
            HUB
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifs(!showNotifs);
              if (!showNotifs) markAsRead();
            }}
            className="p-2 text-white/60 hover:text-white transition-colors relative"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 block h-3 w-3 rounded-full bg-accent border-2 border-ink"></span>
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-72 bg-surface text-ink border border-line rounded-lg shadow-2xl overflow-hidden z-50 font-sans"
              >
                <div className="p-3 border-b border-line bg-bg">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    Activity Log
                  </h3>
                </div>
                <div className="max-h-80 overflow-y-auto high-density-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-neutral-400 text-xs">
                      No entries found
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 border-b border-neutral-100 last:border-0 ${!n.is_read ? "bg-accent/5" : ""}`}
                      >
                        <p className="text-[11px] font-medium leading-normal">
                          {n.message}
                        </p>
                        <span className="text-[9px] text-neutral-400 mt-1 block font-mono">
                          {new Date(n.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-[12px] font-bold leading-none">{user?.name}</p>
            <p className="text-[10px] opacity-60 mt-0.5 font-mono uppercase tracking-tighter">
              {user?.role}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all border border-white/20"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
}
