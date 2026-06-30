import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import { roomsData as fallbackRooms } from "../utils/roomData";
import {
  SlidersHorizontal, BedDouble, Wifi, Wind, Tv,
  Droplets, CheckCircle2, ArrowRight, Star, Trees,
  ChevronLeft, ChevronRight
} from "lucide-react";

const TYPE_STYLES = {
  "AC":           { bg: "bg-blue-50",    text: "text-blue-700",   border: "border-blue-200",   dot: "bg-blue-500"   },
  "Non-AC":       { bg: "bg-stone-50",   text: "text-stone-700",  border: "border-stone-200",  dot: "bg-stone-400"  },
  "Three Bed":    { bg: "bg-emerald-50", text: "text-emerald-700",border: "border-emerald-200",dot: "bg-emerald-500"},
  "Four Bed AC":  { bg: "bg-amber-50",   text: "text-amber-700",  border: "border-amber-200",  dot: "bg-amber-500"  },
};

const AMENITY_ICONS = { WiFi: Wifi, AC: Wind, TV: Tv, "Hot Water": Droplets, Fan: Wind, "Garden View": Trees, "Mountain View": Trees };

const ROOM_IMGS = [
  "/ChatGPT Image Jun 21, 2026, 06_19_17 PM.webp",
  "/ChatGPT Image Jun 21, 2026, 06_19_24 PM.webp",
  "/ChatGPT Image Jun 21, 2026, 06_19_29 PM.webp",
  "/ChatGPT Image Jun 21, 2026, 06_19_35 PM.webp",
  "/ChatGPT Image Jun 21, 2026, 06_20_28 PM.webp",
  "/ChatGPT Image Jun 21, 2026, 06_20_50 PM.webp",
  "/ChatGPT Image Jun 21, 2026, 06_21_49 PM.webp",
  "/ChatGPT Image Jun 21, 2026, 06_22_45 PM.webp",
  "/ChatGPT Image Jun 21, 2026, 06_23_01 PM.webp",
  "/ChatGPT Image Jun 21, 2026, 06_24_42 PM.webp",
  "/ChatGPT Image Jun 21, 2026, 06_25_28 PM.webp",
  "/ChatGPT Image Jun 21, 2026, 06_28_06 PM.webp",
  "/ChatGPT Image Jun 21, 2026, 06_28_16 PM (1).webp",
];

// Give each room a slice of images for its carousel
function getRoomImages(index) {
  const total = ROOM_IMGS.length;
  const perRoom = 4;
  const start = (index * 3) % total;
  const imgs = [];
  for (let i = 0; i < perRoom; i++) {
    imgs.push(ROOM_IMGS[(start + i) % total]);
  }
  return imgs;
}

// ── Image Carousel Component ──
function RoomCarousel({ images, roomName }) {
  const [current, setCurrent] = useState(0);

  const prev = (e) => {
    e.stopPropagation();
    setCurrent(c => (c - 1 + images.length) % images.length);
  };
  const next = (e) => {
    e.stopPropagation();
    setCurrent(c => (c + 1) % images.length);
  };

  return (
    <div className="relative h-52 overflow-hidden bg-slate-100">
      {/* Images */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.img
          key={current}
          src={images[current]}
          alt={`${roomName} - ${current + 1}`}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />

      {/* Prev Arrow — always visible large circle */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all z-10 shadow-lg"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Next Arrow — always visible large circle */}
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all z-10 shadow-lg"
        aria-label="Next image"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Counter — top right */}
      <div className="absolute top-3 right-3 bg-black/50 text-white text-[11px] font-bold px-2.5 py-1 rounded-full z-10">
        {current + 1} of {images.length}
      </div>

      {/* Logo circle — bottom left */}
      <div className="absolute bottom-3 left-3 z-10">
        <img
          src="/Gemini_Generated_Image_1938en1938en1938.png"
          alt="SM Golden Resorts"
          className="w-12 h-12 rounded-2xl object-cover shadow-lg border-2 border-white/60"
        />
      </div>

      {/* Dot indicators — bottom center */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => { e.stopPropagation(); setCurrent(idx); }}
            className={`rounded-full transition-all ${
              idx === current ? "bg-white w-4 h-1.5" : "bg-white/50 w-1.5 h-1.5"
            }`}
            aria-label={`Go to image ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

const FILTER_TABS = ["All", "Non-AC", "AC", "Three Bed", "Four Bed AC"];

export default function Rooms() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    api.get("/api/rooms")
      .then(res => setRooms(res.data?.length > 0 ? res.data : fallbackRooms))
      .catch(() => setRooms(fallbackRooms))
      .finally(() => setLoading(false));
  }, []);

  const filtered = rooms.filter(r => {
    if (activeFilter === "All") return true;
    return r.type === activeFilter;
  });

  const style = (type) => TYPE_STYLES[type] || TYPE_STYLES["AC"];

  return (
    <div className="min-h-screen bg-[#FAFAF8] font-jakarta">

      {/* ── Hero Header ── */}
      <div className="bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block text-primary text-[10px] font-extrabold uppercase tracking-widest bg-primary/15 border border-primary/25 px-4 py-1.5 rounded-full mb-4">
              Accommodations
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white font-jakarta mt-3">
              Rooms & Suites
            </h1>
            <p className="text-white/55 text-sm mt-3 max-w-lg mx-auto leading-relaxed">
              20 thoughtfully designed rooms — Double Bed, Double Bed A/C, Three Bed, and Four Bed A/C — right next to Old Falls.
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {[["20", "Rooms"], ["₹1,300", "Starting from"], ["24/7", "Open"], ["0.38km", "To Falls"]].map(([v, l]) => (
                <div key={l} className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-center">
                  <p className="text-gold font-extrabold text-sm font-jakarta">{v}</p>
                  <p className="text-white/50 text-[9px] font-medium uppercase tracking-wider mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* ── Filter Bar ── */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-3 mb-10">
          <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            <SlidersHorizontal className="w-3.5 h-3.5 text-primary" /> Filter by Room Type
          </div>
          <div className="flex flex-wrap justify-center gap-1.5 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm">
            {FILTER_TABS.map(tab => (
              <button key={tab} onClick={() => setActiveFilter(tab)}
                className={`text-xs font-bold px-5 py-2.5 rounded-xl transition-all ${
                  activeFilter === tab
                    ? "bg-navy text-white shadow-md"
                    : "text-slate-500 hover:bg-slate-100"
                }`}>
                {tab}
                {tab !== "All" && (
                  <span className={`ml-1.5 text-[9px] px-1.5 py-0.5 rounded-full ${
                    activeFilter === tab ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}>
                    {rooms.filter(r => r.type === tab).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Room Grid ── */}
        {loading ? (
          <div className="flex items-center justify-center py-20"><LoadingSpinner /></div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center bg-white rounded-2xl py-16 border border-slate-200 shadow-sm">
            <p className="text-slate-400 font-semibold">No rooms in this category.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filtered.map((room, i) => {
                const s = style(room.type);
                return (
                  <motion.div key={room.roomId}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all group flex flex-col">

                    {/* Image Carousel */}
                    <div className="relative overflow-hidden">
                      <RoomCarousel images={getRoomImages(i)} roomName={room.name} />

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                        <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full border ${s.bg} ${s.text} ${s.border}`}>
                          {room.type}
                        </span>
                        {i === 0 && (
                          <span className="text-[9px] font-extrabold bg-purple-600 text-white px-2.5 py-1 rounded-full">
                            ⭐ Popular
                          </span>
                        )}
                      </div>

                      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
                        <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full ${
                          room.available
                            ? "bg-emerald-500 text-white"
                            : "bg-red-500 text-white"
                        }`}>
                          {room.available ? "✓ Available" : "✕ Sold Out"}
                        </span>
                      </div>

                      {/* Room number on image */}
                      <div className="absolute bottom-10 left-3 z-10">
                        <p className="text-white font-extrabold text-lg font-jakarta leading-none drop-shadow-lg">
                          #{room.roomId}
                        </p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-extrabold text-navy text-base font-jakarta leading-tight">{room.name}</h3>
                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-[10px] font-bold text-slate-500">4.8</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-3 text-xs text-slate-500 font-medium">
                        <BedDouble className="w-3.5 h-3.5 text-primary" />
                        <span>{room.beds}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-emerald-600 font-bold text-[10px] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Pay Later
                        </span>
                      </div>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {room.amenities.slice(0, 4).map((a, ai) => {
                          const Icon = AMENITY_ICONS[a];
                          return (
                            <span key={ai} className="inline-flex items-center gap-1 text-[10px] bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                              {Icon && <Icon className="w-2.5 h-2.5 text-primary" />}
                              {a}
                            </span>
                          );
                        })}
                        {room.amenities.length > 4 && (
                          <span className="text-[10px] text-primary font-bold px-1">+{room.amenities.length - 4}</span>
                        )}
                      </div>

                      {/* Price + CTA */}
                      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                        <div>
                          <span className="text-2xl font-extrabold text-primary font-jakarta">₹{room.price.toLocaleString("en-IN")}</span>
                          <p className="text-[10px] text-slate-400 font-medium">per night + taxes</p>
                        </div>
                        {room.available ? (
                          <button
                            onClick={() => navigate(`/booking`, { state: { roomId: room.roomId } })}
                            className="flex items-center gap-1.5 bg-navy hover:bg-navy-light text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all shadow hover:shadow-md">
                            Book Now <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button disabled className="bg-slate-100 text-slate-400 text-xs font-bold px-4 py-2.5 rounded-xl cursor-not-allowed">
                            Unavailable
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* ── Bottom CTA ── */}
        {!loading && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="mt-12 bg-navy rounded-2xl p-8 text-center">
            <h3 className="text-xl font-extrabold text-white font-jakarta">Can't decide? Call us directly!</h3>
            <p className="text-white/50 text-sm mt-2">Our team will help you pick the perfect room for your needs.</p>
            <div className="flex flex-wrap justify-center gap-3 mt-5">
              <a href="tel:9003549849"
                className="flex items-center gap-2 bg-gold hover:bg-gold/90 text-white font-extrabold px-6 py-3 rounded-xl text-sm transition-all shadow">
                📞 9003549849
              </a>
              <a href="https://wa.me/919003549849?text=Hi%20I%20want%20to%20know%20about%20rooms%20at%20SM%20Golden%20Resorts"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-6 py-3 rounded-xl text-sm transition-all shadow">
                💬 WhatsApp Us
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
