const mongoose = require('mongoose');

const checkinSchema = new mongoose.Schema(
  {
    productivity: { type: Number, required: true, min: 1, max: 10 },
    mood:         { type: Number, required: true, min: 1, max: 10 },
    energy:       { type: Number, required: true, min: 1, max: 10 },
    notes:        { type: String, default: '' },
    loggedAt:     { type: Date, default: Date.now },
  },
  { _id: true }
);

const decisionSchema = new mongoose.Schema(
  {
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title:       { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category:    { type: String, required: true },
    startedAt:   { type: Date, required: true },
    checkins:    [checkinSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Decision', decisionSchema);
