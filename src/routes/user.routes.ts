import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.get("/me", requireAuth, (req, res) => {
	res.status(200).json({ user: req.user });
});

export default router;
