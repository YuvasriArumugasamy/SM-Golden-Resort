import React from "react";
import { motion } from "framer-motion";
import { Phone, MapPin, MessageCircle, Clock, Mail, CheckCircle2 } from "lucide-react";

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1 } }),
};

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] font-jakarta">

      {/* ── Hero ── */}
      <div className="bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-gold rounded-full blur-3xl" />
          <div className="absolute -bottom-10 right-1/3 w-60 h-60 bg-primary rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 py-16 text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block text-primary text-[10px] font-extrabold uppercase tracking-widest bg-primary/15 border border-primary/25 px-4 py-1.5 rounded-full mb-4">
              Contact Us
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white font-jakarta mt-3">
              Get In Touch
            </h1>
            <p className="text-white/55 text-sm mt-3 max-w-md mx-auto leading-relaxed">
              We're available 24/7 to help you book your stay or answer any questions. Reach out anytime!
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">

        {/* ── Contact Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Phone */}
          <motion.div custom={0} variants={CARD_VARIANTS} initial="hidden" animate="visible"
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-navy/8 border border-navy/10 text-navy flex items-center justify-center mb-4">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-navy font-jakarta mb-1">Call Direct</h3>
            <p className="text-[11px] text-slate-400 mb-5 font-medium">Fastest way to book your stay</p>
            <div className="space-y-2.5 w-full">
              <a href="tel:9443710420"
                className="flex items-center justify-center gap-2 w-full bg-navy hover:bg-navy-light text-white font-bold py-3 rounded-xl transition-all text-sm shadow-sm hover:shadow">
                <Phone className="w-4 h-4" /> 9443710420
              </a>
              <a href="tel:9003549849"
                className="flex items-center justify-center gap-2 w-full bg-navy hover:bg-navy-light text-white font-bold py-3 rounded-xl transition-all text-sm shadow-sm hover:shadow">
                <Phone className="w-4 h-4" /> 9003549849
              </a>
            </div>
          </motion.div>

          {/* WhatsApp */}
          <motion.div custom={1} variants={CARD_VARIANTS} initial="hidden" animate="visible"
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-navy font-jakarta mb-1">WhatsApp</h3>
            <p className="text-[11px] text-slate-400 mb-5 font-medium">Quick replies within minutes</p>
            <a href="https://wa.me/919443710420?text=Hi,%20I%20want%20to%20book%20a%20room%20at%20SM%20Golden%20Resorts"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl transition-all text-sm shadow-sm hover:shadow">
              💬 Chat on WhatsApp
            </a>
            <p className="text-[10px] text-slate-400 mt-3 font-medium">Available 24 hours</p>
          </motion.div>

          {/* Address */}
          <motion.div custom={2} variants={CARD_VARIANTS} initial="hidden" animate="visible"
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-navy font-jakarta mb-1">Our Location</h3>
            <p className="text-[11px] text-slate-400 mb-5 font-medium">Open all year round</p>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Old Falls Main Road,<br />
              Old Falls, Courtallam,<br />
              Tamil Nadu — 627812
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-[11px] text-primary font-extrabold bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full">
              <Clock className="w-3 h-3" /> Open 24 Hours
            </div>
          </motion.div>
        </div>

        {/* ── Info Strip ── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-navy rounded-2xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[["🏨", "20 Rooms", "Double Bed, A/C, Three Bed, Four Bed A/C"], ["🐾", "Pets OK", "Animals welcome"], ["🅿️", "Free Parking", "Secure 24/7"], ["🍳", "Kitchen", "Full facility available"]].map(([icon, title, sub], i) => (
              <div key={i}>
                <span className="text-2xl">{icon}</span>
                <p className="text-white font-extrabold text-sm font-jakarta mt-1">{title}</p>
                <p className="text-white/50 text-[10px] font-medium mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Google Map ── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-md">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <MapPin className="w-4.5 h-4.5 text-primary" />
            </div>
            <div>
              <p className="font-extrabold text-navy text-sm font-jakarta">SM Golden Resorts — Old Falls, Courtallam</p>
              <p className="text-[11px] text-slate-400 font-medium">Near Courtallam Main Falls, Tamil Nadu</p>
            </div>
          </div>
          <div className="h-[400px]">
            <iframe
              title="SM Golden Resorts on Google Maps"
              src="https://maps.google.com/maps?q=Old+Falls+Courtallam+Tamil+Nadu&output=embed"
              width="100%" height="100%"
              style={{ border: 0 }} loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </motion.div>

        {/* ── Policies ── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-extrabold text-navy font-jakarta text-sm mb-4 flex items-center gap-2">
            <span className="w-1 h-4 bg-primary rounded-full" /> Resort Policies
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {["Late & Early check-in available on request", "Pets are welcome 🐾",
              "Free secured parking", "Outside food & beverages allowed",
              "Local & Government IDs accepted", "24/7 staff assistance",
              "Maximum 80 guests capacity", "Foreigners welcome"].map((p, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-600 font-medium py-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{p}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
