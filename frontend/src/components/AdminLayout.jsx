import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import {
  LayoutDashboard,
  BedDouble,
  CalendarDays,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Users,
} from "lucide-react";

const navItems = [
  { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/rooms", label: "Rooms", icon: BedDouble },
  { path: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { path: "/admin/guests", label: "Guests", icon: Users },
  { path: "/admin/settings", label: "Settings", icon: Settings },
];

const AdminLayout = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <img
            src="/Gemini_Generated_Image_1938en1938en1938.png"
            alt="SM Golden Resorts Logo"
            className="w-10 h-10 object-contain rounded-full shrink-0"
          />
          <div>
            <p className="text-white font-extrabold text-sm font-jakarta leading-none">SM Golden Resorts</p>
            <p className="text-white/40 text-[10px] uppercase tracking-widest mt-0.5">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                isActive
                  ? "bg-gold text-white shadow-md"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-4 border-t border-white/10 space-y-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          View Site
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Logout
        </button>

        {/* Admin badge */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 mt-2 bg-white/5 rounded-xl">
          <div className="w-7 h-7 rounded-full bg-gold/30 border border-gold/40 flex items-center justify-center shrink-0">
            <span className="text-gold font-extrabold text-xs font-jakarta">A</span>
          </div>
          <div>
            <p className="text-white text-xs font-bold leading-none">Admin</p>
            <p className="text-white/40 text-[10px] mt-0.5">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-cream overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 bg-navy flex-col shadow-xl">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed left-0 top-0 bottom-0 w-60 bg-navy flex flex-col shadow-2xl z-50 lg:hidden"
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Top Bar */}
        <div className="lg:hidden bg-navy px-4 py-3 flex items-center justify-between shadow-md shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center"
          >
            <Menu className="w-5 h-5" />
          </button>
          <img
            src="/Gemini_Generated_Image_1938en1938en1938.png"
            alt="SM Golden Resorts Logo"
            className="w-8 h-8 object-contain rounded-full"
          />
          <span className="text-white font-extrabold text-sm font-jakarta">SM Golden Resorts</span>
          <div className="w-9" />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
