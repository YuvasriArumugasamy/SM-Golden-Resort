import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Wifi, Car, UtensilsCrossed, Zap, ShieldCheck,
  ChevronLeft, ChevronRight, CheckCircle2, MapPin, Star,
  Calendar, Users, ChevronDown, Check, X,
  Phone, BedDouble, Droplets, Wind, Trees, ParkingCircle, Tv,
  CalendarDays, Edit3,
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { roomsData as fallbackRooms } from "../utils/roomData";
import WhatsAppButton from "../components/WhatsAppButton";

/* ── Static data ─────────────────────────── */
const GALLERY = [
  { label: "SM Golden Resorts Resort Building Mountain View Courtallam",    src: "/ChatGPT Image Jun 21, 2026, 06_19_29 PM.png" },
  { label: "Villa Room at SM Golden Resorts Old Falls Courtallam",          src: "/ChatGPT Image Jun 21, 2026, 06_20_50 PM.png" },
  { label: "Double Bed AC Room - SM Golden Resorts Courtallam",             src: "/ChatGPT Image Jun 21, 2026, 06_24_42 PM.png" },
  { label: "Suite Room SM Golden Resorts Courtallam Tamil Nadu",            src: "/ChatGPT Image Jun 21, 2026, 06_28_16 PM (1).png" },
  { label: "Resort Garden View Near Old Falls Courtallam",                  src: "/ChatGPT Image Jun 21, 2026, 06_20_28 PM.png" },
  { label: "SM Golden Resorts Resort Exterior Mountain View",               src: "/ChatGPT Image Jun 21, 2026, 06_19_29 PM.png" },
  { label: "SM Golden Resorts Courtallam - Resort Exterior View",           src: "/ChatGPT Image Jun 21, 2026, 06_19_24 PM.png" },
  { label: "Bedroom Interior SM Golden Resorts Old Falls Courtallam",       src: "/ChatGPT Image Jun 21, 2026, 06_23_01 PM.png" },
  { label: "SM Golden Resorts Building with Western Ghats Mountain View",   src: "/ChatGPT Image Jun 21, 2026, 06_25_28 PM.png" },
  { label: "Double Bed Non-AC Room SM Golden Resorts Courtallam",           src: "/ChatGPT Image Jun 21, 2026, 06_28_06 PM.png" },
  { label: "Premium Room at SM Golden Resorts Near Old Falls",              src: "/ChatGPT Image Jun 21, 2026, 06_19_35 PM.png" },
  { label: "SM Golden Resorts Courtallam Resort Photo",                     src: "/WhatsApp Image 2026-06-22 at 18.04.13.jpeg" },
  { label: "New AC Room View SM Golden Resorts Courtallam 2026",            src: "/ChatGPT Image Jun 22, 2026, 06_57_51 PM.png" },
  { label: "SM Golden Resorts Resort and Mountain Courtallam",              src: "/ChatGPT Image Jun 21, 2026, 06_19_29 PM.png" },
];

const FACILITIES = [
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
  { q: "What types of rooms are available?", a: "We offer Single Bed Non-AC, Double Bed Non-AC, Double Bed AC, Villa Room Double Bed, and Suite Room AC." },
  { q: "Is kitchen facility available?", a: "Yes, kitchen facility is available. However, guests must inform us in advance so we can have it ready for you." },
  { q: "Are pets allowed?", a: "Yes, pets are allowed at SM Golden Resorts." },
  { q: "Is free parking available?", a: "Yes, free and secured parking available 24/7." },
  { q: "What are check-in and check-out times?", a: "Check-in and Check-out available 24 hours. You can arrive and depart at any time — we are open around the clock." },
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
  ["Mount Zion Holidays", "1.43 km"],
  ["AruMeena Cottage Courtallam", "0.35 km"],
  ["Puliaruvi cafe / Tiger falls cafe", "0.35 km"],
  ["Arumugam S", "0.36 km"],
  ["V Veerapandian", "0.37 km"],
  ["C Arul Rajesh", "0.38 km"],
  ["Santhanam Resorts", "0.56 km"],
  ["K.Karuppasamy", "0.76 km"],
  ["Bell Season Restaurant", "0.76 km"],
  ["செட்டியார் இட்லி கடை", "0.77 km"],
  ["Pothigai restaurant", "0.78 km"],
  ["VMM COTTAGE", "0.78 km"],
  ["Malathi S", "0.79 km"],
  ["Sri Shanmuga Hotel", "0.80 km"],
  ["Hariharasudan Gopalan", "0.83 km"],
  ["இன்சுவை காரைக்குடி செட்டிநாடு ஹோட்டல்", "0.83 km"],
  ["Sri Maha", "0.83 km"],
  ["SUGUNA Chicken", "0.83 km"],
  ["Sathyas Hotel", "0.85 km"],
  ["K.Kokila", "0.86 km"],
  ["Hotel Annapoorna", "0.99 km"],
];

// Per-room photo sets — first image is the best hero shot
const ROOM_PHOTO_SETS = {
  "101": [
    "/ChatGPT Image Jun 21, 2026, 06_28_06 PM.png",
    "/ChatGPT Image Jun 21, 2026, 06_19_35 PM.png",
    "/ChatGPT Image Jun 21, 2026, 06_23_01 PM.png",
    "/ChatGPT Image Jun 21, 2026, 06_21_49 PM.png",
  ],
  "102": [
    "/ChatGPT Image Jun 21, 2026, 06_28_06 PM.png",
    "/ChatGPT Image Jun 21, 2026, 06_19_35 PM.png",
    "/ChatGPT Image Jun 21, 2026, 06_23_01 PM.png",
    "/ChatGPT Image Jun 21, 2026, 06_21_49 PM.png",
  ],
  "104": [
    "/ChatGPT Image Jun 21, 2026, 06_28_06 PM.png",
    "/ChatGPT Image Jun 21, 2026, 06_19_35 PM.png",
    "/ChatGPT Image Jun 21, 2026, 06_23_01 PM.png",
    "/ChatGPT Image Jun 21, 2026, 06_21_49 PM.png",
  ],
  "110": [
    "/ChatGPT Image Jun 21, 2026, 06_20_50 PM.png",
    "/ChatGPT Image Jun 21, 2026, 06_28_16 PM (1).png",
    "/ChatGPT Image Jun 21, 2026, 06_24_42 PM.png",
    "/ChatGPT Image Jun 21, 2026, 06_25_28 PM.png",
  ],
};

const ROOM_SLIDES = [
  "/ChatGPT Image Jun 21, 2026, 06_19_17 PM.png",
  "/ChatGPT Image Jun 21, 2026, 06_20_50 PM.png",
  "/ChatGPT Image Jun 21, 2026, 06_24_42 PM.png",
  "/ChatGPT Image Jun 21, 2026, 06_28_16 PM (1).png",
  "/ChatGPT Image Jun 21, 2026, 06_20_28 PM.png",
  "/ChatGPT Image Jun 21, 2026, 06_25_28 PM.png",
  "/ChatGPT Image Jun 21, 2026, 06_28_06 PM.png",
];

/* ── Manage Booking Modal ── */
function ManageBookingModal({ isOpen, onClose }) {
  const [phone, setPhone] = useState("");
  const [bookingId, setBookingId] = useState("");

  const handleClose = () => { setPhone(""); setBookingId(""); onClose(); };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 24 }}
              transition={{ type: "spring", duration: 0.35 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                  <CalendarDays className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">Manage Booking</h2>
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
                <div className="flex items-center border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <div className="flex items-center gap-1.5 px-3 py-3 bg-slate-100 border-r border-slate-200 shrink-0 select-none">
                    <span className="text-lg">🇮🇳</span>
                    <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <input
                    type="tel" value={phone} onChange={e => setPhone(e.target.value)}
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
                <div className="flex items-center border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <span className="pl-4 text-slate-400 font-bold text-sm">#</span>
                  <input
                    type="text" value={bookingId} onChange={e => setBookingId(e.target.value)}
                    placeholder="Please enter booking id"
                    className="flex-1 bg-transparent px-3 py-3.5 text-sm text-slate-700 placeholder-slate-400 outline-none font-medium"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => { toast.error("Please contact us to cancel your booking."); handleClose(); }}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-red-300 text-red-500 hover:bg-red-50 font-bold text-xs transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel Booking</span>
                </button>
                <button
                  onClick={() => {
                    if (!phone && !bookingId) { toast.error("Please enter phone or booking ID"); return; }
                    toast.success("Redirecting to modify your booking...");
                    handleClose();
                  }}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-xs shadow-sm hover:from-blue-600 hover:to-blue-700 transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Modify Booking</span>
                </button>
              </div>
            </div>
          </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

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
  const [apiGallery, setApiGallery]     = useState([]);

  // Hero grid always uses curated static photos — API photos added only to lightbox
  const heroGallery = GALLERY;
  const displayGallery = apiGallery.length > 0 ? [...GALLERY, ...apiGallery] : GALLERY;

  // Best 5 photos for hero grid — hardcoded, never overridden by API
  const HERO_5 = [
    { label: "SM Golden Resorts Courtallam AC Room with Blue Curtains",      src: "/ChatGPT Image Jun 22, 2026, 06_57_51 PM.png" },
    { label: "Double Bed AC Room at SM Golden Resorts Courtallam",           src: "/ChatGPT Image Jun 21, 2026, 06_24_42 PM.png" },
    { label: "Room Entrance View SM Golden Resorts Old Falls Courtallam",    src: "/ChatGPT Image Jun 21, 2026, 06_20_50 PM.png" },
    { label: "SM Golden Resorts Resort Building Mountain View Courtallam",   src: "/ChatGPT Image Jun 21, 2026, 06_19_29 PM.png" },
    { label: "SM Golden Resorts Building with Mountain View Courtallam",     src: "/ChatGPT Image Jun 21, 2026, 06_23_01 PM.png" },
  ];
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);
  const [showAllNearby, setShowAllNearby] = useState(false);
  const [activeTab, setActiveTab]       = useState("overview");
  const [roomImgIdx, setRoomImgIdx]     = useState({});
  const [reviewIdx, setReviewIdx]       = useState(0);
  const [openFaq, setOpenFaq]           = useState(null);
  const [manageModalOpen, setManageModalOpen] = useState(false);

  const guests = adults + children + infants;

  const overviewRef  = useRef(null);
  const amenitiesRef = useRef(null);
  const roomsRef     = useRef(null);
  const mapRef       = useRef(null);
  const reviewsRef   = useRef(null);
  const faqsRef      = useRef(null);

  useEffect(() => {
    // Show fallback immediately, then update if API responds
    setRooms(fallbackRooms);
    setRoomsLoading(false);
    api.get("/api/rooms")
      .then(r => { if (r.data?.length) setRooms(r.data); })
      .catch(() => {});
    // Load gallery photos from API — update gallery if available
    api.get("/api/gallery")
      .then(r => {
        if (r.data?.length) {
          setApiGallery(r.data.map(p => ({ label: p.label, src: p.url })));
        }
      })
      .catch(() => {});
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

  const visibleFacilities = FACILITIES.slice(0, 8);

  const fmtDate = (d) => d ? d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" }) : "";

  /* ── Video autoplay/pause on scroll ── */
  const videoRef = useRef(null);
  const videoSectionRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const section = videoSectionRef.current;
    if (!video || !section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.muted = false;
          video.play().catch(() => { video.muted = true; video.play(); });
        } else {
          video.pause();
          video.muted = true;
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-white min-h-screen font-jakarta text-slate-800">

      {/* ══ 0. HERO VIDEO ══ */}
      <section ref={videoSectionRef} className="relative w-full overflow-hidden bg-black" style={{ height: "100svh", maxHeight: "700px" }}>
        <video
          ref={videoRef}
          src="/WhatsApp Video 2026-06-23 at 17.47.03.mp4"
          className="absolute inset-0 w-full h-full object-cover"
          loop playsInline muted preload="auto"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white font-bold drop-shadow-2xl"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.2rem, 8vw, 5rem)", textShadow: "0 4px 24px rgba(0,0,0,0.6)" }}
          >
            SM Golden Resorts
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-white/80 font-semibold mt-3 tracking-widest uppercase text-sm md:text-base"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
          >
            Old Falls, Courtallam · Tamil Nadu
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            onClick={() => navigate("/booking")}
            className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-8 py-3.5 rounded-full text-sm shadow-2xl transition-all"
          >
            Book Your Stay
          </motion.button>
        </div>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-white/60 text-xs font-medium uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-5 h-5 border-2 border-white/60 rounded-full flex items-center justify-center"
          >
            <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ══ 1. PHOTO GRID ══ */}
      <section className="w-full max-w-[1280px] mx-auto px-3 pt-3">

        {/* ── Mobile: Full-width carousel with arrows + logo ── */}
        <div className="md:hidden relative rounded-xl overflow-hidden h-[260px] bg-slate-200">
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={galleryIdx}
              src={displayGallery[galleryIdx]?.src}
              alt={displayGallery[galleryIdx]?.label}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.22 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* Counter — top right */}
          <div className="absolute top-3 right-3 bg-black/50 text-white text-[11px] font-bold px-2.5 py-1 rounded-full z-10">
            {galleryIdx + 1} of {displayGallery.length}
          </div>

          {/* Prev Arrow — left edge, outside feel */}
          <button
            onClick={() => setGalleryIdx(i => (i - 1 + displayGallery.length) % displayGallery.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/45 hover:bg-black/65 text-white flex items-center justify-center z-10 shadow-lg transition-all"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next Arrow — right edge */}
          <button
            onClick={() => setGalleryIdx(i => (i + 1) % displayGallery.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/45 hover:bg-black/65 text-white flex items-center justify-center z-10 shadow-lg transition-all"
            aria-label="Next photo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {displayGallery.slice(0, 10).map((_, i) => (
              <button key={i} onClick={() => setGalleryIdx(i)}
                className={`rounded-full transition-all ${i === galleryIdx ? "bg-white w-4 h-1.5" : "bg-white/50 w-1.5 h-1.5"}`} />
            ))}
          </div>

          {/* View all photos — bottom right */}
          <button
            onClick={() => { setGalleryIdx(0); setGalleryOpen(true); }}
            className="absolute bottom-3 right-3 bg-black/60 text-white text-[11px] font-bold px-3 py-1.5 rounded-full z-10 flex items-center gap-1"
          >
            {displayGallery.length} photos <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* ── Desktop: 1 big left + 2×2 right grid (reference exact) ── */}
        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-1.5 rounded-xl overflow-hidden h-[420px] relative">

          {/* Left big photo — spans 2 cols × 2 rows */}
          <div
            className="col-span-2 row-span-2 relative overflow-hidden cursor-pointer group"
            onClick={() => { setGalleryIdx(0); setGalleryOpen(true); }}
          >
            <img
              src={HERO_5[0]?.src}
              alt="SM Golden Resorts"
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>

          {/* Right top-left */}
          <div
            className="relative overflow-hidden cursor-pointer group"
            onClick={() => { setGalleryIdx(1); setGalleryOpen(true); }}
          >
            <img src={HERO_5[1]?.src} alt={HERO_5[1]?.label}
                 className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>

          {/* Right top-right */}
          <div
            className="relative overflow-hidden cursor-pointer group"
            onClick={() => { setGalleryIdx(2); setGalleryOpen(true); }}
          >
            <img src={HERO_5[2]?.src} alt={HERO_5[2]?.label}
                 className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>

          {/* Right bottom-left */}
          <div
            className="relative overflow-hidden cursor-pointer group"
            onClick={() => { setGalleryIdx(3); setGalleryOpen(true); }}
          >
            <img src={HERO_5[3]?.src} alt={HERO_5[3]?.label}
                 className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>

          {/* Right bottom-right — "N photos →" button — corner, no overlay */}
          <div
            className="relative overflow-hidden cursor-pointer group"
            onClick={() => { setGalleryIdx(4); setGalleryOpen(true); }}
          >
            <img src={HERO_5[4]?.src} alt={HERO_5[4]?.label}
                 className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500" />
            {/* Button — bottom right corner, no dark overlay on photo */}
            <button
              onClick={(e) => { e.stopPropagation(); setGalleryIdx(0); setGalleryOpen(true); }}
              className="absolute bottom-3 right-3 bg-black/80 hover:bg-black text-white font-bold text-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg transition-all border-2 border-white"
              style={{ backdropFilter: "blur(4px)" }}
            >
              <span>{displayGallery.length} photos</span>
              <span className="text-base">→</span>
            </button>
          </div>

        </div>
      </section>

      {/* ══ 2. TITLE + RATING ══ */}
      <section className="max-w-[1280px] mx-auto px-4 mt-4">
        <div
          className="rounded-2xl px-5 py-5 mb-0"
          style={{ background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 60%, #1d4ed8 100%)" }}
        >
          {/* Title */}
          <h1 className="leading-tight text-center mb-3">
            <span
              className="block text-white font-bold tracking-wide drop-shadow-sm"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 5vw, 2.4rem)" }}
            >
              SM Golden Resorts
            </span>
            <span
              className="block text-blue-100 font-semibold mt-0.5"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(0.85rem, 2.5vw, 1.05rem)", letterSpacing: "0.04em" }}
            >
              Courtallam, Tamil Nadu
            </span>
          </h1>

          {/* Address + Rating row */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-blue-100">
              <MapPin className="w-3.5 h-3.5 text-blue-200 shrink-0" />
              <span>Old Falls Main Road, Old Falls, Courtallam, Tamil Nadu 627802</span>
              <span className="inline-flex items-center gap-1 bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">🌦️ 27°C</span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex flex-row items-start justify-between gap-3 pb-4 border-b border-slate-100 mt-0">
          <div className="flex items-center gap-1 text-xs font-bold text-slate-500 border border-slate-200 rounded-lg px-3 py-1.5 self-start mt-1">
            <span>IN</span><span className="text-slate-400 mx-1">INR</span><span>₹</span>
          </div>
        </div>
      </section>

      {/* ══ 3. STICKY TABS + MOBILE DATE/GUESTS BAR ══ */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        <div className="max-w-[1280px] mx-auto px-4">

          {/* Tabs row — blue pill active — FIRST */}
          <div className="flex gap-1 overflow-x-auto no-scrollbar py-2">
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
      <div className="max-w-[1280px] mx-auto px-4 pt-2 pb-2">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">

          {/* ─── LEFT ─── */}
          <div className="space-y-6 min-w-0">

            {/* OVERVIEW */}
            <div ref={overviewRef} className="scroll-mt-[110px] space-y-5">
              <div className="text-center space-y-1">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">ABOUT</p>
                <h2 className="text-2xl font-extrabold text-slate-800">Our <span className="text-blue-600 italic">Resort</span></h2>
              </div>
              <div>
                <p className="text-slate-500 text-sm leading-relaxed">
                  SM Golden Resorts is a peaceful resort near Old Falls, Courtallam, Tamil Nadu. Located just 0.38 km from Old Falls Courtallam, we offer the best Courtallam resort booking experience for families, couples, and groups. With 11 well-maintained rooms — Double Bed Non-AC, Double Bed AC, Villa, and Suite — SM Golden Resorts Courtallam is your perfect nature escape. Enjoy free parking, kitchen access, pet-friendly stays, and 24-hour assistance.
                </p>
                <a href="mailto:smgoldenresorts@gmail.com" className="mt-2 block text-sm text-slate-400">smgoldenresorts@gmail.com</a>
              </div>

              {/* FACILITIES */}
              <div ref={amenitiesRef} className="scroll-mt-[110px]">
                <div className="text-center space-y-1 mb-4">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">AMENITIES</p>
                  <h2 className="text-2xl font-extrabold text-slate-800">Our <span className="text-blue-600 italic">Facilities</span></h2>
                </div>
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
                {/* Center-aligned popup button */}
                <div className="flex justify-center mt-5">
                  <button
                    onClick={() => setShowAmenitiesModal(true)}
                    className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-400 bg-blue-50 hover:bg-blue-100 px-5 py-2 rounded-xl transition-all outline-none focus:outline-none"
                  >
                    Show all {FACILITIES.length} Amenities
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* ROOMS */}
            <div ref={roomsRef} className="scroll-mt-[110px] border-t border-slate-100 pt-4 space-y-6">
              <div className="text-center space-y-1">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">TARIFF</p>
                <h2 className="text-2xl font-extrabold text-slate-800">Our <span className="text-blue-600 italic">Rooms & Prices</span></h2>
                <p className="text-sm text-slate-400">Best rates guaranteed when you book directly with us</p>
              </div>

              {roomsLoading ? (
                <div className="flex items-center justify-center gap-2 text-sm text-slate-400 py-10">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  Loading rooms...
                </div>
              ) : (() => {
                const ROOM_TYPE_IMAGE = {
                  "Non-AC":       "/ChatGPT Image Jun 21, 2026, 06_28_06 PM.png",
                  "AC":           "/ChatGPT Image Jun 21, 2026, 06_24_42 PM.png",
                  "Three Bed":    "/ChatGPT Image Jun 21, 2026, 06_28_06 PM.png",
                  "Four Bed AC":  "/ChatGPT Image Jun 21, 2026, 06_28_16 PM (1).png",
                  "Villa":        "/ChatGPT Image Jun 21, 2026, 06_20_50 PM.png",
                  "Suite AC":     "/ChatGPT Image Jun 21, 2026, 06_28_16 PM (1).png",
                };
                const ROOM_DISPLAY_NAME = {
                  "Non-AC":      "Double Bed Non-AC",
                  "AC":          "Double Bed AC",
                  "Three Bed":   "Double Bed Non-AC",
                  "Four Bed AC": "Suite Room AC",
                  "Villa":       "Villa",
                  "Suite AC":    "Suite Room AC",
                };
                const FALLBACK = "/WhatsApp Image 2026-06-14 at 07.53.16.jpeg";
                const uniqueRooms = rooms.filter((room, idx, arr) =>
                  arr.findIndex(r => r.price === room.price) === idx
                ).sort((a, b) => a.price - b.price);
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {uniqueRooms.map((room, ri) => {
                      const isSelected = selectedRoomId === room.roomId;
                      const badgeColor = {
                        "Non-AC":   "border-amber-400 text-amber-700 bg-amber-50",
                        "AC":       "border-blue-400 text-blue-700 bg-blue-50",
                        "Villa":    "border-emerald-400 text-emerald-700 bg-emerald-50",
                        "Suite AC": "border-purple-400 text-purple-700 bg-purple-50",
                      }[room.type] || "border-slate-300 text-slate-600 bg-slate-50";

                      const badgeLabel = {
                        "Non-AC":   "NON-A/C",
                        "AC":       "A/C",
                        "Villa":    "VILLA",
                        "Suite AC": "SUITE",
                      }[room.type] || room.badge?.toUpperCase();

                      return (
                        <motion.div key={room.roomId}
                          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: ri * 0.07 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setSelectedRoomId(room.roomId)}
                          className={`bg-white rounded-3xl overflow-hidden shadow-md flex flex-col cursor-pointer transition-all duration-200 group ${
                            isSelected
                              ? "border-2 border-blue-500 border-t-4 border-t-blue-700 shadow-blue-200 shadow-lg"
                              : "border border-slate-200 hover:border-blue-400 hover:border-t-4 hover:border-t-blue-700 hover:shadow-xl hover:-translate-y-1"
                          }`}>

                          {/* Photo — inside card with padding & rounded */}
                          <div className="px-4 pt-4">
                            <div className="relative overflow-hidden rounded-2xl" style={{ height: "200px" }}>
                              <img
                                src={ROOM_TYPE_IMAGE[room.type] || FALLBACK}
                                alt={room.type}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                              />
                              {isSelected && (
                                <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md">
                                  ✓ Selected
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Info */}
                          <div className="px-5 pt-4 pb-5 flex flex-col gap-3 flex-1 text-center">
                            {/* Name */}
                            <h3 className="font-extrabold text-slate-800 text-lg leading-tight">
                              {ROOM_DISPLAY_NAME[room.type] || room.type}
                            </h3>

                            {/* Badge */}
                            <div className="flex justify-center">
                              <span className={`text-xs font-extrabold px-4 py-1 rounded-full border tracking-wider ${badgeColor}`}>
                                {badgeLabel}
                              </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline justify-center gap-1 mt-1">
                              <span className="text-slate-500 text-sm font-medium">₹</span>
                              <span className="text-3xl font-extrabold text-slate-800 whitespace-nowrap">
                                {room.price?.toLocaleString("en-IN")}
                              </span>
                              <span className="text-slate-400 text-sm font-medium whitespace-nowrap">/ day</span>
                            </div>

                            {/* Book Now */}
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={e => { e.stopPropagation(); navigate("/booking", {
                                state: { roomId: room.roomId, checkIn: checkIn.toISOString(), checkOut: checkOut.toISOString(), guests }
                              });}}
                              disabled={!room.available}
                              className={`w-full py-3 rounded-2xl text-sm font-extrabold transition-colors shadow-sm mt-1 ${
                                room.available
                                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
                              }`}>
                              {room.available ? "Book Now" : "Sold Out"}
                            </motion.button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Refund Policy */}
            <div className="border border-slate-200 rounded-xl p-4 text-sm text-slate-500 bg-slate-50/50">
              <p className="font-semibold text-slate-700 mb-1">Refund Policy</p>
              <p className="text-xs">Free cancellation up to 48 hours before check-in. Within 48 hours, 1 night charge applies.</p>
            </div>

            {/* MAP */}
            <div ref={mapRef} className="scroll-mt-[110px] border-t border-slate-100 pt-8 space-y-4">
              <div className="text-center space-y-1 mb-2">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">LOCATION</p>
                <h2 className="text-2xl font-extrabold text-slate-800">Find <span className="text-blue-600 italic">Us Here</span></h2>
              </div>

              {/* Google Maps Embed — SM Golden Resorts, Old Falls, Courtallam */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm" style={{ height: "320px" }}>
                <iframe
                  title="SM Golden Resorts Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.7!2d77.2766!3d9.1667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06c9b6c1a1a1a1%3A0x1a1a1a1a1a1a1a1a!2sSM+Golden+Resorts%2C+Old+Falls+Main+Road%2C+Courtallam%2C+Tamil+Nadu+627802!5e0!3m2!1sen!2sin!4v1234567890!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Get Directions button */}
              <a
                href="https://www.google.com/maps/search/SM+Golden+Resorts+Courtallam+Old+Falls/@9.1667,77.2766,15z"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl transition-all shadow-sm">
                <MapPin className="w-4 h-4" />
                Get Directions on Google Maps
              </a>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-base font-bold text-slate-800">Nearby Places</h3>
                  <button
                    onClick={() => setShowAllNearby(!showAllNearby)}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 underline outline-none focus:outline-none"
                  >
                    {showAllNearby ? "Show Less" : "Show More"}
                  </button>
                </div>
                <div className="divide-y divide-slate-100">
                  {(showAllNearby ? NEARBY : NEARBY.slice(0, 7)).map(([name, dist]) => (
                    <div key={name} className="flex items-center justify-between py-3">
                      <span className="text-sm text-slate-700">• {name}</span>
                      <span className="text-sm text-slate-500 font-medium shrink-0 ml-4">{dist}</span>
                    </div>
                  ))}
                </div>
                {!showAllNearby && (
                  <button
                    onClick={() => setShowAllNearby(true)}
                    className="mt-2 text-sm font-semibold text-blue-600 hover:text-blue-700 underline flex items-center gap-1 outline-none focus:outline-none"
                  >
                    Show More <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* REVIEWS — Google Reviews via Elfsight */}
            <div ref={reviewsRef} className="scroll-mt-[110px] border-t border-slate-100 pt-8 space-y-4">
              <div className="text-center space-y-1 mb-4">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">TESTIMONIALS</p>
                <h2 className="text-2xl font-extrabold text-slate-800">Guest <span className="text-blue-600 italic">Reviews</span></h2>
              </div>
              <div className="elfsight-app-9aed98a4-50a0-461b-8b92-9236e77aafcd"></div>
            </div>

            {/* FAQs */}
            <div ref={faqsRef} className="scroll-mt-[110px] border-t border-slate-100 pt-4 pb-2 space-y-4">
              <div className="text-center space-y-1 mb-2">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">FAQ</p>
                <h2 className="text-2xl font-extrabold text-slate-800">Frequently <span className="text-blue-600 italic">Asked Questions</span></h2>
              </div>
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
                <button onClick={() => setManageModalOpen(true)}
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
              <a href="tel:9003549849" className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-all">
                <Phone className="w-3.5 h-3.5" /> 9003549849
              </a>
              <a href="tel:9443710420" className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-all">
                <Phone className="w-3.5 h-3.5" /> 9443710420
              </a>
              <a href="https://wa.me/919003549849?text=Hi%20I%20want%20to%20book%20at%20SM%20Golden%20Resorts"
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
          {selRoom && (
            <button onClick={handleBook}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow flex items-center gap-2 shrink-0 outline-none focus:outline-none">
              Book Now →
            </button>
          )}
        </div>
      </div>


      {/* ══ GALLERY LIGHTBOX ══ */}
      <AnimatePresence>
        {galleryOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/95 z-50 flex flex-col">
            {/* Top bar — title left, counter + close right */}
            <div className="flex items-center justify-between px-5 py-4 shrink-0">
              <span className="text-white text-sm font-bold">SM Golden Resorts</span>
              <div className="flex items-center gap-3">
                <span className="text-white/60 text-sm font-medium">{galleryIdx + 1} / {displayGallery.length}</span>
                <button onClick={() => setGalleryOpen(false)}
                        className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all outline-none focus:outline-none">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center relative px-14 min-h-0">
              <button onClick={() => setGalleryIdx(p => (p - 1 + displayGallery.length) % displayGallery.length)}
                      className="absolute left-3 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center outline-none focus:outline-none transition-all">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <AnimatePresence mode="wait">
                <motion.img key={galleryIdx} src={displayGallery[galleryIdx]?.src} alt={displayGallery[galleryIdx]?.label}
                  initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.18 }}
                  className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl" />
              </AnimatePresence>
              <button onClick={() => setGalleryIdx(p => (p + 1) % displayGallery.length)}
                      className="absolute right-3 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center outline-none focus:outline-none transition-all">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            {/* Thumbnail strip */}
            <div className="shrink-0 flex gap-2 py-4 px-4 overflow-x-auto no-scrollbar">
              {displayGallery.map((img, i) => (
                <button key={i} onClick={() => setGalleryIdx(i)}
                        className={`shrink-0 w-16 h-11 rounded-lg overflow-hidden border-2 transition-all outline-none focus:outline-none ${
                          i === galleryIdx ? "border-white scale-105" : "border-transparent opacity-35 hover:opacity-65"
                        }`}>
                  <img src={img.src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manage Booking Modal */}
      <ManageBookingModal isOpen={manageModalOpen} onClose={() => setManageModalOpen(false)} />

      {/* ══ AMENITIES MODAL ══ */}
      <AnimatePresence>
        {showAmenitiesModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAmenitiesModal(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 24 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none"
            >
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg pointer-events-auto overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
                  <h2 className="text-xl font-extrabold text-slate-900">Amenities</h2>
                  <button
                    onClick={() => setShowAmenitiesModal(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-all outline-none"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {/* All amenities — 3-col grid */}
                <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-4 max-h-[60vh] overflow-y-auto">
                  {FACILITIES.map((f, i) => {
                    const Icon = f.icon;
                    return (
                      <div key={i} className="flex items-center gap-3 py-1">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                          <Icon className="w-4.5 h-4.5 text-slate-600" />
                        </div>
                        <span className="text-sm text-slate-700 font-medium">{f.name}</span>
                      </div>
                    );
                  })}
                </div>
                {/* Footer */}
                <div className="px-6 pb-5 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setShowAmenitiesModal(false)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition-all outline-none"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* WhatsApp button — hidden when gallery lightbox is open */}
      {!galleryOpen && <WhatsAppButton />}

    </div>
  );
}
