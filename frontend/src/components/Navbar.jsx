import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Phone } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top contact bar */}
      <div className="bg-navy text-cream-dark text-xs py-2 px-4 hidden md:flex justify-end gap-6 items-center">
        <a href="tel:9443710440" className="flex items-center gap-1.5 hover:text-gold-light transition-colors">
          <Phone className="w-3 h-3" /> 9443710440
        </a>
        <a href="tel:9003549849" className="flex items-center gap-1.5 hover:text-gold-light transition-colors">
          <Phone className="w-3 h-3" /> 9003549849
        </a>
        <span className="text-cream-dark/50">|</span>
        <span>Old Falls, Courtallam, Tamil Nadu</span>
      </div>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white shadow-lg border-b border-cream-dark py-3"
            : "bg-white/98 py-4 border-b border-cream-dark/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center shadow-md">
              <span className="text-gold font-bold text-lg font-jakarta">S</span>
            </div>
            <div>
              <span className="block text-lg font-extrabold tracking-tight text-navy font-jakarta leading-tight">
                SM Golden Resorts
              </span>
              <span className="block text-[10px] text-primary font-semibold uppercase tracking-widest">
                Courtallam
              </span>
            </div>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
