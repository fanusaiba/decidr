import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 5000;

// CORS
app.use(
  cors({
    origin: "https://decidr-dusky.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// preflight
app.options("*", cors());

app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);

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

// ✅ ONLY ONE SERVER START
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Decidr server running on port ${PORT}`);
});