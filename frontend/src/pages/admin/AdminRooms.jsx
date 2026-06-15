import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AdminLayout from "../../components/AdminLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { RefreshCw, ExternalLink, BedDouble, Wind, Wifi, Tv } from "lucide-react";

export default function AdminRooms() {
  const [rooms,    setRooms]    = useState([]);
  const [loading,  setLoading]  = useState(true);
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

  const typeBadge = (type) => {
    if (type === "AC" || type?.includes("A/C")) return "bg-blue-50 text-blue-700 border-blue-200";
    if (type === "Suite AC" || type?.includes("Suite")) return "bg-violet-50 text-violet-700 border-violet-200";
    if (type === "Villa") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    return "bg-slate-100 text-slate-600 border-slate-200";
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">Rooms</h1>
            <p className="text-slate-400 text-sm mt-0.5">Manage your inventory and availability</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchRooms}
              className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-slate-50 shadow-sm transition-all">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-all">
              <ExternalLink className="w-3.5 h-3.5" /> View Site
            </a>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20"><LoadingSpinner /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {rooms.map((room, i) => (
              <motion.div key={room.roomId}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all p-5">

                {/* Top */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                      <BedDouble className="w-4.5 h-4.5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-800 text-sm leading-tight">#{room.roomId}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{room.beds}</p>
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

                <p className="font-bold text-slate-800 text-sm mb-1.5">{room.name}</p>

                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${typeBadge(room.type)}`}>
                    {room.type}
                  </span>
                  <span className="text-blue-600 font-extrabold text-sm">
                    ₹{room.price?.toLocaleString("en-IN")}
                    <span className="text-[10px] text-slate-400 font-normal">/night</span>
                  </span>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {room.amenities?.slice(0, 4).map((am) => (
                    <span key={am} className="text-[10px] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-slate-500 font-medium">
                      {am}
                    </span>
                  ))}
                  {room.amenities?.length > 4 && (
                    <span className="text-[10px] text-slate-400 font-medium px-1">+{room.amenities.length - 4} more</span>
                  )}
                </div>

                {/* Toggle */}
                <button onClick={() => handleToggle(room.roomId)} disabled={toggling === room.roomId}
                  className={`w-full text-xs font-bold py-2 rounded-xl transition-all disabled:opacity-60 ${
                    room.available
                      ? "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                      : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                  }`}>
                  {toggling === room.roomId ? "Updating…" : room.available ? "Mark Unavailable" : "Mark Available"}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
