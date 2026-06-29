import React from "react";
import { motion } from "framer-motion";
import { FaFire, FaUtensils, FaTint, FaParking, FaSnowflake } from "react-icons/fa";

const amenities = [
  { name: "Campfire", icon: FaFire },
  { name: "Home‑cooked Food", icon: FaUtensils },
  { name: "24/7 Hot Water", icon: FaTint },
  { name: "Safe Parking", icon: FaParking },
  { name: "Air‑Conditioning", icon: FaSnowflake },
];

const Amenities = () => (
  <section className="w-full max-w-[1280px] mx-auto px-3 py-12">
    <h2 className="text-center text-3xl md:text-4xl font-extrabold text-white mb-8 drop-shadow-2xl">
      Our Premium Amenities
    </h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 justify-items-center">
      {amenities.map((item, idx) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={idx}
            className="flex flex-col items-center p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 hover:border-[#c5a059]/30 transition-all"
            whileHover={{ scale: 1.07, boxShadow: "0 0 20px rgba(197,160,89,0.6)" }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className="text-[#c5a059] text-4xl md:text-5xl mb-2" />
            <span className="text-white text-sm md:text-base font-medium tracking-wider text-center">
              {item.name}
            </span>
          </motion.div>
        );
      })}
    </div>
  </section>
);

export default Amenities;
