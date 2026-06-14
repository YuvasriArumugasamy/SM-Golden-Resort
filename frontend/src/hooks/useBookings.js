import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

export const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, cancelled: 0 });

  const fetchBookings = useCallback(async (status = "all", search = "") => {
    setLoading(true);
    try {
      const response = await api.get("/api/bookings", {
        params: { status, search },
      });
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error(error.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get("/api/admin/stats");
      setStats({
        total: response.data.total,
        pending: response.data.pending,
        confirmed: response.data.confirmed,
        cancelled: response.data.cancelled,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await api.patch(`/api/bookings/${id}/status`, { status: newStatus });
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
      );
      toast.success(response.data.message || "Status updated successfully");
      fetchStats(); // Update stats summary
      return true;
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
      return false;
    }
  };

  const deleteBooking = async (id) => {
    try {
      const response = await api.delete(`/api/bookings/${id}`);
      setBookings((prev) => prev.filter((b) => b._id !== id));
      toast.success(response.data.message || "Booking deleted successfully");
      fetchStats();
      return true;
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error(error.response?.data?.message || "Failed to delete booking");
      return false;
    }
  };

  return {
    bookings,
    stats,
    loading,
    fetchBookings,
    fetchStats,
    updateStatus,
    deleteBooking,
  };
};
