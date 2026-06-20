import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

// Context
import { AuthProvider } from "./context/AuthContext";

// Components
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminRooms from "./pages/admin/AdminRooms";
import AdminGuests from "./pages/admin/AdminGuests";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminReports from "./pages/admin/AdminReports";
import AdminPayments from "./pages/admin/AdminPayments";

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.25, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

const AppLayout = () => {
  const location = useLocation();
  const isAdminRoute  = location.pathname.startsWith("/admin");
  const isHomePage    = location.pathname === "/";
  const isBookingPage = location.pathname === "/booking";

  // Hide navbar & footer on admin routes AND booking page
  const hideChrome = isAdminRoute || isBookingPage;

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

      {/* Navbar — only on Home (not on booking, not on admin) */}
      {!hideChrome && !isHomePage && <Navbar />}

      <div className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public */}
            <Route path="/"        element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/booking" element={<PageWrapper><Booking /></PageWrapper>} />

            {/* Redirect old pages to home */}
            <Route path="/rooms"   element={<Navigate to="/" replace />} />
            <Route path="/contact" element={<Navigate to="/" replace />} />

            {/* Admin */}
            <Route path="/admin/login"      element={<PageWrapper><AdminLogin /></PageWrapper>} />
            <Route path="/admin"            element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard"  element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/bookings"   element={<ProtectedRoute><AdminBookings /></ProtectedRoute>} />
            <Route path="/admin/rooms"      element={<ProtectedRoute><AdminRooms /></ProtectedRoute>} />
            <Route path="/admin/guests"         element={<ProtectedRoute><AdminGuests /></ProtectedRoute>} />
            <Route path="/admin/settings"       element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
            <Route path="/admin/notifications"  element={<ProtectedRoute><AdminNotifications /></ProtectedRoute>} />
            <Route path="/admin/reports"        element={<ProtectedRoute><AdminReports /></ProtectedRoute>} />
            <Route path="/admin/payments"       element={<ProtectedRoute><AdminPayments /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>

      {/* Footer & WhatsApp — only on Home */}
      {!hideChrome && <Footer />}
      {!hideChrome && <WhatsAppButton />}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}
