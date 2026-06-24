import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen({ onDone }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 700);
    }, 3200);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] overflow-hidden"
        >
          {/* ── Background photo with slow Ken Burns zoom ── */}
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1.08 }}
            transition={{ duration: 3.5, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src="/ChatGPT Image Jun 21, 2026, 06_19_29 PM.png"
              alt="SM Golden Resorts Courtallam"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* ── Gradient overlay ── */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.15) 100%)",
            }}
          />

          {/* ── Center content ── */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">

            {/* Logo */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 160, damping: 16, delay: 0.2 }}
              className="w-24 h-24 rounded-2xl overflow-hidden shadow-2xl mb-6 border-2 border-white/30"
              style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.5)" }}
            >
              <img src="/logo.jpeg" alt="SM Golden Resorts Logo" className="w-full h-full object-cover" />
            </motion.div>

            {/* Resort Name */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-white font-bold text-center drop-shadow-2xl"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.8rem, 6vw, 3rem)",
                textShadow: "0 4px 20px rgba(0,0,0,0.6)",
              }}
            >
              SM Golden Resorts
            </motion.h1>

            {/* Location */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-white/80 text-sm font-semibold uppercase tracking-[0.25em] mt-2"
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
            >
              Courtallam, Tamil Nadu
            </motion.p>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="text-white/55 text-xs mt-2 tracking-widest uppercase"
            >
              Your Perfect Nature Escape
            </motion.p>

            {/* Shimmer loading bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="mt-10 w-36 h-0.5 bg-white/20 rounded-full overflow-hidden"
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.4, ease: "easeInOut", delay: 1.4, repeat: Infinity }}
                className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent rounded-full"
              />
            </motion.div>
          </div>

          {/* ── Bottom tagline ── */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="absolute bottom-8 left-0 right-0 text-center text-white/40 text-[11px] tracking-[0.2em] uppercase"
          >
            Near Old Falls · Best Rates Guaranteed
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
