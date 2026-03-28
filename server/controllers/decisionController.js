const Decision = require('../models/Decision');

// GET /api/decisions
const getDecisions = async (req, res) => {
  try {
    const decisions = await Decision
      .find({ userId: req.userId })
      .sort({ createdAt: -1 });
    res.json(decisions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/decisions/:id
const getDecision = async (req, res) => {
  try {
    const decision = await Decision.findOne({ _id: req.params.id, userId: req.userId });
    if (!decision) return res.status(404).json({ error: 'Decision not found' });
    res.json(decision);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/decisions
const createDecision = async (req, res) => {
  try {
    const {
      title, description, category, startedAt,
      baselineProductivity, baselineMood, baselineEnergy,
    } = req.body;

    if (!title || !category || !startedAt)
      return res.status(400).json({ error: 'title, category, and startedAt are required' });

    const baseline = {
      productivity: parseInt(baselineProductivity) || 5,
      mood:         parseInt(baselineMood)          || 5,
      energy:       parseInt(baselineEnergy)        || 5,
      notes:        'Baseline measurement',
      loggedAt:     new Date(startedAt),
    };

    const decision = await Decision.create({
      userId:      req.userId,
      title,
      description: description || '',
      category,
      startedAt:   new Date(startedAt),
      checkins:    [baseline],
    });

    res.status(201).json(decision);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/decisions/:id
const updateDecision = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const decision = await Decision.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title, description, category },
      { new: true }
    );
    if (!decision) return res.status(404).json({ error: 'Decision not found' });
    res.json(decision);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/decisions/:id
const deleteDecision = async (req, res) => {
  try {
    const decision = await Decision.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!decision) return res.status(404).json({ error: 'Decision not found' });
    res.json({ message: 'Decision deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getDecisions, getDecision, createDecision, updateDecision, deleteDecision };
