import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import AdminLayout from "../../components/AdminLayout";
import api from "../../api/axios";
import { RefreshCw, ExternalLink, TrendingUp, BarChart2, CheckCircle2 } from "lucide-react";

const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

export default function AdminReports() {
  const [bookings,  setBookings]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [refreshing,setRefreshing]= useState(false);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const res = await api.get("/api/bookings");
      setBookings(Array.isArray(res.data) ? res.data : (res.data.bookings || []));
    } catch {}
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── Compute stats ── */
  const total     = bookings.length;
  const confirmed = bookings.filter(b => b.status === "confirmed").length;
  const revenue   = bookings.reduce((s, b) => s + (b.totalPrice || 0), 0);
  const avgRev    = total > 0 ? Math.round(revenue / total) : 0;
  const confRate  = total > 0 ? ((confirmed / total) * 100).toFixed(1) : "0.0";

  /* ── Occupancy by room type ── */
  const roomTypeMap = {};
  bookings.forEach(b => {
    const t = b.roomType || b.roomName || "Unknown";
    roomTypeMap[t] = (roomTypeMap[t] || 0) + 1;
  });
  const roomTypes = Object.entries(roomTypeMap).sort((a, b) => b[1] - a[1]);
  const maxCount  = Math.max(...roomTypes.map(r => r[1]), 1);

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 space-y-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">Reports</h1>
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

        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Occupancy by Room Type — chart */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-extrabold text-slate-800">Occupancy by Room Type</h3>
                <span className="text-xs text-blue-600 font-bold">All bookings</span>
              </div>
              {roomTypes.length === 0 ? (
                <div className="h-40 flex items-center justify-center text-slate-400 text-sm">No data yet.</div>
              ) : (
                <div className="flex items-end gap-4 h-48 px-2">
                  {roomTypes.map(([type, count], i) => (
                    <div key={type} className="flex flex-col items-center gap-2 flex-1">
                      <span className="text-xs font-extrabold text-slate-700">{count}</span>
                      <motion.div
                        initial={{ height: 0 }} animate={{ height: `${(count / maxCount) * 160}px` }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.1 }}
                        className="w-full rounded-t-lg bg-blue-500"
                        style={{ minHeight: "8px" }}
                      />
                      <span className="text-[10px] text-slate-500 font-medium text-center leading-tight">{type}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Key Metrics */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="space-y-4">

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">AVG REV / BOOKING</p>
                <p className="text-3xl font-extrabold text-slate-800">₹{avgRev.toLocaleString("en-IN")}</p>
                <p className="text-xs text-slate-400 mt-1">Based on {total} booking{total !== 1 ? "s" : ""}</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">CONFIRMATION RATE</p>
                <p className="text-3xl font-extrabold text-slate-800">{confRate}%</p>
                <p className="text-xs text-slate-400 mt-1">{confirmed} of {total} confirmed</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">TOTAL REVENUE</p>
                <p className="text-2xl font-extrabold text-blue-600">₹{revenue.toLocaleString("en-IN")}</p>
                <p className="text-xs text-slate-400 mt-1">All confirmed bookings</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">TOTAL BOOKINGS</p>
                <p className="text-3xl font-extrabold text-slate-800">{total}</p>
                <p className="text-xs text-emerald-500 font-bold mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" /> Real-time
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
