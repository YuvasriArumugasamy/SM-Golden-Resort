import React from "react";
import { Link } from "react-router-dom";
import { BedDouble, Check, Star } from "lucide-react";

const RoomCard = ({ room }) => {
  const { roomId, name, type, price, beds, badge, available, amenities } = room;

  const badgeStyles = {
    "AC": "bg-blue-50 text-blue-700 border-blue-200",
    "Non-AC": "bg-stone-100 text-stone-700 border-stone-200",
    "Three Bed": "bg-emerald-50 text-emerald-800 border-emerald-200",
    "Four Bed AC": "bg-amber-50 text-amber-800 border-amber-200",
  };

  const badgeClass = badgeStyles[badge] || badgeStyles[type] || "bg-primary/10 text-primary";

  return (
    <div className={`bg-white rounded-2xl overflow-hidden shadow room-card flex flex-col border border-cream-dark/60 ${!available ? "opacity-80" : ""}`}>
      {/* Top colored strip */}
      <div className={`h-1.5 ${available ? "bg-gradient-to-r from-primary to-gold" : "bg-stone-200"}`} />

      <div className="p-6 flex flex-col flex-grow">
        {/* Badges row */}
        <div className="flex items-center justify-between mb-4">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${badgeClass}`}>
            {badge}
          </span>
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
            available
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-red-50 text-red-600 border-red-200"
          }`}>
            {available ? "✓ Available" : "✕ Sold Out"}
          </span>
        </div>

        {/* Room Name */}
        <h3 className="text-lg font-extrabold text-navy mb-2 font-jakarta leading-tight">{name}</h3>

        {/* Bed info */}
        <div className="flex items-center gap-2 text-navy/60 text-sm mb-4 font-medium">
          <BedDouble className="w-4 h-4 text-primary" />
          <span>{beds}</span>
        </div>

        {/* Amenities chips */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {amenities.map((am, idx) => (
            <span key={idx} className="inline-flex items-center gap-1 text-[11px] bg-cream text-navy/70 border border-cream-dark px-2 py-0.5 rounded-md font-medium">
              <Check className="w-2.5 h-2.5 text-primary" />
              {am}
            </span>
          ))}
        </div>

        {/* Price + Button */}
        <div className="mt-auto border-t border-cream-dark pt-5 flex items-center justify-between gap-3">
          <div>
            <div className="text-2xl font-extrabold text-primary font-jakarta">₹{price.toLocaleString()}</div>
            <div className="text-xs text-navy/50 font-medium">per night + taxes</div>
          </div>

          {available ? (
            <Link
              to={`/booking?room=${roomId}`}
              className="bg-navy hover:bg-navy-light text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-all duration-200 shadow hover:shadow-md whitespace-nowrap"
            >
              Book Now
            </Link>
          ) : (
            <button disabled className="bg-stone-100 text-stone-400 text-xs font-bold px-5 py-2.5 rounded-lg cursor-not-allowed whitespace-nowrap">
              Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
