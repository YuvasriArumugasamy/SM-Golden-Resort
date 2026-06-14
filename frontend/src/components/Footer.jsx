import React from "react";
import { Link } from "react-router-dom";
import { Phone, MapPin, Mail, Instagram, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-navy text-white overflow-hidden">
      {/* Top CTA strip */}
      <div className="bg-primary py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <h3 className="text-white font-extrabold text-xl font-jakarta">
              Ready to Experience Courtallam?
            </h3>
            <p className="text-white/80 text-sm mt-1">Book your stay directly for the best rates</p>
          </div>
          <div className="flex gap-3">
            <a
              href="tel:9443710440"
              className="flex items-center gap-2 bg-white text-primary font-bold px-5 py-2.5 rounded-lg text-sm hover:bg-cream transition-all shadow"
            >
              <Phone className="w-4 h-4" /> Call Now
            </a>
            <a
              href="https://wa.me/919443710440?text=Hi,%20I%20want%20to%20book%20a%20room%20at%20SM%20Golden%20Resorts"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-all shadow"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
        {/* Column 1: Brand */}
        <div className="sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <span className="text-gold font-bold text-lg font-jakarta">S</span>
            </div>
            <div>
              <span className="block text-base font-extrabold text-white font-jakarta">SM Golden Resorts</span>
              <span className="block text-[10px] text-primary font-semibold uppercase tracking-widest">Courtallam</span>
            </div>
          </div>
          <p className="text-white/60 text-sm leading-relaxed">
            Your perfect nature escape near the iconic Courtallam Falls. AC, Non-AC, Suites & Villas available.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-widest border-b border-white/10 pb-2">
            Quick Links
          </h4>
          <ul className="space-y-3 text-sm text-white/60">
            {[
              { path: "/", label: "Home" },
              { path: "/rooms", label: "Our Rooms" },
              { path: "/booking", label: "Book Online" },
              { path: "/contact", label: "Contact Us" },
            ].map((link) => (
              <li key={link.path}>
                <Link to={link.path} className="hover:text-gold-light transition-colors">
                  → {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Room Types */}
        <div>
          <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-widest border-b border-white/10 pb-2">
            Room Types
          </h4>
          <ul className="space-y-3 text-sm text-white/60">
            {["AC Rooms (₹2,000/night)", "Non-AC Rooms (₹1,500/night)", "Suite AC (₹10,000/night)", "Villa (₹2,500/night)"].map((item) => (
              <li key={item} className="hover:text-gold-light transition-colors cursor-default">
                → {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div>
          <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-widest border-b border-white/10 pb-2">
            Contact
          </h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>Old Falls Main Road, Old Falls, Courtallam, Tamil Nadu</span>
            </li>
            <li>
              <a href="tel:9443710440" className="flex items-center gap-2 hover:text-gold-light transition-colors">
                <Phone className="w-4 h-4 text-primary" /> 9443710440
              </a>
            </li>
            <li>
              <a href="tel:9003549849" className="flex items-center gap-2 hover:text-gold-light transition-colors">
                <Phone className="w-4 h-4 text-primary" /> 9003549849
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              <span>info@smgoldenresorts.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <span>
            © {new Date().getFullYear()} SM Golden Resorts. All rights reserved. &middot;{" "}
            <Link to="/admin/login" className="text-white/50 hover:text-gold transition-colors font-semibold">
              admin
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
