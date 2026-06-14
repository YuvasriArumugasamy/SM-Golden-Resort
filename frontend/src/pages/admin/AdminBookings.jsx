import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useBookings } from "../../hooks/useBookings";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  LogOut, Search, Trash2, RefreshCw
} from "lucide-react";

const AdminBookings = () => {
  const { logout } = useAuth();
  const { bookings, loading, fetchBookings, updateStatus, deleteBooking } = useBookings();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const loadData = useCallback(() => {
    fetchBookings("all", "");
  }, [fetchBookings]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleLogout = () => { logout(); navigate("/admin/login"); };

  const handleStatusChange = async (id, status) => { await updateStatus(id, status); };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this booking record permanently?")) await deleteBooking(id);
  };

  const filtered = bookings.filter(b => {
    const matchTab = activeTab === "all" || b.status === activeTab;
    const term = searchTerm.toLowerCase().trim();
    const matchSearch = !term || b.guestName.toLowerCase().includes(term) || b.phone.includes(term);
    return matchTab && matchSearch;
  });

  const statusBadge = (status) => {
    const map = {
      confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
      cancelled: "bg-red-50 text-red-600 border-red-200",
      pending: "bg-amber-50 text-amber-700 border-amber-200",
    };
    return map[status] || map.pending;
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col page-transition">
      {/* ── Top Header Bar ── */}
      <header className="bg-navy text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
              <span className="text-gold font-bold font-jakarta text-base">S</span>
            </div>
            <div>
              <p className="text-white font-extrabold text-sm font-jakarta leading-none">SM Golden Resorts</p>
              <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1">Admin Portal</p>
            </div>
          </div>

          <button onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl font-bold text-xs transition-all cursor-pointer">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-navy font-jakarta">Manage Bookings</h1>
            <p className="text-navy/50 text-sm mt-1">Update, confirm or cancel reservation requests.</p>
          </div>
          <button onClick={loadData}
            className="flex items-center gap-2 bg-white border border-cream-dark text-navy/70 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-cream shadow-sm cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-cream-dark shadow-sm p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {["all", "pending", "confirmed", "cancelled"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all capitalize cursor-pointer ${
                  activeTab === tab ? "bg-navy text-white shadow-sm" : "text-navy/60 hover:bg-cream"
                }`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="relative w-full md:max-w-xs">
            <Search className="w-4 h-4 text-navy/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search by name or phone..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-cream-dark rounded-xl text-xs outline-none focus:border-primary text-navy font-jakarta bg-cream/50"
            />
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-2xl border border-cream-dark shadow-sm overflow-hidden mb-10">
          {loading ? <LoadingSpinner /> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-cream text-navy/50 text-xs font-bold uppercase tracking-wider border-b border-cream-dark">
                    <th className="py-4 px-5">ID</th>
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
                    <tr><td colSpan="7" className="py-12 text-center text-navy/40 font-medium">No bookings found.</td></tr>
                  ) : filtered.map(b => (
                    <tr key={b._id} className="hover:bg-cream/40 transition-colors">
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
                        <p className="text-[10px] font-bold text-primary mt-0.5">{b.nights} Night{b.nights > 1 ? "s" : ""}</p>
                      </td>
                      <td className="py-4 px-5 font-extrabold text-primary font-jakarta">
                        ₹{b.totalPrice?.toLocaleString()}
                      </td>
                      <td className="py-4 px-5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${statusBadge(b.status)}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center justify-center gap-2">
                          <select value={b.status} onChange={e => handleStatusChange(b._id, e.target.value)}
                            className="text-xs px-2.5 py-1.5 bg-cream border border-cream-dark rounded-lg outline-none focus:border-primary text-navy/80 font-semibold cursor-pointer">
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirm</option>
                            <option value="cancelled">Cancel</option>
                          </select>
                          <button onClick={() => handleDelete(b._id)}
                            className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-all cursor-pointer" title="Delete">
                            <Trash2 className="w-4 h-4" />
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
      </main>
    </div>
  );
};

export default AdminBookings;
