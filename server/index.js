import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import decisionRoutes from "./routes/decisions.js";
import checkinRoutes from "./routes/checkins.js";
import analyticsRoutes from "./routes/analytics.js";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 5000;

// CORS
app.use(
  cors({
    origin: 
      "https://decidr-dusky.vercel.app",
      credentials: true,
  })
);

// preflight
app.options("*", cors());

app.use(express.json());

// ✅ FIXED ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/decisions", decisionRoutes);
app.use("/api/checkins", checkinRoutes);
app.use("/api/analytics", analyticsRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API working");
});

// error handler
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

// start server


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB error:", err);
  });