import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AdminLayout from "../../components/AdminLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { RefreshCw, ExternalLink, BedDouble, Wifi, Wind } from "lucide-react";

const typeColor = {
  "AC": "bg-blue-50 text-blue-700 border-blue-200",
  "Non-AC": "bg-stone-100 text-stone-700 border-stone-200",
  "Suite AC": "bg-amber-50 text-amber-700 border-amber-200",
  "Suite Premium": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Villa": "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/rooms");
      setRooms(res.data);
    } catch {
      toast.error("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleToggle = async (roomId) => {
    setToggling(roomId);
    try {
      const res = await api.patch(`/api/rooms/${roomId}/toggle`);
      setRooms((prev) =>
        prev.map((r) => r.roomId === roomId ? { ...r, available: res.data.room.available } : r)
      );
      toast.success(res.data.message);
    } catch {
      toast.error("Failed to toggle room");
    } finally {
      setToggling(null);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-navy font-jakarta">Rooms</h1>
            <p className="text-navy/50 text-sm mt-0.5">Manage your inventory and availability</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchRooms}
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

        {/* Rooms Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20"><LoadingSpinner /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {rooms.map((room, i) => (
              <motion.div
                key={room.roomId}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl border border-cream-dark shadow-sm hover:shadow-md transition-shadow p-5"
              >
                {/* Top row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-navy/5 flex items-center justify-center">
                      <BedDouble className="w-4.5 h-4.5 text-navy/60" />
                    </div>
                    <div>
                      <p className="font-extrabold text-navy text-sm font-jakarta leading-tight">#{room.roomId}</p>
                      <p className="text-[10px] text-navy/40 font-medium">{room.beds}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${
                    room.available
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-red-50 text-red-600 border-red-200"
                  }`}>
                    {room.available ? "Available" : "Unavailable"}
                  </span>
                </div>

                <p className="font-bold text-navy text-sm mb-1">{room.name}</p>

                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${typeColor[room.type] || "bg-navy/10 text-navy border-navy/20"}`}>
                    {room.type}
                  </span>
                  <span className="text-gold font-extrabold text-sm font-jakarta">₹{room.price.toLocaleString("en-IN")}<span className="text-[10px] text-navy/40 font-normal">/night</span></span>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {room.amenities.slice(0, 4).map((am) => (
                    <span key={am} className="text-[10px] bg-cream border border-cream-dark px-2 py-0.5 rounded text-navy/60 font-medium">
                      {am}
                    </span>
                  ))}
                  {room.amenities.length > 4 && (
                    <span className="text-[10px] text-navy/40 font-medium px-1">+{room.amenities.length - 4} more</span>
                  )}
                </div>

                {/* Toggle button */}
                <button
                  onClick={() => handleToggle(room.roomId)}
                  disabled={toggling === room.roomId}
                  className={`w-full text-xs font-bold py-2 rounded-xl transition-all cursor-pointer disabled:opacity-60 ${
                    room.available
                      ? "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                      : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                  }`}
                >
                  {toggling === room.roomId
                    ? "Updating..."
                    : room.available
                    ? "Mark Unavailable"
                    : "Mark Available"}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
