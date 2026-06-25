import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { User, Lock, LogIn, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

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

  /* shared glass input style */
  const inputStyle = {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.18)",
    transition: "all 0.2s",
  };
  const focusIn  = e => { e.target.style.border = "1px solid rgba(147,197,253,0.8)"; e.target.style.boxShadow = "0 0 0 3px rgba(96,165,250,0.18)"; e.target.style.background = "rgba(255,255,255,0.13)"; };
  const focusOut = e => { e.target.style.border = "1px solid rgba(255,255,255,0.18)"; e.target.style.boxShadow = "none"; e.target.style.background = "rgba(255,255,255,0.08)"; };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden select-none">

      {/* ── Background photo ── */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: "url('/WhatsApp Image 2026-06-14 at 09.15.41.jpeg')" }}
      />
      {/* gradient overlay */}
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, rgba(15,23,42,0.82) 0%, rgba(30,58,138,0.78) 50%, rgba(15,23,42,0.88) 100%)" }} />

      {/* floating blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #60a5fa, transparent)" }} />

      {/* ── Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.94 }}
        animate={{ opacity: 1, y: 0,  scale: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
        className="relative z-10 w-full max-w-[380px]"
      >
        <div
          className="rounded-3xl px-8 py-10 shadow-2xl"
          style={{
            background: "rgba(255,255,255,0.09)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            border: "1px solid rgba(255,255,255,0.15)",
            boxShadow: "0 32px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)",
          }}
        >
          {/* ── Logo ── */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1,   opacity: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
              className="w-16 h-16 rounded-full overflow-hidden mb-4 shadow-xl"
              style={{
                boxShadow: "0 8px 24px rgba(59,130,246,0.4)",
              }}
            >
              <img src="/WhatsApp Image 2026-06-22 at 18.04.13.jpeg" alt="SM Golden Resorts" className="w-full h-full object-cover" />
            </motion.div>

            <h1 className="text-2xl font-extrabold text-white tracking-tight">SM Golden Resorts</h1>
            <div className="flex items-center gap-1.5 mt-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
              <span className="text-blue-200/70 text-xs font-semibold uppercase tracking-widest">Admin Panel</span>
            </div>
            <p className="text-white/40 text-xs mt-1.5">Sign in to manage bookings</p>
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 w-4 h-4 text-blue-300/60 pointer-events-none" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter username"
                  autoComplete="username"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium text-white placeholder-white/30 outline-none"
                  style={inputStyle}
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-blue-300/60 pointer-events-none" />
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-11 py-3 rounded-xl text-sm font-medium text-white placeholder-white/30 outline-none"
                  style={inputStyle}
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3.5 text-white/35 hover:text-white/70 transition-colors"
                  tabIndex={-1}
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* ── Sign In button ── */}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 rounded-xl font-extrabold text-sm text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                boxShadow: "0 8px 24px rgba(37,99,235,0.40)",
              }}
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing In…
                </>
              ) : (
                <>Sign In <LogIn className="w-4 h-4" /></>
              )}
            </motion.button>
          </form>

          {/* divider */}
          <div className="mt-7 pt-5 border-t border-white/10 flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/30 text-[11px] font-medium">Secure admin access</span>
          </div>
        </div>

        <p className="text-center text-white/20 text-xs mt-5">
          SM Golden Resorts — Admin Access Only
        </p>
      </motion.div>
    </div>
  );
}
