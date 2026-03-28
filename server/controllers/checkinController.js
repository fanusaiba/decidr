const Decision = require('../models/Decision');

// GET /api/checkins/:decisionId
const getCheckins = async (req, res) => {
  try {
    const decision = await Decision.findOne({ _id: req.params.decisionId, userId: req.userId });
    if (!decision) return res.status(404).json({ error: 'Decision not found' });
    res.json(decision.checkins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/checkins/:decisionId
const createCheckin = async (req, res) => {
  try {
    const { productivity, mood, energy, notes } = req.body;

    if (!productivity || !mood || !energy)
      return res.status(400).json({ error: 'productivity, mood, and energy are required' });

    const decision = await Decision.findOne({ _id: req.params.decisionId, userId: req.userId });
    if (!decision) return res.status(404).json({ error: 'Decision not found' });

    const checkin = {
      productivity: parseInt(productivity),
      mood:         parseInt(mood),
      energy:       parseInt(energy),
      notes:        notes || '',
      loggedAt:     new Date(),
    };

    decision.checkins.push(checkin);
    await decision.save();

    // Return the newly added checkin (last one)
    const saved = decision.checkins[decision.checkins.length - 1];
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/checkins/:decisionId/:checkinId
const deleteCheckin = async (req, res) => {
  try {
    const decision = await Decision.findOne({ _id: req.params.decisionId, userId: req.userId });
    if (!decision) return res.status(404).json({ error: 'Decision not found' });

    const checkin = decision.checkins.id(req.params.checkinId);
    if (!checkin) return res.status(404).json({ error: 'Check-in not found' });

    checkin.deleteOne();
    await decision.save();

    res.json({ message: 'Check-in deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getCheckins, createCheckin, deleteCheckin };
