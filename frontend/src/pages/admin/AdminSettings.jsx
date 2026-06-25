import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AdminLayout from "../../components/AdminLayout";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { requestPermission, listenForegroundMessages } from "../../notification";
import {
  Lock, Eye, EyeOff, Shield, RefreshCw, ExternalLink,
  CheckCircle2, Info, Phone, MapPin, Bell
} from "lucide-react";

export default function AdminSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent,     setShowCurrent]     = useState(false);
  const [showNew,         setShowNew]         = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [loading,         setLoading]         = useState(false);

  // Push Notification state
  const [notifPermission, setNotifPermission] = useState("default");
  const [notifLoading,    setNotifLoading]    = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  const handleEnableAlerts = async () => {
    if (!("Notification" in window)) {
      toast.error("Your browser doesn't support notifications"); return;
    }
    setNotifLoading(true);
    try {
      const token = await requestPermission();
      const perm = Notification.permission;
      setNotifPermission(perm);
      if (perm === "granted" && token) {
        listenForegroundMessages();
        toast.success("Push notifications enabled! ✅ Token saved.");
      } else if (perm === "denied") {
        toast.error("Notifications blocked. Please allow in browser settings.");
      } else {
        toast.error("Notification permission dismissed.");
      }
    } catch {
      toast.error("Failed to enable notifications.");
    } finally {
      setNotifLoading(false);
    }
  };

  const handleTestNotification = () => {
    if (notifPermission !== "granted") {
      toast.error("Please enable notifications first"); return;
    }
    new Notification("SM Golden Resorts 🏨", {
      body: "Test: New booking received! Check your dashboard.",
      icon: "/WhatsApp Image 2026-06-22 at 18.04.13.jpeg",
    });
    toast.success("Test notification sent!");
  };
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all fields"); return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match"); return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters"); return;
    }
    setLoading(true);
    try {
      const res = await api.post("/api/admin/change-password", { currentPassword, newPassword });
      toast.success(res.data.message || "Password changed successfully!");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none bg-white text-slate-800 placeholder-slate-400 transition-all pr-12";

  const PwdField = ({ label, value, onChange, show, onToggle, placeholder }) => (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
      <div className="relative">
        <input type={show ? "text" : "password"} value={value} onChange={onChange}
          placeholder={placeholder} className={inputBase} required />
        <button type="button" onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">Settings</h1>
            <p className="text-slate-400 text-sm mt-0.5">Manage your admin account</p>
          </div>
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-all w-fit">
            <ExternalLink className="w-3.5 h-3.5" /> View Site
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Push Notifications ── */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="lg:col-span-2 bg-blue-50 rounded-2xl border border-blue-100 shadow-sm p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">Push Notifications</h3>
                  <p className="text-slate-500 text-xs mt-0.5 max-w-md">
                    Receive instant alerts on this device when a new booking is requested or paid.
                  </p>
                  <p className={`text-xs font-bold mt-1.5 ${
                    notifPermission === "granted" ? "text-emerald-600" :
                    notifPermission === "denied"  ? "text-red-500" :
                    "text-amber-600"
                  }`}>
                    Status: {
                      notifPermission === "granted" ? "✅ Enabled" :
                      notifPermission === "denied"  ? "❌ Denied" :
                      "⚠️ Not set"
                    }
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={handleEnableAlerts}
                  disabled={notifLoading || notifPermission === "granted"}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-sm"
                >
                  {notifLoading ? "Requesting..." : notifPermission === "granted" ? "✅ Alerts Enabled" : "Enable Alerts"}
                </button>
                <button
                  onClick={handleTestNotification}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Bell className="w-3.5 h-3.5" /> Test Notification
                </button>
              </div>
            </div>
          </motion.div>

          {/* ── Change Password ── */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Lock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm">Change Password</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Update your admin login password</p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <PwdField label="Current Password"  value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                show={showCurrent} onToggle={() => setShowCurrent(!showCurrent)} placeholder="Enter current password" />
              <PwdField label="New Password"       value={newPassword}     onChange={e => setNewPassword(e.target.value)}
                show={showNew}     onToggle={() => setShowNew(!showNew)}         placeholder="Min. 6 characters" />

              {/* Confirm field with match hint */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <input type={showConfirm ? "text" : "password"} value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password" className={inputBase} required />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
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

              <button type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-6 rounded-xl transition-all shadow disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm mt-2">
                {loading
                  ? <><RefreshCw className="w-4 h-4 animate-spin" /> Updating...</>
                  : <><Shield className="w-4 h-4" /> Update Password</>}
              </button>
            </form>
          </motion.div>

        </div>

        {/* Security Note */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
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
