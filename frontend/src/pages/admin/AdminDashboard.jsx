import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, BedDouble, CalendarDays, Users, CreditCard,
  PieChart, Settings, MessageSquare, Bell, LogOut, ExternalLink,
  RefreshCw, Plus, Trash2, Edit3, CheckCircle2, XCircle, Clock,
  X, MessageCircle, ClipboardCheck, Calendar, Image as ImageIcon,
  Lock, Eye, EyeOff, ChevronLeft, ChevronRight, Star,
  BarChart2, TrendingUp, Wifi, Wind, Tv,
} from "lucide-react";
import api from "../../api/axios";
import AdminLayout from "../../components/AdminLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../hooks/useAuth";

/* ─── helpers ─── */
const fmt = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const statusCls = {
  Confirmed:    "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Pending:      "bg-amber-50  text-amber-700  border border-amber-200",
  Cancelled:    "bg-red-50    text-red-600    border border-red-200",
  "Checked-out":"bg-blue-50   text-blue-700   border border-blue-200",
};

const StatusPill = ({ status }) => (
  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide ${statusCls[status] || statusCls.Pending}`}>
    {status || "Pending"}
  </span>
);

/* ─── Modal wrapper ─── */
const Modal = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
         onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ type: "spring", duration: 0.3 }}
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <h2 className="font-extrabold text-slate-800 text-lg">{title}</h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </div>
  );
};

/* ─── Stat Card ─── */
const StatCard = ({ icon: Icon, label, value, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all"
  >
    <div className="flex items-center justify-between mb-3">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{label}</p>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
    </div>
    <p className="text-3xl font-extrabold text-slate-800">{value ?? "—"}</p>
    <p className="text-[10px] text-emerald-500 font-bold mt-1">● Real-time</p>
  </motion.div>
);

/* ══════════════════════════════════
   DASHBOARD OVERVIEW
══════════════════════════════════ */
function DashboardOverview({ stats, bookings }) {
  const recent = [...(bookings || [])].sort(
    (a, b) => new Date(b.createdAt || b.checkIn) - new Date(a.createdAt || a.checkIn)
  ).slice(0, 5);

  const confirmed  = stats?.confirmed  ?? 0;
  const pending    = stats?.pending    ?? 0;
  const cancelled  = stats?.cancelled  ?? 0;
  const total      = stats?.total      ?? 0;
  const revenue    = stats?.totalRevenue ?? bookings.reduce((s, b) => s + (b.totalPrice || 0), 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BedDouble}    label="Total Rooms"    value={stats?.totalRooms ?? 11}  color="bg-blue-50 text-blue-600"    delay={0}    />
        <StatCard icon={CalendarDays} label="Total Bookings" value={total}                     color="bg-violet-50 text-violet-600" delay={0.05} />
        <StatCard icon={CheckCircle2} label="Confirmed"      value={confirmed}                 color="bg-emerald-50 text-emerald-600" delay={0.1} />
        <StatCard icon={Clock}        label="Pending"        value={pending}                   color="bg-amber-50 text-amber-600"  delay={0.15} />
      </div>

      {/* Revenue + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-extrabold text-slate-800 text-sm">Revenue Summary</h3>
            <span className="text-xl font-extrabold text-blue-600">₹{revenue.toLocaleString("en-IN")}</span>
          </div>
          <div className="space-y-3">
            {[
              { label: "Confirmed",  count: confirmed, total, color: "bg-emerald-400" },
              { label: "Pending",    count: pending,   total, color: "bg-amber-400"   },
              { label: "Cancelled",  count: cancelled, total, color: "bg-red-400"     },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                  <span>{item.label}</span><span>{item.count}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
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
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-slate-800 text-sm">Recent Bookings</h3>
            <Link to="/admin/bookings" className="text-xs font-bold text-blue-600 hover:underline">View all</Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">No bookings yet.</p>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">
                <span>Guest</span><span>Room</span><span className="text-right">Status</span>
              </div>
              {recent.map((b, i) => (
                <motion.div key={b._id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.04 }}
                  className="grid grid-cols-3 items-center text-xs">
                  <div>
                    <p className="font-bold text-slate-800 truncate">{b.guestName || b.name}</p>
                    <p className="text-slate-400 text-[10px]">{fmt(b.checkIn)}</p>
                  </div>
                  <p className="text-slate-500 font-medium truncate">{b.roomName || b.roomType}</p>
                  <div className="flex justify-end">
                    <StatusPill status={b.status} />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-extrabold text-slate-800 text-sm mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/bookings"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm">
            <CalendarDays className="w-3.5 h-3.5" /> Manage Bookings
          </Link>
          <Link to="/admin/rooms"
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm">
            <BedDouble className="w-3.5 h-3.5" /> View Rooms
          </Link>
          <Link to="/admin/settings"
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
            <Settings className="w-3.5 h-3.5" /> Settings
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════
   ROOM MANAGEMENT
══════════════════════════════════ */
function RoomManagement({ rooms, onAddClick, onDeleteRoom, onEditRoom }) {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Manage your room inventory and pricing</p>
        <button onClick={onAddClick}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm">
          <Plus className="w-3.5 h-3.5" /> Add Room
        </button>
      </div>

      {rooms.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
          No rooms added yet. Click "Add Room" to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {rooms.map(room => (
            <motion.div key={room._id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md hover:border-blue-300 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-xl font-extrabold text-slate-800">#{room.roomNumber}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{room.type}</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  room.status === "Available"   ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                  room.status === "Occupied"    ? "bg-red-50 text-red-600 border border-red-200" :
                  "bg-slate-100 text-slate-500 border border-slate-200"
                }`}>{room.status}</span>
              </div>
              <div className="text-sm font-extrabold text-blue-600 mb-1">
                ₹{room.price}<span className="text-xs font-medium text-slate-400">/night</span>
              </div>
              <div className="text-[10px] text-slate-400 mb-4">
                Weekday ₹{room.nonSeasonPrice || room.price} · Weekend ₹{room.weekendPrice || room.price} · Peak ₹{room.seasonPrice || room.price}
              </div>
              <div className="flex gap-2">
                <button onClick={() => onEditRoom(room)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => onDeleteRoom(room._id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-all">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════
   BOOKING MANAGEMENT
══════════════════════════════════ */
function BookingManagement({ bookings, rooms, onConfirm, onCancel, onCheckOut, onWhatsApp, onDelete,
                              onAddPayment, onUpdateRoomNumber, onAddOfflineClick }) {
  const [filter, setFilter] = useState("All");
  const tabs = ["All", "Pending", "Confirmed", "Checked-out", "Cancelled"];
  const filtered = filter === "All" ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-100">
        <h3 className="font-extrabold text-slate-800">Booking Management</h3>
        <button onClick={onAddOfflineClick}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm shrink-0">
          <Plus className="w-3.5 h-3.5" /> Add Offline Booking
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 px-6 py-3 overflow-x-auto border-b border-slate-100">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filter === tab
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            }`}>
            {tab}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-400 font-medium self-center shrink-0">
          {filtered.length} booking{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wide border-b border-slate-100">
              <th className="text-left px-6 py-3">#</th>
              <th className="text-left px-4 py-3">Guest</th>
              <th className="text-left px-4 py-3">Phone</th>
              <th className="text-left px-4 py-3">Room</th>
              <th className="text-left px-4 py-3">Check-in / out</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-slate-400">No bookings found.</td></tr>
            ) : filtered.map((b, i) => (
              <tr key={b._id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                <td className="px-6 py-4 text-slate-400 font-medium">{i + 1}</td>
                <td className="px-4 py-4">
                  <div className="font-bold text-slate-800">{b.guestName || b.name || "—"}</div>
                  <div className="text-[10px] text-blue-600 font-bold mt-0.5">#{b.bookingId || b._id?.slice(-6)}</div>
                  <div className="text-[10px] text-slate-400">{b.email || ""}</div>
                </td>
                <td className="px-4 py-4 text-slate-600">{b.phone || "—"}</td>
                <td className="px-4 py-4">
                  <div className="font-medium text-slate-700 mb-1">{b.roomType || b.roomName}</div>
                  <select
                    value={b.roomNumber || ""}
                    onChange={e => onUpdateRoomNumber(b._id, e.target.value)}
                    className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white outline-none cursor-pointer w-32"
                  >
                    <option value="">Assign Room</option>
                    {rooms.map(r => (
                      <option key={r.roomNumber} value={r.roomNumber}>
                        {r.roomNumber} ({r.type?.split(" ")[0]})
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-4 text-xs text-slate-600">
                  <div>{fmt(b.checkIn)}</div>
                  <div className="text-slate-400">→ {fmt(b.checkOut)}</div>
                </td>
                <td className="px-4 py-4"><StatusPill status={b.status} /></td>
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-1 min-w-[140px]">
                    {b.status === "Pending" && (
                      <button onClick={() => onConfirm(b._id, b)}
                        className="flex items-center gap-1.5 justify-center py-1.5 px-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-all">
                        <CheckCircle2 className="w-3 h-3" /> Confirm
                      </button>
                    )}
                    {b.status === "Confirmed" && (
                      <button onClick={() => onCheckOut(b._id, b)}
                        className="flex items-center gap-1.5 justify-center py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all">
                        <LogOut className="w-3 h-3" /> Check-out
                      </button>
                    )}
                    <button onClick={() => onWhatsApp(b)}
                      className="flex items-center gap-1.5 justify-center py-1.5 px-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-xs font-bold rounded-lg transition-all">
                      <MessageCircle className="w-3 h-3" /> WhatsApp
                    </button>
                    {(b.status === "Pending" || b.status === "Confirmed") && (
                      <button onClick={() => onCancel(b._id, b)}
                        className="flex items-center gap-1.5 justify-center py-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg border border-red-200 transition-all">
                        <XCircle className="w-3 h-3" /> Cancel
                      </button>
                    )}
                    <button onClick={() => onAddPayment(b)}
                      className="flex items-center gap-1.5 justify-center py-1.5 px-3 bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-bold rounded-lg border border-violet-200 transition-all">
                      <CreditCard className="w-3 h-3" /> Payment
                    </button>
                    <button onClick={() => onDelete(b._id)}
                      className="flex items-center gap-1.5 justify-center py-1.5 px-3 text-slate-400 hover:text-red-500 text-xs font-bold transition-all">
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   GUESTS VIEW
══════════════════════════════════ */
function GuestsView({ guests, onDeleteGuest }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm animate-fadeIn overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="font-extrabold text-slate-800">Guest Records</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wide border-b border-slate-100 bg-slate-50">
              <th className="text-left px-6 py-3">Guest Name</th>
              <th className="text-left px-4 py-3">Phone</th>
              <th className="text-left px-4 py-3">Total Stays</th>
              <th className="text-left px-4 py-3">Level</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {guests.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-slate-400">No guest records.</td></tr>
            ) : guests.map(g => (
              <tr key={g._id} className="border-b border-slate-50 hover:bg-slate-50/60">
                <td className="px-6 py-4 font-bold text-slate-800">{g.name}</td>
                <td className="px-4 py-4 text-slate-600">{g.phone}</td>
                <td className="px-4 py-4 text-slate-600">{g.totalStays}</td>
                <td className="px-4 py-4">
                  <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    {g.loyaltyLevel || "New"}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <button onClick={() => onDeleteGuest(g._id)}
                    className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 font-bold transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   PAYMENTS VIEW
══════════════════════════════════ */
function PaymentsView({ payments, totalRevenue }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard icon={TrendingUp} label="Total Revenue" value={`₹${(totalRevenue || 0).toLocaleString("en-IN")}`}
          color="bg-blue-50 text-blue-600" />
        <StatCard icon={CreditCard} label="Payment Records" value={payments.length}
          color="bg-violet-50 text-violet-600" />
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-extrabold text-slate-800">Transaction History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wide border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-3">Guest</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Amount</th>
                <th className="text-left px-4 py-3">Method</th>
                <th className="text-left px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-slate-400">No payment records.</td></tr>
              ) : payments.map(p => (
                <tr key={p._id} className="border-b border-slate-50 hover:bg-slate-50/60">
                  <td className="px-6 py-4 font-bold text-slate-800">{p.guestName}</td>
                  <td className="px-4 py-4 text-slate-500 text-xs">{new Date(p.date).toLocaleDateString()}</td>
                  <td className="px-4 py-4 font-extrabold text-blue-600">₹{p.amount}</td>
                  <td className="px-4 py-4 text-slate-600">{p.method}</td>
                  <td className="px-4 py-4"><StatusPill status={p.status === "Paid" ? "Confirmed" : p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   SETTINGS VIEW
══════════════════════════════════ */
function SettingsView({ isSeason, onToggleSeason, isWeekendActive, onToggleWeekend }) {
  const [showNewPwd, setShowNewPwd]     = useState(false);
  const [showCurrPwd, setShowCurrPwd]   = useState(false);

  const handleUpdateLogin = async () => {
    const newU  = document.getElementById("s-new-user").value;
    const newP  = document.getElementById("s-new-pass").value;
    const currP = document.getElementById("s-curr-pass").value;
    if (!newU && !newP) return;
    if (!currP) return alert("Current password is required to save changes");
    if (newP && newP.length < 6) return alert("New password must be at least 6 characters");
    if (!window.confirm("Are you sure you want to change your login credentials? You will be logged out.")) return;
    const token = localStorage.getItem("adminToken");
    try {
      await api.patch("/api/admin/profile", { oldPassword: currP, newPassword: newP || undefined },
        { headers: { Authorization: `Bearer ${token}` } });
      alert("Success! Please login with your new credentials.");
      localStorage.removeItem("adminToken");
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Error updating profile");
    }
  };

  const Toggle = ({ active, onToggle, activeColor = "bg-blue-600" }) => (
    <div onClick={onToggle}
      className={`w-14 h-7 rounded-full relative cursor-pointer transition-all duration-300 ${active ? activeColor : "bg-slate-300"}`}
      style={{ boxShadow: active ? "0 4px 12px rgba(37, 99, 235, 0.3)" : "none" }}>
      <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all duration-300 shadow-md ${active ? "left-8" : "left-1"}`} />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg font-extrabold text-slate-800">System Settings</h2>
          <p className="text-sm text-slate-500 mt-1">Manage your lodge's global configuration and seasonal pricing.</p>
        </div>

        {/* Peak Season */}
        <div className={`p-5 rounded-xl border transition-all ${isSeason ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-200"}`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{isSeason ? "🔥" : "❄️"}</span>
                <h4 className="font-bold text-slate-800">Peak Season Pricing</h4>
              </div>
              <p className="text-xs text-slate-500">When activated, the website automatically transitions to peak season rates (₹1300 / ₹2500).</p>
            </div>
            <Toggle active={isSeason} onToggle={() => onToggleSeason(!isSeason)} activeColor="bg-amber-500" />
          </div>
          <div className={`mt-3 flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg ${isSeason ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-500"}`}>
            <span className={`w-2 h-2 rounded-full ${isSeason ? "bg-amber-500 animate-pulse" : "bg-slate-400"}`} />
            {isSeason ? "PEAK SEASON RATES ARE LIVE" : "REGULAR RATES ARE LIVE"}
          </div>
        </div>

        {/* Weekend Pricing */}
        <div className={`p-5 rounded-xl border transition-all ${isWeekendActive ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"}`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{isWeekendActive ? "📅" : "📆"}</span>
                <h4 className="font-bold text-slate-800">Weekend Pricing (Fri–Sun)</h4>
              </div>
              <p className="text-xs text-slate-500">When activated, the website automatically applies higher weekend rates on Friday, Saturday, and Sunday.</p>
            </div>
            <Toggle active={isWeekendActive} onToggle={() => onToggleWeekend(!isWeekendActive)} activeColor="bg-emerald-500" />
          </div>
          <div className={`mt-3 flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg ${isWeekendActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>
            <span className={`w-2 h-2 rounded-full ${isWeekendActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
            {isWeekendActive ? "WEEKEND RATES (FRI–SUN) ARE ENABLED" : "WEEKEND RATES ARE DISABLED"}
          </div>
        </div>

        {/* Login Credentials */}
        <div className="border-t border-slate-100 pt-5">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-blue-600" />
            <h4 className="font-bold text-slate-800">Login Credentials</h4>
          </div>
          <p className="text-xs text-slate-500 mb-4">Update your admin credentials. You will be logged out after changing these.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">New Password</label>
              <div className="relative flex items-center">
                <input id="s-new-pass" type={showNewPwd ? "text" : "password"} placeholder="Minimum 6 characters"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 pr-10" />
                <button type="button" onClick={() => setShowNewPwd(!showNewPwd)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600">
                  {showNewPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">New Username (optional)</label>
              <input id="s-new-user" type="text" placeholder="Leave blank to keep current"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <label className="block text-xs font-bold text-red-700 uppercase tracking-wide mb-1.5">Current Password (required)</label>
            <div className="relative flex items-center">
              <input id="s-curr-pass" type={showCurrPwd ? "text" : "password"}
                className="w-full bg-white border border-red-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-400 pr-10" />
              <button type="button" onClick={() => setShowCurrPwd(!showCurrPwd)}
                className="absolute right-3 text-red-400 hover:text-red-600">
                {showCurrPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={handleUpdateLogin}
              className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-8 py-2.5 rounded-xl text-sm transition-all shadow-sm">
              Update Login Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   MAIN ADMIN DASHBOARD
══════════════════════════════════ */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [activeTab,   setActiveTab]   = useState("overview");
  const [stats,       setStats]       = useState(null);
  const [bookings,    setBookings]    = useState([]);
  const [rooms,       setRooms]       = useState([]);
  const [guests,      setGuests]      = useState([]);
  const [payments,    setPayments]    = useState([]);
  const [isSeason,    setIsSeason]    = useState(false);
  const [isWeekend,   setIsWeekend]   = useState(false);
  const [loading,     setLoading]     = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);

  /* ── modals ── */
  const [roomModal,    setRoomModal]    = useState(false);
  const [editingRoom,  setEditingRoom]  = useState(null);
  const [roomForm,     setRoomForm]     = useState({ roomNumber: "", type: "Double Bed A/C", nonSeasonPrice: "", weekendPrice: "", seasonPrice: "", status: "Available" });

  const [payModal,     setPayModal]     = useState(false);
  const [payForm,      setPayForm]      = useState({ guestName: "", bookingId: "", amount: "", method: "Cash", status: "Paid" });
  const [paySaving,    setPaySaving]    = useState(false);

  const [offlineModal, setOfflineModal] = useState(false);
  const [offlineForm,  setOfflineForm]  = useState({ name: "", phone: "", email: "", roomType: "Double Bed A/C", checkIn: "", checkOut: "", checkInTime: "", checkOutTime: "", guests: 2, rooms: 1, message: "", advancePaid: 0, paymentMethod: "Cash" });
  const [offlineSaving,setOfflineSaving]= useState(false);

  const todayStr = new Date().toISOString().split("T")[0];

  /* ── fetch ── */
  const fetchData = useCallback(async (isRefresh = false) => {
    const token = localStorage.getItem("adminToken");
    if (!token) { navigate("/admin/login"); return; }
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const [statsRes, bookRes, roomRes, guestRes, payRes, settingsRes] = await Promise.allSettled([
        api.get("/api/admin/stats"),
        api.get("/api/admin/bookings", { params: { page: 1, limit: 100 } }),
        api.get("/api/admin/rooms"),
        api.get("/api/admin/guests"),
        api.get("/api/admin/payments"),
        api.get("/api/admin/settings"),
      ]);
      if (statsRes.status === "fulfilled")    setStats(statsRes.value.data.stats || statsRes.value.data);
      if (bookRes.status === "fulfilled")     setBookings(bookRes.value.data.bookings || bookRes.value.data || []);
      if (roomRes.status === "fulfilled")     setRooms(roomRes.value.data.rooms || roomRes.value.data || []);
      if (guestRes.status === "fulfilled")    setGuests(guestRes.value.data.guests || guestRes.value.data || []);
      if (payRes.status === "fulfilled")      setPayments(payRes.value.data.payments || payRes.value.data || []);
      if (settingsRes.status === "fulfilled") {
        const s = settingsRes.value.data.settings || settingsRes.value.data;
        setIsSeason(s?.isSeason  ?? false);
        setIsWeekend(s?.isWeekendActive !== false);
      }
    } catch (err) {
      if (err?.response?.status === 401) navigate("/admin/login");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [navigate]);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── room actions ── */
  const openAddRoom  = () => { setEditingRoom(null); setRoomForm({ roomNumber: "", type: "Double Bed A/C", nonSeasonPrice: "", weekendPrice: "", seasonPrice: "", status: "Available" }); setRoomModal(true); };
  const openEditRoom = (room) => { setEditingRoom(room._id); setRoomForm({ roomNumber: room.roomNumber, type: room.type, nonSeasonPrice: room.nonSeasonPrice || room.price, weekendPrice: room.weekendPrice || room.price, seasonPrice: room.seasonPrice || room.price, status: room.status }); setRoomModal(true); };
  const handleRoomSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");
    const h = { Authorization: `Bearer ${token}` };
    const payload = { ...roomForm, price: isSeason ? roomForm.seasonPrice : roomForm.nonSeasonPrice };
    try {
      if (editingRoom) await api.patch(`/api/admin/rooms/${editingRoom}`, payload, { headers: h });
      else             await api.post("/api/admin/rooms", payload, { headers: h });
      setRoomModal(false);
      fetchData();
    } catch (err) { alert("Error saving room: " + err.message); }
  };
  const handleDeleteRoom = async id => {
    if (!window.confirm("Delete this room?")) return;
    const token = localStorage.getItem("adminToken");
    await api.delete(`/api/admin/rooms/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    fetchData();
  };

  /* ── booking actions ── */
  const handleConfirm = async (id, b) => {
    if (!window.confirm(`Confirm booking for ${b.guestName || b.name}?`)) return;
    const token = localStorage.getItem("adminToken");
    try {
      const res = await api.patch(`/api/admin/bookings/${id}`, { status: "Confirmed" }, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data?.waLink) window.open(res.data.waLink, "_blank");
      fetchData();
    } catch (err) { alert("Error: " + err.message); }
  };
  const handleCancel = async (id, b) => {
    const reason = window.prompt(`Cancellation reason for ${b.guestName || b.name} (optional):`, "") || "";
    if (reason === null) return;
    const token = localStorage.getItem("adminToken");
    try {
      const res = await api.patch(`/api/admin/bookings/${id}`, { status: "Cancelled", cancellationReason: reason }, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data?.waLink) window.open(res.data.waLink, "_blank");
      fetchData();
    } catch (err) { alert("Error: " + err.message); }
  };
  const handleCheckOut = async (id, b) => {
    if (!window.confirm(`Complete check-out for ${b.guestName || b.name}?`)) return;
    const token = localStorage.getItem("adminToken");
    try {
      await api.patch(`/api/admin/bookings/${id}`, { status: "Checked-out" }, { headers: { Authorization: `Bearer ${token}` } });
      const phone = (b.phone || "").replace(/[^0-9]/g, "");
      const formatted = phone.startsWith("91") ? phone : `91${phone}`;
      const msg = `Hello ${b.guestName || b.name}! 👋\n\nThank you for staying at *SM Golden Resorts*. We hope you had a wonderful experience!\n\nWe'd love your feedback: https://g.page/r/review\n\n📍 Old Falls Main Road, Courtallam\n🙏 We look forward to hosting you again!`;
      window.open(`https://wa.me/${formatted}?text=${encodeURIComponent(msg)}`, "_blank");
      fetchData();
    } catch (err) { alert("Error: " + err.message); }
  };
  const handleWhatsApp = b => {
    const checkIn  = new Date(b.checkIn).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    const checkOut = new Date(b.checkOut).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    const msg = `✅ *SM Golden Resorts – Booking Update*\n\nDear ${b.guestName || b.name},\n\n🛏️ Room: *${b.roomType || b.roomName}*${b.roomNumber ? ` (Room #${b.roomNumber})` : ""}\n📅 Check-in: *${checkIn}*\n📅 Check-out: *${checkOut}*\n📊 Status: *${b.status}*\n\n📍 SM Golden Resorts, Old Falls Main Road, Courtallam – 627 802\n\nThank you! 🙏`;
    const phone = (b.phone || "").replace(/[^0-9]/g, "");
    const formatted = phone.startsWith("91") ? phone : `91${phone}`;
    window.open(`https://wa.me/${formatted}?text=${encodeURIComponent(msg)}`, "_blank");
  };
  const handleDeleteBooking = async id => {
    if (!window.confirm("Delete this booking?")) return;
    const token = localStorage.getItem("adminToken");
    await api.delete(`/api/admin/bookings/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    fetchData();
  };
  const handleUpdateRoomNumber = async (id, roomNumber) => {
    const token = localStorage.getItem("adminToken");
    try {
      await api.patch(`/api/admin/bookings/${id}`, { roomNumber }, { headers: { Authorization: `Bearer ${token}` } });
      setBookings(prev => prev.map(b => b._id === id ? { ...b, roomNumber } : b));
    } catch (err) { alert("Error: " + err.message); }
  };

  /* ── payment actions ── */
  const openPayModal = b => { setPayForm({ guestName: b.guestName || b.name, bookingId: b._id, amount: "", method: "Cash", status: "Paid" }); setPayModal(true); };
  const handlePaySubmit = async e => {
    e.preventDefault();
    if (!payForm.amount || Number(payForm.amount) <= 0) return alert("Enter a valid amount.");
    setPaySaving(true);
    const token = localStorage.getItem("adminToken");
    try {
      await api.post("/api/admin/payments", payForm, { headers: { Authorization: `Bearer ${token}` } });
      setPayModal(false);
      fetchData();
    } catch (err) { alert("Error: " + err.message); } finally { setPaySaving(false); }
  };

  /* ── offline booking ── */
  const handleOfflineSubmit = async e => {
    e.preventDefault();
    if (!offlineForm.name || !offlineForm.phone || !offlineForm.checkIn || !offlineForm.checkOut) return alert("Fill in all required fields.");
    if (new Date(offlineForm.checkIn) >= new Date(offlineForm.checkOut)) return alert("Check-out must be after check-in.");
    setOfflineSaving(true);
    const token = localStorage.getItem("adminToken");
    try {
      const res = await api.post("/api/admin/bookings/offline", offlineForm, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) {
        setOfflineModal(false);
        setOfflineForm({ name: "", phone: "", email: "", roomType: "Double Bed A/C", checkIn: "", checkOut: "", checkInTime: "", checkOutTime: "", guests: 2, rooms: 1, message: "", advancePaid: 0, paymentMethod: "Cash" });
        fetchData();
      }
    } catch (err) { alert("Error: " + (err.response?.data?.message || err.message)); } finally { setOfflineSaving(false); }
  };

  /* ── guests ── */
  const handleDeleteGuest = async id => {
    if (!window.confirm("Delete this guest record?")) return;
    const token = localStorage.getItem("adminToken");
    await api.delete(`/api/admin/guests/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    fetchData();
  };

  /* ── season toggles ── */
  const handleToggleSeason = async val => {
    const token = localStorage.getItem("adminToken");
    try { await api.patch("/api/admin/settings", { isSeason: val }, { headers: { Authorization: `Bearer ${token}` } }); setIsSeason(val); fetchData(); }
    catch { alert("Error updating season mode"); }
  };
  const handleToggleWeekend = async val => {
    const token = localStorage.getItem("adminToken");
    try { await api.patch("/api/admin/settings", { isWeekendActive: val }, { headers: { Authorization: `Bearer ${token}` } }); setIsWeekend(val); fetchData(); }
    catch { alert("Error updating weekend mode"); }
  };

  /* ── nav tabs ── */
  const NAV_TABS = [
    { id: "overview",  label: "Dashboard",  icon: LayoutDashboard },
    { id: "rooms",     label: "Rooms",       icon: BedDouble },
    { id: "bookings",  label: "Bookings",    icon: CalendarDays },
    { id: "guests",    label: "Guests",      icon: Users },
    { id: "payments",  label: "Payments",    icon: CreditCard },
    { id: "settings",  label: "Settings",    icon: Settings },
  ];

  /* ── render view ── */
  const renderView = () => {
    switch (activeTab) {
      case "overview":
        return <DashboardOverview stats={stats} bookings={bookings} />;
      case "rooms":
        return <RoomManagement rooms={rooms} onAddClick={openAddRoom} onDeleteRoom={handleDeleteRoom} onEditRoom={openEditRoom} />;
      case "bookings":
        return (
          <BookingManagement
            bookings={bookings} rooms={rooms}
            onConfirm={handleConfirm} onCancel={handleCancel}
            onCheckOut={handleCheckOut} onWhatsApp={handleWhatsApp}
            onDelete={handleDeleteBooking} onAddPayment={openPayModal}
            onUpdateRoomNumber={handleUpdateRoomNumber}
            onAddOfflineClick={() => setOfflineModal(true)}
          />
        );
      case "guests":
        return <GuestsView guests={guests} onDeleteGuest={handleDeleteGuest} />;
      case "payments":
        return <PaymentsView payments={payments} totalRevenue={stats?.totalRevenue} />;
      case "settings":
        return <SettingsView isSeason={isSeason} onToggleSeason={handleToggleSeason} isWeekendActive={isWeekend} onToggleWeekend={handleToggleWeekend} />;
      default:
        return <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">Coming Soon…</div>;
    }
  };

  return (
    <AdminLayout>
      {loading ? (
        <div className="flex items-center justify-center h-full p-20"><LoadingSpinner /></div>
      ) : (
        <div className="p-4 md:p-6 space-y-5">

          {/* ── Page Header ── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-extrabold text-slate-800 capitalize">{activeTab}</h1>
                <p className="text-slate-400 text-xs mt-0.5">Work with real occupancy and data logs</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => fetchData(true)} disabled={refreshing}
                  className="flex items-center gap-2 border border-slate-200 text-slate-600 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
                  Refresh
                </button>
                <a href="/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm">
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Site
                </a>
              </div>
            </div>

            {/* Sub-nav tabs */}
            <div className="flex gap-1 mt-4 overflow-x-auto">
              {NAV_TABS.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === id
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                  }`}>
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ── View Content ── */}
          {renderView()}
        </div>
      )}

      {/* ════════ MODALS ════════ */}

      {/* Room Modal */}
      <AnimatePresence>
        {roomModal && (
          <Modal title={editingRoom ? "Edit Room" : "Add New Room"} isOpen={roomModal} onClose={() => setRoomModal(false)}>
            <form onSubmit={handleRoomSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Room Number *</label>
                  <input required type="text" value={roomForm.roomNumber}
                    onChange={e => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
                    placeholder="e.g. 101"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Room Type</label>
                  <select value={roomForm.type} onChange={e => setRoomForm({ ...roomForm, type: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400">
                    <option>Double Bed A/C</option>
                    <option>Double Bed</option>
                    <option>Three Bed</option>
                    <option>Four Bed A/C</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[["Weekday Price (₹)", "nonSeasonPrice", "1200"], ["Weekend Price (₹)", "weekendPrice", "1600"], ["Peak Price (₹)", "seasonPrice", "2000"]].map(([lbl, key, ph]) => (
                  <div key={key}>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">{lbl}</label>
                    <input required type="number" value={roomForm[key]}
                      onChange={e => setRoomForm({ ...roomForm, [key]: e.target.value })}
                      placeholder={ph}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Status</label>
                <select value={roomForm.status} onChange={e => setRoomForm({ ...roomForm, status: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400">
                  <option>Available</option><option>Occupied</option><option>Maintenance</option>
                </select>
              </div>
              <button type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-sm">
                {editingRoom ? "Update Room" : "Create Room"}
              </button>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {payModal && (
          <Modal title="Record Payment" isOpen={payModal} onClose={() => setPayModal(false)}>
            <form onSubmit={handlePaySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Guest Name</label>
                <input required type="text" value={payForm.guestName}
                  onChange={e => setPayForm({ ...payForm, guestName: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Amount (₹)</label>
                  <input required type="number" min="1" value={payForm.amount}
                    onChange={e => setPayForm({ ...payForm, amount: e.target.value })}
                    placeholder="e.g. 2600"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Method</label>
                  <select value={payForm.method} onChange={e => setPayForm({ ...payForm, method: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400">
                    <option>Cash</option><option>UPI</option><option>Card</option><option>Net Banking</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Status</label>
                <select value={payForm.status} onChange={e => setPayForm({ ...payForm, status: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400">
                  <option>Paid</option><option>Pending</option><option>Refunded</option>
                </select>
              </div>
              <button type="submit" disabled={paySaving}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-sm disabled:opacity-60">
                {paySaving ? "Saving…" : "💾 Record Payment"}
              </button>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      {/* Offline Booking Modal */}
      <AnimatePresence>
        {offlineModal && (
          <Modal title="➕ Add Offline Booking" isOpen={offlineModal} onClose={() => setOfflineModal(false)}>
            <form onSubmit={handleOfflineSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Customer Name *</label>
                <input required type="text" value={offlineForm.name}
                  onChange={e => setOfflineForm({ ...offlineForm, name: e.target.value })}
                  placeholder="Full name"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Phone *</label>
                  <input required type="text" value={offlineForm.phone}
                    onChange={e => setOfflineForm({ ...offlineForm, phone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Email</label>
                  <input type="email" value={offlineForm.email}
                    onChange={e => setOfflineForm({ ...offlineForm, email: e.target.value })}
                    placeholder="optional"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Room Type *</label>
                  <select value={offlineForm.roomType} onChange={e => setOfflineForm({ ...offlineForm, roomType: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400">
                    <option>Double Bed</option><option>Double Bed A/C</option><option>Three Bed</option><option>Four Bed A/C</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Guests</label>
                  <input type="number" min="1" max="40" value={offlineForm.guests}
                    onChange={e => setOfflineForm({ ...offlineForm, guests: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Check-In Date *</label>
                  <input required type="date" min={todayStr} value={offlineForm.checkIn}
                    onChange={e => setOfflineForm({ ...offlineForm, checkIn: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Check-In Time *</label>
                  <input required type="time" value={offlineForm.checkInTime}
                    onChange={e => setOfflineForm({ ...offlineForm, checkInTime: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Check-Out Date *</label>
                  <input required type="date" min={offlineForm.checkIn || todayStr} value={offlineForm.checkOut}
                    onChange={e => setOfflineForm({ ...offlineForm, checkOut: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Check-Out Time *</label>
                  <input required type="time" value={offlineForm.checkOutTime}
                    onChange={e => setOfflineForm({ ...offlineForm, checkOutTime: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Advance Paid (₹)</label>
                  <input type="number" min="0" value={offlineForm.advancePaid}
                    onChange={e => setOfflineForm({ ...offlineForm, advancePaid: e.target.value })}
                    placeholder="0"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Payment Method</label>
                  <select value={offlineForm.paymentMethod} onChange={e => setOfflineForm({ ...offlineForm, paymentMethod: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400">
                    <option>Cash</option><option>UPI</option><option>Card</option><option>Net Banking</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Special Notes</label>
                <input type="text" value={offlineForm.message}
                  onChange={e => setOfflineForm({ ...offlineForm, message: e.target.value })}
                  placeholder="e.g. Early check-in requested"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
              </div>
              <button type="submit" disabled={offlineSaving}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-sm disabled:opacity-60">
                {offlineSaving ? "Adding Offline Booking…" : "💾 Confirm Offline Booking"}
              </button>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
