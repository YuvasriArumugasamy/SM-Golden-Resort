import React from "react";
import { Phone, MapPin, MessageCircle, Clock, Mail } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-cream page-transition">
      {/* Navy Header */}
      <div className="bg-navy py-16 px-4 text-center">
        <span className="text-primary text-xs font-bold uppercase tracking-widest bg-primary/20 px-4 py-1.5 rounded-full">
          Contact
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-5 font-jakarta">Get In Touch</h1>
        <p className="text-white/60 text-sm md:text-base mt-3 max-w-xl mx-auto">
          We're always happy to assist you with bookings, inquiries, or anything else. Reach out anytime.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-14 space-y-10">

        {/* Contact Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Phone 1 */}
          <div className="bg-white rounded-2xl p-7 border border-cream-dark shadow-sm text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-navy/10 text-navy flex items-center justify-center mb-4">
              <Phone className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-navy mb-1 font-jakarta">Call Direct</h3>
            <p className="text-xs text-navy/50 mb-5">Fastest way to book your stay</p>
            <div className="space-y-3 w-full">
              <a href="tel:9443710440"
                className="flex items-center justify-center gap-2 w-full bg-navy hover:bg-navy-light text-white font-bold py-3 px-4 rounded-xl transition-all text-sm">
                <Phone className="w-4 h-4" /> 9443710440
              </a>
              <a href="tel:9003549849"
                className="flex items-center justify-center gap-2 w-full bg-navy hover:bg-navy-light text-white font-bold py-3 px-4 rounded-xl transition-all text-sm">
                <Phone className="w-4 h-4" /> 9003549849
              </a>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="bg-white rounded-2xl p-7 border border-cream-dark shadow-sm text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-4">
              <MessageCircle className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-navy mb-1 font-jakarta">WhatsApp</h3>
            <p className="text-xs text-navy/50 mb-5">Chat with us for quick replies</p>
            <a
              href="https://wa.me/919443710440?text=Hi,%20I%20want%20to%20book%20a%20room%20at%20SM%20Golden%20Resorts"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 px-4 rounded-xl transition-all text-sm"
            >
              💬 Chat on WhatsApp
            </a>
            <p className="text-[10px] text-navy/40 mt-3">Response within a few minutes</p>
          </div>

          {/* Address */}
          <div className="bg-white rounded-2xl p-7 border border-cream-dark shadow-sm text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <MapPin className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-navy mb-1 font-jakarta">Our Address</h3>
            <p className="text-xs text-navy/50 mb-5">We're open all seasons</p>
            <p className="text-sm text-navy/70 leading-relaxed font-medium">
              Old Falls Main Road,<br />
              Old Falls, Courtallam,<br />
              Tamil Nadu — 627812
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-primary font-bold bg-primary/10 px-3 py-1.5 rounded-full">
              <Clock className="w-3.5 h-3.5" /> Open 24 Hours
            </div>
          </div>
        </div>

        {/* Google Maps */}
        <div className="bg-white rounded-2xl overflow-hidden border border-cream-dark shadow-md">
          <div className="px-6 py-4 border-b border-cream-dark flex items-center gap-3">
            <MapPin className="w-5 h-5 text-primary" />
            <div>
              <p className="font-bold text-navy text-sm font-jakarta">SM Golden Resorts — Old Falls, Courtallam</p>
              <p className="text-xs text-navy/50">Near Courtallam Main Falls, Tamil Nadu</p>
            </div>
          </div>
          <div className="h-[420px]">
            <iframe
              title="SM Golden Resorts on Google Maps"
              src="https://maps.google.com/maps?q=Old+Falls+Courtallam+Tamil+Nadu&output=embed"
              width="100%" height="100%"
              style={{ border: 0 }} loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
