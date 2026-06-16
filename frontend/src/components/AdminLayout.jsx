import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import {
  LayoutDashboard, BedDouble, CalendarDays,
  Settings, LogOut, Menu, X, ExternalLink, Users,
} from "lucide-react";

const navItems = [
  { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/rooms",     label: "Rooms",     icon: BedDouble },
  { path: "/admin/bookings",  label: "Bookings",  icon: CalendarDays },
  { path: "/admin/guests",    label: "Guests",    icon: Users },
  { path: "/admin/settings",  label: "Settings",  icon: Settings },
];

const AdminLayout = ({ children }) => {
  const { logout }       = useAuth();
  const navigate         = useNavigate();
  const location         = useLocation();
  const [open, setOpen]  = useState(false);

  const handleLogout = () => { logout(); navigate("/admin/login"); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow">
            <span className="text-blue-700 font-extrabold text-sm leading-none">SM</span>
          </div>
          <div>
            <p className="text-white font-extrabold text-sm leading-none">SM Golden Resorts</p>
            <p className="text-blue-200 text-[10px] uppercase tracking-widest mt-0.5">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <Link key={path} to={path} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                active
                  ? "bg-white text-blue-700 shadow-sm font-bold"
                  : "text-white/75 hover:text-white hover:bg-white/10"
              }`}>
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-5 pt-3 border-t border-white/10 space-y-0.5">
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-white/60 hover:text-white hover:bg-white/10 transition-all">
          <ExternalLink className="w-4 h-4 shrink-0" /> View Site
        </a>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-300 hover:text-red-200 hover:bg-red-500/15 transition-all">
          <LogOut className="w-4 h-4 shrink-0" /> Logout
        </button>

        {/* Admin badge */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 mt-1 bg-white/8 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
            <span className="text-white font-extrabold text-xs">A</span>
          </div>
          <div>
            <p className="text-white text-xs font-bold leading-none">Admin</p>
            <p className="text-blue-200/60 text-[10px] mt-0.5">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f0f4f8] overflow-hidden">

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-56 shrink-0 flex-col shadow-xl"
        style={{ background: "linear-gradient(180deg, #1e3a8a 0%, #1d4ed8 100%)" }}>
        <SidebarContent />
      </aside>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden" />
            <motion.aside
              initial={{ x: -224 }} animate={{ x: 0 }} exit={{ x: -224 }}
              transition={{ type: "tween", duration: 0.22 }}
              className="fixed left-0 top-0 bottom-0 w-56 flex flex-col shadow-2xl z-50 lg:hidden"
              style={{ background: "linear-gradient(180deg, #1e3a8a 0%, #1d4ed8 100%)" }}>
              <button onClick={() => setOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Mobile Top Bar */}
        <div className="lg:hidden px-4 py-3 flex items-center justify-between shadow-md shrink-0"
          style={{ background: "linear-gradient(90deg, #1e3a8a, #1d4ed8)" }}>
          <button onClick={() => setOpen(true)}
            className="w-9 h-9 rounded-xl bg-white/15 text-white flex items-center justify-center">
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-white font-extrabold text-sm">SM Golden Resorts</span>
          <div className="w-9" />
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div key={location.pathname}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
            className="h-full">
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
