import React, { useState } from "react";
import { motion } from "framer-motion";
import AdminLayout from "../../components/AdminLayout";
import api from "../../api/axios";
import toast from "react-hot-toast";
import {
  Lock, Eye, EyeOff, Shield, RefreshCw, ExternalLink,
  CheckCircle2, Info, Phone, MapPin
} from "lucide-react";

export default function AdminSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/admin/change-password", {
        currentPassword,
        newPassword,
      });
      toast.success(res.data.message || "Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 border border-cream-dark rounded-xl text-sm focus:border-gold focus:ring-2 focus:ring-gold/15 outline-none bg-cream/30 font-jakarta text-navy placeholder-navy/30 transition-all pr-12";

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-navy font-jakarta">Settings</h1>
            <p className="text-navy/50 text-sm mt-0.5">Manage your admin account</p>
          </div>
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold/90 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-all cursor-pointer w-fit">
            <ExternalLink className="w-3.5 h-3.5" />
            View Site
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Change Password Card */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-cream-dark shadow-sm p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center">
                <Lock className="w-5 h-5 text-navy/60" />
              </div>
              <div>
                <h3 className="font-extrabold text-navy font-jakarta text-sm">Change Password</h3>
                <p className="text-[11px] text-navy/50 mt-0.5">Update your admin login password</p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-bold text-navy/60 uppercase tracking-wider mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className={inputClass}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy/70 transition-colors"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-navy/60 uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className={inputClass}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy/70 transition-colors"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-bold text-navy/60 uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className={inputClass}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy/70 transition-colors"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && newPassword && confirmPassword !== newPassword && (
                  <p className="text-[11px] text-red-500 font-bold mt-1">Passwords do not match</p>
                )}
                {confirmPassword && newPassword && confirmPassword === newPassword && (
                  <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Passwords match
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-navy hover:bg-navy/90 text-white font-extrabold py-3 px-6 rounded-xl transition-all duration-300 shadow hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-jakarta text-sm mt-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Updating...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" /> Update Password
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Resort Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-cream-dark shadow-sm p-6 space-y-5"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                <Info className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h3 className="font-extrabold text-navy font-jakarta text-sm">Resort Info</h3>
                <p className="text-[11px] text-navy/50 mt-0.5">SM Golden Resorts details</p>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="bg-cream rounded-xl p-4 space-y-1">
                <p className="text-[10px] font-bold text-navy/40 uppercase tracking-wider">Resort Name</p>
                <p className="font-extrabold text-navy font-jakarta">SM Golden Resorts</p>
              </div>
              <div className="bg-cream rounded-xl p-4 space-y-1">
                <p className="text-[10px] font-bold text-navy/40 uppercase tracking-wider">Location</p>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <p className="text-navy/80 font-medium text-xs leading-relaxed">
                    Old Falls Main Road, Old Falls, Courtallam, Tamil Nadu
                  </p>
                </div>
              </div>
              <div className="bg-cream rounded-xl p-4 space-y-2">
                <p className="text-[10px] font-bold text-navy/40 uppercase tracking-wider">Contact Numbers</p>
                <a href="tel:9443710420" className="flex items-center gap-2 text-xs font-medium text-navy/70 hover:text-gold transition-colors">
                  <Phone className="w-3.5 h-3.5 text-gold" /> 9443710420
                </a>
                <a href="tel:9003549849" className="flex items-center gap-2 text-xs font-medium text-navy/70 hover:text-gold transition-colors">
                  <Phone className="w-3.5 h-3.5 text-gold" /> 9003549849
                </a>
              </div>
              <div className="bg-cream rounded-xl p-4 space-y-2">
                <p className="text-[10px] font-bold text-navy/40 uppercase tracking-wider">Room Pricing</p>
                <div className="space-y-1 text-xs text-navy/70 font-medium">
                  <div className="flex justify-between"><span>Non-AC Rooms</span><span className="font-bold text-navy">₹1,500/night</span></div>
                  <div className="flex justify-between"><span>AC Rooms</span><span className="font-bold text-navy">₹2,000/night</span></div>
                  <div className="flex justify-between"><span>Villa Room 110</span><span className="font-bold text-navy">₹2,500/night</span></div>
                  <div className="flex justify-between"><span>Suite Rooms</span><span className="font-bold text-navy">₹10,000/night</span></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Security Note */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3"
        >
          <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-amber-800">Security Tip</p>
            <p className="text-[11px] text-amber-700 font-medium mt-0.5">
              Use a strong password with letters, numbers and special characters. Change it regularly for better security.
            </p>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
