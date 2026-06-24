import React from "react";
import { Link } from "react-router-dom";
import { Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="text-white font-jakarta"
      style={{ background: "linear-gradient(135deg, #0F2557 0%, #1a3470 50%, #0F2557 100%)" }}
    >
      {/* ── Main Footer ── */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/logo.jpeg"
              alt="SM Golden Resorts Logo"
              className="w-12 h-12 object-contain rounded-xl border-2 border-white/30"
            />
            <div>
              <span className="block text-sm font-extrabold text-white">SM Golden Resorts</span>
              <span className="block text-[10px] text-blue-100 font-bold uppercase tracking-widest mt-0.5">Courtallam</span>
            </div>
          </div>
          <p className="text-blue-100 text-xs leading-relaxed">
            Your perfect nature escape near the iconic Courtallam Old Falls. Single Bed, Double Bed, AC, Villa & Suite rooms available.
          </p>
          <div className="flex gap-3 mt-4">
            {[["24/7", "Open"], ["4.8★", "Rating"]].map(([v, l]) => (
              <div key={l} className="text-center bg-white/15 rounded-lg px-3 py-2 border border-white/20">
                <p className="text-white font-extrabold text-sm">{v}</p>
                <p className="text-blue-100 text-[9px] mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links + Room Types stacked */}
        <div className="space-y-6">
          {/* Quick Links */}
          <div>
            <h4 className="text-white font-extrabold text-xs uppercase tracking-widest border-b border-white/30 pb-2 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs">
              {[{ p: "/", l: "Home" }, { p: "/booking", l: "Book Online" }].map(link => (
                <li key={link.p}>
                  <Link to={link.p} className="text-blue-100 hover:text-white transition-colors flex items-center gap-1.5 font-medium">
                    <span className="text-white">→</span> {link.l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Room Types */}
          <div>
            <h4 className="text-white font-extrabold text-xs uppercase tracking-widest border-b border-white/30 pb-2 mb-4">
              Room Types
            </h4>
            <ul className="space-y-2.5 text-xs">
              {[
                ["Single Bed Non-AC", "₹1,300/day"],
                ["Double Bed Non-AC", "₹1,500/day"],
                ["Double Bed AC", "₹2,000/day"],
                ["Villa Room", "₹2,500/day"],
                ["Suite Room AC", "₹10,000/day"],
              ].map(([name, price]) => (
                <li key={name} className="flex items-center justify-between text-blue-100 font-medium gap-2">
                  <span className="flex items-center gap-1.5 whitespace-nowrap"><span className="text-white shrink-0">→</span> {name}</span>
                  <span className="text-white font-bold whitespace-nowrap shrink-0">{price}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-extrabold text-xs uppercase tracking-widest border-b border-white/30 pb-2 mb-4">
            Contact
          </h4>
          <ul className="space-y-3 text-xs">
            <li className="flex items-start gap-2 text-blue-100 font-medium">
              <MapPin className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
              <a
                href="https://www.google.com/maps/search/SM+Golden+Resorts+Old+Falls+Courtallam+Tamil+Nadu"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Old Falls Main Road, Old Falls, Courtallam, Tamil Nadu
              </a>
            </li>
            <li>
              <a href="tel:9003549849" className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors font-medium">
                <Phone className="w-3.5 h-3.5 text-white" /> 9003549849
              </a>
            </li>
            <li>
              <a href="tel:9443710420" className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors font-medium">
                <Phone className="w-3.5 h-3.5 text-white" /> 9443710420
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/20 pt-5 pb-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-3">

          {/* Decorative dots */}
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white/30 inline-block"></span>
            <span className="w-2 h-2 rounded-full bg-white/50 inline-block"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/30 inline-block"></span>
          </div>

          {/* Copyright line */}
          <p className="text-[11px] text-blue-100 text-center font-medium tracking-wide">
            © {new Date().getFullYear()}{" "}
            <span className="text-white font-bold">SM Golden Resorts</span>
            {" "}· All rights reserved.
          </p>

          {/* Designed by */}
          <p className="text-[10px] text-blue-200 text-center flex items-center gap-1.5 flex-wrap justify-center">
            <span>Website Designed</span>
            <span className="text-red-400 text-sm">♥</span>
            <span>by</span>
            <span className="text-white font-semibold tracking-wide border-b border-white/30 pb-px">Yuvasri Arumugasamy</span>
          </p>

          {/* Admin link — subtle */}
          <Link
            to="/admin/login"
            className="text-[9px] text-white/30 hover:text-white/70 transition-colors tracking-[0.2em] uppercase font-medium mt-1"
          >
            Admin
          </Link>

        </div>
      </div>
    </footer>
  );
}
