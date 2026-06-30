import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import {
  LayoutDashboard, BedDouble, CalendarDays,
  Settings, LogOut, Menu, X, ExternalLink, Users, Bell,
  CreditCard, PieChart, Image,
} from "lucide-react";

const navItems = [
  { path: "/admin/dashboard",      label: "Dashboard",    icon: LayoutDashboard },
  { path: "/admin/rooms",          label: "Rooms",        icon: BedDouble },
  { path: "/admin/bookings",       label: "Bookings",     icon: CalendarDays },
  { path: "/admin/guests",         label: "Guests",       icon: Users },
  { path: "/admin/payments",       label: "Payments",     icon: CreditCard },
  { path: "/admin/reports",        label: "Reports",      icon: PieChart },
  { path: "/admin/gallery",        label: "Gallery",      icon: Image },
  { path: "/admin/settings",       label: "Settings",     icon: Settings },
  { path: "/admin/notifications",  label: "Notifications",icon: Bell },
];

const SIDEBAR_BG = { background: "linear-gradient(180deg, #1e3a8a 0%, #1d4ed8 100%)" };

const AdminLayout = ({ children }) => {
  const { logout }      = useAuth();
  const navigate        = useNavigate();
  const location        = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/admin/login"); };

  const NavLinks = ({ onClose }) => (
    <>
      {navItems.map(({ path, label, icon: Icon }) => {
        const active = location.pathname === path;
        return (
          <Link key={path} to={path} onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              active
                ? "bg-white text-blue-700 shadow-sm font-bold"
                : "text-white/75 hover:text-white hover:bg-white/10"
            }`}>
            <Icon className="w-4.5 h-4.5 shrink-0" />
            {label}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="flex h-screen bg-[#f0f4f8] overflow-hidden">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col shadow-xl" style={SIDEBAR_BG}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10 shrink-0">
          <div>
            <p className="text-white font-extrabold text-sm leading-none">SM Golden Resorts</p>
            <p className="text-blue-200 text-[10px] uppercase tracking-widest mt-0.5">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <NavLinks onClose={() => {}} />
        </nav>

        {/* Footer */}
        <div className="px-3 pb-5 pt-3 border-t border-white/10 space-y-0.5 shrink-0">

          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all">
            <LogOut className="w-4 h-4 shrink-0" /> Logout
          </button>
          <div className="flex items-center gap-2.5 px-4 py-2.5 mt-1 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
              <span className="text-white font-extrabold text-xs">A</span>
            </div>
            <div>
              <p className="text-white text-xs font-bold leading-none">Admin</p>
              <p className="text-blue-200/60 text-[10px] mt-0.5">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Mobile Full-screen Drawer ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Full backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" />

            {/* Drawer — full screen on mobile */}
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              className="fixed left-0 top-0 bottom-0 w-[280px] max-w-[85vw] z-50 flex flex-col lg:hidden shadow-2xl"
              style={SIDEBAR_BG}>

              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
                <div>
                  <p className="text-white font-extrabold text-sm leading-none">SM Golden Resorts</p>
                  <p className="text-blue-200 text-[10px] uppercase tracking-widest mt-0.5">Admin Panel</p>
                </div>
                <button onClick={() => setOpen(false)}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all shrink-0">
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Drawer Nav */}
              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                <NavLinks onClose={() => setOpen(false)} />
              </nav>

              {/* Drawer Footer */}
              <div className="px-3 pb-6 pt-3 border-t border-white/10 space-y-1 shrink-0">

                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all">
                  <LogOut className="w-4 h-4 shrink-0" /> Logout
                </button>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 mt-1">
                  <div className="w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
                    <span className="text-white font-extrabold text-sm">A</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold leading-none">Admin</p>
                    <p className="text-blue-200/60 text-xs mt-0.5">Administrator</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Mobile Top Bar */}
        <div className="lg:hidden px-4 py-3 flex items-center justify-between shadow-md shrink-0"
          style={{ background: "linear-gradient(90deg, #1e3a8a, #1d4ed8)" }}>
          <button onClick={() => setOpen(true)}
            className="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-white font-extrabold text-sm">SM Golden Resorts</span>
          </div>
          <div className="w-10" />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="h-full">
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
