const Decision = require('../models/Decision');

// GET /api/analytics/summary
const getSummary = async (req, res) => {
  try {
    const decisions = await Decision.find({ userId: req.userId });

    const totalDecisions = decisions.length;
    let totalProd = 0, totalMood = 0, totalEnergy = 0, count = 0;
    let bestDecision = null, bestScore = -Infinity;
    const categoryMap = {};

    decisions.forEach((d) => {
      const c = d.checkins;
      if (c.length < 2) return;

      const base   = c[0];
      const latest = c[c.length - 1];

      const dp = latest.productivity - base.productivity;
      const dm = latest.mood         - base.mood;
      const de = latest.energy       - base.energy;
      const total = dp + dm + de;

      totalProd   += dp;
      totalMood   += dm;
      totalEnergy += de;
      count++;

      if (total > bestScore) {
        bestScore    = total;
        bestDecision = { id: d._id, title: d.title, totalDelta: total };
      }

      if (!categoryMap[d.category]) categoryMap[d.category] = { totalDelta: 0, count: 0 };
      categoryMap[d.category].totalDelta += total;
      categoryMap[d.category].count      += 1;
    });

    const safeCount = count || 1;
    const categoryBreakdown = Object.entries(categoryMap).map(([category, data]) => ({
      category,
      avgImpact: parseFloat((data.totalDelta / data.count).toFixed(1)),
      count: data.count,
    }));

    res.json({
      totalDecisions,
      avgProductivityGain: parseFloat((totalProd   / safeCount).toFixed(1)),
      avgMoodGain:         parseFloat((totalMood   / safeCount).toFixed(1)),
      avgEnergyGain:       parseFloat((totalEnergy / safeCount).toFixed(1)),
      bestDecision,
      categoryBreakdown,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/analytics/timeline/:decisionId
const getTimeline = async (req, res) => {
  try {
    const decision = await Decision.findOne({ _id: req.params.decisionId, userId: req.userId });
    if (!decision) return res.status(404).json({ error: 'Decision not found' });

    const checkins = decision.checkins;
    const baseline = checkins[0];

    const timeline = checkins.map((c, i) => {
      const msPerDay = 86400000;
      const day = i === 0 ? 0 : Math.floor((new Date(c.loggedAt) - new Date(baseline.loggedAt)) / msPerDay);
      return {
        day,
        productivity:      c.productivity,
        mood:              c.mood,
        energy:            c.energy,
        productivityDelta: c.productivity - baseline.productivity,
        moodDelta:         c.mood         - baseline.mood,
        energyDelta:       c.energy       - baseline.energy,
        loggedAt:          c.loggedAt,
      };
    });

    res.json({ decision, timeline });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getSummary, getTimeline };
