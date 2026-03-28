const express = require('express');
const router = express.Router();
const { getDecisions, getDecision, createDecision, updateDecision, deleteDecision } = require('../controllers/decisionController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getDecisions);
router.post('/', createDecision);
router.get('/:id', getDecision);
router.put('/:id', updateDecision);
router.delete('/:id', deleteDecision);

module.exports = router;
