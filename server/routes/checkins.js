import express from "express";
const router = express.Router();

import { getCheckins, createCheckin, deleteCheckin } from "../controllers/checkinController.js";
import { protect } from "../middleware/auth.js";

router.use(protect);

router.get("/:decisionId", getCheckins);
router.post("/:decisionId", createCheckin);
router.delete("/:decisionId/:checkinId", deleteCheckin);

export default router;