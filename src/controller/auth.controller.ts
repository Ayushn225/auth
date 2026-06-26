import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { registrationSchema } from "../models/auth.schema";
import { hashPassword } from "../lib/hash";
import { sendMail } from "../lib/email";
import { getAppUrl } from "../lib/url";

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
