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
    const adminUsername = process.env.ADMIN_USERNAME?.toLowerCase().trim();
    const adminEmail    = process.env.ADMIN_EMAIL?.toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error("❌ ADMIN_PASSWORD not set in .env");
      return;
    }

    // Always delete and re-create to ensure credentials are up to date
    await Admin.deleteMany({});
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await Admin.create({
      username: adminUsername || null,
      email:    adminEmail    || null,
      password: hashedPassword,
    });
    console.log(`✅ Admin seeded — username: ${adminUsername || "N/A"}, email: ${adminEmail || "N/A"}`);
  } catch (error) {
    console.error("Admin seeding error:", error);
  }
};

// ─── Start Server ─────────────────────────────────────────────
const startServer = async () => {
  // Listen FIRST so Render detects the port
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
  });

  try {
    await connectDB();
    await seedAdmin();
    await seedRooms();
    console.log("✅ DB connected and seeded");
  } catch (error) {
    console.error("DB startup error:", error.message);
  }
};

startServer();
