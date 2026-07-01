import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { requireRole } from "../middleware/requireRole";
import User from "../models/user.model";

const router = Router();

router.get("/users", requireAuth, requireRole(['admin']), async (req, res) => {
	try {
		const users = await User.find().sort({ createdAt: -1 });
		res.status(200).json({ users });
	} catch (error) {
		console.error("Admin users fetch error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

export default router;
