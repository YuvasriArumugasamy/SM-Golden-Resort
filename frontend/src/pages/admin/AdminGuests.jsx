import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import AdminLayout from "../../components/AdminLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { RefreshCw, ExternalLink, Phone } from "lucide-react";

export default function AdminGuests() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGuests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/bookings");
      setBookings(res.data);
    } catch {
      toast.error("Failed to fetch guests");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchGuests(); }, [fetchGuests]);

  // Deduplicate by phone
  const guestMap = {};
  bookings.forEach((b) => {
    if (!guestMap[b.phone]) {
      guestMap[b.phone] = { name: b.guestName, phone: b.phone, stays: 0, lastRoom: b.roomName };
    }
    guestMap[b.phone].stays += 1;
    guestMap[b.phone].lastRoom = b.roomName;
  });
  const guests = Object.values(guestMap);

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-navy font-jakarta">Guests</h1>
            <p className="text-navy/50 text-sm mt-0.5">All unique guests who booked</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchGuests}
              className="flex items-center gap-2 bg-white border border-cream-dark text-navy/70 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-cream shadow-sm cursor-pointer transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gold hover:bg-gold/90 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-all cursor-pointer">
              <ExternalLink className="w-3.5 h-3.5" />
              View Site
            </a>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-cream-dark shadow-sm overflow-hidden"
        >
          {loading ? (
            <div className="py-16 flex items-center justify-center"><LoadingSpinner /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-cream text-navy/50 text-xs font-bold uppercase tracking-wider border-b border-cream-dark">
                    <th className="py-4 px-6">Guest Name</th>
                    <th className="py-4 px-6">Phone</th>
                    <th className="py-4 px-6">Total Stays</th>
                    <th className="py-4 px-6">Last Room</th>
                    <th className="py-4 px-6">Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-dark">
                  {guests.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-14 text-center text-navy/40 text-sm">No guests yet.</td>
                    </tr>
                  ) : (
                    guests.map((g, i) => (
                      <motion.tr
                        key={g.phone}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="hover:bg-cream/40 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-navy/10 border border-navy/10 flex items-center justify-center shrink-0">
                              <span className="text-navy font-extrabold text-xs font-jakarta">
                                {g.name?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <p className="font-extrabold text-navy text-sm font-jakarta">{g.name}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <a href={`tel:${g.phone}`} className="flex items-center gap-1.5 text-xs font-medium text-navy/70 hover:text-gold transition-colors">
                            <Phone className="w-3.5 h-3.5" />{g.phone}
                          </a>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm font-extrabold text-navy font-jakarta">{g.stays}</span>
                        </td>
                        <td className="py-4 px-6 text-xs text-navy/60 font-medium">{g.lastRoom}</td>
                        <td className="py-4 px-6">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${
                            g.stays >= 3
                              ? "bg-gold/10 text-gold border-gold/30"
                              : "bg-amber-50 text-amber-600 border-amber-200"
                          }`}>
                            {g.stays >= 3 ? "Regular" : "New"}
                          </span>
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
