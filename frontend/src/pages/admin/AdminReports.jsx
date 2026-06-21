import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import AdminLayout from "../../components/AdminLayout";
import api from "../../api/axios";
import { RefreshCw, ExternalLink, TrendingUp, CheckCircle2, XCircle, Clock } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "—";
const fmtMonth = (d) => d ? new Date(d).toLocaleDateString("en-IN", { month: "short", year: "2-digit" }) : "—";

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
  const pending   = bookings.filter(b => b.status === "pending").length;
  const cancelled = bookings.filter(b => b.status === "cancelled").length;
  const revenue   = bookings.reduce((s, b) => s + (b.totalPrice || 0), 0);
  const avgRev    = total > 0 ? Math.round(revenue / total) : 0;
  const confRate  = total > 0 ? ((confirmed / total) * 100).toFixed(1) : "0.0";

  /* ── Monthly Revenue Data ── */
  const monthlyMap = {};
  bookings.forEach(b => {
    const month = fmtMonth(b.createdAt || b.checkIn);
    if (!monthlyMap[month]) monthlyMap[month] = { month, revenue: 0, bookings: 0 };
    monthlyMap[month].revenue  += b.totalPrice || 0;
    monthlyMap[month].bookings += 1;
  });
  const monthlyData = Object.values(monthlyMap).slice(-6);

  /* ── Occupancy by Room Type ── */
  const roomTypeMap = {};
  bookings.forEach(b => {
    const t = b.roomType || "Unknown";
    roomTypeMap[t] = (roomTypeMap[t] || 0) + 1;
  });
  const roomTypeData = Object.entries(roomTypeMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  /* ── Status Distribution ── */
  const statusData = [
    { name: "Confirmed", value: confirmed, color: "#10b981" },
    { name: "Pending",   value: pending,   color: "#f59e0b" },
    { name: "Cancelled", value: cancelled, color: "#ef4444" },
  ].filter(d => d.value > 0);

  /* ── Daily bookings last 7 days ── */
  const dailyMap = {};
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = fmt(d);
    dailyMap[key] = { day: key, bookings: 0, revenue: 0 };
  }
  bookings.forEach(b => {
    const day = fmt(b.createdAt || b.checkIn);
    if (dailyMap[day]) {
      dailyMap[day].bookings += 1;
      dailyMap[day].revenue  += b.totalPrice || 0;
    }
  });
  const dailyData = Object.values(dailyMap);

  const StatCard = ({ icon: Icon, label, value, color, delay = 0 }) => (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-3xl font-extrabold text-slate-800 leading-none">{value ?? "—"}</p>
      <p className="text-[10px] text-emerald-500 font-bold mt-2 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
        Real-time
      </p>
    </motion.div>
  );

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">Reports</h1>
            <p className="text-slate-400 text-sm mt-0.5">Real-time analytics and performance insights</p>
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
          <>
            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={TrendingUp}    label="Total Revenue"     value={`₹${revenue.toLocaleString("en-IN")}`} color="bg-blue-50 text-blue-600"    delay={0}    />
              <StatCard icon={CheckCircle2}  label="Confirmed"         value={confirmed}   color="bg-emerald-50 text-emerald-600" delay={0.05} />
              <StatCard icon={Clock}         label="Avg Rev / Booking" value={`₹${avgRev.toLocaleString("en-IN")}`} color="bg-violet-50 text-violet-600"  delay={0.1}  />
              <StatCard icon={XCircle}       label="Confirmation Rate" value={`${confRate}%`} color="bg-amber-50 text-amber-600"  delay={0.15} />
            </div>

            {/* ── Monthly Revenue Bar Chart ── */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-extrabold text-slate-800 mb-5">Monthly Revenue</h3>
              {monthlyData.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No data yet.</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]} />
                    <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </motion.div>

            {/* ── Daily Bookings Line Chart + Status Pie ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Daily bookings */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-extrabold text-slate-800 mb-5">Daily Bookings (Last 7 Days)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={dailyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4, fill: "#3b82f6" }} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Status Pie */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-extrabold text-slate-800 mb-5">Booking Status Distribution</h3>
                {statusData.length === 0 ? (
                  <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No data yet.</div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={statusData} cx="50%" cy="50%" outerRadius={75} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                        {statusData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v, n) => [v, n]} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </motion.div>
            </div>

            {/* ── Occupancy by Room Type Bar ── */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-extrabold text-slate-800 mb-5">Occupancy by Room Type</h3>
              {roomTypeData.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No data yet.</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={roomTypeData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {roomTypeData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </motion.div>

            {/* ── Key Metrics ── */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Total Bookings", value: total },
                { label: "Cancelled",      value: cancelled },
                { label: "Pending",        value: pending },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</p>
                  <p className="text-3xl font-extrabold text-slate-800">{value}</p>
                </div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
