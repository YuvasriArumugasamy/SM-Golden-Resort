import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState("in"); // "in" | "out"

  useEffect(() => {
    // Show for 2.8s then fade out
    const t1 = setTimeout(() => setPhase("out"), 2800);
    const t2 = setTimeout(onDone, 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === "out" ? 0 : 1 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1d4ed8 100%)" }}
        >

          {/* ── Animated bed icon image ── */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 140, damping: 16, delay: 0.15 }}
            className="relative"
          >
            {/* Pulse ring behind image */}
            <motion.div
              animate={{ scale: [1, 1.18, 1], opacity: [0.15, 0.3, 0.15] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-blue-100"
              style={{ margin: "-24px" }}
            />
            <img
              src="/WhatsApp Image 2026-06-24 at 09.16.52.jpeg"
              alt="SM Golden Resorts"
              className="w-52 h-52 object-contain relative z-10"
            />
          </motion.div>

          {/* ── Text ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.55 }}
            className="text-center mt-6 space-y-1.5"
          >
            <h1
              className="text-white font-extrabold"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.4rem, 5vw, 2rem)" }}
            >
              SM Golden Resorts
            </h1>
            <p className="text-blue-200 text-xs font-semibold uppercase tracking-[0.25em]">
              Courtallam, Tamil Nadu
            </p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-blue-300 text-[11px] font-bold uppercase tracking-widest"
            >
              Book Direct · Best Price · Exceptional Service
            </motion.p>
          </motion.div>

          {/* ── Shimmer progress bar ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 w-40 h-1 bg-white/20 rounded-full overflow-hidden"
          >
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.4, ease: "easeInOut", delay: 0.6 }}
              className="h-full bg-gradient-to-r from-blue-300 to-white rounded-full"
            />
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
