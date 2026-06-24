import React, { useState, useEffect } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import { Phone, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { path: "/", label: "Home" },
  { path: "/booking", label: "Book Now" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Hide on all admin pages
  if (location.pathname.startsWith("/admin")) return null;

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  return (
    <nav className={`sticky top-0 z-50 bg-white font-jakarta transition-all duration-200 ${
      scrolled ? "shadow-sm border-b border-slate-200" : "border-b border-slate-100"
    }`}>
      <div className="max-w-[1280px] mx-auto px-4 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img
            src="/logo.jpeg"
            alt="SM Golden Resorts Logo"
            className="w-10 h-10 object-contain rounded-xl"
          />
          <div className="hidden sm:block">
            <span className="block text-sm font-extrabold text-[#1C2B4A] leading-none font-jakarta">
              SM Golden Resorts
            </span>
            <span className="block text-[9px] text-[#C8963E] font-semibold uppercase tracking-widest mt-0.5">
              Courtallam
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map(link => (
            <NavLink key={link.path} to={link.path} end={link.path === "/"}
              className={({ isActive }) =>
                `text-sm px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive
                    ? "text-blue-600 bg-blue-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`
              }>
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop right actions */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <a href="tel:9003549849"
             className="flex items-center gap-1.5 text-xs font-medium text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-all">
            <Phone className="w-3.5 h-3.5" /> Call
          </a>
          <Link to="/booking"
                className="text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-all">
            Book Now
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all">
          {mobileOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.18 }}
            className="md:hidden border-t border-slate-100 bg-white overflow-hidden">
            <div className="px-4 py-3 space-y-0.5">
              {NAV_LINKS.map(link => (
                <NavLink key={link.path} to={link.path} end={link.path === "/"}
                  className={({ isActive }) =>
                    `block text-sm font-medium px-3 py-2.5 rounded-lg transition-all ${
                      isActive ? "text-blue-600 bg-blue-50" : "text-slate-700 hover:bg-slate-50"
                    }`
                  }>
                  {link.label}
                </NavLink>
              ))}
              <div className="pt-2 flex gap-2 border-t border-slate-100 mt-2">
                <a href="tel:9003549849"
                   className="flex-1 text-center text-xs font-semibold bg-slate-900 text-white py-2.5 rounded-lg">
                  📞 9003549849
                </a>
                <a href="https://wa.me/919003549849" target="_blank" rel="noopener noreferrer"
                   className="flex-1 text-center text-xs font-semibold bg-emerald-500 text-white py-2.5 rounded-lg">
                  💬 WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
