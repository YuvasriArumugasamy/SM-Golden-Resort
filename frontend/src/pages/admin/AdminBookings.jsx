import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "../../components/AdminLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { RefreshCw, ExternalLink, Search, Trash2, MessageCircle, CheckCircle2, X, Plus, LogOut } from "lucide-react";

const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const STATUS_CLS = {
  confirmed:  "bg-emerald-100 text-emerald-700",
  pending:    "bg-amber-100 text-amber-700",
  cancelled:  "bg-red-100 text-red-600",
};

const StatusBadge = ({ status }) => (
  <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${STATUS_CLS[status?.toLowerCase()] || STATUS_CLS.pending}`}>
    {status || "pending"}
  </span>
);

/* ── Offline Booking Modal ── */
function OfflineModal({ isOpen, onClose, onSubmit, saving }) {
  const [form, setForm] = useState({
    name: "", phone: "", email: "", roomType: "Non-AC",
    checkIn: "", checkOut: "", checkInTime: "11:00", checkOutTime: "10:00", guests: 2,
  });
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <h2 className="font-extrabold text-slate-800">Add Offline Booking</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Guest Name *</label>
            <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              placeholder="Full name" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Phone *</label>
              <input required type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                placeholder="9876543210" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Room Type *</label>
              <select value={form.roomType} onChange={e => setForm({...form, roomType: e.target.value})}
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
              <input required type="date" min={today} value={form.checkIn} onChange={e => setForm({...form, checkIn: e.target.value})}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Check-in Time *</label>
              <input required type="time" value={form.checkInTime} onChange={e => setForm({...form, checkInTime: e.target.value})}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Check-out Date *</label>
              <input required type="date" min={form.checkIn || today} value={form.checkOut} onChange={e => setForm({...form, checkOut: e.target.value})}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Check-out Time *</label>
              <input required type="time" value={form.checkOutTime} onChange={e => setForm({...form, checkOutTime: e.target.value})}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400" />
            </div>
          </div>
          <button type="submit" disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-60">
            {saving ? "Adding…" : "Confirm Offline Booking"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminBookings() {
  const [bookings,     setBookings]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [refreshing,   setRefreshing]   = useState(false);
  const [activeTab,    setActiveTab]    = useState("All");
  const [searchTerm,   setSearchTerm]   = useState("");
  const [offlineModal, setOfflineModal] = useState(false);
  const [offlineSaving,setOfflineSaving]= useState(false);

  const fetchBookings = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const res = await api.get("/api/bookings");
      const raw = Array.isArray(res.data) ? res.data : (res.data.bookings || []);
      setBookings(raw);
    } catch { toast.error("Failed to fetch bookings"); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const tabs = ["All", "pending", "confirmed", "cancelled"];
  const filtered = bookings.filter(b => {
    const matchTab = activeTab === "All" || b.status?.toLowerCase() === activeTab;
    const term = searchTerm.toLowerCase().trim();
    const matchSearch = !term || (b.guestName || "").toLowerCase().includes(term) || (b.phone || "").includes(term);
    return matchTab && matchSearch;
  });

  const handleConfirm = async (b) => {
    if (!window.confirm(`Confirm booking for ${b.guestName}?`)) return;
    try {
      await api.patch(`/api/bookings/${b._id}/status`, { status: "confirmed" });
      toast.success("Booking confirmed!");
      const msg = `✅ *SM Golden Resorts – Booking Confirmed!*\n\nDear ${b.guestName},\n🛏️ Room: *${b.roomType || b.roomName}*\n📅 Check-in: *${fmt(b.checkIn)}*\n📅 Check-out: *${fmt(b.checkOut)}*\n\n📍 Old Falls Main Road, Courtallam\nThank you! 🙏`;
      const phone = (b.phone || "").replace(/[^0-9]/g, "");
      window.open(`https://wa.me/${phone.startsWith("91") ? phone : "91" + phone}?text=${encodeURIComponent(msg)}`, "_blank");
      fetchBookings(true);
    } catch { toast.error("Error confirming"); }
  };

  const handleCheckout = async (b) => {
    if (!window.confirm(`Complete check-out for ${b.guestName}?`)) return;
    try {
      await api.patch(`/api/bookings/${b._id}/status`, { status: "cancelled" });
      toast.success("Checked out!");
      const phone = (b.phone || "").replace(/[^0-9]/g, "");
      const msg = `Hello ${b.guestName}! 👋\n\nThank you for staying at *SM Golden Resorts*! 🏨\n\nWe hope you had a wonderful experience. We'd love to see you again!\n\n⭐ Please leave a review on Google!\n\n📍 Old Falls, Courtallam`;
      window.open(`https://wa.me/${phone.startsWith("91") ? phone : "91" + phone}?text=${encodeURIComponent(msg)}`, "_blank");
      fetchBookings(true);
    } catch { toast.error("Error checking out"); }
  };

  const handleWhatsApp = (b) => {
    const msg = `📋 *SM Golden Resorts – Booking Update*\n\nDear ${b.guestName},\n🛏️ Room: *${b.roomType || b.roomName}*\n📅 ${fmt(b.checkIn)} → ${fmt(b.checkOut)}\n📊 Status: *${b.status}*\n\nThank you! 🙏`;
    const phone = (b.phone || "").replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${phone.startsWith("91") ? phone : "91" + phone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleCancel = async (b) => {
    if (!window.confirm(`Cancel booking for ${b.guestName}?`)) return;
    try {
      await api.patch(`/api/bookings/${b._id}/status`, { status: "cancelled" });
      toast.success("Booking cancelled");
      fetchBookings(true);
    } catch { toast.error("Error cancelling"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this booking permanently?")) return;
    try {
      await api.delete(`/api/bookings/${id}`);
      toast.success("Booking deleted");
      fetchBookings(true);
    } catch { toast.error("Error deleting"); }
  };

  const handleOfflineSubmit = async (form) => {
    setOfflineSaving(true);
    try {
      await api.post("/api/bookings", {
        guestName: form.name, phone: form.phone,
        email: form.email || "no-email@smgoldenresorts.com",
        roomId: form.roomType, checkIn: form.checkIn,
        checkOut: form.checkOut, guests: form.guests,
      });
      setOfflineModal(false);
      toast.success("Offline booking added!");
      fetchBookings(true);
    } catch (err) { toast.error(err.response?.data?.message || "Error"); }
    finally { setOfflineSaving(false); }
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 space-y-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">Bookings</h1>
            <p className="text-slate-400 text-sm mt-0.5">Work with real occupancy and data logs</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => fetchBookings(true)} disabled={refreshing}
              className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-slate-50 shadow-sm transition-all">
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} /> Refresh
            </button>
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-all">
              <ExternalLink className="w-3.5 h-3.5" /> View Site
            </a>
          </div>
        </div>

        {/* Booking Management Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-800 text-base">Booking Management</h3>
            <button onClick={() => setOfflineModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all shrink-0">
              <Plus className="w-3.5 h-3.5" /> Add Offline Booking
            </button>
          </div>

          {/* Tabs + Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-3 border-b border-slate-100">
            <div className="flex gap-1 overflow-x-auto">
              {tabs.map(t => (
                <button key={t} onClick={() => setActiveTab(t)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all ${
                    activeTab === t ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-100"
                  }`}>
                  {t} ({t === "All" ? bookings.length : bookings.filter(b => b.status?.toLowerCase() === t).length})
                </button>
              ))}
            </div>
            <div className="relative w-full sm:max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search guest or phone..."
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-400 bg-slate-50" />
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="py-16 flex items-center justify-center"><LoadingSpinner /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    <th className="py-3 px-4 text-left">#</th>
                    <th className="py-3 px-4 text-left">Guest</th>
                    <th className="py-3 px-4 text-left">Phone</th>
                    <th className="py-3 px-4 text-left">Room</th>
                    <th className="py-3 px-4 text-left">Check-In/Out</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7} className="py-14 text-center text-slate-400 text-sm">No bookings found.</td></tr>
                  ) : filtered.map((b, i) => (
                    <tr key={b._id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono text-[10px] text-blue-600 font-bold">#{(() => { try { const num = parseInt(b._id?.slice(-8), 16); return String(Math.abs(num) % 1000000).padStart(6, "0"); } catch { return b._id?.slice(-6); } })()}</td>
                      <td className="py-3 px-4">
                        <p className="font-extrabold text-slate-800 text-sm">{b.guestName}</p>
                        {b.email && <p className="text-[10px] text-slate-400">{b.email}</p>}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600">{b.phone}</td>
                      <td className="py-3 px-4">
                        <p className="text-xs font-semibold text-slate-700">{b.roomName || b.roomType}</p>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500">
                        <p>{fmt(b.checkIn)}</p>
                        <p>→ {fmt(b.checkOut)}</p>
                        <p className="text-[10px] font-bold text-blue-600">{b.nights} night{b.nights > 1 ? "s" : ""}</p>
                      </td>
                      <td className="py-3 px-4"><StatusBadge status={b.status} /></td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1 min-w-[130px]">
                          {b.status?.toLowerCase() === "confirmed" && (
                            <button onClick={() => handleCheckout(b)}
                              className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg transition-all">
                              <LogOut className="w-3 h-3" /> Check-out
                            </button>
                          )}
                          {b.status?.toLowerCase() === "pending" && (
                            <button onClick={() => handleConfirm(b)}
                              className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold rounded-lg transition-all">
                              <CheckCircle2 className="w-3 h-3" /> Confirm
                            </button>
                          )}
                          <button onClick={() => handleWhatsApp(b)}
                            className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-[10px] font-bold rounded-lg transition-all">
                            <MessageCircle className="w-3 h-3" /> WhatsApp Guest
                          </button>
                          {(b.status?.toLowerCase() === "pending" || b.status?.toLowerCase() === "confirmed") && (
                            <button onClick={() => handleCancel(b)}
                              className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-bold rounded-lg border border-red-200 transition-all">
                              <X className="w-3 h-3" /> Cancel Booking
                            </button>
                          )}
                          <button onClick={() => handleDelete(b._id)}
                            className="flex items-center justify-center gap-1.5 py-1.5 px-3 text-slate-400 hover:text-red-500 text-[10px] font-bold transition-all">
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <OfflineModal isOpen={offlineModal} onClose={() => setOfflineModal(false)} onSubmit={handleOfflineSubmit} saving={offlineSaving} />
    </AdminLayout>
  );
}
