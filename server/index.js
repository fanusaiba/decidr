import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js"; // adjust path

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS FIX
app.use(
  cors({
    origin: "https://decidr-dusky.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ handle preflight
app.options("*", cors());

app.use(express.json());

// ✅ ROUTES (IMPORTANT)
app.use("/auth", authRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API working");
});

app.listen(5000, () => {
  console.log("Server running");
});

// ── Error handler ─────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// ── Start server ──────────────────────────────────────────
app.listen(PORT,'0.0.0.0', () => {
  console.log(`🚀 Decidr server running on port ${PORT}`);
});