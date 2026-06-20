import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import AdminLayout from "../../components/AdminLayout";
import api from "../../api/axios";
import { RefreshCw, ExternalLink, TrendingUp, CreditCard } from "lucide-react";

const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

export default function AdminPayments() {
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

  const totalRevenue = bookings.reduce((s, b) => s + (b.totalPrice || 0), 0);
  const activePayments = bookings.filter(b => b.status !== "cancelled").length;

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 space-y-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">Payments</h1>
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
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">TOTAL REVENUE</p>
                <p className="text-3xl font-extrabold text-slate-800">₹{totalRevenue.toLocaleString("en-IN")}</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">ACTIVE PAYMENTS</p>
                <p className="text-3xl font-extrabold text-slate-800">{activePayments}</p>
              </motion.div>
            </div>

            {/* Transaction History */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-800">Transaction History</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      <th className="py-3 px-6 text-left">Guest</th>
                      <th className="py-3 px-6 text-left">Date</th>
                      <th className="py-3 px-6 text-left">Amount</th>
                      <th className="py-3 px-6 text-left">Method</th>
                      <th className="py-3 px-6 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.length === 0 ? (
                      <tr><td colSpan={5} className="py-12 text-center text-slate-400 text-sm">No payment records.</td></tr>
                    ) : bookings.map((b, i) => (
                      <motion.tr key={b._id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                        className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6 font-extrabold text-slate-800">{b.guestName}</td>
                        <td className="py-4 px-6 text-xs text-slate-500">{fmt(b.createdAt || b.checkIn)}</td>
                        <td className="py-4 px-6 font-extrabold text-slate-800">₹{(b.totalPrice || 0).toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6 text-xs text-slate-600">Cash</td>
                        <td className="py-4 px-6">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${
                            b.status === "confirmed" ? "bg-emerald-100 text-emerald-700" :
                            b.status === "cancelled" ? "bg-red-100 text-red-600" :
                            "bg-amber-100 text-amber-700"
                          }`}>
                            {b.status === "confirmed" ? "PAID" : b.status === "cancelled" ? "CANCELLED" : "PENDING"}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
