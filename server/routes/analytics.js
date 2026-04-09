import express from "express";
const router = express.Router();

import { getSummary, getTimeline } from "../controllers/analyticsController.js";
import { protect } from "../middleware/auth.js";

router.use(protect);

router.get("/summary", getSummary);
router.get("/timeline/:decisionId", getTimeline);

export default router;