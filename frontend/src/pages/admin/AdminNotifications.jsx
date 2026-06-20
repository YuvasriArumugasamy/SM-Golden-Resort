import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AdminLayout from "../../components/AdminLayout";
import api from "../../api/axios";
import { RefreshCw, ExternalLink, Bell, Trash2 } from "lucide-react";

const fmt = (d) => d ? new Date(d).toLocaleString("en-IN", {
  day: "2-digit", month: "short", year: "numeric",
  hour: "2-digit", minute: "2-digit",
}) : "—";

export default function AdminNotifications() {
  const [bookings,       setBookings]       = useState([]);
  const [notifications,  setNotifications]  = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [refreshing,     setRefreshing]     = useState(false);

  const buildNotifications = (bookings) =>
    [...bookings]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(b => ({
        id:      b._id,
        title:   "🔥 New Paid Booking",
        message: `${b.guestName} booked ${b.roomName || b.roomType}.`,
        time:    fmt(b.createdAt),
      }));

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const res = await api.get("/api/bookings");
      const raw = Array.isArray(res.data) ? res.data : (res.data.bookings || []);
      setBookings(raw);
      setNotifications(buildNotifications(raw));
    } catch {}
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = (id) => setNotifications(prev => prev.filter(n => n.id !== id));
  const handleClearAll = () => setNotifications([]);

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 space-y-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">Notifications</h1>
            <p className="text-slate-400 text-sm mt-0.5">Work with real occupancy and data logs</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => fetchData(true)} disabled={refreshing}
              className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-slate-50 shadow-sm transition-all">
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} /> Refresh
            </button>
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-all">
              <ExternalLink className="w-3.5 h-3.5" /> View Site
            </a>
          </div>
        </div>

        {/* Actions */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-end">
            <button onClick={handleClearAll}
              className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl border border-red-200 transition-all">
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          </div>
        )}

        {/* Notifications List */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
            <Bell className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No notifications yet.</p>
            <p className="text-slate-300 text-xs mt-1">New bookings will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n, i) => (
              <motion.div key={n.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl border border-amber-200 shadow-sm p-4 flex items-start justify-between gap-4 hover:shadow-md transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                    <Bell className="w-4.5 h-4.5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-800 text-sm">{n.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                    <p className="text-[10px] text-slate-400 mt-1.5">{n.time}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(n.id)}
                  className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0 mt-0.5">
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
