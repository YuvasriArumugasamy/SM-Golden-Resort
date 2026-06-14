import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarDays, BedDouble, CheckCircle2, XCircle,
  Clock, TrendingUp, RefreshCw, ExternalLink, IndianRupee,
} from "lucide-react";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import AdminLayout from "../../components/AdminLayout";

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.35 }}
    className="bg-white rounded-2xl border border-cream-dark p-5 shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex items-center justify-between mb-3">
      <p className="text-xs font-bold text-navy/50 uppercase tracking-wider">{label}</p>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-4.5 h-4.5" />
      </div>
    </div>
    <p className="text-3xl font-extrabold text-navy font-jakarta">{value}</p>
    <p className="text-[10px] text-emerald-500 font-bold mt-1">Real-time update</p>
  </motion.div>
);

const statusBadge = (status) => ({
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
}[status] || "bg-amber-50 text-amber-700 border-amber-200");

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, cancelled: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const res = await api.get("/api/admin/stats");
      setStats({
        total: res.data.total,
        pending: res.data.pending,
        confirmed: res.data.confirmed,
        cancelled: res.data.cancelled,
      });
      setRecent(res.data.recentBookings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const totalRevenue = recent.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-full"><LoadingSpinner /></div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-navy font-jakarta">Dashboard</h1>
            <p className="text-navy/50 text-sm mt-0.5">Work with real occupancy and data logs</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => load(true)}
              disabled={refreshing}
              className="flex items-center gap-2 bg-white border border-cream-dark text-navy/70 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-cream shadow-sm transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gold hover:bg-gold/90 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-all cursor-pointer">
              <ExternalLink className="w-3.5 h-3.5" />
              View Site
            </a>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={BedDouble} label="Total Rooms" value={11} color="bg-blue-50 text-blue-600" delay={0} />
          <StatCard icon={CalendarDays} label="Total Bookings" value={stats.total} color="bg-gold/10 text-gold" delay={0.05} />
          <StatCard icon={CheckCircle2} label="Confirmed" value={stats.confirmed} color="bg-emerald-50 text-emerald-600" delay={0.1} />
          <StatCard icon={Clock} label="Pending" value={stats.pending} color="bg-amber-50 text-amber-600" delay={0.15} />
        </div>

        {/* Revenue + Recent Bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Summary */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-cream-dark shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-navy font-jakarta text-sm">Revenue Summary</h3>
              <span className="text-lg font-extrabold text-gold font-jakarta">
                ₹{totalRevenue.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Mini bar chart */}
            <div className="space-y-3 mt-4">
              {[
                { label: "Confirmed", count: stats.confirmed, color: "bg-emerald-400", total: stats.total },
                { label: "Pending", count: stats.pending, color: "bg-amber-400", total: stats.total },
                { label: "Cancelled", count: stats.cancelled, color: "bg-red-400", total: stats.total },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs font-bold text-navy/60 mb-1">
                    <span>{item.label}</span>
                    <span>{item.count}</span>
                  </div>
                  <div className="h-2 bg-cream rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: item.total > 0 ? `${(item.count / item.total) * 100}%` : "0%" }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className={`h-full rounded-full ${item.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl border border-cream-dark shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-navy font-jakarta text-sm">Recent Bookings</h3>
              <Link to="/admin/bookings" className="text-xs font-bold text-gold hover:underline">View all</Link>
            </div>

            {recent.length === 0 ? (
              <p className="text-navy/40 text-sm text-center py-6">No bookings yet.</p>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-3 text-[10px] font-bold text-navy/40 uppercase tracking-wider pb-2 border-b border-cream-dark">
                  <span>Guest</span>
                  <span>Room</span>
                  <span className="text-right">Status</span>
                </div>
                {recent.slice(0, 5).map((b, i) => (
                  <motion.div
                    key={b._id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="grid grid-cols-3 items-center text-xs"
                  >
                    <div>
                      <p className="font-bold text-navy truncate">{b.guestName}</p>
                      <p className="text-navy/40 text-[10px]">{new Date(b.checkIn).toLocaleDateString("en-IN")}</p>
                    </div>
                    <p className="text-navy/60 font-medium truncate">{b.roomName}</p>
                    <div className="flex justify-end">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${statusBadge(b.status)}`}>
                        {b.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-cream-dark shadow-sm p-6"
        >
          <h3 className="font-extrabold text-navy font-jakarta text-sm mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/bookings"
              className="flex items-center gap-2 bg-navy text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-navy/90 transition-all shadow-sm">
              <CalendarDays className="w-3.5 h-3.5" /> Manage Bookings
            </Link>
            <Link to="/admin/rooms"
              className="flex items-center gap-2 bg-gold text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-gold/90 transition-all shadow-sm">
              <BedDouble className="w-3.5 h-3.5" /> View Rooms
            </Link>
            <Link to="/admin/settings"
              className="flex items-center gap-2 bg-white border border-cream-dark text-navy/70 text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-cream transition-all shadow-sm">
              Change Password
            </Link>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
