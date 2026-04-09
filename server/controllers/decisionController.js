import Decision from "../models/Decision.js";

// GET all decisions
export const getDecisions = async (req, res) => {
  try {
    const decisions = await Decision.find({ userId: req.userId });
    res.json(decisions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET one decision
export const getDecision = async (req, res) => {
  try {
    const decision = await Decision.findById(req.params.id);
    res.json(decision);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE decision
export const createDecision = async (req, res) => {
  try {
    const decision = await Decision.create({
      ...req.body,
      userId: req.userId,
    });
    res.status(201).json(decision);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE decision
export const updateDecision = async (req, res) => {
  try {
    const decision = await Decision.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(decision);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE decision
export const deleteDecision = async (req, res) => {
  try {
    await Decision.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};