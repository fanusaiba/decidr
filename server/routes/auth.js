import express from "express";
const router = express.Router();

router.post("/login", (req, res) => {
  res.json({ message: "Login working" });
});

router.post("/register", (req, res) => {
  res.json({ message: "Register working" });
});

export default router;