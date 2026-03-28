const express = require('express');
const router  = express.Router();
const { getCheckins, createCheckin, deleteCheckin } = require('../controllers/checkinController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/:decisionId',                    getCheckins);
router.post('/:decisionId',                   createCheckin);
router.delete('/:decisionId/:checkinId',      deleteCheckin);

module.exports = router;
