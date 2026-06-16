import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, BedDouble, CalendarDays, Users, CreditCard,
  Settings, LogOut, ExternalLink, RefreshCw, Plus, Trash2,
  CheckCircle2, XCircle, Clock, X, MessageCircle, TrendingUp,
  Eye, EyeOff, Lock, Shield, Phone, MapPin,
} from "lucide-react";
import api from "../../api/axios";
import AdminLayout from "../../components/AdminLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../hooks/useAuth";

/* ── helpers ── */
const fmt = (d) => d
  ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
  : "—";

const STATUS_CLS = {
  confirmed:    "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending:      "bg-amber-50  text-amber-700  border-amber-200",
  cancelled:    "bg-red-50    text-red-600    border-red-200",
  "checked-out":"bg-blue-50   text-blue-700   border-blue-200",
};
const StatusPill = ({ status = "pending" }) => (
  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide
    ${STATUS_CLS[status?.toLowerCase()] || STATUS_CLS.pending}`}>
    {status}
  </span>
);

/* ── Modal ── */
const Modal = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }} transition={{ type: "spring", duration: 0.3 }}
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <h2 className="font-extrabold text-slate-800 text-base">{title}</h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </div>
  );
};

/* ── Stat Card ── */
const StatCard = ({ icon: Icon, label, value, sub, color, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay }} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-all">
    <div className="flex items-start justify-between mb-3">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
    </div>
    <p className="text-3xl font-extrabold text-slate-800 leading-none">{value ?? "—"}</p>
    <p className="text-[10px] text-emerald-500 font-bold mt-2 flex items-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
      {sub || "Real-time update"}
    </p>
  </motion.div>
);

/* ══════════ PAGE HEADER ══════════ */
const PageHeader = ({ title, subtitle, onRefresh, refreshing }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div>
      <h1 className="text-xl font-extrabold text-slate-800">{title}</h1>
      <p className="text-slate-400 text-xs mt-0.5">{subtitle || "Work with real occupancy and data logs"}</p>
    </div>
    <div className="flex items-center gap-2 shrink-0">
      {onRefresh && (
        <button onClick={onRefresh} disabled={refreshing}
          className="flex items-center gap-2 border border-slate-200 bg-white text-slate-600 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-all shadow-sm disabled:opacity-60">
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} /> Refresh
        </button>
      )}
      <a href="/" target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-all">
        <ExternalLink className="w-3.5 h-3.5" /> View Site
      </a>
    </div>
  </div>
);

/* ══════════ OVERVIEW ══════════ */
function Overview({ stats, bookings }) {
  const total     = stats?.totalBookings ?? 0;
  const confirmed = stats?.confirmed     ?? 0;
  const pending   = stats?.pending       ?? 0;
  const cancelled = stats?.cancelled     ?? 0;
  const revenue   = bookings.reduce((s, b) => s + (b.totalPrice || 0), 0);
  const recent    = [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);
  const today     = new Date().toDateString();
  const todayIn   = bookings.filter(b => new Date(b.checkIn).toDateString() === today).length;
  const todayOut  = bookings.filter(b => new Date(b.checkOut).toDateString() === today).length;

  return (
    <div className="space-y-5">
      {/* Stat row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BedDouble}    label="Total Rooms"    value={stats?.totalRooms ?? 11} color="bg-blue-50 text-blue-600"      delay={0}    />
        <StatCard icon={CalendarDays} label="Total Bookings" value={total}                   color="bg-violet-50 text-violet-600"  delay={0.05} />
        <StatCard icon={CheckCircle2} label="Available Rooms"value={stats?.totalRooms ?? 11} color="bg-emerald-50 text-emerald-600"delay={0.1}  />
        <StatCard icon={Clock}        label="Today Check-ins" value={todayIn}                color="bg-amber-50 text-amber-600"    delay={0.15} />
      </div>
      {/* Stat row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={XCircle}    label="Today Check-outs" value={todayOut}   color="bg-red-50 text-red-500"          delay={0.2}  />
        <StatCard icon={Clock}      label="Pending"          value={pending}    color="bg-orange-50 text-orange-600"    delay={0.25} />
        <StatCard icon={TrendingUp} label="Total Revenue"    value={`₹${revenue.toLocaleString("en-IN")}`} color="bg-teal-50 text-teal-600" delay={0.3} />
      </div>

      {/* Revenue + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Revenue bars */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-extrabold text-slate-800 text-sm">Revenue Summary</h3>
            <span className="text-lg font-extrabold text-blue-600">₹{revenue.toLocaleString("en-IN")}</span>
          </div>
          <div className="space-y-4">
            {[
              { label: "Confirmed", count: confirmed, color: "bg-emerald-500" },
              { label: "Pending",   count: pending,   color: "bg-amber-400"   },
              { label: "Cancelled", count: cancelled, color: "bg-red-400"     },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1.5">
                  <span>{item.label}</span><span className="font-bold text-slate-700">{item.count}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }}
                    animate={{ width: total > 0 ? `${(item.count / total) * 100}%` : "0%" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full rounded-full ${item.color}`} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Bookings */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-slate-800 text-sm">Recent Bookings</h3>
            <Link to="/admin/bookings" className="text-xs font-bold text-blue-600 hover:underline">View all →</Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">No bookings yet.</p>
          ) : (
            <div className="space-y-3">
              {recent.map((b, i) => (
                <div key={b._id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="font-bold text-slate-800 text-xs">{b.guestName || "—"}</p>
                    <p className="text-[10px] text-slate-400">{fmt(b.checkIn)} → {fmt(b.checkOut)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <p className="text-xs font-bold text-blue-600">₹{(b.totalPrice || 0).toLocaleString("en-IN")}</p>
                    <StatusPill status={b.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-extrabold text-slate-800 text-sm mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/bookings"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all">
            <CalendarDays className="w-3.5 h-3.5" /> Manage Bookings
          </Link>
          <Link to="/admin/rooms"
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all">
            <BedDouble className="w-3.5 h-3.5" /> View Rooms
          </Link>
          <Link to="/admin/guests"
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-slate-50 shadow-sm transition-all">
            <Users className="w-3.5 h-3.5" /> Guest Records
          </Link>
          <Link to="/admin/settings"
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-slate-50 shadow-sm transition-all">
            <Settings className="w-3.5 h-3.5" /> Settings
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

/* ══════════ BOOKING MANAGEMENT ══════════ */
function BookingMgmt({ bookings, onConfirm, onCancel, onWhatsApp, onDelete, onAddOffline }) {
  const [filter, setFilter] = useState("All");
  const tabs = ["All", "pending", "confirmed", "cancelled"];
  const filtered = filter === "All" ? bookings : bookings.filter(b => b.status?.toLowerCase() === filter);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-100">
          <h3 className="font-extrabold text-slate-800">All Bookings</h3>
          <button onClick={onAddOffline}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all shrink-0">
            <Plus className="w-3.5 h-3.5" /> Add Offline Booking
          </button>
        </div>
        <div className="flex gap-1 px-6 py-3 border-b border-slate-100 overflow-x-auto">
          {tabs.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all ${
                filter === t ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"
              }`}>
              {t} {t === "All" ? `(${bookings.length})` : `(${bookings.filter(b => b.status?.toLowerCase() === t).length})`}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="py-3 px-5 text-left">#ID</th>
                <th className="py-3 px-5 text-left">Guest</th>
                <th className="py-3 px-5 text-left">Room</th>
                <th className="py-3 px-5 text-left">Dates</th>
                <th className="py-3 px-5 text-left">Amount</th>
                <th className="py-3 px-5 text-left">Status</th>
                <th className="py-3 px-5 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-14 text-center text-slate-400 text-sm">No bookings found.</td></tr>
              ) : filtered.map((b, i) => (
                <tr key={b._id} className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors">
                  <td className="px-5 py-4 font-mono text-[10px] text-slate-400 font-bold">#{b._id?.slice(-6).toUpperCase()}</td>
                  <td className="px-5 py-4">
                    <p className="font-extrabold text-slate-800 text-sm">{b.guestName || "—"}</p>
                    <p className="text-xs text-slate-400">{b.phone}</p>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-600 font-medium">{b.roomName || b.roomType}</td>
                  <td className="px-5 py-4 text-xs text-slate-500">
                    <p>{fmt(b.checkIn)}</p>
                    <p className="text-slate-400">→ {fmt(b.checkOut)}</p>
                  </td>
                  <td className="px-5 py-4 font-extrabold text-blue-600 text-sm">₹{(b.totalPrice || 0).toLocaleString("en-IN")}</td>
                  <td className="px-5 py-4"><StatusPill status={b.status} /></td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {b.status?.toLowerCase() === "pending" && (
                        <button onClick={() => onConfirm(b._id, b)}
                          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold rounded-lg transition-all">
                          ✓ Confirm
                        </button>
                      )}
                      <button onClick={() => onWhatsApp(b)}
                        className="px-3 py-1.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-[10px] font-bold rounded-lg transition-all">
                        WhatsApp
                      </button>
                      {(b.status?.toLowerCase() === "pending" || b.status?.toLowerCase() === "confirmed") && (
                        <button onClick={() => onCancel(b._id)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-bold rounded-lg border border-red-200 transition-all">
                          Cancel
                        </button>
                      )}
                      <button onClick={() => onDelete(b._id)}
                        className="px-3 py-1.5 text-slate-400 hover:text-red-500 text-[10px] font-bold transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ══════════ SETTINGS ══════════ */
function InlineSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurr, setShowCurr] = useState(false);
  const [showNew,  setShowNew]  = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [loading,  setLoading]  = useState(false);

  const handleChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { alert("Passwords do not match"); return; }
    if (newPassword.length < 6) { alert("Min 6 characters"); return; }
    setLoading(true);
    try {
      await api.post("/api/admin/change-password", { currentPassword, newPassword });
      alert("Password changed! Please login again.");
      localStorage.removeItem("adminToken");
      window.location.href = "/admin/login";
    } catch (err) { alert(err.response?.data?.message || "Error"); }
    finally { setLoading(false); }
  };

  const Field = ({ label, value, onChange, show, onToggle, placeholder }) => (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
      <div className="relative">
        <input type={show ? "text" : "password"} value={value} onChange={onChange} placeholder={placeholder}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 pr-12" required />
        <button type="button" onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Lock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm">Change Password</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Update your admin login password</p>
          </div>
        </div>
        <form onSubmit={handleChange} className="space-y-4">
          <Field label="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} show={showCurr} onToggle={() => setShowCurr(!showCurr)} placeholder="Enter current password" />
          <Field label="New Password"     value={newPassword}     onChange={e => setNewPassword(e.target.value)}     show={showNew}  onToggle={() => setShowNew(!showNew)}   placeholder="Min 6 characters" />
          <Field label="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} show={showConf} onToggle={() => setShowConf(!showConf)} placeholder="Re-enter new password" />
          {confirmPassword && newPassword && confirmPassword !== newPassword && (
            <p className="text-xs text-red-500 font-bold">Passwords do not match</p>
          )}
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl transition-all shadow disabled:opacity-60 flex items-center justify-center gap-2 text-sm">
            {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Updating…</> : <><Shield className="w-4 h-4" /> Update Password</>}
          </button>
        </form>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="font-extrabold text-slate-800 text-sm mb-2">Resort Info</h3>
        {[
          ["Resort Name", "SM Golden Resorts"],
          ["Location", "Old Falls Main Road, Courtallam, Tamil Nadu"],
          ["Phone 1", "9443710420"],
          ["Phone 2", "9003549849"],
        ].map(([k, v]) => (
          <div key={k} className="bg-slate-50 rounded-xl px-4 py-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{k}</p>
            <p className="text-sm font-semibold text-slate-800">{v}</p>
          </div>
        ))}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-2.5">
          <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 font-medium">Use a strong password with letters, numbers and special characters for better security.</p>
        </div>
      </div>
    </div>
  );
}

/* ══════════ MAIN ══════════ */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [activeTab,    setActiveTab]    = useState("overview");
  const [stats,        setStats]        = useState(null);
  const [bookings,     setBookings]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [refreshing,   setRefreshing]   = useState(false);
  const [offlineModal, setOfflineModal] = useState(false);
  const [offlineForm,  setOfflineForm]  = useState({
    name: "", phone: "", email: "", roomType: "Non-AC",
    checkIn: "", checkOut: "", checkInTime: "", checkOutTime: "", guests: 2,
  });
  const [offlineSaving, setOfflineSaving] = useState(false);
  const todayStr = new Date().toISOString().split("T")[0];

  const fetchData = useCallback(async (isRefresh = false) => {
    const token = localStorage.getItem("adminToken");
    if (!token) { navigate("/admin/login"); return; }
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const [statsRes, bookRes] = await Promise.allSettled([
        api.get("/api/admin/stats"),
        api.get("/api/bookings"),
      ]);
      if (statsRes.status === "fulfilled") {
        const d = statsRes.value.data;
        setStats({ totalRooms: 11, totalBookings: d.total ?? 0, confirmed: d.confirmed ?? 0, pending: d.pending ?? 0, cancelled: d.cancelled ?? 0 });
      }
      if (bookRes.status === "fulfilled") {
        const raw = Array.isArray(bookRes.value.data) ? bookRes.value.data : (bookRes.value.data.bookings || []);
        setBookings(raw);
      }
    } catch (err) {
      if (err?.response?.status === 401) navigate("/admin/login");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [navigate]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleConfirm = async (id, b) => {
    if (!window.confirm(`Confirm booking for ${b.guestName}?`)) return;
    try {
      await api.patch(`/api/bookings/${id}/status`, { status: "confirmed" });
      const msg = `✅ *SM Golden Resorts – Booking Confirmed!*\n\nDear ${b.guestName},\n🛏️ Room: *${b.roomType || b.roomName}*\n📅 Check-in: *${fmt(b.checkIn)}*\n📅 Check-out: *${fmt(b.checkOut)}*\n\n📍 Old Falls Main Road, Courtallam\nThank you! 🙏`;
      const phone = (b.phone || "").replace(/[^0-9]/g, "");
      window.open(`https://wa.me/${phone.startsWith("91") ? phone : "91" + phone}?text=${encodeURIComponent(msg)}`, "_blank");
      fetchData(true);
    } catch { alert("Error confirming booking"); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try { await api.patch(`/api/bookings/${id}/status`, { status: "cancelled" }); fetchData(true); }
    catch { alert("Error cancelling booking"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this booking permanently?")) return;
    try { await api.delete(`/api/bookings/${id}`); fetchData(true); }
    catch { alert("Error deleting booking"); }
  };

  const handleWhatsApp = (b) => {
    const msg = `📋 *SM Golden Resorts – Booking Update*\n\nDear ${b.guestName},\n🛏️ Room: *${b.roomType || b.roomName}*\n📅 ${fmt(b.checkIn)} → ${fmt(b.checkOut)}\n📊 Status: *${b.status}*\n\nThank you! 🙏`;
    const phone = (b.phone || "").replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${phone.startsWith("91") ? phone : "91" + phone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleOfflineSubmit = async (e) => {
    e.preventDefault();
    if (!offlineForm.name || !offlineForm.phone || !offlineForm.checkIn || !offlineForm.checkOut) return alert("Fill required fields");
    setOfflineSaving(true);
    try {
      await api.post("/api/bookings", {
        guestName: offlineForm.name, phone: offlineForm.phone,
        email: offlineForm.email || "no-email@smgoldenresorts.com",
        roomId: offlineForm.roomType, checkIn: offlineForm.checkIn,
        checkOut: offlineForm.checkOut, guests: offlineForm.guests,
        checkInTime: offlineForm.checkInTime, checkOutTime: offlineForm.checkOutTime,
      });
      setOfflineModal(false);
      setOfflineForm({ name: "", phone: "", email: "", roomType: "Non-AC", checkIn: "", checkOut: "", checkInTime: "", checkOutTime: "", guests: 2 });
      fetchData(true);
      alert("Offline booking added!");
    } catch (err) { alert(err.response?.data?.message || "Error"); }
    finally { setOfflineSaving(false); }
  };

  const NAV_TABS = [
    { id: "overview",  label: "Dashboard",  icon: LayoutDashboard },
    { id: "bookings",  label: "Bookings",   icon: CalendarDays },
    { id: "settings",  label: "Settings",   icon: Settings },
  ];

  const titles = { overview: "Overview", bookings: "Bookings", settings: "Settings" };

  return (
    <AdminLayout>
      {loading ? (
        <div className="flex items-center justify-center h-full p-20"><LoadingSpinner /></div>
      ) : (
        <div className="p-4 md:p-6 space-y-4">
          {/* Header */}
          <PageHeader title={titles[activeTab]} onRefresh={() => fetchData(true)} refreshing={refreshing} />

          {/* Sub nav */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-2.5 flex gap-1 overflow-x-auto">
            {NAV_TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === id ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"
                }`}>
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === "overview"  && <Overview stats={stats} bookings={bookings} />}
          {activeTab === "bookings"  && <BookingMgmt bookings={bookings} onConfirm={handleConfirm} onCancel={handleCancel} onWhatsApp={handleWhatsApp} onDelete={handleDelete} onAddOffline={() => setOfflineModal(true)} />}
          {activeTab === "settings"  && <InlineSettings />}
        </div>
      )}

      {/* Offline Booking Modal */}
      <AnimatePresence>
        {offlineModal && (
          <Modal title="Add Offline Booking" isOpen={offlineModal} onClose={() => setOfflineModal(false)}>
            <form onSubmit={handleOfflineSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Guest Name *</label>
                <input required type="text" value={offlineForm.name} onChange={e => setOfflineForm({...offlineForm, name: e.target.value})}
                  placeholder="Full name" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Phone *</label>
                  <input required type="text" value={offlineForm.phone} onChange={e => setOfflineForm({...offlineForm, phone: e.target.value})}
                    placeholder="9876543210" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Room Type *</label>
                  <select value={offlineForm.roomType} onChange={e => setOfflineForm({...offlineForm, roomType: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400">
                    <option value="Non-AC">Double Bed Non-AC</option>
                    <option value="AC">Double Bed AC</option>
                    <option value="Villa">Villa</option>
                    <option value="Suite AC">Suite Room</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Check-in Date *</label>
                  <input required type="date" min={todayStr} value={offlineForm.checkIn} onChange={e => setOfflineForm({...offlineForm, checkIn: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Check-in Time *</label>
                  <input required type="time" value={offlineForm.checkInTime} onChange={e => setOfflineForm({...offlineForm, checkInTime: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Check-out Date *</label>
                  <input required type="date" min={offlineForm.checkIn || todayStr} value={offlineForm.checkOut} onChange={e => setOfflineForm({...offlineForm, checkOut: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Check-out Time *</label>
                  <input required type="time" value={offlineForm.checkOutTime} onChange={e => setOfflineForm({...offlineForm, checkOutTime: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>
              </div>
              <button type="submit" disabled={offlineSaving}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-sm disabled:opacity-60">
                {offlineSaving ? "Adding…" : "Confirm Offline Booking"}
              </button>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
