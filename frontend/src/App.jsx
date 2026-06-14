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

// Pages
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import Contact from "./pages/Contact";
import Booking from "./pages/Booking";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminBookings from "./pages/admin/AdminBookings";

// PageWrapper for slide/fade animations
const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

// Layout wrapper that conditionally shows Footer & WhatsApp on non-admin routes
const AppLayout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <div className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageWrapper>
                  <Home />
                </PageWrapper>
              }
            />
            <Route
              path="/rooms"
              element={
                <PageWrapper>
                  <Rooms />
                </PageWrapper>
              }
            />
            <Route
              path="/contact"
              element={
                <PageWrapper>
                  <Contact />
                </PageWrapper>
              }
            />
            <Route
              path="/booking"
              element={
                <PageWrapper>
                  <Booking />
                </PageWrapper>
              }
            />
            <Route
              path="/admin/login"
              element={
                <PageWrapper>
                  <AdminLogin />
                </PageWrapper>
              }
            />
            <Route
              path="/admin"
              element={<Navigate to="/admin/bookings" replace />}
            />
            <Route
              path="/admin/dashboard"
              element={<Navigate to="/admin/bookings" replace />}
            />
            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <AdminBookings />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
            {/* Redirect any other path to Home */}
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
