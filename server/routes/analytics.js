const express = require('express');
const router = express.Router();
const { getSummary, getTimeline } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/summary', getSummary);
router.get('/timeline/:decisionId', getTimeline);

module.exports = router;
