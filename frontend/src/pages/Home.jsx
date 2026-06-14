import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Wifi, Car, UtensilsCrossed, Zap, ShieldAlert,
  ChevronLeft, ChevronRight, CheckCircle2, MapPin, Star,
  Calendar, Users, Info, ChevronDown, Check, ArrowRight, X, Phone
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { roomsData as fallbackRooms } from "../utils/roomData";

const Home = () => {
  const navigate = useNavigate();

  /* ─── State ─── */
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  });
  const [guests, setGuests] = useState(2);
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Room Image slider state (roomId -> current image index)
  const [roomImgIndexes, setRoomImgIndexes] = useState({});

  /* ─── Refs for Scrollspy ─── */
  const overviewRef = useRef(null);
  const amenitiesRef = useRef(null);
  const roomsRef = useRef(null);
  const mapRef = useRef(null);
  const reviewsRef = useRef(null);
  const faqsRef = useRef(null);

  /* ─── Fetch Rooms ─── */
  useEffect(() => {
    api.get("/api/rooms")
      .then(res => {
        setRooms(res.data);
      })
      .catch(() => {
        setRooms(fallbackRooms);
      })
      .finally(() => setRoomsLoading(false));
  }, []);

  /* ─── Scrollspy effect ─── */
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 180;
      
      if (faqsRef.current && scrollPos >= faqsRef.current.offsetTop) {
        setActiveTab("faqs");
      } else if (reviewsRef.current && scrollPos >= reviewsRef.current.offsetTop) {
        setActiveTab("reviews");
      } else if (mapRef.current && scrollPos >= mapRef.current.offsetTop) {
        setActiveTab("map");
      } else if (roomsRef.current && scrollPos >= roomsRef.current.offsetTop) {
        setActiveTab("rooms");
      } else if (amenitiesRef.current && scrollPos >= amenitiesRef.current.offsetTop) {
        setActiveTab("amenities");
      } else {
        setActiveTab("overview");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId, ref) => {
    setActiveTab(sectionId);
    if (ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop - 140,
        behavior: "smooth"
      });
    }
  };

  /* ─── Static Images ─── */
  const galleryImages = [
    { label: "Premium Suite Bedroom", src: "/WhatsApp Image 2026-05-15 at 10.48.35 (1).webp" },
    { label: "Executive Suite Living Area", src: "/WhatsApp Image 2026-05-15 at 10.48.37.webp" },
    { label: "Aerial Resort View", src: "/Gemini_Generated_Image_1938en1938en1938.png" },
    { label: "Deluxe Family Room", src: "/WhatsApp Image 2026-05-15 at 10.48.39 (1).webp" },
    { label: "Bathroom Amenities", src: "/WhatsApp Image 2026-05-15 at 10.48.39.webp" },
    { label: "Resort Front Entrance", src: "/WhatsApp Image 2026-05-15 at 10.48.40.webp" },
    { label: "Mountain View Balcony", src: "/WhatsApp Image 2026-05-15 at 10.48.41.webp" },
  ];

  /* ─── Amenities ─── */
  const facilities = [
    { name: "Pickup / drop", icon: Car },
    { name: "Kitchen", icon: UtensilsCrossed },
    { name: "Wifi", icon: Wifi },
    { name: "Parking", icon: Car },
    { name: "Power backup", icon: Zap },
    { name: "Washing machine", icon: Wifi },
    { name: "Debit Card", icon: ShieldAlert },
    { name: "24h lobby", icon: ShieldAlert },
    { name: "Mountain View", icon: ShieldAlert },
    { name: "Water Falls Access", icon: ShieldAlert },
    { name: "AC Rooms", icon: ShieldAlert },
    { name: "Room Service", icon: ShieldAlert },
    { name: "80 Capacity Lounge", icon: ShieldAlert },
    { name: "Safe Lockers", icon: ShieldAlert }
  ];

  const visibleFacilities = showAllAmenities ? facilities : facilities.slice(0, 8);

  /* ─── Reviews ─── */
  const reviews = [
    {
      name: "RajeshRaj P",
      initials: "RP",
      review: "I recently had the pleasure of staying at SM GOLDEN Resort Which located near to old cuttralam , and it exceeded all my expectations. Highly recommended!",
      rating: 5,
      time: "2 years ago on Google"
    },
    {
      name: "Archana R",
      initials: "AR",
      review: "We stayed in this place last week. Rooms were clean and spacious and the owner was very friendly, attended us everytime quickly. Perfect resort for families.",
      rating: 5,
      time: "a year ago on Google"
    },
    {
      name: "Suresh Kumar",
      initials: "SK",
      review: "Best place in Courtallam to stay with family. Old falls is very near by walk. Secured parking space and kitchen facility was super convenient.",
      rating: 5,
      time: "6 months ago on Google"
    }
  ];

  const [reviewIdx, setReviewIdx] = useState(0);

  /* ─── Calculations ─── */
  const selectedRoom = rooms.find(r => r.roomId === selectedRoomId);
  const nights = checkOut && checkIn ? Math.max(1, Math.ceil((checkOut - checkIn) / 86400000)) : 1;
  const basePrice = selectedRoom ? selectedRoom.price * nights : 0;
  const discount = selectedRoom ? Math.round(basePrice * 0.1) : 0; // 10% discount
  const taxes = selectedRoom ? Math.round((basePrice - discount) * 0.05) : 0; // 5% tax
  const finalPrice = basePrice - discount + taxes;

  /* ─── Navigation Slider for Rooms ─── */
  const handleRoomImgPrev = (e, roomId, imagesCount) => {
    e.stopPropagation();
    setRoomImgIndexes(prev => {
      const cur = prev[roomId] || 0;
      const nextIdx = cur === 0 ? imagesCount - 1 : cur - 1;
      return { ...prev, [roomId]: nextIdx };
    });
  };

  const handleRoomImgNext = (e, roomId, imagesCount) => {
    e.stopPropagation();
    setRoomImgIndexes(prev => {
      const cur = prev[roomId] || 0;
      const nextIdx = cur === imagesCount - 1 ? 0 : cur + 1;
      return { ...prev, [roomId]: nextIdx };
    });
  };

  /* ─── Redirect to Checkout ─── */
  const handleProceedToBooking = () => {
    if (!selectedRoomId) {
      toast.error("Please select a room type first!");
      scrollToSection("rooms", roomsRef);
      return;
    }
    // Navigate with state containing selection
    navigate(`/booking`, {
      state: {
        roomId: selectedRoomId,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        guests: guests
      }
    });
  };

  return (
    <div className="bg-white min-h-screen font-jakarta text-slate-800">

      {/* ══════════════════════════════════════════
          1. HEADER IMAGE GRID (5-Photos Layout)
         ══════════════════════════════════════════ */}
      <section className="max-w-[1400px] mx-auto px-4 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden h-[300px] md:h-[420px] relative">
          
          {/* Big Image on Left */}
          <div className="col-span-1 md:col-span-2 h-full relative cursor-pointer group" onClick={() => { setActivePhotoIdx(0); setShowGalleryModal(true); }}>
            <img
              src={galleryImages[0].src}
              alt={galleryImages[0].label}
              className="w-full h-full object-cover group-hover:opacity-95 transition-all duration-300"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
          </div>

          {/* Right 2x2 Small Grid */}
          <div className="hidden md:grid col-span-2 grid-cols-2 gap-2 h-full">
            <div className="h-full relative cursor-pointer group" onClick={() => { setActivePhotoIdx(1); setShowGalleryModal(true); }}>
              <img src={galleryImages[1].src} alt={galleryImages[1].label} className="w-full h-full object-cover group-hover:opacity-95 transition-all" />
            </div>
            <div className="h-full relative cursor-pointer group" onClick={() => { setActivePhotoIdx(2); setShowGalleryModal(true); }}>
              <img src={galleryImages[2].src} alt={galleryImages[2].label} className="w-full h-full object-cover group-hover:opacity-95 transition-all" />
            </div>
            <div className="h-full relative cursor-pointer group" onClick={() => { setActivePhotoIdx(3); setShowGalleryModal(true); }}>
              <img src={galleryImages[3].src} alt={galleryImages[3].label} className="w-full h-full object-cover group-hover:opacity-95 transition-all" />
            </div>
            <div className="h-full relative cursor-pointer group" onClick={() => { setActivePhotoIdx(5); setShowGalleryModal(true); }}>
              <img src={galleryImages[5].src} alt={galleryImages[5].label} className="w-full h-full object-cover group-hover:opacity-95 transition-all" />
              
              {/* Overlay on bottom right image */}
              <div className="absolute inset-0 bg-black/45 flex items-center justify-center transition-colors group-hover:bg-black/50">
                <button className="bg-white/95 hover:bg-white text-navy font-bold px-4 py-2.5 rounded-lg text-sm flex items-center gap-1.5 shadow transition-all scale-95 md:scale-100">
                  <span>{galleryImages.length} photos</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Overlay Gallery Button */}
          <button
            onClick={() => { setActivePhotoIdx(0); setShowGalleryModal(true); }}
            className="md:hidden absolute bottom-4 right-4 bg-white/90 text-navy font-bold px-3 py-1.5 rounded-lg text-xs shadow flex items-center gap-1"
          >
            Show Gallery
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          2. TITLE BLOCK & INFO BAR
         ══════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 mt-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-extrabold text-navy tracking-tight font-jakarta">
                SM Golden Resorts in courtallam
              </h1>
            </div>

            {/* Address & Weather Mockup */}
            <div className="flex items-center gap-2 flex-wrap text-xs sm:text-sm text-slate-500 font-medium">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="break-words">SM gardens, Courtallam Rd, Courtallam, Tamil Nadu 627802, India</span>
              <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-slate-300 mx-1"></span>
              <div className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-sky-100">
                <span className="text-base leading-none">🌦️</span>
                <span>27°C</span>
              </div>
            </div>

            {/* Rating summary */}
            <div className="flex items-center gap-1.5 pt-1">
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                <span className="text-xs font-extrabold text-blue-600 font-jakarta">G</span>
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              </div>
              <span className="text-xs text-slate-500 font-bold ml-1">56 Reviews</span>
            </div>
          </div>

          {/* Badges strip on desktop */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              100% Secure Payments
            </span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3. STICKY SUB-NAVBAR TABS
         ══════════════════════════════════════════ */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-150 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-6 overflow-x-auto no-scrollbar font-medium py-3">
            {[
              { id: "overview", label: "Overview", ref: overviewRef },
              { id: "amenities", label: "Amenities", ref: amenitiesRef },
              { id: "rooms", label: "Rooms", ref: roomsRef },
              { id: "map", label: "Map", ref: mapRef },
              { id: "reviews", label: "Reviews", ref: reviewsRef },
              { id: "faqs", label: "FAQs", ref: faqsRef }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id, tab.ref)}
                className={`text-sm py-1 border-b-2 font-bold transition-all shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          4. TWO-COLUMN LAYOUT MAIN SECTION
         ══════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative">
          
          {/* ─── LEFT COLUMN (Overview, Amenities, Rooms, Map, Reviews) ─── */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* OVERVIEW SECTION */}
            <div ref={overviewRef} className="space-y-6 scroll-mt-28">
              {/* Promo offer banners slider */}
              <div className="flex gap-3 overflow-x-auto py-2 w-full no-scrollbar">
                <div className="bg-amber-50/70 border border-amber-200 p-3 sm:p-4 rounded-xl flex items-center justify-between shrink-0 w-[220px] sm:w-[260px] md:w-[300px]">
                  <div>
                    <p className="text-xs text-amber-600 font-bold uppercase tracking-wider">sm golden resorts</p>
                    <h4 className="text-sm font-extrabold text-slate-800 mt-1">Get 10% off!</h4>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                    🏷️
                  </div>
                </div>

                <div className="bg-indigo-50/70 border border-indigo-200 p-3 sm:p-4 rounded-xl flex items-center justify-between shrink-0 w-[220px] sm:w-[260px] md:w-[300px]">
                  <div>
                    <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider">Early Bird Offer!!</p>
                    <h4 className="text-sm font-extrabold text-slate-800 mt-1">10% OFF Book 3 days advance</h4>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                    ⏱️
                  </div>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-200 p-3 sm:p-4 rounded-xl flex items-center justify-between shrink-0 w-[220px] sm:w-[260px] md:w-[300px]">
                  <div>
                    <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Last Minute Deals!!</p>
                    <h4 className="text-sm font-extrabold text-slate-800 mt-1">5% OFF Book Today</h4>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                    🔥
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 font-jakarta mb-3">Overview</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  SM Golden Resorts is an exquisite property situated in the heart of Courtallam, next to the stunning Old Waterfalls. Built to host families, groups, and honeymooners, the resort provides peaceful accommodations, direct access to nature, premium rooms, and round-the-clock support to guarantee a relaxing stay. We invite you to experience the natural beauty and cascades of Courtallam.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-semibold bg-slate-50 border border-slate-100 p-3 rounded-lg max-w-full flex-wrap">
                  <span>📧 Contact Email:</span>
                  <a href="mailto:smgoldenresorts@gmail.com" className="text-blue-600 hover:underline">smgoldenresorts@gmail.com</a>
                </div>
              </div>
            </div>

            {/* AMENITIES SECTION */}
            <div ref={amenitiesRef} className="border-t border-slate-100 pt-8 scroll-mt-28">
              <h3 className="text-lg font-bold text-slate-900 font-jakarta mb-4">Facilities</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {visibleFacilities.map((fac, idx) => {
                  const Icon = fac.icon;
                  return (
                    <div key={idx} className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-3.5 rounded-xl hover:border-slate-300 hover:bg-slate-100/55 transition-all group">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-700">{fac.name}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5">
                <button
                  onClick={() => setShowAllAmenities(!showAllAmenities)}
                  className="text-xs font-extrabold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-all"
                >
                  <span>{showAllAmenities ? "Show less" : `Show all ${facilities.length} Amenities`}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAllAmenities ? "rotate-180" : ""}`} />
                </button>
              </div>
            </div>

            {/* ROOMS LIST SECTION */}
            <div ref={roomsRef} className="border-t border-slate-100 pt-8 scroll-mt-28">
              <h3 className="text-lg font-bold text-slate-900 font-jakarta mb-6">Available Rooms</h3>

              {roomsLoading ? (
                <div className="text-center py-12"><p className="text-slate-500 font-semibold animate-pulse text-sm">Fetching accommodation rates...</p></div>
              ) : (
                <div className="space-y-6">
                  {rooms.map(room => {
                    const currentIdx = roomImgIndexes[room.roomId] || 0;
                    
                    // Mock slides for room gallery
                    const roomSlides = [
                      galleryImages[1].src,
                      galleryImages[3].src,
                      galleryImages[4].src,
                      galleryImages[6].src,
                    ];

                    return (
                      <div
                        key={room.roomId}
                        className={`border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow flex flex-col md:flex-row bg-white relative ${
                          selectedRoomId === room.roomId ? "ring-2 ring-blue-500 border-blue-200" : ""
                        }`}
                      >
                        {/* Selected Indicator Badge */}
                        {selectedRoomId === room.roomId && (
                          <div className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full z-10 uppercase tracking-widest shadow">
                            Active Selection
                          </div>
                        )}

                        {/* Room Image Slider Column */}
                        <div className="w-full md:w-[260px] h-[180px] md:h-auto shrink-0 relative overflow-hidden bg-slate-100">
                          <img
                            src={roomSlides[currentIdx]}
                            alt={room.name}
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Navigation Arrows */}
                          <button
                            onClick={(e) => handleRoomImgPrev(e, room.roomId, roomSlides.length)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all cursor-pointer"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleRoomImgNext(e, room.roomId, roomSlides.length)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all cursor-pointer"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>

                          {/* Image indicator */}
                          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                            {currentIdx + 1} of {roomSlides.length}
                          </div>
                        </div>

                        {/* Room Details Column */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h4 className="font-extrabold text-navy text-base font-jakarta">
                                {room.name}
                              </h4>
                              {room.type === "AC" ? (
                                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                  AC Suite
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                  {room.type}
                                </span>
                              )}
                              
                              {room.roomId === "room-2" && (
                                <span className="text-[10px] font-extrabold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                  Recommended
                                </span>
                              )}
                            </div>

                            <p className="text-emerald-600 font-bold text-xs flex items-center gap-1 mb-3">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Book Now Pay Later
                            </p>

                            {/* Amenity tags */}
                            <div className="flex flex-wrap gap-1.5 mb-5">
                              {room.amenities.slice(0, 4).map((am, idx) => (
                                <span key={idx} className="text-[11px] bg-slate-50 border border-slate-150 px-2 py-0.5 rounded text-slate-600 font-medium">
                                  {am}
                                </span>
                              ))}
                              {room.amenities.length > 4 && (
                                <span className="text-[11px] text-blue-600 font-bold px-1 py-0.5">
                                  +{room.amenities.length - 4} More
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action & price row */}
                          <div className="border-t border-slate-100 pt-4 flex items-center justify-between mt-4">
                            <div>
                              <div className="flex items-baseline gap-1">
                                <span className="text-xl font-extrabold text-blue-600">₹{room.price.toLocaleString()}</span>
                                <span className="text-xs text-slate-500 font-semibold">/night</span>
                              </div>
                              <p className="text-[10px] text-slate-400 font-medium">+ taxes & fees</p>
                            </div>

                            {room.available ? (
                              <button
                                onClick={() => {
                                  setSelectedRoomId(room.roomId);
                                  toast.success(`Selected ${room.name}! Booking summary updated.`);
                                }}
                                className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow hover:shadow-md cursor-pointer ${
                                  selectedRoomId === room.roomId
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                                }`}
                              >
                                {selectedRoomId === room.roomId ? "Selected ✓" : "Select Room"}
                              </button>
                            ) : (
                              <button disabled className="bg-slate-100 text-slate-400 px-5 py-2.5 rounded-lg text-xs font-bold cursor-not-allowed">
                                Sold Out
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* MAP & LOCATION SECTION */}
            <div ref={mapRef} className="border-t border-slate-100 pt-8 scroll-mt-28 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 font-jakarta">Map</h3>
              
              <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200 h-[300px] md:h-[350px]">
                <iframe
                  title="Google Map Location of SM Golden Resorts"
                  src="https://maps.google.com/maps?q=Old+Falls+Courtallam+Tamil+Nadu&output=embed"
                  width="100%" height="100%"
                  style={{ border: 0 }} loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Nearby Places */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Nearby Places</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { name: "Tiger Falls", dist: "0.38 km" },
                    { name: "குற்றாலம் சாரல் (Main Courtallam Falls)", dist: "0.76 km" },
                    { name: "Raghu don courtallam", dist: "1.14 km" },
                    { name: "Arulmigu Thiru Kutralanathar Temple", dist: "1.31 km" },
                    { name: "Thendral Cottage", dist: "1.32 km" },
                    { name: "Courtallam Main Waterfalls", dist: "1.38 km" },
                    { name: "Main falls Arch", dist: "1.39 km" }
                  ].map((place, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-50 border border-slate-100 p-3 rounded-lg text-xs font-medium text-slate-700">
                      <span>• {place.name}</span>
                      <span className="font-bold text-slate-500 shrink-0">{place.dist}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* GUEST REVIEWS SECTION */}
            <div ref={reviewsRef} className="border-t border-slate-100 pt-8 scroll-mt-28 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 font-jakarta">Reviews</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setReviewIdx(prev => Math.max(0, prev - 1))}
                    disabled={reviewIdx === 0}
                    className="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setReviewIdx(prev => Math.min(reviews.length - 1, prev + 1))}
                    disabled={reviewIdx === reviews.length - 1}
                    className="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Review Card */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl relative shadow-sm hover:border-slate-300 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm font-jakarta">
                      {reviews[reviewIdx].initials}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-navy text-sm font-jakarta">{reviews[reviewIdx].name}</h4>
                      <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">{reviews[reviewIdx].time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 pt-1">
                    <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-extrabold">G</div>
                    <div className="flex">
                      {[...Array(reviews[reviewIdx].rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                    </div>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed italic">
                  "{reviews[reviewIdx].review}"
                </p>
              </div>
            </div>

            {/* HOUSE FAQS / POLICIES SECTION */}
            <div ref={faqsRef} className="border-t border-slate-100 pt-8 pb-10 scroll-mt-28 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 font-jakarta">FAQs</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-medium text-slate-600">
                {[
                  "Late Check-out allowed subject to availability",
                  "Early Check-In allowed subject to availability",
                  "Pets are not allowed",
                  "Smoking allowed in designated areas",
                  "Unmarried couples are allowed",
                  "Govt. Id(s) required at arrival",
                  "Local Id(s) allowed",
                  "Foreigners are allowed",
                  "Visitors are allowed in lounge",
                  "Outside food & Beverage allowed"
                ].map((rule, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start">
                    <span className="text-blue-600 shrink-0 font-extrabold">•</span>
                    <span>{rule}</span>
                  </div>
                ))}
              </div>

              {/* Manage Booking Button block */}
              <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm font-jakarta">Have a booking you want to make changes to?</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Lookup your reservation status or request details updates</p>
                </div>
                
                <button
                  onClick={() => navigate("/admin/login")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-lg text-xs transition-all shadow hover:shadow-md cursor-pointer shrink-0"
                >
                  Manage Booking
                </button>
              </div>
            </div>

          </div>
          
          {/* ─── RIGHT COLUMN (Sticky Booking Summary Widget) ─── */}
          <div className="lg:col-span-1 lg:sticky lg:top-20 z-20">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
              
              {/* Header */}
              <div className="bg-slate-50 px-6 py-4.5 border-b border-slate-150">
                <h3 className="font-extrabold text-navy text-sm font-jakarta">Booking Summary</h3>
                <p className="text-xs text-slate-500 mt-0.5">Best online rates guaranteed direct</p>
              </div>

              <div className="p-5 space-y-4">
                {/* Checkin - Checkout dates */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> Checkin - Checkout
                  </label>
                  <div className="relative border border-slate-200 rounded-lg p-2 px-3 hover:border-slate-350 bg-slate-50/50 flex items-center transition-all">
                    <DatePicker
                      selectsRange={true}
                      startDate={checkIn}
                      endDate={checkOut}
                      onChange={(update) => {
                        const [start, end] = update;
                        setCheckIn(start);
                        setCheckOut(end);
                      }}
                      minDate={new Date()}
                      dateFormat="dd MMM yy"
                      className="w-full text-xs font-bold text-slate-800 focus:outline-none bg-transparent cursor-pointer font-jakarta"
                    />
                  </div>
                </div>

                {/* Guests count selection dropdown */}
                <div className="relative">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" /> Guests
                  </label>
                  <button
                    onClick={() => setShowGuestsDropdown(!showGuestsDropdown)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 px-3 bg-slate-50/50 text-left text-xs font-bold text-slate-700 flex items-center justify-between hover:border-slate-350 transition-all cursor-pointer font-jakarta"
                  >
                    <span>{guests} Guest{guests > 1 ? "s" : ""}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showGuestsDropdown ? "rotate-180" : ""}`} />
                  </button>

                  {showGuestsDropdown && (
                    <div className="absolute right-0 left-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden divide-y divide-slate-100">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <button
                          key={num}
                          onClick={() => {
                            setGuests(num);
                            setShowGuestsDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 flex items-center justify-between ${
                            guests === num ? "text-blue-600 bg-blue-50/30" : "text-slate-700"
                          }`}
                        >
                          <span>{num} Guest{num > 1 ? "s" : ""}</span>
                          {guests === num && <Check className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selection details pricing breakdown */}
                {selectedRoom ? (
                  <div className="border-t border-slate-150 pt-4 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-slate-900">{selectedRoom.name}</span>
                      <span className="font-bold text-slate-500">₹{selectedRoom.price}/night</span>
                    </div>

                    <div className="space-y-1.5 border-t border-dashed border-slate-200 pt-3 text-xs font-medium text-slate-600">
                      <div className="flex justify-between">
                        <span>1 Room x {nights} Night{nights > 1 ? "s" : ""} ({guests} Guests)</span>
                        <span className="font-bold text-slate-800">₹{basePrice.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Taxes</span>
                        <span className="font-bold text-slate-800">+₹{taxes.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between text-emerald-600">
                        <span>Promotion Applied</span>
                        <span className="font-bold">-₹{discount.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Final Price */}
                    <div className="border-t border-slate-150 pt-3 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-extrabold text-navy font-jakarta">Final Price</span>
                        <p className="text-[10px] text-slate-400 font-semibold">(Incl. of Taxes)</p>
                      </div>
                      <span className="text-lg font-extrabold text-blue-600 font-jakarta">₹{finalPrice.toLocaleString()}</span>
                    </div>

                    {/* CTA Book Now */}
                    <button
                      onClick={handleProceedToBooking}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer font-jakarta text-sm"
                    >
                      Book Now
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-slate-150 pt-4 space-y-3">
                    <p className="text-xs text-slate-400 font-medium italic text-center py-2">
                      Please select an available room from the list to view total pricing.
                    </p>
                    {/* CTA Select Room */}
                    <button
                      onClick={() => scrollToSection("rooms", roomsRef)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 px-6 rounded-xl transition-all duration-300 shadow flex items-center justify-center gap-2 cursor-pointer font-jakarta text-sm"
                    >
                      Select Room
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
          5. GALLERY SLIDESHOW LIGHTBOX MODAL
         ══════════════════════════════════════════ */}
      <AnimatePresence>
        {showGalleryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex flex-col justify-between p-4"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between text-white py-2">
              <span className="text-xs font-semibold uppercase tracking-wider">{galleryImages[activePhotoIdx].label}</span>
              <button
                onClick={() => setShowGalleryModal(false)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slider Main View */}
            <div className="flex-1 flex items-center justify-between max-w-5xl mx-auto w-full gap-4 relative">
              <button
                onClick={() => setActivePhotoIdx(prev => prev === 0 ? galleryImages.length - 1 : prev - 1)}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="h-[50vh] md:h-[65vh] w-full flex items-center justify-center bg-slate-900/40 rounded-2xl overflow-hidden p-2">
                <img
                  src={galleryImages[activePhotoIdx].src}
                  alt={galleryImages[activePhotoIdx].label}
                  className="max-h-full max-w-full object-contain rounded-xl shadow-2xl"
                />
              </div>

              <button
                onClick={() => setActivePhotoIdx(prev => prev === galleryImages.length - 1 ? 0 : prev + 1)}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Slide Indicators Thumbnails Bar */}
            <div className="max-w-4xl mx-auto w-full py-4 overflow-x-auto no-scrollbar flex justify-center gap-2.5">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`w-14 h-10 md:w-20 md:h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activePhotoIdx === idx ? "border-blue-500 scale-105" : "border-transparent opacity-40 hover:opacity-85"
                  }`}
                >
                  <img src={img.src} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════
          6. PAYMENT TRUST & FOOTER EXTRA SECTION
         ══════════════════════════════════════════ */}
      <section className="bg-slate-50 border-t border-slate-150 py-8 sm:py-10 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="flex justify-center items-center gap-4 sm:gap-6 flex-wrap opacity-60">
            <span className="text-[10px] sm:text-xs font-extrabold tracking-widest text-slate-500">VISA</span>
            <span className="text-[10px] sm:text-xs font-extrabold tracking-widest text-slate-500">MASTERCARD</span>
            <span className="text-[10px] sm:text-xs font-extrabold tracking-widest text-slate-500">RUPAY</span>
            <span className="text-[10px] sm:text-xs font-extrabold tracking-widest text-slate-500">UPI / GPAY</span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-wider">
            Secured Reservation &middot; Direct Hotel Confirmation
          </p>
        </div>
      </section>

    </div>
  );
};

export default Home;
