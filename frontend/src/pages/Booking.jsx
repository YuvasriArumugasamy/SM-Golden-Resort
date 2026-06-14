import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, Phone, Mail, User, Info, CreditCard, ChevronDown, Check,
  Clock, Calendar, Users, AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Ticket
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  /* ─── Retrieve State Passed from Home ─── */
  const passedState = location.state || {};
  const [roomId, setRoomId] = useState(passedState.roomId || "");
  const [checkInDate, setCheckInDate] = useState(() => {
    return passedState.checkIn ? new Date(passedState.checkIn) : new Date();
  });
  const [checkOutDate, setCheckOutDate] = useState(() => {
    if (passedState.checkOut) return new Date(passedState.checkOut);
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  });
  const [guests, setGuests] = useState(passedState.guests || 2);

  /* ─── State variables ─── */
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  
  // Steps: 1 = Selection (done), 2 = Details (active), 3 = Success/Finish
  const [currentStep, setCurrentStep] = useState(2);
  
  // Checkout Form Fields
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [salutation, setSalutation] = useState("Mr");
  const [guestName, setGuestName] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [paymentMode, setPaymentMode] = useState("property"); // "property" or "deposit"
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  
  // Accordions
  const [showRefundPolicy, setShowRefundPolicy] = useState(false);

  // Timer: 15 minutes (900 seconds)
  const [timeLeft, setTimeLeft] = useState(900);
  
  // Booking API submission
  const [bookingLoading, setBookingLoading] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);

  /* ─── Fetch Rooms on Mount ─── */
  useEffect(() => {
    api.get("/api/rooms")
      .then(res => {
        setRooms(res.data);
        if (!roomId && res.data.length > 0) {
          setRoomId(res.data[0].roomId);
        }
      })
      .catch(err => {
        console.error(err);
        toast.error("Failed to load room details. Please try again.");
      })
      .finally(() => setLoadingRooms(false));
  }, [roomId]);

  /* ─── Countdown Timer Effect ─── */
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  /* ─── Pricing calculations ─── */
  const selectedRoom = rooms.find(r => r.roomId === roomId);
  const nights = Math.max(1, Math.ceil((checkOutDate - checkInDate) / 86400000));
  const basePrice = selectedRoom ? selectedRoom.price * nights : 0;
  
  // 10% standard discount + extra 5% if promo applied
  const promoRate = promoApplied ? 0.15 : 0.10;
  const discountAmount = Math.round(basePrice * promoRate);
  
  const taxAmount = Math.round((basePrice - discountAmount) * 0.05); // 5% tax
  const finalPrice = basePrice - discountAmount + taxAmount;
  const depositAmount = Math.round(finalPrice * 0.2065); // 20.65% deposit online

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    if (promoCode.toUpperCase() === "SMGOLD5" || promoCode.toUpperCase() === "WELCOME") {
      setPromoApplied(true);
      toast.success("Coupon code applied successfully! Extra 5% off.");
    } else {
      toast.error("Invalid coupon code");
    }
  };

  /* ─── Form Submission ─── */
  const handleSubmitBooking = async () => {
    if (!guestName.trim()) {
      toast.error("Please enter guest name");
      return;
    }
    if (!phone.trim() || phone.length < 9) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setBookingLoading(true);
    try {
      const res = await api.post("/api/bookings", {
        guestName: `${salutation} ${guestName}`,
        phone,
        email: email || "no-email@smgoldenresorts.com",
        roomId,
        checkIn: checkInDate.toISOString(),
        checkOut: checkOutDate.toISOString(),
        guests: Number(guests),
        specialRequests,
        paymentMode,
        totalPrice: finalPrice
      });
      
      toast.success("Booking request registered successfully!");
      setCreatedBooking(res.data.booking);
      setCurrentStep(3); // Transition to success step
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking request failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loadingRooms) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen font-jakarta text-slate-800 pb-20">
      
      {/* ══════════════════════════════════════════
          1. STEPS PROGRESS BAR HEADER
         ══════════════════════════════════════════ */}
      <section className="bg-white border-b border-slate-200 py-6 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          
          {/* Step 1 */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 font-extrabold text-xs">
              ✓
            </div>
            <span className="text-xs md:text-sm font-bold text-slate-500">Selection</span>
          </div>

          <div className="flex-1 h-0.5 bg-emerald-200 mx-4" />

          {/* Step 2 */}
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-extrabold text-xs transition-colors ${
              currentStep >= 2 ? "bg-blue-600 border border-blue-600 text-white" : "bg-slate-100 border border-slate-350 text-slate-400"
            }`}>
              2
            </div>
            <span className={`text-xs md:text-sm font-extrabold ${currentStep >= 2 ? "text-blue-600" : "text-slate-400"}`}>Details</span>
          </div>

          <div className={`flex-1 h-0.5 mx-4 ${currentStep === 3 ? "bg-emerald-200" : "bg-slate-200"}`} />

          {/* Step 3 */}
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-extrabold text-xs transition-colors ${
              currentStep === 3 ? "bg-blue-600 border border-blue-600 text-white" : "bg-slate-100 border border-slate-350 text-slate-400"
            }`}>
              3
            </div>
            <span className={`text-xs md:text-sm font-extrabold ${currentStep === 3 ? "text-blue-600" : "text-slate-400"}`}>Finish</span>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
          2. STEP 2: FILL DETAILS (MAIN CONTENT)
         ══════════════════════════════════════════ */}
      {currentStep === 2 && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* ─── LEFT COLUMN: DETAILS FORMS ─── */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Back Link */}
              <button onClick={() => navigate("/")} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Resort Details
              </button>

              {/* Contact Details Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-extrabold text-navy uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-3 bg-blue-600 rounded"></span> Contact Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Phone Number *</label>
                    <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-slate-50/20 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                      <div className="bg-slate-100 border-r border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-600 flex items-center gap-1">
                        <span>🇮🇳</span>
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="10-digit mobile number"
                        required
                        className="w-full px-4 py-2.5 text-xs font-bold text-slate-800 outline-none bg-transparent"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                    <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-slate-50/20 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full px-4 py-2.5 text-xs font-bold text-slate-800 outline-none bg-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Guest Details Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-extrabold text-navy uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-3 bg-blue-600 rounded"></span> Guest Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Salutation */}
                  <div className="col-span-1">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Title</label>
                    <select
                      value={salutation}
                      onChange={e => setSalutation(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50/50 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 transition-all"
                    >
                      <option value="Mr">Mr.</option>
                      <option value="Ms">Ms.</option>
                      <option value="Mrs">Mrs.</option>
                    </select>
                  </div>

                  {/* Name */}
                  <div className="col-span-1 md:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={e => setGuestName(e.target.value)}
                      placeholder="Enter guest name"
                      required
                      className="w-full border border-slate-200 rounded-lg p-2.5 px-4 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Special Requests Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-extrabold text-navy uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-3 bg-blue-600 rounded"></span> Special Requests (if any)
                </h3>
                <textarea
                  value={specialRequests}
                  onChange={e => setSpecialRequests(e.target.value)}
                  placeholder="e.g., Early check-in, dynamic room preference, adjacent rooms..."
                  rows="3"
                  className="w-full border border-slate-200 rounded-lg p-3 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-transparent transition-all"
                />
              </div>

              {/* Refund Policy Accordion */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <button
                  onClick={() => setShowRefundPolicy(!showRefundPolicy)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-navy hover:bg-slate-50/50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Info className="w-4.5 h-4.5 text-blue-600 shrink-0" />
                    Refund & Cancellation Policy
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showRefundPolicy ? "rotate-180" : ""}`} />
                </button>
                {showRefundPolicy && (
                  <div className="px-5 pb-5 border-t border-slate-100 pt-4 text-xs text-slate-600 leading-relaxed space-y-2 font-medium">
                    <p>• Cancel free of charge up to 48 hours prior to arrival check-in date.</p>
                    <p>• Within 48 hours of check-in date, 1 night stay charges will apply as cancellation fee.</p>
                    <p>• Refund request payments are processed back via original payment methods within 5 to 7 working days.</p>
                  </div>
                )}
              </div>

              {/* Select Mode Of Payment */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-extrabold text-navy uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-3 bg-blue-600 rounded"></span> Select Mode Of Payment
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card 1: Pay At Property */}
                  <div
                    onClick={() => setPaymentMode("property")}
                    className={`border rounded-xl p-4.5 cursor-pointer flex items-start justify-between transition-all ${
                      paymentMode === "property"
                        ? "border-blue-500 bg-blue-50/20 ring-1 ring-blue-500"
                        : "border-slate-200 hover:border-slate-350 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-extrabold text-slate-900">Pay At Property</h4>
                      <p className="text-[10px] text-slate-500 font-medium">No advance payment needed. Pay during check-in at the resort.</p>
                    </div>
                    <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 ${
                      paymentMode === "property" ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300"
                    }`}>
                      {paymentMode === "property" && <Check className="w-3 h-3" />}
                    </div>
                  </div>

                  {/* Card 2: Pay Deposit Online */}
                  <div
                    onClick={() => setPaymentMode("deposit")}
                    className={`border rounded-xl p-4.5 cursor-pointer flex items-start justify-between transition-all ${
                      paymentMode === "deposit"
                        ? "border-blue-500 bg-blue-50/20 ring-1 ring-blue-500"
                        : "border-slate-200 hover:border-slate-350 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-extrabold text-slate-900 font-jakarta">Pay just 20.65% now</h4>
                        <span className="text-[9px] font-extrabold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded leading-none">Instant</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium">Securely pay ₹{depositAmount.toLocaleString()} online deposit to guarantee reservation.</p>
                    </div>
                    <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 ${
                      paymentMode === "deposit" ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300"
                    }`}>
                      {paymentMode === "deposit" && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* ─── RIGHT COLUMN: BILL & SUMMARY DETAILS ─── */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Countdown timer alert */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 px-4 flex items-center gap-2.5 text-xs text-amber-800 font-bold shadow-sm animate-pulse">
                <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                <span>We have saved your booking for {formatTime(timeLeft)} Mins</span>
              </div>

              {/* Room Summary Card */}
              {selectedRoom && (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  {/* thumbnail */}
                  <div className="h-[140px] relative bg-slate-100">
                    <img
                      src="/WhatsApp Image 2026-05-15 at 10.48.35 (1).webp"
                      alt={selectedRoom.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-3 bg-black/60 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {selectedRoom.type}
                    </div>
                  </div>
                  
                  {/* details */}
                  <div className="p-5 space-y-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold mb-1">
                        <span>⭐ 4.3</span>
                        <span>&middot;</span>
                        <span>SM Golden Resorts</span>
                      </div>
                      <h4 className="font-extrabold text-navy text-sm font-jakarta leading-tight">
                        {selectedRoom.name}
                      </h4>
                    </div>

                    <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-xs">
                      <div>
                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Check-in</span>
                        <p className="font-bold text-slate-700 mt-0.5">{checkInDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}</p>
                        <p className="text-[10px] text-slate-500 font-medium">11:00 AM</p>
                      </div>
                      
                      <div>
                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Check-out</span>
                        <p className="font-bold text-slate-700 mt-0.5">{checkOutDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}</p>
                        <p className="text-[10px] text-slate-500 font-medium">10:00 AM</p>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500 font-bold">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Total stay duration</span>
                      <span className="text-slate-800">{nights} Night{nights > 1 ? "s" : ""}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Bill Details Breakout */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <h4 className="text-xs font-extrabold text-navy uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1 h-2.5 bg-blue-600 rounded"></span> Bill Details
                </h4>

                {selectedRoom && (
                  <div className="space-y-2.5 text-xs font-semibold text-slate-600">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">{selectedRoom.name} x {nights} Night{nights > 1 ? "s" : ""}</span>
                      <span className="font-bold text-slate-800">₹{basePrice.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center text-emerald-600">
                      <span>Promotion Applied ({promoApplied ? "15%" : "10%"})</span>
                      <span className="font-bold">-₹{discountAmount.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center border-t border-slate-100 pt-2 text-slate-500">
                      <span>Price</span>
                      <span className="font-bold text-slate-800">₹{(basePrice - discountAmount).toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center text-slate-500">
                      <span>Taxes</span>
                      <span className="font-bold text-slate-800">+₹{taxAmount.toLocaleString()}</span>
                    </div>

                    <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                      <div>
                        <span className="text-xs font-extrabold text-navy font-jakarta">Final Price</span>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">(Incl. of Taxes)</p>
                      </div>
                      <span className="text-lg font-extrabold text-blue-600 font-jakarta">₹{finalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Promo Code Box */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Ticket className="w-3.5 h-3.5 text-slate-400" /> Have a promo code?
                </label>
                <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-slate-50/20 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value)}
                    placeholder="e.g. SMGOLD5"
                    className="w-full px-3 py-2 text-xs font-bold text-slate-800 outline-none bg-transparent uppercase"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 text-xs transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-[10px] text-emerald-600 font-bold">✓ Coupon active: 5% extra discount applied!</p>
                )}
              </div>

              {/* Secure Trust Badges */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Book With Confidence</h4>
                
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-[11px] font-extrabold text-slate-900">100% Booking Confirmation</h5>
                      <p className="text-[10px] text-slate-500 font-medium">Your stay request is instantly registered and confirmed.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-[11px] font-extrabold text-slate-900">Instant Refund Policy</h5>
                      <p className="text-[10px] text-slate-500 font-medium">Easy cancellation and dynamic processing on refunds.</p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-[11px] font-extrabold text-slate-900">24/7 Customer Support</h5>
                      <p className="text-[10px] text-slate-500 font-medium">Always here to support you at any stage of stay.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          3. STICKY BOTTOM ACTIONS BAR (For Step 2)
         ══════════════════════════════════════════ */}
      {currentStep === 2 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-4.5 px-6 shadow-2xl z-40 flex items-center justify-between">
          <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="text-left">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Price details</span>
                <span className="text-base font-extrabold text-blue-600">₹{finalPrice.toLocaleString()}</span>
              </div>
              <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
              <div className="text-left hidden sm:block">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Stay summary</span>
                <span className="text-xs font-bold text-slate-600">{nights} Night{nights > 1 ? "s" : ""}, {guests} Guests</span>
              </div>
            </div>

            <button
              onClick={handleSubmitBooking}
              disabled={bookingLoading}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-8 rounded-xl transition-all duration-300 shadow hover:shadow-lg disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              {bookingLoading ? "Registering Stay..." : "Complete Booking"} <ArrowRight className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          4. STEP 3: FINISH BOOKING / SUCCESS VIEW
         ══════════════════════════════════════════ */}
      {currentStep === 3 && createdBooking && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl mx-auto px-4 py-16 text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-navy font-jakarta">Booking Confirmed!</h2>
            <p className="text-sm text-slate-500 font-medium">Thank you Mr/Ms {guestName}, your reservation request was registered.</p>
          </div>

          {/* Booking Card Details */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-left shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Booking ID</span>
              <span className="text-xs font-extrabold text-slate-700 font-jakarta">{createdBooking._id?.slice(-8).toUpperCase()}</span>
            </div>

            <div className="space-y-2.5 text-xs font-semibold text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-400">Guest Name</span>
                <span>{createdBooking.guestName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Phone Number</span>
                <span>+91 {createdBooking.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Room Allocated</span>
                <span>{selectedRoom?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Check-in</span>
                <span>{checkInDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Check-out</span>
                <span>{checkOutDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Stay Duration</span>
                <span>{nights} Night{nights > 1 ? "s" : ""}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Status</span>
                <span className="text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded text-[10px] uppercase font-extrabold">
                  {paymentMode === "property" ? "Pay At Check-in" : "Deposit Paid"}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3.5 flex justify-between items-baseline text-sm font-extrabold">
              <span className="text-slate-900">Total Price</span>
              <span className="text-lg text-blue-600 font-jakarta">₹{createdBooking.totalPrice?.toLocaleString() || finalPrice.toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <Link
              to="/"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-lg text-xs transition-all shadow hover:shadow-md cursor-pointer"
            >
              Back to Home
            </Link>
            <a
              href={`https://wa.me/919443710440?text=Hi,%20I%20have%20registered%20a%20booking%20(ID:%20${createdBooking._id?.slice(-8).toUpperCase()})%20for%20a%20stay%20at%20SM%20Golden%20Resorts`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-lg text-xs transition-all shadow hover:shadow-md cursor-pointer flex items-center gap-1.5"
            >
              💬 Notify via WhatsApp
            </a>
          </div>
        </motion.div>
      )}

    </div>
  );
};

export default Booking;
