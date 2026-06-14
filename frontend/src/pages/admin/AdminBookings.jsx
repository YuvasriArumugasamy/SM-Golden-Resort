import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useBookings } from "../../hooks/useBookings";
import LoadingSpinner from "../../components/LoadingSpinner";
import AdminLayout from "../../components/AdminLayout";
import { Search, RefreshCw, Trash2, ExternalLink } from "lucide-react";

const statusBadge = (status) => ({
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
}[status] || "bg-amber-50 text-amber-700 border-amber-200");

export default function AdminBookings() {
  const { bookings, loading, fetchBookings, updateStatus, deleteBooking } = useBookings();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    await fetchBookings("all", "");
    setRefreshing(false);
  }, [fetchBookings]);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = bookings.filter((b) => {
    const matchTab = activeTab === "all" || b.status === activeTab;
    const term = searchTerm.toLowerCase().trim();
    const matchSearch = !term || b.guestName.toLowerCase().includes(term) || b.phone.includes(term);
    return matchTab && matchSearch;
  });

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-navy font-jakarta">Bookings</h1>
            <p className="text-navy/50 text-sm mt-0.5">Work with real occupancy and data logs</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => loadData(true)}
              disabled={refreshing}
              className="flex items-center gap-2 bg-white border border-cream-dark text-navy/70 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-cream shadow-sm cursor-pointer transition-all"
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

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-cream-dark shadow-sm p-4 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex flex-wrap gap-1.5">
            {["all", "pending", "confirmed", "cancelled"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all capitalize cursor-pointer ${
                  activeTab === tab ? "bg-navy text-white shadow-sm" : "text-navy/60 hover:bg-cream"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative w-full md:max-w-xs">
            <Search className="w-4 h-4 text-navy/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-cream-dark rounded-xl text-xs outline-none focus:border-gold text-navy font-jakarta bg-cream/50"
            />
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-cream-dark shadow-sm overflow-hidden"
        >
          {loading ? (
            <div className="py-16 flex items-center justify-center"><LoadingSpinner /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-cream text-navy/50 text-xs font-bold uppercase tracking-wider border-b border-cream-dark">
                    <th className="py-4 px-5">#</th>
                    <th className="py-4 px-5">Guest</th>
                    <th className="py-4 px-5">Room</th>
                    <th className="py-4 px-5">Dates</th>
                    <th className="py-4 px-5">Total</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-dark">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-14 text-center text-navy/40 font-medium text-sm">
                        No bookings found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((b, i) => (
                      <motion.tr
                        key={b._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="hover:bg-cream/40 transition-colors"
                      >
                        <td className="py-4 px-5 font-mono text-[10px] text-navy/30 font-bold">
                          #{b._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="py-4 px-5">
                          <p className="font-extrabold text-navy text-sm font-jakarta">{b.guestName}</p>
                          <p className="text-xs text-navy/50">{b.phone}</p>
                          {b.email && <p className="text-[10px] text-navy/30 break-all">{b.email}</p>}
                        </td>
                        <td className="py-4 px-5">
                          <p className="font-semibold text-navy text-xs">{b.roomName}</p>
                          <p className="text-[10px] text-navy/40">{b.roomType}</p>
                        </td>
                        <td className="py-4 px-5 text-xs text-navy/60">
                          <p>{new Date(b.checkIn).toLocaleDateString("en-IN")} →</p>
                          <p>{new Date(b.checkOut).toLocaleDateString("en-IN")}</p>
                          <p className="text-[10px] font-bold text-gold mt-0.5">
                            {b.nights} Night{b.nights > 1 ? "s" : ""}
                          </p>
                        </td>
                        <td className="py-4 px-5 font-extrabold text-gold font-jakarta">
                          ₹{b.totalPrice?.toLocaleString("en-IN")}
                        </td>
                        <td className="py-4 px-5">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${statusBadge(b.status)}`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex items-center justify-center gap-2">
                            <select
                              value={b.status}
                              onChange={(e) => updateStatus(b._id, e.target.value)}
                              className="text-xs px-2.5 py-1.5 bg-cream border border-cream-dark rounded-lg outline-none focus:border-gold text-navy/80 font-semibold cursor-pointer"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirm</option>
                              <option value="cancelled">Cancel</option>
                            </select>
                            <button
                              onClick={() => {
                                if (window.confirm("Delete this booking permanently?"))
                                  deleteBooking(b._id);
                              }}
                              className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  );
}
