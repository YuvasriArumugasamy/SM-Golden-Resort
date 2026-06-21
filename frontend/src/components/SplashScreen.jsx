import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen({ onDone }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 600);
    }, 2800);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1d4ed8 100%)" }}
        >
          {/* Ambient glow blobs */}
          <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} />
          <div className="absolute bottom-1/4 right-1/4 w-60 h-60 rounded-full opacity-15 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, #60a5fa, transparent)" }} />

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 18, delay: 0.1 }}
            className="w-28 h-28 rounded-3xl overflow-hidden shadow-2xl mb-6"
            style={{ boxShadow: "0 0 60px rgba(59,130,246,0.5)" }}
          >
            <img src="/logo.jpeg" alt="SM Golden Resorts" className="w-full h-full object-cover" />
          </motion.div>

          {/* Resort Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center space-y-2"
          >
            <h1 className="text-3xl font-extrabold text-white tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              SM Golden Resorts
            </h1>
            <p className="text-blue-200 text-sm font-semibold uppercase tracking-[0.3em]">
              Courtallam, Tamil Nadu
            </p>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-white/40 text-xs mt-4 tracking-widest uppercase"
          >
            Your Perfect Nature Escape
          </motion.p>

          {/* Loading bar */}
          <motion.div
            className="absolute bottom-12 w-40 h-0.5 bg-white/10 rounded-full overflow-hidden"
          >
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.4, ease: "easeInOut", delay: 0.2 }}
              className="h-full bg-blue-400 rounded-full"
            />
          </motion.div>

          {/* Bottom tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute bottom-6 text-white/25 text-[10px] tracking-widest uppercase"
          >
            Near Old Falls · Best Rates Guaranteed
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
