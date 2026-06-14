import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api/axios";
import toast from "react-hot-toast";
import { User, Phone, Mail, Users, Calendar, ArrowRight } from "lucide-react";

const BookingForm = ({ preselectedRoomId }) => {
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [formData, setFormData] = useState({ guestName: "", phone: "", email: "", roomId: "", guests: 1 });
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(() => { const d = new Date(); d.setDate(d.getDate() + 1); return d; });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    setLoadingRooms(true);
    api.get("/api/rooms")
      .then(res => {
        setRooms(res.data);
        const defaultRoom = preselectedRoomId
          ? preselectedRoomId
          : (res.data.find(r => r.available) || res.data[0])?.roomId || "";
        setFormData(prev => ({ ...prev, roomId: defaultRoom }));
      })
      .catch(console.error)
      .finally(() => setLoadingRooms(false));
  }, [preselectedRoomId]);

  useEffect(() => {
    if (preselectedRoomId) setFormData(prev => ({ ...prev, roomId: preselectedRoomId }));
  }, [preselectedRoomId]);

  const selectedRoom = rooms.find(r => r.roomId === formData.roomId);
  const nights = checkOut && checkIn && checkOut > checkIn
    ? Math.ceil((checkOut - checkIn) / 86400000) : 0;
  const totalPrice = selectedRoom ? nights * selectedRoom.price : 0;

  const handleChange = e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.guestName.trim()) return toast.error("Please enter guest name");
    if (!formData.phone.trim()) return toast.error("Please enter phone number");
    if (!formData.roomId) return toast.error("Please select a room");
    if (nights <= 0) return toast.error("Check-out must be after check-in");
    if (selectedRoom && !selectedRoom.available) return toast.error("This room is unavailable. Please choose another.");

    setBookingLoading(true);
    try {
      const res = await api.post("/api/bookings", {
        guestName: formData.guestName, phone: formData.phone, email: formData.email,
        roomId: formData.roomId, checkIn: checkIn.toISOString(), checkOut: checkOut.toISOString(),
        guests: Number(formData.guests),
      });
      toast.success(res.data.message || "Booking request sent!");
      setFormData(prev => ({ ...prev, guestName: "", phone: "", email: "", guests: 1 }));
      const d = new Date(); d.setDate(d.getDate() + 1);
      setCheckIn(new Date()); setCheckOut(d);
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed. Please try again.");
    } finally { setBookingLoading(false); }
  };

  const inputClass = "w-full px-4 py-2.5 border border-cream-dark rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none bg-cream/40 font-jakarta text-navy placeholder-navy/30 transition-all";
  const labelClass = "block text-xs font-bold text-navy/60 uppercase tracking-wider mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Guest Name */}
        <div>
          <label className={labelClass}>
            <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-primary" /> Guest Name *</span>
          </label>
          <input type="text" name="guestName" value={formData.guestName}
            onChange={handleChange} placeholder="Enter full name" required className={inputClass} />
        </div>

        {/* Phone */}
        <div>
          <label className={labelClass}>
            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-primary" /> Phone Number *</span>
          </label>
          <input type="tel" name="phone" value={formData.phone}
            onChange={handleChange} placeholder="10-digit mobile number" required className={inputClass} />
        </div>

        {/* Email */}
        <div>
          <label className={labelClass}>
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-primary" /> Email (optional)</span>
          </label>
          <input type="email" name="email" value={formData.email}
            onChange={handleChange} placeholder="name@example.com" className={inputClass} />
        </div>

        {/* Room */}
        <div>
          <label className={labelClass}>
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary" /> Select Room *</span>
          </label>
          <select name="roomId" value={formData.roomId} onChange={handleChange} required
            className={inputClass + " bg-cream/40"}>
            {loadingRooms && <option>Loading rooms...</option>}
            {rooms.map(r => (
              <option key={r.roomId} value={r.roomId} disabled={!r.available}>
                {r.name} ({r.type}) — ₹{r.price}/night {!r.available ? "[Sold Out]" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Check-in */}
        <div>
          <label className={labelClass}>
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary" /> Check-In *</span>
          </label>
          <DatePicker selected={checkIn}
            onChange={date => { setCheckIn(date); if (date >= checkOut) { const d = new Date(date); d.setDate(d.getDate()+1); setCheckOut(d); } }}
            minDate={new Date()} dateFormat="dd MMM yyyy" />
        </div>

        {/* Check-out */}
        <div>
          <label className={labelClass}>
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary" /> Check-Out *</span>
          </label>
          <DatePicker selected={checkOut} onChange={date => setCheckOut(date)}
            minDate={new Date(checkIn.getTime() + 86400000)} dateFormat="dd MMM yyyy" />
        </div>

        {/* Guests */}
        <div className="md:col-span-2">
          <label className={labelClass}>
            <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-primary" /> Number of Guests</span>
          </label>
          <select name="guests" value={formData.guests} onChange={handleChange} className={inputClass + " bg-cream/40"}>
            {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Guest{n>1?"s":""}</option>)}
          </select>
        </div>
      </div>

      {/* Price Preview */}
      {selectedRoom && nights > 0 && (
        <div className="bg-cream border border-cream-dark rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-sm text-navy/70 font-medium">
            <span className="font-bold text-navy">{nights} night{nights>1?"s":""}</span> ×{" "}
            <span className="font-bold text-navy">₹{selectedRoom.price.toLocaleString()}</span> for {selectedRoom.name}
          </p>
          <p className="text-xl font-extrabold text-primary font-jakarta">
            Total: ₹{totalPrice.toLocaleString()}
          </p>
        </div>
      )}

      {/* Submit */}
      <button type="submit"
        disabled={bookingLoading || (selectedRoom && !selectedRoom.available)}
        className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold py-4 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:bg-navy/20 disabled:cursor-not-allowed font-jakarta text-sm"
      >
        {bookingLoading ? "Sending Request..." : "Confirm Booking"} <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
};

export default BookingForm;
