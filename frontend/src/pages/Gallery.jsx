import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Images } from "lucide-react";
import api from "../api/axios";

/* ── Static fallback photos ── */
const STATIC_GALLERY = [
  { label: "SM Golden Resorts",        src: "/ChatGPT Image Jun 21, 2026, 06_19_17 PM.png" },
  { label: "Villa Room",               src: "/ChatGPT Image Jun 21, 2026, 06_20_50 PM.png" },
  { label: "Double Bed AC Room",       src: "/ChatGPT Image Jun 21, 2026, 06_24_42 PM.png" },
  { label: "Suite Room",               src: "/ChatGPT Image Jun 21, 2026, 06_28_16 PM (1).png" },
  { label: "Resort View",              src: "/ChatGPT Image Jun 21, 2026, 06_20_28 PM.png" },
  { label: "Room Interior",            src: "/ChatGPT Image Jun 21, 2026, 06_21_49 PM.png" },
  { label: "Resort Facilities",        src: "/ChatGPT Image Jun 21, 2026, 06_22_45 PM.png" },
  { label: "Bedroom",                  src: "/ChatGPT Image Jun 21, 2026, 06_23_01 PM.png" },
  { label: "Resort Building",          src: "/ChatGPT Image Jun 21, 2026, 06_25_28 PM.png" },
  { label: "Resort Entrance",          src: "/ChatGPT Image Jun 21, 2026, 06_19_24 PM.png" },
  { label: "Double Bed Non-AC",        src: "/ChatGPT Image Jun 21, 2026, 06_28_06 PM.png" },
  { label: "Premium Room",             src: "/ChatGPT Image Jun 21, 2026, 06_19_35 PM.png" },
  { label: "Resort Photo",             src: "/WhatsApp Image 2026-06-22 at 18.04.13.jpeg" },
  { label: "New Room View",            src: "/ChatGPT Image Jun 22, 2026, 06_57_51 PM.png" },
];

/* ══════════════════════════════════════════════════════════════ */
export default function Gallery() {
  const [photos, setPhotos]             = useState(STATIC_GALLERY);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIdx, setActiveIdx]       = useState(0);
  const [mobileIdx, setMobileIdx]       = useState(0);
  const thumbRef = useRef(null);

  /* Load API gallery and merge */
  useEffect(() => {
    api.get("/api/gallery")
      .then((r) => {
        if (r.data?.length) {
          const apiPhotos = r.data.map((p) => ({ label: p.label, src: p.url }));
          setPhotos([...apiPhotos, ...STATIC_GALLERY]);
        }
      })
      .catch(() => {});
  }, []);

  const openAt = (i) => { setActiveIdx(i); setLightboxOpen(true); };
  const prev   = () => setActiveIdx((i) => (i - 1 + photos.length) % photos.length);
  const next   = () => setActiveIdx((i) => (i + 1) % photos.length);

  /* Auto-scroll thumbnail into view */
  useEffect(() => {
    if (!thumbRef.current) return;
    const el = thumbRef.current.children[activeIdx];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeIdx]);

  /* Keyboard navigation */
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape")     setLightboxOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, photos.length]);

  /* Swipe support for lightbox */
  const touchStart = useRef(null);
  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    touchStart.current = null;
  };

  return (
    <div className="min-h-screen bg-white font-jakarta">

      {/* ══ PAGE HEADER ══ */}
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1e40af 0%, #2563eb 60%, #1d4ed8 100%)" }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-10 right-1/3 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-[1280px] mx-auto px-4 py-10 text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-[11px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
              <Images className="w-3.5 h-3.5" />
              Photo Gallery
            </div>
            <h1
              className="text-white font-bold drop-shadow-sm"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 5vw, 2.6rem)" }}
            >
              SM Golden Resorts
            </h1>
            <p className="text-blue-100 text-sm mt-2 font-medium">
              {photos.length} photos · Old Falls, Courtallam
            </p>
          </motion.div>
        </div>
      </div>

      {/* ══ GALLERY CONTENT ══ */}
      <div className="max-w-[1280px] mx-auto px-3 py-5 space-y-4">

        {/* ─────────────────────────────────────────────────────
            MOBILE VIEW: Full-width carousel
        ───────────────────────────────────────────────────── */}
        <div className="md:hidden relative rounded-2xl overflow-hidden bg-slate-200" style={{ height: "260px" }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={mobileIdx}
              src={photos[mobileIdx]?.src}
              alt={photos[mobileIdx]?.label}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.22 }}
              className="absolute inset-0 w-full h-full object-cover cursor-pointer"
              onClick={() => openAt(mobileIdx)}
            />
          </AnimatePresence>

          {/* Counter */}
          <div className="absolute top-3 right-3 bg-black/55 text-white text-[11px] font-bold px-2.5 py-1 rounded-full z-10">
            {mobileIdx + 1} / {photos.length}
          </div>

          {/* Prev */}
          <button
            onClick={() => setMobileIdx((i) => (i - 1 + photos.length) % photos.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/45 hover:bg-black/65 text-white flex items-center justify-center z-10 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next */}
          <button
            onClick={() => setMobileIdx((i) => (i + 1) % photos.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/45 hover:bg-black/65 text-white flex items-center justify-center z-10 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {photos.slice(0, 12).map((_, i) => (
              <button
                key={i}
                onClick={() => setMobileIdx(i)}
                className={`rounded-full transition-all ${i === mobileIdx ? "bg-white w-4 h-1.5" : "bg-white/50 w-1.5 h-1.5"}`}
              />
            ))}
          </div>
        </div>

        {/* Mobile: all photos grid */}
        <div className="md:hidden">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            All Photos ({photos.length})
          </p>
          <div className="grid grid-cols-2 gap-2">
            {photos.map((photo, i) => (
              <div
                key={i}
                className="relative aspect-[4/3] overflow-hidden rounded-xl cursor-pointer"
                onClick={() => openAt(i)}
              >
                <img src={photo.src} alt={photo.label} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────
            DESKTOP VIEW
        ───────────────────────────────────────────────────── */}

        {/* ── SECTION 1: Three equal portrait strips (top reference) ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="hidden md:grid grid-cols-3 gap-2 rounded-2xl overflow-hidden"
          style={{ height: "340px" }}
        >
          {photos.slice(0, 3).map((photo, i) => (
            <div
              key={i}
              className="relative overflow-hidden cursor-pointer group"
              onClick={() => openAt(i)}
            >
              <img
                src={photo.src}
                alt={photo.label}
                className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
              {/* Label on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white text-xs font-semibold">{photo.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── SECTION 2: 1 big left + 2×2 right grid (bottom reference) ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="hidden md:grid grid-cols-4 gap-2 rounded-2xl overflow-hidden"
          style={{ height: "420px" }}
        >
          {/* Big left photo */}
          <div
            className="col-span-2 relative overflow-hidden cursor-pointer group"
            onClick={() => openAt(3)}
          >
            <img
              src={photos[3]?.src}
              alt={photos[3]?.label}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>

          {/* Right 2×2 */}
          <div className="col-span-2 grid grid-cols-2 gap-2">
            {[4, 5, 6, 7].map((photoIdx, i) => (
              <div
                key={i}
                className="relative overflow-hidden cursor-pointer group"
                onClick={() => openAt(photoIdx)}
              >
                <img
                  src={photos[photoIdx]?.src}
                  alt={photos[photoIdx]?.label}
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />

                {/* Last cell overlay — "N photos →" */}
                {i === 3 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <button
                      onClick={(e) => { e.stopPropagation(); openAt(0); }}
                      className="bg-white/95 hover:bg-white text-slate-800 font-extrabold text-sm px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg transition-all"
                    >
                      <span>{photos.length} photos</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── SECTION 3: Remaining photos — 5-col grid ── */}
        {photos.length > 8 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="hidden md:block"
          >
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-0.5">
              More Photos
            </p>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {photos.slice(8).map((photo, i) => (
                <div
                  key={i}
                  className="relative aspect-[4/3] overflow-hidden rounded-xl cursor-pointer group"
                  onClick={() => openAt(i + 8)}
                >
                  <img
                    src={photo.src}
                    alt={photo.label}
                    className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-400"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end p-2 opacity-0 group-hover:opacity-100">
                    <span className="text-white text-[10px] font-semibold truncate bg-black/40 px-2 py-0.5 rounded-full w-full text-center">
                      {photo.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* ══ LIGHTBOX ══ */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/95 z-[100] flex flex-col"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Top bar */}
            <div className="shrink-0 flex items-center justify-between px-5 py-4">
              <span className="text-white/60 text-xs font-medium truncate max-w-[60%]">
                {photos[activeIdx]?.label}
              </span>
              <div className="flex items-center gap-4">
                <span className="text-white/40 text-xs font-medium">
                  {activeIdx + 1} / {photos.length}
                </span>
                <button
                  onClick={() => setLightboxOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all"
                  aria-label="Close gallery"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main image */}
            <div className="flex-1 flex items-center justify-center relative px-14 min-h-0">
              <button
                onClick={prev}
                className="absolute left-3 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all z-10"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <AnimatePresence mode="wait">
                <motion.img
                  key={activeIdx}
                  src={photos[activeIdx]?.src}
                  alt={photos[activeIdx]?.label}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  className="max-h-[72vh] max-w-full object-contain rounded-xl shadow-2xl select-none"
                  draggable={false}
                />
              </AnimatePresence>

              <button
                onClick={next}
                className="absolute right-3 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all z-10"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Thumbnail strip */}
            <div className="shrink-0 pb-4 pt-3 px-4">
              <div
                ref={thumbRef}
                className="flex gap-2 overflow-x-auto no-scrollbar"
                style={{ scrollbarWidth: "none" }}
              >
                {photos.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={`shrink-0 w-16 h-11 rounded-lg overflow-hidden border-2 transition-all outline-none focus:outline-none ${
                      i === activeIdx
                        ? "border-white opacity-100 scale-110"
                        : "border-transparent opacity-35 hover:opacity-65"
                    }`}
                    aria-label={img.label}
                  >
                    <img src={img.src} alt="" className="w-full h-full object-cover" draggable={false} />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
