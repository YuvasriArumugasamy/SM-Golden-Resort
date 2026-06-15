import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Wifi, Car, UtensilsCrossed, Zap, ShieldCheck,
  ChevronLeft, ChevronRight, CheckCircle2, MapPin, Star,
  Calendar, Users, ChevronDown, Check, X,
  Phone, BedDouble, Droplets, Wind, Trees, ParkingCircle, Tv
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { roomsData as fallbackRooms } from "../utils/roomData";

/* ── Static data ─────────────────────────── */
const GALLERY = [
  { label: "Resort Room",       src: "/WhatsApp Image 2026-06-14 at 07.53.04.jpeg" },
  { label: "Room Interior",     src: "/WhatsApp Image 2026-06-14 at 07.53.09.jpeg" },
  { label: "Room View",         src: "/WhatsApp Image 2026-06-14 at 07.53.09 (1).jpeg" },
  { label: "Bedroom",           src: "/WhatsApp Image 2026-06-14 at 07.53.10.jpeg" },
  { label: "Room Facilities",   src: "/WhatsApp Image 2026-06-14 at 07.53.15 (1).jpeg" },
  { label: "Living Area",       src: "/WhatsApp Image 2026-06-14 at 07.53.16.jpeg" },
  { label: "Suite Room",        src: "/WhatsApp Image 2026-06-14 at 07.53.16 (1).jpeg" },
  { label: "Premium Room",      src: "/WhatsApp Image 2026-06-14 at 07.53.17.jpeg" },
  { label: "Resort Entrance",   src: "/WhatsApp Image 2026-06-14 at 07.56.05.jpeg" },
  { label: "Resort Building",   src: "/WhatsApp Image 2026-06-14 at 09.15.41.jpeg" },
  { label: "Deluxe Bedroom",    src: "/WhatsApp Image 2026-05-15 at 10.48.35 (1).webp" },
  { label: "Executive Suite",   src: "/WhatsApp Image 2026-05-15 at 10.48.37.webp" },
  { label: "Family Room",       src: "/WhatsApp Image 2026-05-15 at 10.48.39 (1).webp" },
  { label: "Bathroom",          src: "/WhatsApp Image 2026-05-15 at 10.48.39.webp" },
  { label: "Front Entrance",    src: "/WhatsApp Image 2026-05-15 at 10.48.40.webp" },
  { label: "Mountain View",     src: "/WhatsApp Image 2026-05-15 at 10.48.41.webp" },
  { label: "Aerial View",       src: "/Gemini_Generated_Image_1938en1938en1938.png" },
];

const FACILITIES = [
  { name: "Pickup / Drop", icon: Car },
  { name: "Kitchen", icon: UtensilsCrossed },
  { name: "Wifi", icon: Wifi },
  { name: "Parking", icon: ParkingCircle },
  { name: "Power backup", icon: Zap },
  { name: "TV", icon: Tv },
  { name: "24h Lobby", icon: ShieldCheck },
  { name: "Hot Water", icon: Droplets },
  { name: "Mountain View", icon: Trees },
  { name: "Pets Allowed", icon: CheckCircle2 },
  { name: "80 Capacity", icon: Users },
  { name: "AC Rooms", icon: Wind },
  { name: "Water Falls Nearby", icon: Droplets },
  { name: "Room Service", icon: ShieldCheck },
];

const REVIEWS = [
  { name: "RajeshRaj P", initials: "RP", rating: 5, time: "2 years ago on Google", review: "I recently had the pleasure of staying at SM GOLDEN Resort which is located near to old Courtallam, and it exceeded all my expectations. Highly recommended!" },
  { name: "Archana R", initials: "AR", rating: 5, time: "a year ago on Google", review: "We stayed here last week. Rooms were clean and spacious and the owner was very friendly, attended us every time quickly. Perfect resort for families." },
  { name: "Suresh Kumar", initials: "SK", rating: 5, time: "6 months ago on Google", review: "Best place in Courtallam to stay with family. Old falls is very nearby by walk. Secured parking and kitchen facility was super convenient." },
  { name: "Premkumar C", initials: "PC", rating: 5, time: "9 months ago on Google", review: "Very good place to stay. Wonderful location near the hill view. Rooms are very neat and clean. Suitable and safe stay with family." },
  { name: "Antony A", initials: "AA", rating: 5, time: "2 years ago on Google", review: "Well maintained property. Looks better than what it looks in Google. Recommended for families." },
];

const FAQS = [
  { q: "What types of rooms are available?", a: "We offer Non-AC (₹1,500), AC (₹2,000), Villa Room 110 (₹2,500), and Suite AC rooms (₹10,000) — 11 rooms total." },
  { q: "Is kitchen facility available?", a: "Yes, full kitchen facility available for all guests." },
  { q: "Are pets allowed?", a: "Yes, pets are allowed at SM Golden Resorts." },
  { q: "Is free parking available?", a: "Yes, free and secured parking available 24/7." },
  { q: "What are check-in and check-out times?", a: "Check-in: 11:00 AM | Check-out: 10:00 AM. Early/late subject to availability." },
  { q: "How far is Old Falls?", a: "Old Falls is just 0.38 km — a short walk from the resort." },
];

const NEARBY = [
  ["Tiger Falls", "0.38 km"],
  ["குற்றாலம் சாரல் (Main Falls)", "0.76 km"],
  ["Raghu don courtallam", "1.14 km"],
  ["Arulmigu Thiru Kuttralanathar Temple", "1.31 km"],
  ["Thendral Cottage", "1.32 km"],
  ["Courtallam Main Waterfalls", "1.38 km"],
  ["Main Falls Arch", "1.39 km"],
];

const ROOM_SLIDES = [
  "/WhatsApp Image 2026-06-14 at 07.53.04.jpeg",
  "/WhatsApp Image 2026-06-14 at 07.53.09.jpeg",
  "/WhatsApp Image 2026-06-14 at 07.53.10.jpeg",
  "/WhatsApp Image 2026-06-14 at 07.53.16.jpeg",
  "/WhatsApp Image 2026-06-14 at 07.53.17.jpeg",
  "/WhatsApp Image 2026-05-15 at 10.48.35 (1).webp",
  "/WhatsApp Image 2026-05-15 at 10.48.37.webp",
];

const Stars = ({ n = 5 }) => (
  <span className="flex gap-px">
    {Array.from({ length: n }).map((_, i) => (
      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
    ))}
  </span>
);

/* ── GuestCounter ─────────────────────────── */
const GuestCounter = ({ label, sub, val, set, min = 0 }) => (
  <div className="flex items-center justify-between py-5">
    <div>
      <p className="text-base font-bold text-slate-900">{label}</p>
      <p className="text-sm text-slate-400 mt-0.5">({sub})</p>
    </div>
    <div className="flex items-center gap-5 border border-slate-200 rounded-2xl px-4 py-2.5">
      <button onClick={() => set(v => Math.max(min, v - 1))}
              className="text-blue-600 font-bold text-2xl w-6 h-6 flex items-center justify-center outline-none focus:outline-none leading-none select-none">
        −
      </button>
      <span className="text-base font-bold text-slate-900 w-5 text-center">{val}</span>
      <button onClick={() => set(v => v + 1)}
              className="text-blue-600 font-bold text-2xl w-6 h-6 flex items-center justify-center outline-none focus:outline-none leading-none select-none">
        +
      </button>
    </div>
  </div>
);

/* ══════════════════════════════════════════ */
export default function Home() {
  const navigate = useNavigate();

  const [rooms, setRooms]               = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [checkIn, setCheckIn]           = useState(new Date());
  const [checkOut, setCheckOut]         = useState(() => { const d = new Date(); d.setDate(d.getDate() + 1); return d; });
  const [adults, setAdults]             = useState(2);
  const [children, setChildren]         = useState(0);
  const [infants, setInfants]           = useState(0);
  const [showGuestsModal, setShowGuestsModal] = useState(false);
  const [galleryOpen, setGalleryOpen]   = useState(false);
  const [galleryIdx, setGalleryIdx]     = useState(0);
  const [showAllFac, setShowAllFac]     = useState(false);
  const [activeTab, setActiveTab]       = useState("overview");
  const [roomImgIdx, setRoomImgIdx]     = useState({});
  const [reviewIdx, setReviewIdx]       = useState(0);
  const [openFaq, setOpenFaq]           = useState(null);

  const guests = adults + children + infants;

  const overviewRef  = useRef(null);
  const amenitiesRef = useRef(null);
  const roomsRef     = useRef(null);
  const mapRef       = useRef(null);
  const reviewsRef   = useRef(null);
  const faqsRef      = useRef(null);

  useEffect(() => {
    api.get("/api/rooms")
      .then(r => setRooms(r.data?.length ? r.data : fallbackRooms))
      .catch(() => setRooms(fallbackRooms))
      .finally(() => setRoomsLoading(false));
  }, []);

  useEffect(() => {
    const refs = [
      { id: "overview", ref: overviewRef }, { id: "amenities", ref: amenitiesRef },
      { id: "rooms", ref: roomsRef }, { id: "map", ref: mapRef },
      { id: "reviews", ref: reviewsRef }, { id: "faqs", ref: faqsRef },
    ];
    const handle = () => {
      const y = window.scrollY + 160;
      let cur = "overview";
      for (const { id, ref } of refs) {
        if (ref.current && ref.current.offsetTop <= y) cur = id;
      }
      setActiveTab(cur);
    };
    window.addEventListener("scroll", handle);
    return () => window.removeEventListener("scroll", handle);
  }, []);

  const scrollTo = (id, ref) => {
    setActiveTab(id);
    if (ref.current) window.scrollTo({ top: ref.current.offsetTop - 110, behavior: "smooth" });
  };

  const selRoom = rooms.find(r => r.roomId === selectedRoomId);
  const nights  = Math.max(1, Math.ceil((checkOut - checkIn) / 86400000));
  const base    = selRoom ? selRoom.price * nights : 0;
  const disc    = selRoom ? Math.round(base * 0.1) : 0;
  const tax     = selRoom ? Math.round((base - disc) * 0.05) : 0;
  const total   = base - disc + tax;

  const handleBook = () => {
    if (!selectedRoomId) { toast.error("Please select a room first!"); scrollTo("rooms", roomsRef); return; }
    navigate("/booking", { state: { roomId: selectedRoomId, checkIn: checkIn.toISOString(), checkOut: checkOut.toISOString(), guests } });
  };

  const TAB_LIST = [
    { id: "overview",  label: "Overview",  ref: overviewRef  },
    { id: "amenities", label: "Amenities", ref: amenitiesRef },
    { id: "rooms",     label: "Rooms",     ref: roomsRef     },
    { id: "map",       label: "Map",       ref: mapRef       },
    { id: "reviews",   label: "Reviews",   ref: reviewsRef   },
    { id: "faqs",      label: "FAQs",      ref: faqsRef      },
  ];

  const visibleFacilities = showAllFac ? FACILITIES : FACILITIES.slice(0, 8);

  const fmtDate = (d) => d ? d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" }) : "";

  return (
    <div className="bg-white min-h-screen font-jakarta text-slate-800">

      {/* ══ 1. PHOTO GRID ══ */}
      <section className="w-full max-w-[1280px] mx-auto px-3 pt-3">

        {/* ── Mobile: Full-width carousel with arrows + logo ── */}
        <div className="md:hidden relative rounded-xl overflow-hidden h-[260px] bg-slate-200">
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={galleryIdx}
              src={GALLERY[galleryIdx].src}
              alt={GALLERY[galleryIdx].label}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.22 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* Counter — top right */}
          <div className="absolute top-3 right-3 bg-black/50 text-white text-[11px] font-bold px-2.5 py-1 rounded-full z-10">
            {galleryIdx + 1} of {GALLERY.length}
          </div>

          {/* Prev Arrow — left edge, outside feel */}
          <button
            onClick={() => setGalleryIdx(i => (i - 1 + GALLERY.length) % GALLERY.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/45 hover:bg-black/65 text-white flex items-center justify-center z-10 shadow-lg transition-all"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next Arrow — right edge */}
          <button
            onClick={() => setGalleryIdx(i => (i + 1) % GALLERY.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/45 hover:bg-black/65 text-white flex items-center justify-center z-10 shadow-lg transition-all"
            aria-label="Next photo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {GALLERY.map((_, i) => (
              <button key={i} onClick={() => setGalleryIdx(i)}
                className={`rounded-full transition-all ${i === galleryIdx ? "bg-white w-4 h-1.5" : "bg-white/50 w-1.5 h-1.5"}`} />
            ))}
          </div>
        </div>

        {/* ── Desktop: original grid ── */}
        <div className="hidden md:grid grid-cols-4 gap-1.5 rounded-xl overflow-hidden h-[400px] relative">
          {/* Big left photo */}
          <div className="col-span-2 relative overflow-hidden cursor-pointer group"
               onClick={() => { setGalleryIdx(0); setGalleryOpen(true); }}>
            <img src={GALLERY[0].src} alt="SM Golden Resorts"
                 className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
          </div>
          {/* Right 2×2 */}
          <div className="col-span-2 grid grid-cols-2 gap-1.5">
            {[1, 2, 3, 4].map((idx, i) => (
              <div key={i} className="relative overflow-hidden cursor-pointer group"
                   onClick={() => { setGalleryIdx(idx); setGalleryOpen(true); }}>
                <img src={GALLERY[idx].src} alt={GALLERY[idx].label}
                     className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                {i === 3 && (
                  <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                    <div className="bg-white/95 text-slate-800 font-extrabold text-sm px-4 py-2 rounded-full flex items-center gap-2 shadow">
                      <span>{GALLERY.length} photos</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 2. TITLE + RATING ══ */}
      <section className="max-w-[1280px] mx-auto px-4 mt-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="space-y-1.5">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">SM Golden Resorts in courtallam</h1>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Old Falls Main Road, Old Falls, Courtallam, Tamil Nadu 627802, India</span>
              <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-sky-100 ml-1">🌦️ 27°C</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                  <span className="text-[9px] font-extrabold text-blue-600">G</span>
                </div>
                <Stars />
                <span className="text-xs font-semibold text-slate-600">56 Reviews</span>
              </div>
              <span className="text-[10px] font-bold text-white bg-orange-500 px-2 py-0.5 rounded-full">LIMITED OFFER</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1 text-xs font-bold text-slate-500 border border-slate-200 rounded-lg px-3 py-1.5 self-start mt-1">
            <span>IN</span><span className="text-slate-400 mx-1">INR</span><span>₹</span>
          </div>
        </div>
      </section>

      {/* ══ 3. STICKY TABS + MOBILE DATE/GUESTS BAR ══ */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        <div className="max-w-[1280px] mx-auto px-4">

          {/* Tabs row — blue pill active — FIRST */}
          <div className="flex gap-1 overflow-x-auto tabs-scrollbar py-2">
            {TAB_LIST.map(t => (
              <button key={t.id} onClick={() => scrollTo(t.id, t.ref)}
                      className={`text-sm font-medium px-4 py-2 rounded-xl shrink-0 transition-all outline-none focus:outline-none cursor-pointer ${
                        activeTab === t.id
                          ? "bg-blue-600 text-white font-semibold shadow-sm"
                          : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                      }`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Mobile: date + guests row — BELOW tabs */}
          <div className="lg:hidden flex gap-2 py-2.5 border-t border-slate-100">
            <div className="flex-1 border border-slate-200 rounded-2xl px-3 py-2.5 flex items-center gap-2 bg-white shadow-sm">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <DatePicker
                selectsRange startDate={checkIn} endDate={checkOut}
                onChange={([s, e]) => {
                  setCheckIn(s);
                  setCheckOut(e);
                  if (s && e) {
                    setTimeout(() => setShowGuestsModal(true), 300);
                  }
                }}
                minDate={new Date()} dateFormat="dd MMM yy"
                className="text-sm font-medium text-slate-700 bg-transparent outline-none w-full"
                placeholderText="Check-in – Check-out"
              />
            </div>
            <button
              onClick={() => setShowGuestsModal(true)}
              className="border border-slate-200 rounded-2xl px-4 py-2.5 flex items-center gap-2 bg-white shadow-sm min-w-[120px] outline-none focus:outline-none">
              <Users className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-sm font-medium text-slate-700">{guests} Guests</span>
            </button>
          </div>

        </div>
      </div>

      {/* ══ GUESTS MODAL — center popup with blur ══ */}
      <AnimatePresence>
        {showGuestsModal && (
          <>
            {/* Blurred backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
              onClick={() => setShowGuestsModal(false)}
            />
            {/* Center card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-5 pointer-events-none"
            >
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm pointer-events-auto overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
                  <h3 className="text-2xl font-bold text-slate-900">Select Guests</h3>
                  <button onClick={() => setShowGuestsModal(false)}
                          className="text-slate-400 hover:text-slate-600 transition-colors outline-none focus:outline-none text-xl font-light w-8 h-8 flex items-center justify-center">
                    ✕
                  </button>
                </div>

                {/* Guest rows */}
                <div className="px-6 divide-y divide-slate-100">
                  {[
                    { label: "Adults",   sub: "Above 18 years", val: adults,   set: setAdults,   min: 1 },
                    { label: "Children", sub: "12 – 18 years",  val: children, set: setChildren, min: 0 },
                    { label: "Infant",   sub: "0 – 11 years",   val: infants,  set: setInfants,  min: 0 },
                  ].map(({ label, sub, val, set, min }) => (
                    <div key={label} className="flex items-center justify-between py-5">
                      <div>
                        <p className="text-lg font-bold text-slate-900">{label}</p>
                        <p className="text-sm text-slate-400 mt-0.5">({sub})</p>
                      </div>
                      <div className="flex items-center gap-4 border border-slate-200 rounded-2xl px-5 py-3 min-w-[130px] justify-between">
                        <button
                          onClick={() => set(v => Math.max(min, v - 1))}
                          className="text-blue-600 font-bold text-xl w-7 h-7 flex items-center justify-center outline-none focus:outline-none select-none leading-none">
                          −
                        </button>
                        <span className="text-xl font-bold text-slate-900 w-6 text-center">{val}</span>
                        <button
                          onClick={() => set(v => v + 1)}
                          className="text-blue-600 font-bold text-xl w-7 h-7 flex items-center justify-center outline-none focus:outline-none select-none leading-none">
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                  <p className="text-sm font-semibold text-slate-700">
                    {fmtDate(checkIn)} – {fmtDate(checkOut)}
                  </p>
                  <button
                    onClick={() => {
                      setShowGuestsModal(false);
                      setTimeout(() => scrollTo("rooms", roomsRef), 200);
                    }}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold px-8 py-3 rounded-2xl text-sm transition-all shadow-lg outline-none focus:outline-none">
                    Done
                  </button>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ══ 4. TWO COLUMN LAYOUT ══ */}
      <div className="max-w-[1280px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">

          {/* ─── LEFT ─── */}
          <div className="space-y-10 min-w-0">

            {/* OVERVIEW */}
            <div ref={overviewRef} className="scroll-mt-[110px] space-y-5">
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                {[
                  { label: "sm golden resorts", title: "Get 10% off!", icon: "🏷️", color: "border-amber-200 bg-amber-50/60", accent: "text-amber-700" },
                  { label: "Early Bird Offer !!", title: "10 ₹ OFF — Book 3 days advance", icon: "⏱️", color: "border-slate-200 bg-slate-50", accent: "text-slate-700" },
                  { label: "Last Minute Deals !!", title: "5 % OFF — Book Today", icon: "⏱️", color: "border-slate-200 bg-slate-50", accent: "text-slate-700" },
                ].map((b, i) => (
                  <div key={i} className={`shrink-0 w-52 border ${b.color} rounded-xl p-4 flex items-center justify-between gap-3`}>
                    <div>
                      <p className={`text-[10px] font-semibold ${b.accent} mb-0.5`}>{b.label}</p>
                      <p className="text-sm font-bold text-slate-800">{b.title}</p>
                    </div>
                    <span className="text-xl shrink-0">{b.icon}</span>
                  </div>
                ))}
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-800 mb-2">Overview</h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  SM Golden Resorts is a peaceful retreat next to Old Falls, Courtallam. With 11 well-maintained rooms — AC, Non-AC, Villa, and Suite — it's ideal for families, groups, and honeymooners. Enjoy free parking, kitchen access, pet-friendly stays, and 24-hour assistance surrounded by nature.
                </p>
                <a href="mailto:smgoldenresorts@gmail.com" className="mt-2 block text-sm text-slate-400">smgoldenresorts@gmail.com</a>
              </div>

              {/* FACILITIES */}
              <div ref={amenitiesRef} className="scroll-mt-[110px]">
                <h2 className="text-base font-semibold text-slate-800 mb-3">Facilities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-2">
                  {visibleFacilities.map((f, i) => {
                    const Icon = f.icon;
                    return (
                      <div key={i} className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-slate-500 shrink-0" />
                        <span className="text-sm text-slate-600 font-medium">{f.name}</span>
                      </div>
                    );
                  })}
                </div>
                <button onClick={() => setShowAllFac(!showAllFac)}
                        className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 outline-none focus:outline-none">
                  {showAllFac ? "Show less" : `Show all ${FACILITIES.length} Amenities`}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAllFac ? "rotate-180" : ""}`} />
                </button>
              </div>
            </div>

            {/* ROOMS */}
            <div ref={roomsRef} className="scroll-mt-[110px] border-t border-slate-100 pt-6 space-y-4">
              <h2 className="text-base font-semibold text-slate-800">Rooms</h2>
              {roomsLoading ? (
                <div className="flex items-center gap-2 text-sm text-slate-400 py-8">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  Loading rooms...
                </div>
              ) : (
                <div className="space-y-4">
                  {rooms.map((room, ri) => {
                    const curImg = roomImgIdx[room.roomId] || 0;
                    const isSelected = selectedRoomId === room.roomId;
                    const mrpPerNight = Math.round(room.price * 1.12);
                    return (
                      <motion.div key={room.roomId}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: ri * 0.05 }}
                        className={`border rounded-xl overflow-hidden flex flex-col sm:flex-row bg-white transition-all ${
                          isSelected ? "border-blue-500 ring-1 ring-blue-500/30 shadow-sm" : "border-slate-200 hover:border-slate-300"
                        }`}>
                        {/* Image */}
                        <div className="w-full sm:w-[280px] h-[220px] sm:h-auto shrink-0 relative overflow-hidden bg-slate-100 rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none">
                          <img src={ROOM_SLIDES[curImg]} alt={room.name} className="w-full h-full object-cover" />

                          {/* View Room — top left */}
                          <div className="absolute top-2.5 left-2.5 z-10">
                            <button onClick={() => { setGalleryIdx(0); setGalleryOpen(true); }}
                                    className="bg-white text-slate-800 text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-md outline-none focus:outline-none hover:bg-slate-50 transition-all">
                              View Room
                            </button>
                          </div>

                          {/* Counter — top right */}
                          <div className="absolute top-2.5 right-2.5 bg-black/55 text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10">
                            {curImg + 1} of {ROOM_SLIDES.length}
                          </div>

                          {/* Prev Arrow */}
                          <button onClick={e => { e.stopPropagation(); setRoomImgIdx(p => ({ ...p, [room.roomId]: ((p[room.roomId] || 0) - 1 + ROOM_SLIDES.length) % ROOM_SLIDES.length })); }}
                                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 text-slate-700 flex items-center justify-center hover:bg-white transition-all shadow-md outline-none focus:outline-none z-10">
                            <ChevronLeft className="w-4.5 h-4.5" />
                          </button>

                          {/* Next Arrow */}
                          <button onClick={e => { e.stopPropagation(); setRoomImgIdx(p => ({ ...p, [room.roomId]: ((p[room.roomId] || 0) + 1) % ROOM_SLIDES.length })); }}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 text-slate-700 flex items-center justify-center hover:bg-white transition-all shadow-md outline-none focus:outline-none z-10">
                            <ChevronRight className="w-4.5 h-4.5" />
                          </button>
                        </div>
                        {/* Details */}
                        <div className="flex-1 p-4 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1.5">
                              <h3 className="text-base font-bold text-slate-900">{room.name}</h3>
                              {ri === 0 && (
                                <span className="text-[10px] font-bold border border-purple-400 text-purple-600 px-2 py-0.5 rounded-full">Recommended</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold mb-2">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Book Now Pay Later
                            </div>
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {room.amenities.slice(0, 4).map((a, ai) => (
                                <span key={ai} className="inline-flex items-center gap-1 text-[11px] bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded font-medium">{a}</span>
                              ))}
                              {room.amenities.length > 4 && (
                                <span className="text-xs text-blue-600 font-semibold">+{room.amenities.length - 4} More</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-end justify-between mt-2 pt-3 border-t border-slate-100">
                            <div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-slate-400 text-xs line-through">₹{mrpPerNight.toLocaleString("en-IN")}</span>
                                <span className="text-[10px] text-emerald-600 font-bold">₹{Math.round(room.price * 0.12).toLocaleString("en-IN")} OFF</span>
                              </div>
                              <div className="flex items-baseline gap-1">
                                <span className="text-lg font-bold text-slate-900">₹{room.price.toLocaleString("en-IN")}</span>
                                <span className="text-xs text-slate-400">/ Night</span>
                              </div>
                              <p className="text-[10px] text-slate-400">Plus Taxes · {guests} Guests</p>
                            </div>
                            {room.available ? (
                              <button onClick={() => { setSelectedRoomId(room.roomId); toast.success(`${room.name} selected!`); }}
                                      className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all outline-none focus:outline-none ${
                                        isSelected ? "bg-emerald-500 text-white" : "border-2 border-slate-300 text-slate-700 hover:border-blue-400 bg-white"
                                      }`}>
                                {isSelected ? "✓ Selected" : "Select Room"}
                              </button>
                            ) : (
                              <button disabled className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-slate-100 text-slate-400 cursor-not-allowed">Sold Out</button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Refund Policy */}
            <div className="border border-slate-200 rounded-xl p-4 text-sm text-slate-500 bg-slate-50/50">
              <p className="font-semibold text-slate-700 mb-1">Refund Policy</p>
              <p className="text-xs">Free cancellation up to 48 hours before check-in. Within 48 hours, 1 night charge applies.</p>
            </div>

            {/* MAP */}
            <div ref={mapRef} className="scroll-mt-[110px] border-t border-slate-100 pt-6 space-y-4">
              <div className="rounded-xl overflow-hidden border border-slate-200 h-[280px]">
                <iframe title="SM Golden Resorts Location"
                  src="https://maps.google.com/maps?q=Old+Falls+Courtallam+Tamil+Nadu&output=embed"
                  width="100%" height="100%" style={{ border: 0 }} loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-base font-bold text-slate-800">Nearby Places</h3>
                  <button className="text-sm text-blue-600 font-medium outline-none focus:outline-none">Show More</button>
                </div>
                <div className="divide-y divide-slate-100">
                  {NEARBY.map(([name, dist]) => (
                    <div key={name} className="flex items-center justify-between py-3">
                      <span className="text-sm text-slate-700">• {name}</span>
                      <span className="text-sm text-slate-500 font-medium shrink-0 ml-4">{dist}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* REVIEWS */}
            <div ref={reviewsRef} className="scroll-mt-[110px] border-t border-slate-100 pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-800">Reviews</h2>
                <div className="flex gap-1.5">
                  <button onClick={() => setReviewIdx(p => Math.max(0, p - 1))} disabled={reviewIdx === 0}
                          className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-30 transition-all outline-none focus:outline-none">
                    <ChevronLeft className="w-4 h-4 text-slate-500" />
                  </button>
                  <button onClick={() => setReviewIdx(p => Math.min(REVIEWS.length - 1, p + 1))} disabled={reviewIdx === REVIEWS.length - 1}
                          className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-30 transition-all outline-none focus:outline-none">
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={reviewIdx}
                  initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.2 }}
                  className="border border-slate-200 rounded-xl p-5 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(REVIEWS[reviewIdx].name)}&background=e2e8f0&color=475569&size=40&bold=true&font-size=0.4`}
                           alt={REVIEWS[reviewIdx].name} className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{REVIEWS[reviewIdx].name}</p>
                        <p className="text-[10px] text-slate-400">{REVIEWS[reviewIdx].time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full border border-slate-200 flex items-center justify-center bg-white shadow-sm">
                        <span className="text-[8px] font-extrabold text-blue-600">G</span>
                      </div>
                      <Stars n={REVIEWS[reviewIdx].rating} />
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{REVIEWS[reviewIdx].review}</p>
                </motion.div>
              </AnimatePresence>
              <div className="flex justify-center gap-1.5">
                {REVIEWS.map((_, i) => (
                  <button key={i} onClick={() => setReviewIdx(i)}
                          className={`h-1.5 rounded-full transition-all outline-none focus:outline-none ${i === reviewIdx ? "w-5 bg-blue-500" : "w-1.5 bg-slate-300"}`} />
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div ref={faqsRef} className="scroll-mt-[110px] border-t border-slate-100 pt-6 pb-8 space-y-3">
              <h2 className="text-base font-semibold text-slate-800">Frequently Asked Questions</h2>
              <div className="space-y-2">
                {FAQS.map((faq, i) => (
                  <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                            className="w-full flex items-center justify-between px-4 py-3.5 text-left text-sm font-medium text-slate-800 hover:bg-slate-50 transition-colors outline-none focus:outline-none">
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 ml-2 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                                    transition={{ duration: 0.18 }} className="overflow-hidden">
                          <p className="px-4 pb-4 pt-1 text-sm text-slate-500 border-t border-slate-100">{faq.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5">
                {["• Late Check-out allowed subject to availability",
                  "• Early Check-In allowed subject to availability",
                  "• Pets are allowed 🐾",
                  "• Smoking allowed in designated areas",
                  "• Unmarried couples are allowed",
                  "• Govt. Id(s) required",
                  "• Local Id(s) allowed",
                  "• Foreigners are allowed",
                  "• Visitors are allowed",
                  "• Outside food & Beverage allowed"].map((r, i) => (
                  <p key={i} className="text-sm text-slate-600">{r}</p>
                ))}
              </div>
              <div className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-slate-100 mt-4">
                <p className="text-sm font-semibold text-slate-800">Have a booking you want to make changes to?</p>
                <button onClick={() => navigate("/admin/login")}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-all shadow-sm shrink-0 outline-none focus:outline-none">
                  Manage Booking
                </button>
              </div>
            </div>
          </div>

          {/* ─── RIGHT — BOOKING WIDGET (desktop only) ─── */}
          <div className="hidden lg:block lg:sticky lg:top-[72px] space-y-3">
            <div className="border border-slate-200 rounded-2xl shadow-lg overflow-hidden bg-white">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-sm">Booking Summary</h3>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="text-xs text-slate-500 font-medium block mb-1.5">Checkin - Checkout</label>
                  <div className="border border-slate-200 rounded-lg px-3 py-2.5 flex items-center gap-2 hover:border-blue-400 transition-all bg-white">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <DatePicker selectsRange startDate={checkIn} endDate={checkOut}
                      onChange={([s, e]) => { setCheckIn(s); setCheckOut(e); }}
                      minDate={new Date()} dateFormat="dd MMM yy"
                      className="text-xs font-medium text-slate-700 bg-transparent outline-none w-full" />
                  </div>
                </div>
                <div className="relative">
                  <label className="text-xs text-slate-500 font-medium block mb-1.5">Guests</label>
                  <button onClick={() => setShowGuestsModal(true)}
                          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 flex items-center gap-2 hover:border-blue-400 transition-all text-left bg-white outline-none focus:outline-none">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-medium text-slate-700">{guests} Guest{guests > 1 ? "s" : ""}</span>
                  </button>
                </div>
                {selRoom ? (
                  <div className="border-t border-slate-100 pt-3 space-y-2">
                    <p className="text-xs font-semibold text-slate-700">{selRoom.name}</p>
                    <div className="space-y-1.5 text-xs text-slate-500">
                      <div className="flex justify-between">
                        <span>1 Room x {nights} Night{nights > 1 ? "s" : ""} ({guests} Guests)</span>
                        <span className="font-medium text-slate-700">₹{base.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between"><span>Taxes</span><span className="font-medium text-slate-700">+ ₹{tax.toLocaleString("en-IN")}</span></div>
                      <div className="flex justify-between text-emerald-600"><span>Promotion Applied</span><span className="font-semibold">- ₹{disc.toLocaleString("en-IN")}</span></div>
                    </div>
                    <div className="flex justify-between items-baseline border-t border-slate-100 pt-2 mt-2">
                      <div><span className="text-sm font-bold text-slate-800">Final Price</span><p className="text-[10px] text-slate-400">(Incl of Taxes)</p></div>
                      <span className="text-lg font-bold text-slate-800">₹{total.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                ) : null}
                <button onClick={handleBook}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow outline-none focus:outline-none">
                  {selRoom ? "Book Now" : "Select Room"}
                </button>
              </div>
            </div>
            <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-2.5">
              <p className="text-xs font-semibold text-slate-500 mb-1">Contact Directly</p>
              <a href="tel:9443710420" className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-all">
                <Phone className="w-3.5 h-3.5" /> 9443710420
              </a>
              <a href="tel:9003549849" className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-all">
                <Phone className="w-3.5 h-3.5" /> 9003549849
              </a>
              <a href="https://wa.me/919443710420?text=Hi%20I%20want%20to%20book%20at%20SM%20Golden%20Resorts"
                 target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-all">
                <span>💬</span> Chat on WhatsApp
              </a>
            </div>
            <div className="border border-slate-100 rounded-xl p-3 bg-slate-50 text-center">
              <p className="text-[10px] text-slate-400 font-medium">VISA · MASTERCARD · RUPAY · UPI / GPAY</p>
              <p className="text-[10px] text-slate-400 mt-0.5">🔒 100% Secured Reservation</p>
            </div>
          </div>
        </div>
      </div>

      {/* ══ MOBILE BOTTOM BAR ══ */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            {selRoom ? (
              <>
                <p className="text-[10px] text-slate-400 font-medium">Final Price (incl. taxes)</p>
                <p className="text-base font-bold text-slate-900">₹{total.toLocaleString("en-IN")}</p>
              </>
            ) : null}
          </div>
          <button onClick={handleBook}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow flex items-center gap-2 shrink-0 outline-none focus:outline-none">
            {selRoom ? "Book Now →" : "Select Room ↓"}
          </button>
        </div>
      </div>
      <div className="lg:hidden h-20" />

      {/* ══ GALLERY LIGHTBOX ══ */}
      <AnimatePresence>
        {galleryOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/95 z-50 flex flex-col">
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-white/60 text-xs font-medium">{GALLERY[galleryIdx].label}</span>
              <div className="flex items-center gap-3">
                <span className="text-white/40 text-xs">{galleryIdx + 1} / {GALLERY.length}</span>
                <button onClick={() => setGalleryOpen(false)}
                        className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all outline-none focus:outline-none">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center relative px-14">
              <button onClick={() => setGalleryIdx(p => (p - 1 + GALLERY.length) % GALLERY.length)}
                      className="absolute left-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center outline-none focus:outline-none">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <AnimatePresence mode="wait">
                <motion.img key={galleryIdx} src={GALLERY[galleryIdx].src} alt={GALLERY[galleryIdx].label}
                  initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.18 }}
                  className="max-h-[72vh] max-w-full object-contain rounded-lg shadow-2xl" />
              </AnimatePresence>
              <button onClick={() => setGalleryIdx(p => (p + 1) % GALLERY.length)}
                      className="absolute right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center outline-none focus:outline-none">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="flex justify-center gap-2 py-4 px-4 overflow-x-auto no-scrollbar">
              {GALLERY.map((img, i) => (
                <button key={i} onClick={() => setGalleryIdx(i)}
                        className={`shrink-0 w-16 h-11 rounded-lg overflow-hidden border-2 transition-all outline-none focus:outline-none ${
                          i === galleryIdx ? "border-white" : "border-transparent opacity-40 hover:opacity-70"
                        }`}>
                  <img src={img.src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
