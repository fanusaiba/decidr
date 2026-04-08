const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes     = require('./routes/auth');
const decisionRoutes = require('./routes/decisions');
const checkinRoutes  = require('./routes/checkins');
const analyticsRoutes = require('./routes/analytics');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── CORS FIX (IMPORTANT) ───────────────────────────────────

// Allow both http and https (because your error shows mismatch)
const allowedOrigins = [
  'https://decidr-dusky.vercel.app',
  'http://decidr-dusky.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS not allowed'), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// ✅ Handle preflight requests (VERY IMPORTANT)
app.options('*', cors());

// ── Middleware ────────────────────────────────────────────
app.use(express.json());

// ── MongoDB connection ────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI || 'mongodb+srv://fanusaiba17_db_user:ZyrahIqraah1219@decidr.cxeafpk.mongodb.net/?appName=DECIDR')
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

// ── Routes ────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/decisions', decisionRoutes);
app.use('/api/checkins',  checkinRoutes);
app.use('/api/analytics', analyticsRoutes);

// ── Health check ──────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// ── Error handler ─────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// ── Start server ──────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Decidr server running on port ${PORT}`);
});