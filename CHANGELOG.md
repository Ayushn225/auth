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

## [2026-06-26] - User Login Flow
- Added `comparePassword` to `src/lib/hash.ts`.
- Created `src/lib/token.ts` providing `createAccessToken` (30m expiry) and `createRefreshToken` (7d expiry).
- Added Zod `loginSchema` to `src/models/auth.schema.ts`.
- Implemented `loginHandler` in `src/controller/auth.controller.ts` to manage authentication and HTTP-only cookies.
- Linked `POST /login` in `src/routes/auth.routes.ts`.

## [2026-06-29] - Token Refresh & Logout Flow
- Added `verifyRefreshToken` to `src/lib/token.ts`.
- Built `refreshHandler` in `src/controller/auth.controller.ts` to validate the token payload (`userId` and `tokenVersion`), issue a new `accessToken`, and refresh the HTTP-only cookie.
- Built `logoutHandler` in `src/controller/auth.controller.ts` to clear the `refreshToken` cookie.
- Linked `POST /refresh` and `POST /logout` routes in `src/routes/auth.routes.ts`.

## [2026-06-30] - Forgot & Reset Password Flow
- Added `forgotPasswordHandler` in `src/controller/auth.controller.ts` using Node.js `crypto` to generate secure, hashed, and expiring reset tokens, dispatching emails via `sendMail`.
- Built `resetPasswordHandler` in `src/controller/auth.controller.ts` to hash the new password, clear reset tokens, and strictly invalidate active sessions by incrementing `tokenVersion`.
- Linked `POST /forgot-password` and `POST /reset-password` endpoints in `src/routes/auth.routes.ts`.

## [2026-07-01] - Protected Routes & Auth Middleware
- Refactored `token.ts` to standard JWT protocol utilizing `sub` instead of `userId`.
- Updated authentication controllers to properly utilize `sub`.
- Created `requireAuth` middleware in `src/middleware/requireAuth.ts` which robustly verifies access tokens, retrieves fresh `role` data from the DB, and extends the Express Request interface with `req.user`.
- Mounted `userRouter` in `src/routes/user.routes.ts` providing the protected `GET /me` endpoint.
- Included the new routes in the central Express configuration in `src/app.ts`.
