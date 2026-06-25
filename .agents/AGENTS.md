# Project Rules & Context (agents.md)

## 1. Core Agent Rules (CRITICAL)

1. **Always Read Prompts & Wait for Approval:** Always thoroughly read the user's prompts. Before making any changes or implementing features, provide a clear implementation plan. You must wait for the user to explicitly say "yes that is i want" (or give explicit approval) before proceeding to execute the plan.
2. **Do NOT Auto-Complete the Project:** This is a practice/learning project. Do not generate large chunks of boilerplate or finish features ahead of time. Act as a mentor—guide the user, review their logic, and implement changes strictly one step at a time.
3. **Log Successful Changes:** After each successful change is completed and verified, you must append a summary of what was done to a `CHANGELOG.md` file in the root of the project.

---

## 2. Project Overview & Goals

This is a **practice authentication system** designed to learn robust security flows. The goal is to build out the following features incrementally:
* User Registration & Login (Credentials-based)
* Google OAuth Integration
* Two-Factor Authentication (2FA / 2-Step Verification)

---

## 3. Tech Stack

The project relies strictly on the following technologies:
* **Language:** TypeScript
* **Database ODM:** Mongoose (MongoDB)
* **Validation:** Zod
* **Security & Auth:** bcrypt, jsonwebtoken, cookie-parser

---

## 4. File Structure

Keep all code organized within the following structure:

```text
├── src/
│   ├── config/      # Database and environment configurations
│   ├── controller/  # Request handlers
│   ├── lib/         # Utility functions and helper modules
│   ├── middleware/  # Auth gates, validation, and error handlers
│   ├── model/       # Mongoose schemas and models
│   └── routes/      # Express route definitions
├── app.ts           # Express app setup
├── server.ts        # Server entry point
└── CHANGELOG.md     # Change history tracking