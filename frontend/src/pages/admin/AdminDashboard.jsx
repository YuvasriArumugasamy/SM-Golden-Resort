import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays, BedDouble, CheckCircle2,
  Clock, RefreshCw, ExternalLink,
  MapPin, Star, ChevronLeft, ChevronRight, Thermometer,
  Wifi, Wind, Tv, Image as ImageIcon,
  X, Edit3,
} from "lucide-react";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import AdminLayout from "../../components/AdminLayout";

// ── Property photos (uses existing public images) ──
const PROPERTY_PHOTOS = [
  "/WhatsApp Image 2026-06-14 at 07.53.04.jpeg",
  "/WhatsApp Image 2026-06-14 at 07.53.09.jpeg",
  "/WhatsApp Image 2026-06-14 at 07.53.10.jpeg",
  "/WhatsApp Image 2026-06-14 at 07.53.15 (1).jpeg",
  "/WhatsApp Image 2026-06-14 at 07.53.16.jpeg",
  "/WhatsApp Image 2026-06-14 at 07.53.17.jpeg",
  "/WhatsApp Image 2026-06-14 at 07.56.05.jpeg",
  "/WhatsApp Image 2026-06-14 at 09.15.41.jpeg",
  "/WhatsApp Image 2026-05-15 at 10.48.37.webp",
  "/WhatsApp Image 2026-05-15 at 10.48.39.webp",
  "/WhatsApp Image 2026-05-15 at 10.48.40.webp",
  "/WhatsApp Image 2026-05-15 at 10.48.41.webp",
];

// ── Hotel Listing Card ──
function HotelListingCard() {
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  const prev = () => setCurrentPhoto(c => (c - 1 + PROPERTY_PHOTOS.length) % PROPERTY_PHOTOS.length);
  const next = () => setCurrentPhoto(c => (c + 1) % PROPERTY_PHOTOS.length);

  const tabs = ["Overview", "Amenities", "Rooms"];
  const tabContent = {
    overview: (
      <div className="mt-3 text-sm text-slate-600 leading-relaxed">
        SM Golden Resorts is located on Old Falls Main Road, just 0.38km from the iconic Courtallam Old Falls.
        We offer 11 thoughtfully designed rooms including Non-AC, AC, Suite, and Villa options — perfect for families and couples.
      </div>
    ),
    amenities: (
      <div className="mt-3 flex flex-wrap gap-2">
        {[
          { icon: Wifi, label: "Free WiFi" },
          { icon: Wind, label: "AC Rooms" },
          { icon: Tv, label: "TV" },
          { icon: CheckCircle2, label: "Hot Water" },
          { icon: CheckCircle2, label: "Parking" },
          { icon: CheckCircle2, label: "24/7 Check-in" },
          { icon: CheckCircle2, label: "Family Rooms" },
          { icon: CheckCircle2, label: "Near Falls" },
        ].map(({ icon: Icon, label }) => (
          <span key={label} className="flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full font-medium">
            <Icon className="w-3 h-3 text-blue-500" /> {label}
          </span>
        ))}
      </div>
    ),
    rooms: (
      <div className="mt-3 space-y-2">
        {[
          { type: "Non-AC Room", price: "₹1,500/night", beds: "1 Double Bed", avail: true },
          { type: "AC Room", price: "₹2,000/night", beds: "1 Double Bed", avail: true },
          { type: "Villa (Room 110)", price: "₹2,500/night", beds: "2 Beds", avail: true },
          { type: "Suite Room", price: "₹10,000/night", beds: "King Bed + Lounge", avail: false },
        ].map(r => (
          <div key={r.type} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
            <div>
              <p className="text-sm font-bold text-slate-800">{r.type}</p>
              <p className="text-xs text-slate-500">{r.beds}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-extrabold text-blue-600">{r.price}</p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.avail ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                {r.avail ? "✓ Available" : "✕ Full"}
              </span>
            </div>
          </div>
        ))}
      </div>
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6"
    >
      {/* ── Photo Carousel ── */}
      <div className="relative h-56 sm:h-64 bg-slate-200 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={currentPhoto}
            src={PROPERTY_PHOTOS[currentPhoto]}
            alt={`SM Golden Resorts - Photo ${currentPhoto + 1}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

        {/* Prev / Next */}
        <button onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all z-10">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all z-10">
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Photos count badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm z-10">
          <ImageIcon className="w-3.5 h-3.5" />
          {currentPhoto + 1} of {PROPERTY_PHOTOS.length} photos
        </div>

        {/* Dot strip */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
          {PROPERTY_PHOTOS.map((_, i) => (
            <button key={i} onClick={() => setCurrentPhoto(i)}
              className={`rounded-full transition-all ${i === currentPhoto ? "bg-white w-4 h-1.5" : "bg-white/50 w-1.5 h-1.5"}`} />
          ))}
        </div>
      </div>

      {/* ── Hotel Info ── */}
      <div className="p-4 sm:p-5">
        {/* Name + Temp */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
            SM Golden Resorts in Courtallam
          </h2>
          <div className="flex flex-col items-center shrink-0 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2">
            <Thermometer className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-extrabold text-blue-700 mt-0.5">27°C</span>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-1.5 text-slate-500 text-sm mb-3">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>Old Falls Main Road, Old Falls, Courtallam, Tamil Nadu 627802, India</span>
        </div>

        {/* Rating + Reviews + Badge */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
            <span className="text-white text-[9px] font-extrabold">G</span>
          </div>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-sm font-bold text-slate-700">56 Reviews</span>
          <span className="bg-orange-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wide">
            Limited Offer
          </span>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-1 border-b border-slate-200 mb-0 overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-4 py-2.5 text-sm font-bold whitespace-nowrap transition-all border-b-2 -mb-px ${
                activeTab === tab.toLowerCase()
                  ? "text-blue-600 border-blue-600"
                  : "text-slate-500 border-transparent hover:text-slate-700"
              }`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}>
            {tabContent[activeTab]}
          </motion.div>
        </AnimatePresence>

        {/* WhatsApp Button */}
        <div className="flex justify-end mt-4 pt-4 border-t border-slate-100">
          <a href="https://wa.me/919443710420" target="_blank" rel="noopener noreferrer"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm flex items-center gap-1.5">
            💬 WhatsApp
          </a>
        </div>

      </div>
    </motion.div>
  );
}

// ── Manage Booking Modal ──
function ManageBookingModal({ isOpen, onClose }) {
  const [phone, setPhone] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success'|'error', text }

  const reset = () => {
    setPhone("");
    setBookingId("");
    setMessage(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleAction = async (action) => {
    if (!phone && !bookingId) {
      setMessage({ type: "error", text: "Please enter phone number or booking ID." });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      if (action === "cancel") {
        await api.patch("/api/admin/bookings/manage", { phone, bookingId, action: "cancel" });
        setMessage({ type: "success", text: "Booking cancelled successfully." });
      } else {
        // Modify — navigate to bookings page filtered
        window.location.href = `/admin/bookings?search=${bookingId || phone}`;
      }
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Action failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", duration: 0.35 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                  <CalendarDays className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 font-jakarta">Manage Booking</h2>
              </div>
              <button onClick={handleClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-5 space-y-5">
              {/* Phone Number */}
              <div>
                <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">
                  Phone Number
                </label>
                <div className="flex items-center gap-0 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  {/* India flag picker */}
                  <div className="flex items-center gap-1.5 px-3 py-3 bg-slate-100 border-r border-slate-200 shrink-0 cursor-default select-none">
                    <span className="text-lg">🇮🇳</span>
                    <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="Please enter phone"
                    className="flex-1 bg-transparent px-4 py-3 text-sm text-slate-700 placeholder-slate-400 outline-none font-medium"
                  />
                </div>
              </div>

              {/* Booking ID */}
              <div>
                <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">
                  Booking ID
                </label>
                <div className="flex items-center gap-0 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <span className="pl-4 text-slate-400 font-bold text-sm">#</span>
                  <input
                    type="text"
                    value={bookingId}
                    onChange={e => setBookingId(e.target.value)}
                    placeholder="Please enter booking id"
                    className="flex-1 bg-transparent px-3 py-3.5 text-sm text-slate-700 placeholder-slate-400 outline-none font-medium"
                  />
                </div>
              </div>

              {/* Error / Success message */}
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-xs font-bold px-4 py-2.5 rounded-xl ${
                    message.type === "error"
                      ? "bg-red-50 text-red-600 border border-red-200"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  }`}
                >
                  {message.text}
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* Cancel Booking */}
                <button
                  onClick={() => handleAction("cancel")}
                  disabled={loading}
                  className="flex flex-col items-center justify-center gap-1 py-4 rounded-2xl border-2 border-red-300 text-red-500 hover:bg-red-50 font-extrabold text-sm transition-all disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel<br />Booking</span>
                </button>

                {/* Modify Booking */}
                <button
                  onClick={() => handleAction("modify")}
                  disabled={loading}
                  className="flex flex-col items-center justify-center gap-1 py-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white font-extrabold text-sm shadow-md hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Modify<br />Booking</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

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
  const [manageModalOpen, setManageModalOpen] = useState(false);

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
      <div className="p-6 md:p-8">
        <HotelListingCard />
        <div className="flex items-center justify-center h-40"><LoadingSpinner /></div>
      </div>
    </AdminLayout>
  );

  return (
    <>
    <AdminLayout>
      <div className="p-6 md:p-8 space-y-8">
        {/* Hotel Listing Card */}
        <HotelListingCard />

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
            <button
              onClick={() => setManageModalOpen(true)}
              className="flex items-center gap-2 bg-navy text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-navy/90 transition-all shadow-sm">
              <CalendarDays className="w-3.5 h-3.5" /> Manage Bookings
            </button>
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
    <ManageBookingModal isOpen={manageModalOpen} onClose={() => setManageModalOpen(false)} />
    </>
  );
}
