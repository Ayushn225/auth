# Changelog

## [2026-06-25] - Project Initialization
- Created directory structure in `src/`: `controller`, `models`, `routes`, `lib`, and `middleware`.
- Set up `AGENTS.md` project-scoped rule to always await approval before executing changes.
- Added a new rule to `AGENTS.md` to maintain this `CHANGELOG.md` file after every successful change.

## [2026-06-25] - User Model Setup
- Created the Mongoose schema and model for `User` in `src/models/user.model.ts`.
- Configured fields including `email`, `passwordHash`, `role`, `twoFactorEnabled`, `twoFactorString`, `tokenVersion`, `resetPasswordToken`, and `resetPasswordExpires`.
- Set `timestamps: true` for the schema.
