import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../lib/token";
import User from "../models/user.model";

// Extend the Express Request interface
declare global {
	namespace Express {
		interface Request {
			user?: {
				userId: string;
				userEmail: string;
				userName: string;
				role: string;
				userEmailVerified: boolean;
			};
		}
	}
}

export const requireAuth = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			res.status(401).json({ error: "Missing or invalid authorization header" });
			return;
		}

		const token = authHeader.split(" ")[1];
		let payload: any;
		
		try {
			payload = verifyAccessToken(token);
		} catch (error) {
			res.status(401).json({ error: "Invalid or expired access token" });
			return;
		}

		const user = await User.findById(payload.sub);
		if (!user) {
			res.status(401).json({ error: "User no longer exists" });
			return;
		}

		// Ensure tokenVersion is compared securely
		const currentVersion = user.tokenVersion || 0;
		if (currentVersion !== payload.tokenVersion) {
			res.status(403).json({ error: "Token revoked. Please login again." });
			return;
		}

		req.user = {
			userId: user._id.toString(),
			userEmail: user.email,
			userName: user.name,
			role: user.role, // Extracted from database as requested
			userEmailVerified: user.isEmailVerified,
		};

		next();
	} catch (error) {
		console.error("Auth middleware error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};
