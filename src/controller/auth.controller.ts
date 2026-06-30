import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user.model";
import { registrationSchema, loginSchema } from "../models/auth.schema";
import { hashPassword, comparePassword } from "../lib/hash";
import { sendMail } from "../lib/email";
import { getAppUrl } from "../lib/url";
import {
	createAccessToken,
	createRefreshToken,
	verifyRefreshToken,
} from "../lib/token";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export const registrationHandler = async (
	req: Request,
	res: Response,
): Promise<void> => {
	console.log("geeting registration handler");
	try {
		const parsed = registrationSchema.safeParse(req.body);
		if (!parsed.success) {
			res.status(400).json({ errors: parsed.error });
			return;
		}

		const { name, password } = parsed.data;
		const email = parsed.data.email.toLowerCase();

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			res.status(400).json({ error: "User with this email already exists" });
			return;
		}

		const passwordHash = await hashPassword(password);

		// Generate verification token with expiration of 1d
		const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1d" });

		const newUser = new User({
			name,
			email,
			passwordHash,
		});
		await newUser.save();

		const confirmationLink = `${getAppUrl()}/api/auth/verify-email?token=${token}`;
		await sendMail(
			email,
			"Please verify your email address",
			`<p>Click <a href="${confirmationLink}">here</a> to verify your email.</p>`,
		);

		res.status(201).json({
			_id: newUser._id,
			email: newUser.email,
			role: newUser.role,
			isEmailVerified: newUser.isEmailVerified,
		});
	} catch (error) {
		console.error("Registration error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const emailHandler = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const token = req.query.token as string;
		if (!token) {
			res.status(400).json({ error: "Verification token is missing" });
			return;
		}

		let payload: any;
		try {
			payload = jwt.verify(token, JWT_SECRET);
		} catch (err) {
			res.status(401).json({ error: "Invalid or expired verification token" });
			return;
		}

		const email = payload.email;
		const user = await User.findOne({ email });
		if (!user) {
			res.status(404).json({ error: "User not found" });
			return;
		}

		if (user.isEmailVerified) {
			res
				.status(200)
				.json({ message: "Email is already verified. You can log in." });
			return;
		}

		user.isEmailVerified = true;
		await user.save();

		res.status(200).json({ message: "Email verified successfully" });
	} catch (error) {
		console.error("Email verification error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const loginHandler = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const parsed = loginSchema.safeParse(req.body);
		if (!parsed.success) {
			res.status(400).json({ errors: parsed.error.flatten() });
			return;
		}

		const { email, password } = parsed.data;

		const user = await User.findOne({ email: email.toLowerCase() });
		if (!user) {
			res.status(401).json({ error: "Invalid credentials" });
			return;
		}

		const isPasswordValid = await comparePassword(password, user.passwordHash);
		if (!isPasswordValid) {
			res.status(401).json({ error: "Invalid credentials" });
			return;
		}

		if (!user.isEmailVerified) {
			res.status(403).json({ error: "Please verify your email" });
			return;
		}

		// Ensure tokenVersion is defined
		const tokenVersion = user.tokenVersion || 0;

		const accessToken = createAccessToken({
			userId: user._id.toString(),
			role: user.role,
			tokenVersion,
		});

		const refreshToken = createRefreshToken({
			userId: user._id.toString(),
			tokenVersion,
		});

		const isProd = process.env.NODE_ENV === "production";
		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: isProd,
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		res.status(200).json({
			message: "Login successful",
			accessToken,
			user: {
				_id: user._id,
				isEmailVerified: user.isEmailVerified,
				twoFactorEnabled: user.twoFactorEnabled,
			},
		});
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const refreshHandler = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const token = req.cookies?.refreshToken as string | undefined;
		if (!token) {
			res.status(401).json({ error: "Refresh token missing" });
			return;
		}

		let payload: any;
		try {
			payload = verifyRefreshToken(token);
		} catch (err) {
			res.status(401).json({ error: "Invalid refresh token" });
			return;
		}

		const userId = payload.userId;
		const user = await User.findById(userId);
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

		const accessToken = createAccessToken({
			userId: user._id.toString(),
			role: user.role,
			tokenVersion: currentVersion,
		});

		const newRefreshToken = createRefreshToken({
			userId: user._id.toString(),
			tokenVersion: currentVersion,
		});

		const isProd = process.env.NODE_ENV === "production";
		res.cookie("refreshToken", newRefreshToken, {
			httpOnly: true,
			secure: isProd,
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		res.status(200).json({ accessToken });
	} catch (error) {
		console.error("Refresh token error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const logoutHandler = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		res.clearCookie("refreshToken", { path: "/" });
		res.status(200).json({ message: "Logout successful" });
	} catch (error) {
		console.error("Logout error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const forgotPasswordHandler = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { email } = req.body;
		if (!email || typeof email !== "string") {
			res.status(400).json({ error: "Invalid email" });
			return;
		}
		const normalizedEmail = email.trim().toLowerCase();

		const user = await User.findOne({ email: normalizedEmail });
		if (!user) {
			// Generic success message to prevent email enumeration
			res
				.status(200)
				.json({
					message:
						"If that email address is in our database, we will send you an email to reset your password.",
				});
			return;
		}

		const rawToken = crypto.randomBytes(32).toString("hex");
		const tokenHash = crypto
			.createHash("sha256")
			.update(rawToken)
			.digest("hex");

		user.resetPasswordToken = tokenHash;
		// 15 mins from now
		user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
		await user.save();

		const resetUrl = `${getAppUrl()}/reset-password?token=${rawToken}`;

		await sendMail(
			user.email,
			"Password Reset Request",
			`<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 15 minutes.</p>`,
		);

		res
			.status(200)
			.json({
				message:
					"If that email address is in our database, we will send you an email to reset your password.",
				rawToken: rawToken,
			});
	} catch (error) {
		console.error("Forgot password error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const resetPasswordHandler = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { token: rawToken, newPassword } = req.body;

		if (
			!rawToken ||
			!newPassword ||
			typeof newPassword !== "string" ||
			newPassword.length < 6
		) {
			res
				.status(400)
				.json({
					error: "Invalid token or password must be at least 6 characters",
				});
			return;
		}

		const tokenHash = crypto
			.createHash("sha256")
			.update(rawToken)
			.digest("hex");

		const user = await User.findOne({
			resetPasswordToken: tokenHash,
			resetPasswordExpires: { $gt: new Date() },
		});

		if (!user) {
			res.status(400).json({ error: "Invalid or expired token" });
			return;
		}

		const newPasswordHash = await hashPassword(newPassword);

		user.passwordHash = newPasswordHash;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;
		// Increment tokenVersion to invalidate existing active sessions
		user.tokenVersion = (user.tokenVersion || 0) + 1;

		await user.save();

		res
			.status(200)
			.json({
				message:
					"Password reset successfully. You can now login with your new password.",
			});
	} catch (error) {
		console.error("Reset password error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};
