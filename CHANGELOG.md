# Changelog

## [2026-06-25] - Project Initialization
- Created directory structure in `src/`: `controller`, `models`, `routes`, `lib`, and `middleware`.
- Set up `AGENTS.md` project-scoped rule to always await approval before executing changes.
- Added a new rule to `AGENTS.md` to maintain this `CHANGELOG.md` file after every successful change.

## [2026-06-25] - User Model Setup
- Created the Mongoose schema and model for `User` in `src/models/user.model.ts`.
- Configured fields including `email`, `passwordHash`, `role`, `twoFactorEnabled`, `twoFactorString`, `tokenVersion`, `resetPasswordToken`, and `resetPasswordExpires`.
- Set `timestamps: true` for the schema.

## [2026-06-26] - User Registration & Email Verification
- Implemented `hashPassword` helper in `src/lib/hash.ts` using bcrypt.
- Configured `sendMail` transporter in `src/lib/email.ts` using nodemailer with SMTP environment variables.
- Added `getAppUrl` helper in `src/lib/url.ts`.
- Created Zod validation schema `registrationSchema` in `src/models/auth.schema.ts`.
- Built `registrationHandler` and `emailHandler` in `src/controller/auth.controller.ts` with 1-day expiring JWT tokens.
- Defined the endpoints `POST /registration` and `GET /verify-email` in `src/routes/auth.routes.ts`.
