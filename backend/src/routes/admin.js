import express from "express";
import { User } from "../models/User.js";
import { UserActivity } from "../models/UserActivity.js";
import { adminOnly } from "../middleware/auth.js";

const router = express.Router();



// GET /api/admin/users
router.get("/users", adminOnly, async (_req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/users/:id/activity
router.get("/users/:id/activity", adminOnly, async (req, res) => {
  try {
    const activities = await UserActivity.find({ userId: req.params.id })
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/users/:id
router.delete("/users/:id", adminOnly, async (req, res) => {
  try {
    if (req.user.id === req.params.id)
      return res.status(400).json({ error: "Cannot delete your own account" });

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await UserActivity.deleteMany({ userId: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
