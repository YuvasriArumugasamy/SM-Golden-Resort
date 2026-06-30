import React, { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, MapPin, Phone, MessageCircle, ChevronDown,
  ArrowRight, CheckCircle2, Clock, Calendar, Download,
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import { roomsData as fallbackRooms } from "../utils/roomData";

/* ── room type → single image mapping ── */
const ROOM_TYPE_IMAGE = {
  "Non-AC":       "/ChatGPT Image Jun 21, 2026, 06_28_06 PM.webp",
  "AC":           "/ChatGPT Image Jun 21, 2026, 06_24_42 PM.webp",
  "Three Bed":    "/ChatGPT Image Jun 21, 2026, 06_28_06 PM.webp",
  "Four Bed AC":  "/ChatGPT Image Jun 21, 2026, 06_28_16 PM (1).webp",
  "Villa":        "/ChatGPT Image Jun 21, 2026, 06_20_50 PM.webp",
  "Suite AC":     "/ChatGPT Image Jun 21, 2026, 06_28_16 PM (1).webp",
};

const FALLBACK_IMG = "/WhatsApp Image 2026-06-14 at 07.53.16.webp";

/* ── Step Bar ── */
function StepBar({ step }) {
  return (
    <div className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center">
        {/* Step 1 */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold border-2 transition-all ${
            step > 1 ? "bg-emerald-500 border-emerald-500 text-white"
            : "bg-blue-600 border-blue-600 text-white"
          }`}>
            {step > 1 ? "✓" : "1"}
          </div>
          <span className="text-sm font-bold text-slate-800 leading-tight">Room &<br className="sm:hidden" /> Dates</span>
        </div>

        {/* Connector line */}
        <div className={`flex-1 h-0.5 mx-4 transition-colors ${step > 1 ? "bg-emerald-400" : "bg-slate-200"}`} />

        {/* Step 2 */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold border-2 transition-all ${
            step === 2 ? "bg-blue-600 border-blue-600 text-white"
            : "bg-white border-slate-300 text-slate-400"
          }`}>
            2
          </div>
          <span className={`text-sm font-bold leading-tight ${step === 2 ? "text-slate-800" : "text-slate-400"}`}>
            Guest<br className="sm:hidden" /> Information
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Right Sidebar ── */
function Sidebar({ selectedRoom, checkIn, checkOut, guests, nights, roomCount, step, onChangeStep }) {
  const basePrice = selectedRoom ? selectedRoom.price * nights * roomCount : 0;
  const gst       = Math.round(basePrice * 0.12);
  const total     = basePrice + gst;

  const fmtDate = d => {
    if (!d) return "—";
    const date = new Date(d.includes("T") ? d : d + "T00:00:00");
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div className="space-y-4">
      {/* Hotel card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-900 px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
            <img src="/WhatsApp Image 2026-06-22 at 18.04.13.webp" alt="SM Golden Resorts" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-white font-extrabold text-sm leading-none">SM Golden Resorts</p>
            <p className="text-slate-400 text-[10px] mt-0.5">Courtallam, Tamil Nadu</p>
          </div>
        </div>
        <div className="p-4 space-y-2.5 text-xs">
          <div className="flex items-start gap-2 text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
            <span className="font-medium">Old Falls Main Road, Courtallam, Tamil Nadu – 627 802</span>
          </div>
          <a href="tel:9003549849" className="flex items-center gap-2 text-blue-600 font-bold hover:underline">
            <Phone className="w-3.5 h-3.5 text-blue-500" /> +91 90035 49849
          </a>
          <a href="https://wa.me/919003549849" target="_blank" rel="noreferrer"
            className="flex items-center gap-2 text-emerald-600 font-bold hover:underline">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-500" /> WhatsApp Us
          </a>
        </div>
      </div>

      {/* Booking summary */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-800 text-sm">Booking Summary</h3>
          {step === 2 && (
            <button onClick={onChangeStep}
              className="text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg hover:bg-blue-100 transition-all">
              Change
            </button>
          )}
        </div>

        {/* Dates */}
        <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3 border border-slate-200">
          <div className="text-center">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Check-in</p>
            <p className="font-extrabold text-slate-800 text-xs mt-0.5">{fmtDate(checkIn)}</p>
          </div>
          <div className={`px-3 py-1 rounded-lg text-xs font-extrabold ${nights > 0 ? "bg-slate-800 text-white" : "bg-slate-200 text-slate-400"}`}>
            {nights > 0 ? `${nights}N` : "—"}
          </div>
          <div className="text-center">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Check-out</p>
            <p className="font-extrabold text-slate-800 text-xs mt-0.5">{fmtDate(checkOut)}</p>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          {[["Room Type", selectedRoom?.type || "—"], ["Rooms", roomCount], ["Guests", guests]].map(([k, v]) => (
            <div key={k} className="flex justify-between text-slate-600 font-medium">
              <span>{k}</span>
              <span className="font-bold text-slate-800">{v}</span>
            </div>
          ))}
        </div>

        {/* Price */}
        {selectedRoom && nights > 0 ? (
          <div className="border-t border-slate-200 pt-3 space-y-2 text-xs">
            <p className="font-extrabold text-slate-700 text-[11px] uppercase tracking-wide">Price Breakdown</p>
            <div className="flex justify-between text-slate-600">
              <span>₹{selectedRoom.price?.toLocaleString("en-IN")} × {nights}N × {roomCount} room{roomCount > 1 ? "s" : ""}</span>
              <span className="font-bold text-slate-800 whitespace-nowrap">₹{basePrice.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>GST (12%)</span>
              <span className="font-bold text-slate-800 whitespace-nowrap">₹{gst.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold pt-1 border-t border-slate-100">
              <span className="text-slate-800">Total</span>
              <span className="text-blue-600 whitespace-nowrap">₹{total.toLocaleString("en-IN")}</span>
            </div>
            <p className="text-[9px] text-slate-400 italic">Inclusive of all taxes. Payment at property.</p>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 flex items-center gap-2 text-xs text-amber-700 font-medium">
            <span>💡</span> Select a room and dates to see pricing
          </div>
        )}
      </div>

      {/* Policies */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-2.5">
        <div className="flex items-center gap-2 mb-1">
          <span>📋</span>
          <h4 className="font-extrabold text-slate-800 text-sm">Booking Policies</h4>
        </div>
        {["Flexible Check-in / Check-out", "Extra Bed Available (on request)", "Confirmation via WhatsApp", "Payment at property", "Valid ID proof required at check-in"].map(p => (
          <div key={p} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> {p}
          </div>
        ))}
      </div>

      {/* Need Help */}
      <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-amber-600" />
          <h4 className="font-extrabold text-amber-800 text-sm">Need Help?</h4>
        </div>
        <p className="text-xs text-amber-700 font-medium">Prefer to book over the phone? Call or WhatsApp us directly.</p>
        <div className="grid grid-cols-2 gap-2">
          <a href="https://wa.me/919003549849" target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2.5 rounded-xl transition-all">
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
          </a>
          <a href="tel:9003549849"
            className="flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl transition-all">
            <Phone className="w-3.5 h-3.5" /> Call Now
          </a>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   MAIN
══════════════════════════════════ */
export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const passed   = location.state || {};

  const [rooms,          setRooms]          = useState(fallbackRooms);
  const [loadingRooms,   setLoadingRooms]   = useState(false);
  const [roomsError,     setRoomsError]     = useState(false);
  const [step,           setStep]           = useState(1);
  const [roomId,         setRoomId]         = useState(passed.roomId || fallbackRooms[0]?.roomId || "");
  const [checkIn,        setCheckIn]        = useState(
    passed.checkIn ? new Date(passed.checkIn).toISOString().split("T")[0] : ""
  );
  const [checkOut,       setCheckOut]       = useState(
    passed.checkOut ? new Date(passed.checkOut).toISOString().split("T")[0] : ""
  );
  const [checkInTime,    setCheckInTime]    = useState("");
  const [checkOutTime,   setCheckOutTime]   = useState("");
  const [roomCount,      setRoomCount]      = useState(1);
  const [guests,         setGuests]         = useState(passed.guests || 1);
  const [firstName,      setFirstName]      = useState("");
  const [lastName,       setLastName]       = useState("");
  const [phone,          setPhone]          = useState("");
  const [email,          setEmail]          = useState("");
  const [specialReq,     setSpecialReq]     = useState("");
  const [policyOk,       setPolicyOk]       = useState(false);
  const [showSpecial,    setShowSpecial]    = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);
  const pdfRef = useRef(null);

  const today = new Date().toISOString().split("T")[0];

  // Scroll to top when booking page loads
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);

  const fetchRooms = () => {
    setLoadingRooms(true);
    setRoomsError(false);
    api.get("/api/rooms")
      .then(res => {
        const data = res.data?.length ? res.data : fallbackRooms;
        setRooms(data);
        if (passed.roomId) {
          setRoomId(passed.roomId);
        } else if (data.length > 0) {
          setRoomId(data[0].roomId);
        }
      })
      .catch(() => {
        setRooms(fallbackRooms);
        setRoomsError(false);
        if (passed.roomId) {
          setRoomId(passed.roomId);
        } else {
          setRoomId(fallbackRooms[0].roomId);
        }
      })
      .finally(() => setLoadingRooms(false));
  };

  useEffect(() => { fetchRooms(); }, []);

  const selectedRoom = rooms.find(r => r.roomId === roomId);
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const diff = Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000);
    return diff > 0 ? diff : 0;
  }, [checkIn, checkOut]);

  const basePrice = selectedRoom ? selectedRoom.price * nights * roomCount : 0;
  const gst       = Math.round(basePrice * 0.12);
  const total     = basePrice + gst;

  const goStep2 = () => {
    if (!roomId)       return toast.error("Please select a room type");
    if (!checkIn)      return toast.error("Please select check-in date");
    if (!checkOut)     return toast.error("Please select check-out date");
    if (nights <= 0)   return toast.error("Check-out must be after check-in");
    if (!checkInTime)  return toast.error("Please enter check-in time");
    if (!checkOutTime) return toast.error("Please enter check-out time");
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!firstName.trim())            return toast.error("Please enter your first name");
    if (!phone.trim() || phone.length < 9) return toast.error("Please enter a valid phone number");
    if (!policyOk)                    return toast.error("Please accept the booking policy");
    setBookingLoading(true);
    try {
      const res = await api.post("/api/bookings", {
        guestName:  `${firstName} ${lastName}`.trim(),
        phone:      phone.trim(),
        email:      email.trim() || "no-email@smgoldenresorts.com",
        roomId,
        checkIn:    checkIn + "T00:00:00.000Z",
        checkOut:   checkOut + "T00:00:00.000Z",
        guests:     Number(guests),
        totalPrice: total,
        specialRequests: specialReq,
        checkInTime,
        checkOutTime,
        rooms: Number(roomCount),
      });
      toast.success("Booking confirmed! 🎉");
      setCreatedBooking(res.data.booking);
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  /* ── 6-digit numeric booking ID ── */
  const bookingId6 = createdBooking?._id
    ? (() => {
        try {
          const num = parseInt(createdBooking._id.slice(-8), 16);
          return String(Math.abs(num) % 1000000).padStart(6, "0");
        } catch {
          return "000000";
        }
      })()
    : "000000";

  const handleDownloadPDF = async () => {
    const element = pdfRef.current;
    if (!element) return;
    const html2pdf = (await import("html2pdf.js")).default;
    html2pdf(element, {
      margin: 0.5,
      filename: `SMGoldenResorts-Booking-${bookingId6}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    });
  };

  if (loadingRooms) return (
    <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );

  /* ── helper: format date like "07 May 2026" ── */
  const fmtConfirmDate = d => {
    if (!d) return "—";
    const date = new Date(d.includes("T") ? d : d + "T00:00:00");
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  };

  /* ── WhatsApp message (mirrors reference style) ── */
  const guestFullName   = `${firstName} ${lastName}`.trim();
  const roomLabel       = selectedRoom?.type || createdBooking?.roomType || "—";
  const displayTotal    = createdBooking?.totalPrice || total || 0;
  const displayGst      = Math.round(displayTotal * 0.12 / 1.12);
  const displayBase     = displayTotal - displayGst;

  const waText = encodeURIComponent(
    `✅ *SM Golden Resorts – Booking Confirmed!*\n\n` +
    `Dear ${guestFullName},\n` +
    `Your booking has been *confirmed*. Here are your details:\n\n` +
    `🆔 Booking ID: *${bookingId6}*\n` +
    `🛏️ Room: *${roomLabel}*\n` +
    `📅 Check-in: *${fmtConfirmDate(checkIn)}*\n` +
    `📅 Check-out: *${fmtConfirmDate(checkOut)}*\n` +
    `🌙 Nights: *${nights}*\n` +
    `👥 Guests: *${guests}*\n` +
    `💰 Total Amount: *₹${displayTotal.toLocaleString("en-IN")}*\n\n` +
    `📍 SM Golden Resorts, Old Falls Main Road, Courtallam – 627 802\n\n` +
    `We look forward to hosting you! 🙏`
  );

  /* ── Success ── */

  if (step === 3) return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg space-y-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          ref={pdfRef}
          className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">

          {/* ── Header banner ── */}
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-extrabold text-base leading-none">Booking Confirmed! 🎉</p>
                <p className="text-emerald-100 text-xs mt-1">
                  Show your Booking ID at reception. Payment at property.
                </p>
              </div>
            </div>
            {/* Hotel name strip */}
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border-2 border-white/40">
                <img src="/WhatsApp Image 2026-06-22 at 18.04.13.webp" alt="SM Golden Resorts" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-white font-extrabold text-sm leading-none">SM Golden Resorts</p>
                <p className="text-emerald-100 text-[11px] mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Old Falls Main Road, Courtallam – 627 802
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-5 space-y-5">

            {/* ── Booking ID badge ── */}
            <div className="flex items-center justify-between bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl px-5 py-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Booking ID</p>
                <p className="font-extrabold text-slate-800 text-2xl tracking-[0.2em] mt-0.5">{bookingId6}</p>
              </div>
              <div className="text-4xl">🎫</div>
            </div>

            {/* ── Guest info row ── */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl px-4 py-3">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">👤 Guest Name</p>
                <p className="font-extrabold text-slate-800 text-sm leading-tight">{guestFullName}</p>
              </div>
              <div className="bg-slate-50 rounded-xl px-4 py-3">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">📞 Phone</p>
                <p className="font-extrabold text-slate-800 text-sm">+91 {phone}</p>
              </div>
            </div>

            {/* ── Stay details ── */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              {/* Room */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500 font-medium flex items-center gap-2">🛏️ Room Type</span>
                <span className="font-extrabold text-slate-800 text-sm">{roomLabel}</span>
              </div>
              {/* Dates */}
              <div className="grid grid-cols-2 divide-x divide-slate-100 border-b border-slate-100">
                <div className="px-4 py-3">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">📅 Check-in</p>
                  <p className="font-extrabold text-slate-800 text-sm">{fmtConfirmDate(checkIn)}</p>
                  {checkInTime && <p className="text-xs text-slate-400 mt-0.5">{checkInTime}</p>}
                </div>
                <div className="px-4 py-3">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">📅 Check-out</p>
                  <p className="font-extrabold text-slate-800 text-sm">{fmtConfirmDate(checkOut)}</p>
                  {checkOutTime && <p className="text-xs text-slate-400 mt-0.5">{checkOutTime}</p>}
                </div>
              </div>
              {/* Nights / Rooms / Guests */}
              <div className="grid grid-cols-3 divide-x divide-slate-100">
                <div className="px-4 py-3 text-center">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">🌙 Nights</p>
                  <p className="font-extrabold text-slate-800 text-sm">{nights}</p>
                </div>
                <div className="px-4 py-3 text-center">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">🚪 Rooms</p>
                  <p className="font-extrabold text-slate-800 text-sm">{roomCount}</p>
                </div>
                <div className="px-4 py-3 text-center">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">👥 Guests</p>
                  <p className="font-extrabold text-slate-800 text-sm">{guests}</p>
                </div>
              </div>
            </div>

            {/* ── Price breakdown ── */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 space-y-2.5">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">💰 Price Breakdown</p>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Room Charges ({nights} Night{nights > 1 ? "s" : ""})</span>
                <span className="font-bold text-slate-700">₹{displayBase.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>GST (12%)</span>
                <span className="font-bold text-slate-700">₹{displayGst.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-800 pt-1 border-t border-blue-200">
                <span>Total Amount</span>
                <span className="text-blue-600">₹{displayTotal.toLocaleString("en-IN")}</span>
              </div>
              <p className="text-[9px] text-slate-400 italic">Payment to be made at the property. Valid ID required at check-in.</p>
            </div>

            {/* ── Booked on ── */}
            <p className="text-center text-xs text-slate-400 font-medium">
              Booked on {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
            </p>

            {/* ── Action buttons ── */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link to="/"
                className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl text-sm transition-all text-center">
                ← Back to Home
              </Link>
              <a href={`https://wa.me/919003549849?text=${waText}`}
                target="_blank" rel="noreferrer"
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" /> Share on WhatsApp
              </a>
            </div>
          </div>
        </motion.div>

        {/* Download PDF button — outside the card */}
        <button onClick={handleDownloadPDF}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl text-sm transition-all shadow-md">
          <Download className="w-4 h-4" /> Download Booking Receipt (PDF)
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f0f4f8] font-jakarta">
      {/* Back to Home — sticky top */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-2.5 shadow-sm">
        <div className="max-w-5xl mx-auto">
          <Link to="/" className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors w-fit">
            <span className="text-lg leading-none">←</span> Back to Home
          </Link>
        </div>
      </div>
      <StepBar step={step} />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">

          {/* ── LEFT ── */}
          <div>
            <AnimatePresence mode="wait">

              {/* STEP 1 */}
              {step === 1 && (
                <motion.div key="s1"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">

                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl shrink-0">🏠</div>
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-800">Select Room & Dates</h2>
                      <p className="text-sm text-slate-400 font-medium mt-0.5">Choose your room type and stay duration.</p>
                    </div>
                  </div>

                  {/* Room type label */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">
                      Room Type <span className="text-red-500">*</span>
                    </label>
                    {loadingRooms ? (
                      <div className="flex items-center justify-center gap-2 py-8 text-slate-400 text-sm">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        Loading rooms...
                      </div>
                    ) : rooms.length === 0 ? (
                      <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                        <p className="text-sm text-slate-500 font-medium">
                          {roomsError
                            ? "Could not connect to server. Please make sure the backend is running."
                            : "No rooms available at the moment."}
                        </p>
                        <button type="button" onClick={fetchRooms}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all">
                          🔄 Retry
                        </button>
                      </div>
                    ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(() => {
                        // Display name mapping
                        const DISPLAY = {
                          "Non-AC":       { name: "Double Bed Non-AC", sub: "Non-A/C", icon: "🛏️" },
                          "AC":           { name: "Double Bed AC",     sub: "A/C",     icon: "❄️" },
                          "Three Bed":    { name: "Double Bed Non-AC", sub: "Non-A/C", icon: "🛏️" },
                          "Four Bed AC":  { name: "Suite Room AC",      sub: "A/C",     icon: "👑" },
                          "Villa":        { name: "Villa",               sub: "Non-A/C", icon: "🏡" },
                          "Suite AC":     { name: "Suite Room AC",       sub: "A/C",     icon: "👑" },
                        };
                        return rooms
                          .filter((r, i, arr) => arr.findIndex(x => x.price === r.price) === i)
                          .sort((a, b) => a.price - b.price)
                          .map(room => {
                            const isSelected = roomId === room.roomId;
                            const d = DISPLAY[room.type] || { name: room.type, sub: room.badge, icon: "🛏️" };
                            const countAvail = rooms.filter(r => r.type === room.type && r.available).length;
                            return (
                              <button key={room.roomId} type="button"
                                onClick={() => room.available && setRoomId(room.roomId)}
                                disabled={!room.available}
                                className={`relative text-left rounded-2xl p-5 transition-all focus:outline-none border-2 ${
                                  isSelected
                                    ? "border-amber-400 bg-amber-50/40 shadow-md"
                                    : room.available
                                    ? "border-slate-200 hover:border-blue-300 hover:shadow-sm bg-white"
                                    : "border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed"
                                }`}>

                                {/* Top: icon only */}
                                <div className="flex items-start justify-between mb-4">
                                  <span className="text-3xl leading-none">{d.icon}</span>
                                  {!room.available && (
                                    <span className="text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider bg-red-100 text-red-600">
                                      Sold Out
                                    </span>
                                  )}
                                </div>

                                {/* Name & subtype */}
                                <p className="font-extrabold text-slate-900 text-base leading-tight">{d.name}</p>
                                <p className="text-xs text-slate-400 font-medium mt-0.5">{d.sub}</p>

                                {/* Price */}
                                <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline gap-1">
                                  <span className="text-xl font-extrabold text-slate-800 whitespace-nowrap">
                                    ₹{room.price?.toLocaleString("en-IN")}
                                  </span>
                                  <span className="text-xs text-slate-400 font-medium whitespace-nowrap">/ day</span>
                                </div>

                                {/* Selected tick */}
                                {isSelected && (
                                  <div className="absolute top-3 right-3 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                                    <Check className="w-3 h-3 text-white" />
                                  </div>
                                )}
                              </button>
                            );
                          });
                      })()}
                    </div>
                    )}
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-1.5 text-sm font-bold text-slate-700 mb-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> Check-in Date <span className="text-red-500">*</span>
                      </label>
                      <input type="date" min={today} value={checkIn}
                        onChange={e => setCheckIn(e.target.value)}
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-1.5 text-sm font-bold text-slate-700 mb-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> Check-out Date <span className="text-red-500">*</span>
                      </label>
                      <input type="date" min={checkIn || today} value={checkOut}
                        onChange={e => setCheckOut(e.target.value)}
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                      />
                    </div>
                  </div>

                  {/* Times */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-1.5 text-sm font-bold text-slate-700 mb-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> Expected Check-in Time <span className="text-red-500">*</span>
                      </label>
                      <input type="time" value={checkInTime} onChange={e => setCheckInTime(e.target.value)}
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-1.5 text-sm font-bold text-slate-700 mb-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> Expected Check-out Time <span className="text-red-500">*</span>
                      </label>
                      <input type="time" value={checkOutTime} onChange={e => setCheckOutTime(e.target.value)}
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                      />
                    </div>
                  </div>

                  {/* Rooms & Guests */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Number of Rooms</label>
                      <input type="number" min="1" max="10" value={roomCount}
                        onChange={e => setRoomCount(Math.max(1, Number(e.target.value)))}
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Number of Guests</label>
                      <input type="number" min="1" max="40" value={guests}
                        onChange={e => setGuests(Math.max(1, Number(e.target.value)))}
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                      />
                    </div>
                  </div>

                  <button onClick={goStep2}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2">
                    Continue to Guest Details <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <motion.div key="s2"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">

                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl shrink-0">👤</div>
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-800">Guest Information</h2>
                      <p className="text-sm text-slate-400 font-medium mt-0.5">All fields marked with * are required.</p>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">First Name <span className="text-red-500">*</span></label>
                      <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                        placeholder="First name"
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                      <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                        placeholder="Last name"
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Mobile Number <span className="text-red-500">*</span></label>
                    <div className="flex border-2 border-slate-200 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                      <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-50 border-r-2 border-slate-200 shrink-0">
                        <span className="text-base">🇮🇳</span>
                        <span className="text-xs font-bold text-slate-600">IN +91</span>
                      </div>
                      <input type="tel" value={phone}
                        onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="XXXXX XXXXX"
                        className="w-full px-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none bg-transparent"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                    <p className="text-xs text-slate-400 font-medium mt-1.5">Your booking confirmation will be sent to this email address.</p>
                  </div>

                  {/* Special requests */}
                  <div>
                    <button type="button" onClick={() => setShowSpecial(!showSpecial)}
                      className="w-full flex items-center justify-between border-2 border-dashed border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all">
                      <span>Special Requests / Notes</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showSpecial ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {showSpecial && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <textarea value={specialReq} onChange={e => setSpecialReq(e.target.value)}
                            rows={3} placeholder="e.g. Early check-in, extra bed..."
                            className="w-full mt-2 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Policy */}
                  <label className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 cursor-pointer">
                    <input type="checkbox" checked={policyOk} onChange={e => setPolicyOk(e.target.checked)}
                      className="w-5 h-5 rounded border-2 border-amber-300 accent-blue-600 mt-0.5 shrink-0"
                    />
                    <span className="text-xs text-amber-800 font-medium leading-relaxed">
                      I agree to the <strong>booking policies</strong> of SM Golden Resorts. I understand that the booking is subject to confirmation via WhatsApp and payment is to be made at the property.
                    </span>
                  </label>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      className="border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold px-6 py-3 rounded-xl text-sm transition-all">
                      ← Back
                    </button>
                    <button onClick={handleSubmit} disabled={bookingLoading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-extrabold py-3 px-6 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2">
                      {bookingLoading
                        ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Confirming...</>
                        : <><span>📩</span> Confirm Booking</>
                      }
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── RIGHT Sidebar ── */}
          <div className="lg:sticky lg:top-6">
            <Sidebar
              selectedRoom={selectedRoom}
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
              nights={nights}
              roomCount={roomCount}
              step={step}
              onChangeStep={() => { setStep(1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
