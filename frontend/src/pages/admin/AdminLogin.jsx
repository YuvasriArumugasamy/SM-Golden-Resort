import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { Shield, Mail, Lock, LogIn } from "lucide-react";

const AdminLogin = () => {
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) navigate("/admin/dashboard");
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill in all fields");
    setLoading(true);
    try {
      const res = await api.post("/api/admin/login", { email, password });
      toast.success(res.data.message || "Login successful!");
      login(res.data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4 page-transition">
      <div className="w-full max-w-md">
        {/* Logo area */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-gold" />
          </div>
          <h1 className="text-2xl font-extrabold text-white font-jakarta">SM Golden Resorts</h1>
          <p className="text-white/50 text-xs uppercase tracking-widest mt-1 font-semibold">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="admin@smgoldenresorts.com" required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-jakarta"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-jakarta"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:bg-white/20 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-jakarta"
            >
              {loading ? "Signing In..." : "Sign In"} <LogIn className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          SM Golden Resorts — Admin Access Only
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
