import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState("in"); // "in" | "out"
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Show splash for 2s then transition
    const t1 = setTimeout(() => setPhase("out"), 2000);
    const t2 = setTimeout(onDone, 2700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === "out" ? 0 : 1 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden select-none bg-[#0b0f19]"
        >
          {/* Cinematic Background Image with slow breathing scale */}
          <motion.div
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ 
              scale: imageLoaded ? [1.05, 1.12, 1.05] : 1.05, 
              opacity: imageLoaded ? 1 : 0 
            }}
            transition={{
              scale: { repeat: Infinity, duration: 25, ease: "easeInOut" },
              opacity: { duration: 1.2, ease: "easeInOut" }
            }}
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <img 
              src="/ChatGPT Image Jun 21, 2026, 06_19_29 PM.webp" 
              alt="Resort Hills Background" 
              className="w-full h-full object-cover"
              onLoad={() => setImageLoaded(true)}
            />
          </motion.div>

          {/* Cinematic Overlays — darkened for better text clarity */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-black/90 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.1)_10%,rgba(0,0,0,0.65)_80%)] pointer-events-none" />

          {/* Center Logo with Premium Golden glowing frame */}
          <motion.div
            initial={{ y: 35, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            className="relative flex items-center justify-center mb-6 z-10"
          >
            {/* Pulsing Outer Gold Ring */}
            <motion.div
              animate={{ 
                scale: [1, 1.08, 1],
                opacity: [0.25, 0.5, 0.25]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 3, 
                ease: "easeInOut" 
              }}
              className="absolute w-36 h-36 rounded-full border border-[#d4af37]/30 blur-[2px]"
            />
            
            {/* Inner Solid Gold Border Ring */}
            <div className="absolute w-[136px] h-[136px] rounded-full border-2 border-[#d4af37]/50" />

            {/* Logo Image */}
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl bg-slate-900">
              <img
                src="/WhatsApp Image 2026-06-22 at 18.04.13.webp"
                alt="SM Golden Resorts Logo"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Typography & Brand Slogan */}
          <motion.div
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
            className="text-center z-10 px-6 max-w-lg space-y-3"
          >
            {/* Elegant Welcome Badge */}
            <span
              className="inline-block text-[#f5d060] text-xs font-extrabold tracking-[0.3em] uppercase bg-[#d4af37]/15 px-4 py-1.5 rounded-full border border-[#d4af37]/40 select-none"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}
            >
              ✦ Welcome To Luxury ✦
            </span>

            {/* Main Title with Serif Font */}
            <h1
              className="text-white font-bold tracking-wide"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 8vw, 3.25rem)",
                textShadow: "0 2px 20px rgba(0,0,0,0.9), 0 4px 40px rgba(0,0,0,0.7)",
                lineHeight: 1.15
              }}
            >
              SM{" "}
              <span
                className="bg-gradient-to-r from-yellow-200 via-[#d4af37] to-amber-400 bg-clip-text text-transparent"
                style={{ textShadow: "none" }}
              >
                Golden
              </span>{" "}
              Resorts
            </h1>

            {/* Location Tag */}
            <p
              className="text-white text-sm font-bold uppercase tracking-[0.4em]"
              style={{ textShadow: "0 1px 12px rgba(0,0,0,0.9)" }}
            >
              Courtallam, Tamil Nadu
            </p>

            {/* Divider lines and Slogan */}
            <div className="flex items-center justify-center gap-3 pt-1">
              <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#d4af37]/70" />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.7 }}
                className="text-white text-[11px] md:text-xs font-bold tracking-widest uppercase"
                style={{ textShadow: "0 1px 10px rgba(0,0,0,0.9)" }}
              >
                Book Direct • Best Price • Exceptional Service
              </motion.p>
              <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#d4af37]/70" />
            </div>
          </motion.div>

          {/* Premium Golden Shimmering Loading Bar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.8 }}
            className="z-10 mt-8 w-44 h-1 bg-white/10 rounded-full border border-white/5 overflow-hidden relative"
          >
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.8, ease: "easeInOut", delay: 0.15 }}
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-600 rounded-full relative"
            >
              {/* Inner shimmer animation */}
              <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-1/2 h-full"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
