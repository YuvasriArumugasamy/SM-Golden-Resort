import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, Check, Calendar, ArrowLeft, ArrowRight,
  CheckCircle2, Ticket, Info, ShieldCheck, MapPin, Phone,
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";

/* ─── All resort photos ─── */
const ALL_PHOTOS = [
  "/WhatsApp Image 2026-06-14 at 07.53.04.jpeg",
  "/WhatsApp Image 2026-06-14 at 07.53.09.jpeg",
  "/WhatsApp Image 2026-06-14 at 07.53.09 (1).jpeg",
  "/WhatsApp Image 2026-06-14 at 07.53.10.jpeg",
  "/WhatsApp Image 2026-06-14 at 07.53.15 (1).jpeg",
  "/WhatsApp Image 2026-06-14 at 07.53.16.jpeg",
  "/WhatsApp Image 2026-06-14 at 07.53.16 (1).jpeg",
  "/WhatsApp Image 2026-06-14 at 07.53.17.jpeg",
  "/WhatsApp Image 2026-06-14 at 07.56.05.jpeg",
  "/WhatsApp Image 2026-06-14 at 09.15.41.jpeg",
];

const ROOM_PHOTOS = {
  "101": ["/WhatsApp Image 2026-06-14 at 07.53.04.jpeg", "/WhatsApp Image 2026-06-14 at 07.53.09.jpeg", "/WhatsApp Image 2026-06-14 at 07.53.10.jpeg", "/WhatsApp Image 2026-05-15 at 10.48.37.webp"],
  "102": ["/WhatsApp Image 2026-05-15 at 10.48.35 (1).webp", "/WhatsApp Image 2026-06-14 at 07.53.15 (1).jpeg", "/WhatsApp Image 2026-06-14 at 07.53.16 (1).jpeg", "/WhatsApp Image 2026-05-15 at 10.48.40.webp"],
  "104": ["/WhatsApp Image 2026-06-14 at 07.53.17.jpeg", "/WhatsApp Image 2026-06-14 at 07.53.16.jpeg", "/WhatsApp Image 2026-05-15 at 10.48.39 (1).webp", "/WhatsApp Image 2026-05-15 at 10.48.41.webp"],
  "110": ["/WhatsApp Image 2026-06-14 at 09.15.41.jpeg", "/WhatsApp Image 2026-06-14 at 07.56.05.jpeg", "/WhatsApp Image 2026-05-15 at 10.48.39.webp", "/WhatsApp Image 2026-06-14 at 07.53.09 (1).jpeg"],
};

/* ─── Sidebar image carousel ─── */
function SidebarCarousel({ photos }) {
  const [idx, setIdx] = React.useState(0);
  if (!photos.length) return null;
  return (
    <div className="relative h-44 bg-slate-100 overflow-hidden rounded-t-2xl">
      <AnimatePresence mode="wait" initial={false}>
        <motion.img key={idx} src={photos[idx]} alt="Room"
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.22 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
      <button onClick={() => setIdx(i => (i - 1 + photos.length) % photos.length)}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center z-10 transition-all">
        <ChevronDown className="w-3.5 h-3.5 rotate-90" />
      </button>
      <button onClick={() => setIdx(i => (i + 1) % photos.length)}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center z-10 transition-all">
        <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
      </button>
      <div className="absolute top-2 right-2 bg-black/50 text-white text-[9px] font-bold px-2 py-0.5 rounded-full z-10">
        {idx + 1}/{photos.length}
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
        {photos.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`rounded-full transition-all ${i === idx ? "bg-white w-3 h-1.5" : "bg-white/50 w-1.5 h-1.5"}`} />
        ))}
      </div>
    </div>
  );
}

/* ─── Step indicator ─── */
function StepBar({ step }) {
  const steps = ["Selection", "Details", "Finish"];
  return (
    <section className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-5 flex items-center justify-between">
        {steps.map((label, i) => {
          const n = i + 1;
          const done = step > n;
          const active = step === n;
          return (
            <React.Fragment key={label}>
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-extrabold text-xs transition-all ${
                  done   ? "bg-emerald-500 border border-emerald-500 text-white" :
                  active ? "bg-blue-600 border border-blue-600 text-white" :
                           "bg-slate-100 border border-slate-200 text-slate-400"
                }`}>
                  {done ? "✓" : n}
                </div>
                <span className={`text-xs md:text-sm font-bold hidden sm:block ${
                  active ? "text-blue-600" : done ? "text-emerald-600" : "text-slate-400"
                }`}>{label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 transition-colors ${done ? "bg-emerald-300" : "bg-slate-200"}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
}

/* ══════════════════════════════════
   MAIN BOOKING PAGE
══════════════════════════════════ */
export default function Booking() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const passed    = location.state || {};

  /* ─── state ─── */
  const [rooms,        setRooms]        = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [roomId,       setRoomId]       = useState(passed.roomId || "");
  const [checkIn,  setCheckIn]   = useState(passed.checkIn  ? new Date(passed.checkIn)  : new Date());
  const [checkOut, setCheckOut]  = useState(passed.checkOut ? new Date(passed.checkOut) : (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d; })());
  const [guests,   setGuests]    = useState(passed.guests || 2);

  const [step,          setStep]         = useState(1);
  const [guestName,     setGuestName]    = useState("");
  const [salutation,    setSalutation]   = useState("Mr");
  const [phone,         setPhone]        = useState("");
  const [email,         setEmail]        = useState("");
  const [specialReq,    setSpecialReq]   = useState("");
  const [paymentMode,   setPaymentMode]  = useState("property");
  const [promoCode,     setPromoCode]    = useState("");
  const [promoApplied,  setPromoApplied] = useState(false);
  const [showPolicy,    setShowPolicy]   = useState(false);
  const [bookingLoading,setBookingLoading] = useState(false);
  const [createdBooking,setCreatedBooking] = useState(null);
  const [timeLeft,      setTimeLeft]     = useState(900);
  const [galleryIdx,    setGalleryIdx]   = useState(0);

  /* ─── fetch rooms ─── */
  useEffect(() => {
    api.get("/api/rooms")
      .then(res => {
        setRooms(res.data || []);
        if (!roomId && res.data?.length) setRoomId(res.data[0].roomId);
      })
      .catch(() => toast.error("Failed to load rooms. Please try again."))
      .finally(() => setLoadingRooms(false));
  }, []);

  /* ─── countdown timer ─── */
  useEffect(() => {
    if (step !== 2 || timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [step, timeLeft]);

  const fmtTime = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  /* ─── gallery auto-rotate ─── */
  useEffect(() => {
    if (step !== 1) return;
    const t = setInterval(() => setGalleryIdx(i => (i + 1) % ALL_PHOTOS.length), 3500);
    return () => clearInterval(t);
  }, [step]);

  /* ─── pricing ─── */
  const selectedRoom = rooms.find(r => r.roomId === roomId);
  const nights       = useMemo(() => Math.max(1, Math.ceil((checkOut - checkIn) / 86400000)), [checkIn, checkOut]);
  const basePrice    = selectedRoom ? selectedRoom.price * nights : 0;
  const promoRate    = promoApplied ? 0.15 : 0.10;
  const discount     = Math.round(basePrice * promoRate);
  const tax          = Math.round((basePrice - discount) * 0.05);
  const finalPrice   = basePrice - discount + tax;
  const deposit      = Math.round(finalPrice * 0.2065);

  const todayStr = new Date().toISOString().split("T")[0];

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return toast.error("Enter a promo code");
    if (["SMGOLD5", "WELCOME"].includes(promoCode.toUpperCase())) {
      setPromoApplied(true);
      toast.success("Coupon applied! 5% extra discount.");
    } else {
      toast.error("Invalid coupon code");
    }
  };

  const goToStep2 = () => {
    if (!roomId)  return toast.error("Please select a room");
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!guestName.trim())          return toast.error("Please enter your name");
    if (!phone.trim() || phone.length < 9) return toast.error("Please enter a valid phone number");
    setBookingLoading(true);
    try {
      const res = await api.post("/api/bookings", {
        guestName: `${salutation} ${guestName}`,
        phone,
        email: email || "no-email@smgoldenresorts.com",
        roomId,
        checkIn:  checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        guests:   Number(guests),
        specialRequests: specialReq,
        paymentMode,
        totalPrice: finalPrice,
      });
      toast.success("Booking registered successfully! 🎉");
      setCreatedBooking(res.data.booking);
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loadingRooms) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );

  /* ══════════════
     STEP 1 — Room Selection
  ══════════════ */
  if (step === 1) return (
    <div className="bg-slate-50 min-h-screen font-jakarta text-slate-800">
      <StepBar step={1} />

      {/* Hero photo */}
      <div className="relative h-56 md:h-72 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.img key={galleryIdx} src={ALL_PHOTOS[galleryIdx]} alt="SM Golden Resorts"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
        <div className="absolute bottom-5 left-0 right-0 text-center">
          <p className="text-white font-extrabold text-xl md:text-2xl drop-shadow">SM Golden Resorts, Courtallam</p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <MapPin className="w-3.5 h-3.5 text-white/70" />
            <p className="text-white/70 text-xs font-medium">Old Falls Main Road · 0.38 km to Old Falls</p>
          </div>
        </div>
        {/* Dot indicators */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {ALL_PHOTOS.map((_, i) => (
            <button key={i} onClick={() => setGalleryIdx(i)}
              className={`rounded-full transition-all ${i === galleryIdx ? "bg-white w-3 h-1.5" : "bg-white/40 w-1.5 h-1.5"}`} />
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* LEFT — Room Picker + Dates */}
          <div className="lg:col-span-2 space-y-5">

            {/* Dates row */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" /> Your Stay
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Check-in</label>
                  <input type="date" min={todayStr}
                    value={checkIn.toISOString().split("T")[0]}
                    onChange={e => { if (e.target.value) setCheckIn(new Date(e.target.value)); }}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Check-out</label>
                  <input type="date" min={checkIn.toISOString().split("T")[0]}
                    value={checkOut.toISOString().split("T")[0]}
                    onChange={e => { if (e.target.value) setCheckOut(new Date(e.target.value)); }}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Guests</label>
                  <input type="number" min="1" max="20" value={guests}
                    onChange={e => setGuests(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-slate-50"
                  />
                </div>
              </div>
              {nights > 0 && (
                <div className="mt-3 inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-200">
                  🌙 {nights} Night{nights > 1 ? "s" : ""} stay
                </div>
              )}
            </div>

            {/* Room cards */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4">Select Room Type</h3>
              <div className="space-y-3">
                {rooms.map(room => (
                  <motion.div key={room.roomId}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setRoomId(room.roomId)}
                    className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all flex gap-4 items-start ${
                      roomId === room.roomId
                        ? "border-blue-500 bg-blue-50/30 shadow-md"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                    }`}
                  >
                    {/* Photo thumb */}
                    <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                      <img src={(ROOM_PHOTOS[room.roomId] || ALL_PHOTOS)[0]} alt={room.name}
                        className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-extrabold text-slate-800 text-sm leading-tight">{room.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5">{room.type} · {room.beds || "1 Bed"}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-extrabold text-blue-600 text-sm">₹{room.price?.toLocaleString()}</p>
                          <p className="text-[9px] text-slate-400 font-medium">/night</p>
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(room.amenities || ["WiFi", "Hot Water", "TV"]).slice(0, 4).map(a => (
                          <span key={a} className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">{a}</span>
                        ))}
                      </div>

                      {/* Price total */}
                      {nights > 0 && (
                        <p className="text-[10px] font-bold text-emerald-600 mt-1.5">
                          ₹{(room.price * nights).toLocaleString()} for {nights} night{nights > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>

                    {/* Selected check */}
                    {roomId === room.roomId && (
                      <div className="absolute top-3 right-3 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            <button onClick={goToStep2}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-xl text-sm transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
              Continue to Guest Details <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* RIGHT — Info sidebar */}
          <div className="space-y-4">
            {/* Resort info */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <span className="text-white font-extrabold text-xs">SM</span>
                </div>
                <div>
                  <p className="text-white font-extrabold text-sm leading-none">SM Golden Resorts</p>
                  <p className="text-blue-200 text-[10px] mt-0.5">Courtallam, Tamil Nadu</p>
                </div>
              </div>
              <div className="p-4 space-y-2.5 text-xs">
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Old Falls Main Road, Courtallam – 627 802
                </div>
                <a href="tel:9443710420" className="flex items-center gap-2 text-blue-600 font-bold hover:underline">
                  <Phone className="w-3.5 h-3.5" /> 9443710420
                </a>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["Free WiFi", "Parking", "Kitchen", "24/7 Check-in", "Near Falls"].map(f => (
                    <span key={f} className="bg-slate-50 border border-slate-200 text-slate-500 text-[9px] font-bold px-2 py-0.5 rounded-full">{f}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Why book here */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
              <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Why Book Direct</h4>
              {[
                ["✓ Best price guaranteed", "No hidden charges"],
                ["✓ Instant confirmation", "Via WhatsApp"],
                ["✓ Flexible check-in", "Subject to availability"],
              ].map(([title, sub]) => (
                <div key={title} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-extrabold text-slate-800">{title}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /* ══════════════
     STEP 2 — Guest Details
  ══════════════ */
  if (step === 2) return (
    <div className="bg-slate-50 min-h-screen font-jakarta text-slate-800 pb-24">
      <StepBar step={2} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* LEFT — Forms */}
          <div className="lg:col-span-2 space-y-5">

            <button onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Room Selection
            </button>

            {/* Contact */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h3 className="text-sm font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-4 bg-blue-600 rounded" /> Contact Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Phone Number *</label>
                  <div className="flex border border-slate-200 rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                    <div className="px-3 py-2.5 bg-slate-50 border-r border-slate-200 text-xs font-bold text-slate-600 flex items-center gap-1 shrink-0">
                      🇮🇳 +91
                    </div>
                    <input type="tel" value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="10-digit mobile number"
                      className="w-full px-4 py-2.5 text-xs font-bold text-slate-800 outline-none bg-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Guest info */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h3 className="text-sm font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-4 bg-blue-600 rounded" /> Guest Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Title</label>
                  <select value={salutation} onChange={e => setSalutation(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 transition-all">
                    <option>Mr</option><option>Ms</option><option>Mrs</option>
                  </select>
                </div>
                <div className="col-span-1 md:col-span-3">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                  <input type="text" value={guestName} onChange={e => setGuestName(e.target.value)}
                    placeholder="Enter guest full name"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Special requests */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
              <h3 className="text-sm font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-4 bg-blue-600 rounded" /> Special Requests
              </h3>
              <textarea value={specialReq} onChange={e => setSpecialReq(e.target.value)}
                rows="3" placeholder="e.g. Early check-in, extra bed, any specific needs..."
                className="w-full border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white transition-all resize-none"
              />
            </div>

            {/* Refund policy */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <button onClick={() => setShowPolicy(!showPolicy)}
                className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                <span className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-500 shrink-0" /> Refund & Cancellation Policy
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showPolicy ? "rotate-180" : ""}`} />
              </button>
              {showPolicy && (
                <div className="px-5 pb-5 border-t border-slate-100 pt-4 text-xs text-slate-600 leading-relaxed space-y-2 font-medium">
                  <p>• Cancel free of charge up to 48 hours prior to arrival.</p>
                  <p>• Within 48 hours, 1 night stay charges apply as cancellation fee.</p>
                  <p>• Refunds processed within 5–7 working days via original payment method.</p>
                </div>
              )}
            </div>

            {/* Payment mode */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h3 className="text-sm font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-4 bg-blue-600 rounded" /> Payment Mode
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: "property", title: "Pay At Property", sub: "No advance needed. Pay at check-in.", badge: null },
                  { id: "deposit",  title: `Pay 20.65% Now (₹${deposit.toLocaleString()})`, sub: "Secure online deposit to guarantee your stay.", badge: "INSTANT" },
                ].map(opt => (
                  <div key={opt.id} onClick={() => setPaymentMode(opt.id)}
                    className={`border-2 rounded-xl p-4 cursor-pointer flex items-start justify-between gap-3 transition-all ${
                      paymentMode === opt.id
                        ? "border-blue-500 bg-blue-50/30 shadow-sm"
                        : "border-slate-200 hover:border-slate-300"
                    }`}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-extrabold text-slate-900">{opt.title}</p>
                        {opt.badge && <span className="text-[9px] font-extrabold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">{opt.badge}</span>}
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium">{opt.sub}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                      paymentMode === opt.id ? "bg-blue-600 border-blue-600" : "border-slate-300"
                    }`}>
                      {paymentMode === opt.id && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT — Summary sidebar */}
          <div className="space-y-4 lg:sticky lg:top-24">

            {/* Countdown */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-amber-400 px-4 py-1.5">
                <span className="text-white text-xs font-extrabold">⚡ FLASH SALE</span>
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-xs text-slate-600 font-medium">Booking saved for</span>
                <span className="text-base font-extrabold text-amber-600">{fmtTime(timeLeft)}</span>
              </div>
            </div>

            {/* Room summary card */}
            {selectedRoom && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <SidebarCarousel photos={ROOM_PHOTOS[roomId] || ALL_PHOTOS.slice(0, 4)} />
                <div className="p-4 space-y-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold mb-1">
                      <span>⭐ 4.3</span> <span>·</span> <span>SM Golden Resorts</span>
                    </div>
                    <p className="font-extrabold text-slate-800 text-sm">{selectedRoom.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-xs">
                    <div>
                      <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Check-in</span>
                      <p className="font-bold text-slate-700 mt-0.5">{checkIn.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}</p>
                      <p className="text-[9px] text-slate-400">11:00 AM</p>
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Check-out</span>
                      <p className="font-bold text-slate-700 mt-0.5">{checkOut.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}</p>
                      <p className="text-[9px] text-slate-400">10:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold border-t border-slate-100 pt-2">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Duration</span>
                    <span className="text-slate-800">{nights} Night{nights > 1 ? "s" : ""}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Bill */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
              <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1 h-2.5 bg-blue-600 rounded" /> Bill Details
              </h4>
              {selectedRoom && (
                <div className="space-y-2 text-xs font-semibold text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{selectedRoom.name} × {nights}N</span>
                    <span className="font-bold text-slate-800">₹{basePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount ({promoApplied ? "15%" : "10%"})</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Taxes (5%)</span>
                    <span>+₹{tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-baseline border-t border-slate-100 pt-2">
                    <div>
                      <span className="font-extrabold text-slate-900 text-xs">Final Price</span>
                      <p className="text-[9px] text-slate-400 font-bold">(Incl. all taxes)</p>
                    </div>
                    <span className="text-lg font-extrabold text-blue-600">₹{finalPrice.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Promo */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-2.5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Ticket className="w-3 h-3" /> Promo Code
              </label>
              <div className="flex border border-slate-200 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <input type="text" value={promoCode} onChange={e => setPromoCode(e.target.value)}
                  placeholder="e.g. SMGOLD5" className="w-full px-3 py-2 text-xs font-bold text-slate-800 outline-none bg-transparent uppercase" />
                <button onClick={handleApplyPromo}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 text-xs transition-colors shrink-0">Apply</button>
              </div>
              {promoApplied && <p className="text-[10px] text-emerald-600 font-bold">✓ 5% extra discount applied!</p>}
            </div>

            {/* Trust */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3">
              <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-center">Book With Confidence</h4>
              {[
                ["100% Confirmation", "Your stay is instantly registered."],
                ["Easy Cancellation",  "Free cancellation up to 48 hours."],
                ["24/7 Support",       "Always here to help you."],
              ].map(([t, s]) => (
                <div key={t} className="flex gap-2.5 items-start">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-extrabold text-slate-800">{t}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{s}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-2xl z-40 py-4 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Total Price</span>
              <span className="text-lg font-extrabold text-blue-600">₹{finalPrice.toLocaleString()}</span>
            </div>
            <div className="h-6 w-px bg-slate-200 hidden sm:block" />
            <div className="hidden sm:block">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Stay</span>
              <span className="text-xs font-bold text-slate-600">{nights} Nights, {guests} Guests</span>
            </div>
          </div>
          <button onClick={handleSubmit} disabled={bookingLoading}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-8 rounded-xl transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm">
            {bookingLoading ? "Registering…" : "Complete Booking"} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  /* ══════════════
     STEP 3 — Success
  ══════════════ */
  return (
    <div className="bg-slate-50 min-h-screen font-jakarta text-slate-800">
      <StepBar step={3} />
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto px-4 py-16 text-center space-y-6">

        <div className="w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-800">Booking Confirmed! 🎉</h2>
          <p className="text-sm text-slate-500 font-medium">
            Thank you {salutation} {guestName}, your reservation has been registered successfully.
          </p>
        </div>

        {createdBooking && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Booking ID</span>
              <span className="text-xs font-extrabold text-slate-700 font-mono">{createdBooking._id?.slice(-8).toUpperCase()}</span>
            </div>
            <div className="space-y-2.5 text-xs font-semibold">
              {[
                ["Guest",       createdBooking.guestName],
                ["Phone",       `+91 ${createdBooking.phone}`],
                ["Room",        selectedRoom?.name || createdBooking.roomName],
                ["Check-in",    checkIn.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })],
                ["Check-out",   checkOut.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })],
                ["Duration",    `${nights} Night${nights > 1 ? "s" : ""}`],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-slate-400">{label}</span>
                  <span className="text-slate-800">{val}</span>
                </div>
              ))}
              <div className="flex justify-between">
                <span className="text-slate-400">Payment</span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                  paymentMode === "property" ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}>{paymentMode === "property" ? "Pay At Property" : "Deposit Paid"}</span>
              </div>
              <div className="flex justify-between items-baseline border-t border-slate-100 pt-2">
                <span className="text-slate-900 font-extrabold">Total</span>
                <span className="text-lg font-extrabold text-blue-600">₹{(createdBooking.totalPrice || finalPrice).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-sm">
            Back to Home
          </Link>
          <a href={`https://wa.me/919443710420?text=Hi!%20I%20just%20booked%20a%20stay%20at%20SM%20Golden%20Resorts%20(ID:%20${createdBooking?._id?.slice(-8).toUpperCase()}).%20Please%20confirm!`}
            target="_blank" rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2">
            💬 Confirm on WhatsApp
          </a>
        </div>
      </motion.div>
    </div>
  );
}
