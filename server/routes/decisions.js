import express from "express";
const router = express.Router();

import {
  getDecisions,
  getDecision,
  createDecision,
  updateDecision,
  deleteDecision,
} from "../controllers/decisionController.js";

import { protect } from "../middleware/auth.js";

router.use(protect);

router.get("/", getDecisions);
router.post("/", createDecision);
router.get("/:id", getDecision);
router.put("/:id", updateDecision);
router.delete("/:id", deleteDecision);

export default router;
