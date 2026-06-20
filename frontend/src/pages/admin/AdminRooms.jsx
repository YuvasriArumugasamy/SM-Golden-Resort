import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "../../components/AdminLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { RefreshCw, ExternalLink, Edit3, Trash2, X, BedDouble } from "lucide-react";

const DISPLAY_NAME = {
  "Non-AC":   "Double Bed Non-AC",
  "AC":       "Double Bed AC",
  "Villa":    "Villa",
  "Suite AC": "Suite Room",
};

/* ── Edit Modal ── */
function EditModal({ room, isOpen, onClose, onSave }) {
  const [form, setForm] = useState({
    roomNumber: "",
    roomType: "Double Bed",
    weekdayPrice: "",
    weekendPrice: "",
    peakPrice: "",
    status: "Available",
  });

  useEffect(() => {
    if (room) {
      setForm({
        roomNumber:   room.roomId || "",
        roomType:     DISPLAY_NAME[room.type] || room.type || "Double Bed",
        weekdayPrice: room.price || "",
        weekendPrice: room.price || "",
        peakPrice:    room.price || "",
        status:       room.available ? "Available" : "Unavailable",
      });
    }
  }, [room]);

  if (!isOpen || !room) return null;

  const inputCls = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-extrabold text-slate-800 text-lg">Edit Room</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {/* Room Number + Room Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Room Number</label>
              <input type="text" value={form.roomNumber} onChange={e => setForm({...form, roomNumber: e.target.value})}
                className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Room Type</label>
              <select value={form.roomType} onChange={e => setForm({...form, roomType: e.target.value})}
                className={inputCls}>
                <option>Double Bed</option>
                <option>Double Bed AC</option>
                <option>Villa</option>
                <option>Suite Room</option>
              </select>
            </div>
          </div>

          {/* Weekday + Weekend Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Weekday Price (Mon-Thu) (₹)</label>
              <input type="number" value={form.weekdayPrice} onChange={e => setForm({...form, weekdayPrice: e.target.value})}
                className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Weekend Price (Fri-Sun) (₹)</label>
              <input type="number" value={form.weekendPrice} onChange={e => setForm({...form, weekendPrice: e.target.value})}
                className={inputCls} />
            </div>
          </div>

          {/* Peak Season Price */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Peak Season Price (₹)</label>
            <input type="number" value={form.peakPrice} onChange={e => setForm({...form, peakPrice: e.target.value})}
              className={inputCls} />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
              className={inputCls}>
              <option>Available</option>
              <option>Unavailable</option>
            </select>
          </div>

          <button onClick={() => onSave(room.roomId, {
            price: Number(form.weekdayPrice),
            available: form.status === "Available",
          })}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-sm mt-2">
            Update Room
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminRooms() {
  const [rooms,      setRooms]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [editRoom,   setEditRoom]   = useState(null);
  const [saving,     setSaving]     = useState(false);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/rooms");
      setRooms(res.data);
    } catch { toast.error("Failed to fetch rooms"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleToggle = async (roomId, currentAvail) => {
    try {
      const res = await api.patch(`/api/rooms/${roomId}/toggle`);
      setRooms(prev => prev.map(r => r.roomId === roomId ? { ...r, available: res.data.room.available } : r));
      toast.success(res.data.message);
    } catch { toast.error("Failed to update room"); }
  };

  const handleSaveEdit = async (roomId, { price, available }) => {
    setSaving(true);
    try {
      // Toggle if availability changed
      const room = rooms.find(r => r.roomId === roomId);
      if (room && room.available !== available) {
        await api.patch(`/api/rooms/${roomId}/toggle`);
      }
      setRooms(prev => prev.map(r => r.roomId === roomId ? { ...r, price, available } : r));
      setEditRoom(null);
      toast.success("Room updated!");
    } catch { toast.error("Failed to update room"); }
    finally { setSaving(false); }
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
          <div className="flex items-center gap-2">
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

        <p className="text-sm text-slate-500">Manage your room inventory and pricing</p>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20"><LoadingSpinner /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {rooms.map((room, i) => (
              <motion.div key={room.roomId}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`bg-white rounded-2xl border-2 shadow-sm hover:shadow-md transition-all p-5 ${
                  room.available ? "border-slate-200 hover:border-blue-200" : "border-red-200"
                }`}>

                {/* Top — Room ID + Available badge */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xl font-extrabold text-slate-800">#{room.roomId}</p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">{DISPLAY_NAME[room.type] || room.type}</p>
                  </div>
                  <span className={`text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider ${
                    room.available
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-600"
                  }`}>
                    {room.available ? "Available" : "Unavailable"}
                  </span>
                </div>

                {/* Price */}
                <p className="text-blue-600 font-extrabold text-sm mt-3">
                  ₹{room.price?.toLocaleString("en-IN")}/day
                </p>

                {/* Divider */}
                <div className="border-t border-slate-100 mt-4 pt-4 flex gap-2">
                  <button onClick={() => setEditRoom(room)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleToggle(room.roomId, room.available)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl border transition-all ${
                      room.available
                        ? "text-red-500 border-red-200 hover:bg-red-50"
                        : "text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                    }`}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {editRoom && (
          <EditModal room={editRoom} isOpen={!!editRoom} onClose={() => setEditRoom(null)} onSave={handleSaveEdit} />
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
