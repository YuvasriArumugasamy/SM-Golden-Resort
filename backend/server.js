require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const { seedRooms } = require("./controllers/roomController");
const Admin = require("./models/Admin");

const adminRoutes = require("./routes/adminRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const roomRoutes = require("./routes/roomRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      const allowed = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        // Vercel deployments
        /\.vercel\.app$/,
        /\.netlify\.app$/,
      ];
      const isAllowed = allowed.some(o =>
        typeof o === "string" ? o === origin : o.test(origin)
      );
      if (isAllowed) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ──────────────────────────────────────────────────
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/rooms", roomRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "SM Golden Resorts API is running 🏨", status: "ok" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// ─── Seed Default Admin ───────────────────────────────────────
const seedAdmin = async () => {
  try {
    const identifier = process.env.ADMIN_USERNAME || process.env.ADMIN_EMAIL;
    const isUsername = !!process.env.ADMIN_USERNAME;

    // Always delete and re-create to ensure password is up to date
    await Admin.deleteMany({});
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await Admin.create({
      ...(isUsername ? { username: identifier?.toLowerCase() } : { email: identifier?.toLowerCase() }),
      password: hashedPassword,
    });
    console.log(`✅ Admin seeded: ${identifier}`);
  } catch (error) {
    console.error("Admin seeding error:", error);
  }
};

// ─── Start Server ─────────────────────────────────────────────
const startServer = async () => {
  try {
    await connectDB();
    await seedAdmin();
    await seedRooms();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
};

startServer();
