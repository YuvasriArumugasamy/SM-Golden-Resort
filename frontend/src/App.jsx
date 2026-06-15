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
import Rooms from "./pages/Rooms";
import Contact from "./pages/Contact";
import Booking from "./pages/Booking";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminRooms from "./pages/admin/AdminRooms";
import AdminGuests from "./pages/admin/AdminGuests";
import AdminSettings from "./pages/admin/AdminSettings";

// PageWrapper for fade animations
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
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isHomePage = location.pathname === "/";

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      {!isAdminRoute && !isHomePage && <Navbar />}
      <div className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/rooms" element={<PageWrapper><Rooms /></PageWrapper>} />
            <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
            <Route path="/booking" element={<PageWrapper><Booking /></PageWrapper>} />

            {/* Admin Auth */}
            <Route path="/admin/login" element={<PageWrapper><AdminLogin /></PageWrapper>} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

            {/* Admin Protected Routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/bookings" element={<ProtectedRoute><AdminBookings /></ProtectedRoute>} />
            <Route path="/admin/rooms" element={<ProtectedRoute><AdminRooms /></ProtectedRoute>} />
            <Route path="/admin/guests" element={<ProtectedRoute><AdminGuests /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <WhatsAppButton />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
