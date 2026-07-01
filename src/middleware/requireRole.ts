import { Request, Response, NextFunction } from "express";

export const requireRole = (allowedRoles: ('user' | 'admin')[]) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		if (!req.user || !allowedRoles.includes(req.user.role as 'user' | 'admin')) {
			res.status(403).json({ error: "Forbidden: Insufficient permissions" });
			return;
		}
		next();
	};
};
