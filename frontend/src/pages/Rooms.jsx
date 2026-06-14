import React, { useState, useEffect } from "react";
import api from "../api/axios";
import RoomCard from "../components/RoomCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { roomsData as fallbackRooms } from "../utils/roomData";
import { SlidersHorizontal } from "lucide-react";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  const filterTabs = ["All", "AC", "Non-AC", "Suite AC", "Villa"];

  useEffect(() => {
    api.get("/api/rooms")
      .then(res => setRooms(res.data?.length > 0 ? res.data : fallbackRooms))
      .catch(() => setRooms(fallbackRooms))
      .finally(() => setLoading(false));
  }, []);

  const filteredRooms = rooms.filter(room => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Suite AC") return room.type === "Suite AC";
    return room.type === activeFilter;
  });

  return (
    <div className="min-h-screen bg-cream page-transition">
      {/* Page Header */}
      <div className="bg-navy py-16 px-4 text-center">
        <span className="text-primary text-xs font-bold uppercase tracking-widest bg-primary/20 px-4 py-1.5 rounded-full">
          Accommodations
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-5 font-jakarta">
          Rooms & Suites
        </h1>
        <p className="text-white/60 text-sm md:text-base mt-3 max-w-xl mx-auto">
          Choose from 11 thoughtfully designed rooms — from budget-friendly Non-AC to premium Suite ACs with mountain views.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14">
        {/* Filter bar */}
        <div className="flex flex-col items-center gap-4 mb-12">
          <div className="flex items-center gap-2 text-navy/50 text-xs font-bold uppercase tracking-widest">
            <SlidersHorizontal className="w-4 h-4 text-primary" /> Filter by Type
          </div>
          <div className="flex flex-wrap justify-center gap-2 bg-white border border-cream-dark rounded-xl p-1.5 shadow-sm">
            {filterTabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`text-xs font-bold px-5 py-2.5 rounded-lg transition-all duration-200 cursor-pointer ${
                  activeFilter === tab
                    ? "bg-navy text-white shadow"
                    : "text-navy/60 hover:bg-cream"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Room Grid */}
        {loading ? <LoadingSpinner /> : (
          filteredRooms.length === 0 ? (
            <div className="text-center bg-white rounded-2xl py-16 border border-cream-dark shadow-sm">
              <p className="text-navy/50 font-semibold">No rooms match this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRooms.map(room => <RoomCard key={room.roomId} room={room} />)}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Rooms;
