import React from "react";
import { Link } from "react-router-dom";
import { Phone, MapPin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy text-white font-jakarta">

      {/* ── CTA Strip ── */}
      <div className="bg-primary py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <h3 className="text-white font-extrabold text-lg font-jakarta">
              Ready to Experience Courtallam? 🏔️
            </h3>
            <p className="text-white/75 text-sm mt-0.5">Book directly for the best rates — no middleman charges.</p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="tel:9443710420"
              className="flex items-center gap-2 bg-white text-primary font-extrabold px-5 py-2.5 rounded-xl text-sm hover:bg-cream transition-all shadow">
              <Phone className="w-4 h-4" /> Call Now
            </a>
            <a href="https://wa.me/919443710420?text=Hi,%20I%20want%20to%20book%20a%20room%20at%20SM%20Golden%20Resorts"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-5 py-2.5 rounded-xl text-sm transition-all shadow">
              💬 WhatsApp
            </a>
            <Link to="/booking"
              className="flex items-center gap-2 bg-navy hover:bg-navy-light text-white font-extrabold px-5 py-2.5 rounded-xl text-sm transition-all shadow">
              Book Online
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Footer ── */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div className="sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/Gemini_Generated_Image_1938en1938en1938.png"
              alt="SM Golden Resorts Logo"
              className="w-12 h-12 object-contain rounded-full"
            />
            <div>
              <span className="block text-sm font-extrabold text-white font-jakarta">SM Golden Resorts</span>
              <span className="block text-[9px] text-primary font-bold uppercase tracking-widest">Courtallam</span>
            </div>
          </div>
          <p className="text-white/50 text-xs leading-relaxed">
            Your perfect nature escape near the iconic Courtallam Old Falls. AC, Non-AC, Suites & Villa available.
          </p>
          <div className="flex gap-3 mt-4">
            <div className="text-center bg-white/5 rounded-lg px-3 py-2">
              <p className="text-gold font-extrabold text-sm">11</p>
              <p className="text-white/40 text-[9px]">Rooms</p>
            </div>
            <div className="text-center bg-white/5 rounded-lg px-3 py-2">
              <p className="text-gold font-extrabold text-sm">24/7</p>
              <p className="text-white/40 text-[9px]">Open</p>
            </div>
            <div className="text-center bg-white/5 rounded-lg px-3 py-2">
              <p className="text-gold font-extrabold text-sm">4.8★</p>
              <p className="text-white/40 text-[9px]">Rating</p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-extrabold text-xs uppercase tracking-widest border-b border-white/10 pb-2 mb-4">
            Quick Links
          </h4>
          <ul className="space-y-2.5 text-xs text-white/55">
            {[{ p: "/", l: "Home" }, { p: "/rooms", l: "Our Rooms" }, { p: "/booking", l: "Book Online" }, { p: "/contact", l: "Contact Us" }].map(link => (
              <li key={link.p}>
                <Link to={link.p} className="hover:text-gold transition-colors flex items-center gap-1.5">
                  <span className="text-primary">→</span> {link.l}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Room Types */}
        <div>
          <h4 className="text-white font-extrabold text-xs uppercase tracking-widest border-b border-white/10 pb-2 mb-4">
            Room Types
          </h4>
          <ul className="space-y-2.5 text-xs text-white/55">
            {["Non-AC Rooms — ₹1,500/night", "AC Rooms — ₹2,000/night", "Villa (Room 110) — ₹2,500/night", "Suite Rooms — ₹10,000/night"].map(item => (
              <li key={item} className="flex items-center gap-1.5">
                <span className="text-primary">→</span> {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-extrabold text-xs uppercase tracking-widest border-b border-white/10 pb-2 mb-4">
            Contact
          </h4>
          <ul className="space-y-3 text-xs text-white/55">
            <li className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <span>Old Falls Main Road, Old Falls, Courtallam, Tamil Nadu</span>
            </li>
            <li>
              <a href="tel:9443710420" className="flex items-center gap-2 hover:text-gold transition-colors">
                <Phone className="w-3.5 h-3.5 text-primary" /> 9443710420
              </a>
            </li>
            <li>
              <a href="tel:9003549849" className="flex items-center gap-2 hover:text-gold transition-colors">
                <Phone className="w-3.5 h-3.5 text-primary" /> 9003549849
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/10 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-[10px] text-white/30">
          <span>© {new Date().getFullYear()} SM Golden Resorts. All rights reserved.</span>
          <span>
            Old Falls, Courtallam, Tamil Nadu &middot;{" "}
            <Link to="/admin/login" className="hover:text-gold transition-colors">Admin</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
