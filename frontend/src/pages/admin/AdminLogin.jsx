import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { User, Lock, Eye, EyeOff, ShieldCheck, LogIn } from "lucide-react";
import { motion } from "framer-motion";

/* ── Holographic tilt card hook ── */
function useTilt() {
  const ref = useRef(null);
  const animRef = useRef(null);

  const onMouseMove = useCallback((e) => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width  / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -12;
    const rotY = ((x - cx) / cx) *  12;

    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(() => {
      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.03,1.03,1.03)`;
      // shift the holographic gradient based on mouse position
      const px = (x / rect.width)  * 100;
      const py = (y / rect.height) * 100;
      card.style.setProperty("--px", `${px}%`);
      card.style.setProperty("--py", `${py}%`);
    });
  }, []);

  const onMouseLeave = useCallback(() => {
    const card = ref.current;
    if (!card) return;
    if (animRef.current) cancelAnimationFrame(animRef.current);
    card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();
  const { ref: cardRef, onMouseMove, onMouseLeave } = useTilt();

  React.useEffect(() => {
    if (isAuthenticated) navigate("/admin/dashboard");
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return toast.error("Please fill in all fields");
    setLoading(true);
    try {
      const res = await api.post("/api/admin/login", { username, password });
      toast.success("Welcome back! 👋");
      login(res.data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 overflow-hidden select-none relative"
      style={{ background: "radial-gradient(ellipse at 60% 40%, #0f172a 0%, #0a0a1a 100%)" }}
    >
      {/* ── Animated background orbs ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #6366f1, transparent)" }}
        />
        <motion.div
          animate={{ x: [0, -25, 0], y: [0, 25, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #ec4899, transparent)" }}
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, 15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full opacity-15 blur-3xl"
          style={{ background: "radial-gradient(circle, #06b6d4, transparent)" }}
        />
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }}
        />
      </div>

      {/* ── Holographic tilt card ── */}
      <div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="relative w-full max-w-[400px] z-10"
        style={{ transition: "transform 0.15s ease-out", willChange: "transform" }}
      >
        {/* Holographic shimmer layer */}
        <div
          className="absolute inset-0 rounded-3xl opacity-0 hover:opacity-100 pointer-events-none transition-opacity duration-300 z-20"
          style={{
            background: "radial-gradient(circle at var(--px, 50%) var(--py, 50%), rgba(255,255,255,0.12) 0%, transparent 60%)",
            mixBlendMode: "overlay",
          }}
        />
        {/* Rainbow border glow */}
        <div
          className="absolute -inset-px rounded-3xl opacity-70 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899, #06b6d4, #6366f1)",
            backgroundSize: "300% 300%",
            animation: "gradientBorder 4s linear infinite",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            padding: "1.5px",
            borderRadius: "1.5rem",
          }}
        />

        {/* Card body */}
        <div
          className="relative rounded-3xl px-8 py-10 overflow-hidden"
          style={{
            background: "rgba(15, 15, 40, 0.85)",
            backdropFilter: "blur(32px)",
            WebkitBackdropFilter: "blur(32px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)",
          }}
        >
          {/* Inner holographic shimmer */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none rounded-3xl"
            style={{
              background: "linear-gradient(125deg, transparent 30%, rgba(99,102,241,0.08) 50%, transparent 70%)",
              animation: "shineMove 3s ease-in-out infinite",
            }}
          />

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 }}
            className="flex flex-col items-center mb-7"
          >
            <div
              className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2"
              style={{ borderColor: "rgba(99,102,241,0.5)", boxShadow: "0 0 24px rgba(99,102,241,0.4), 0 0 60px rgba(99,102,241,0.15)" }}
            >
              <img src="/WhatsApp Image 2026-06-22 at 18.04.13.jpeg" alt="SM Golden Resorts" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              SM Golden Resorts
            </h1>
            <div className="flex items-center gap-1.5 mt-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-indigo-300/70 text-xs font-semibold uppercase tracking-widest">Admin Panel</span>
            </div>
            <p className="text-white/30 text-xs mt-1">Sign in to manage bookings</p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400/60 pointer-events-none" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter username"
                  autoComplete="username"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium text-white placeholder-white/25 outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                  onFocus={e => { e.target.style.border = "1px solid rgba(99,102,241,0.7)"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15), 0 0 20px rgba(99,102,241,0.1)"; e.target.style.background = "rgba(99,102,241,0.08)"; }}
                  onBlur={e => { e.target.style.border = "1px solid rgba(255,255,255,0.12)"; e.target.style.boxShadow = "none"; e.target.style.background = "rgba(255,255,255,0.07)"; }}
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400/60 pointer-events-none" />
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-11 py-3 rounded-xl text-sm font-medium text-white placeholder-white/25 outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                  onFocus={e => { e.target.style.border = "1px solid rgba(99,102,241,0.7)"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15), 0 0 20px rgba(99,102,241,0.1)"; e.target.style.background = "rgba(99,102,241,0.08)"; }}
                  onBlur={e => { e.target.style.border = "1px solid rgba(255,255,255,0.12)"; e.target.style.boxShadow = "none"; e.target.style.background = "rgba(255,255,255,0.07)"; }}
                />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 transition-colors" tabIndex={-1}>
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 rounded-xl font-extrabold text-sm text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
                  backgroundSize: "200% 200%",
                  boxShadow: "0 8px 32px rgba(99,102,241,0.45), 0 0 0 0 rgba(99,102,241,0)",
                  animation: "gradientButton 3s ease infinite",
                }}
              >
                {/* Shimmer */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)", transform: "skewX(-15deg)" }} />
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                      <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Signing In…
                  </>
                ) : (
                  <><LogIn className="w-4 h-4" /> Sign In</>
                )}
              </button>
            </motion.div>
          </form>

          {/* Footer */}
          <div className="mt-7 pt-5 border-t border-white/8 flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/25 text-[11px] font-medium">Secure admin access</span>
          </div>
        </div>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes gradientBorder {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes gradientButton {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shineMove {
          0%   { transform: translateX(-100%) rotate(25deg); }
          60%  { transform: translateX(200%) rotate(25deg); }
          100% { transform: translateX(200%) rotate(25deg); }
        }
      `}</style>
    </div>
  );
}
