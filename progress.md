# MessMate - Project Progress Tracker

This document tracks all completed and upcoming tasks for the MessMate project, explaining the purpose of each feature.

## Phase 1: Project Setup & Infrastructure
- [x] **Initialize Frontend & Backend Directories**: Set up the fundamental MERN stack (React + Node) structure to separate client and server logic.
- [x] **Git Repository Setup**: Created a root `.gitignore` and secured the repository to prevent uploading massive `node_modules` and sensitive database passwords (`.env`).

## Phase 2: Authentication System
- [x] **Database Connection**: Connected the Express backend to MongoDB via Mongoose.
- [x] **User Model (`user.model.js`)**: Defined the database schema for Students and Admins, including properties like `walletBalance`, `hostel`, `roomNumber`, and `autoPilotMode`.
- [x] **Auth Controller & Routes**: Implemented secure Registration, Login, and Logout API endpoints.
- [x] **JWT & Cookies Security**: Configured JSON Web Tokens to be sent as HTTP-only cookies, protecting user sessions from XSS (Cross-Site Scripting) attacks.
- [x] **Frontend Auth UI (`Register.jsx`, `Login.jsx`)**: Built modern, responsive login and registration forms using Tailwind CSS.
- [x] **API Integration**: Connected the React forms to the Node.js backend using Axios, ensuring credentials (cookies) are passed correctly.
- [x] **React State Management (`AuthContext.jsx`)**: Created a global React Context to securely store and share the logged-in user's data across the entire application without needing to fetch it repeatedly.

## Phase 3: Core Meal System (In Progress)
- [x] **Menu Model (`menu.model.js`)**: Created the schema for administrators to upload the daily mess menu.
- [x] **Registration Model (`registration.model.js`)**: Created the schema to track individual student choices (Breakfast/Lunch/Dinner) and any special paid items they select.
- [x] **Auth Middleware (`authMiddleware.js`)**: Implemented a backend security gatekeeper that ensures only logged-in users with a valid JWT cookie can access meal routes.
- [x] **Meal Controller & Routes**: Built the backend logic to fetch tomorrow's menu and allow students to submit their registrations (including a strict 10 PM deadline check).
- [x] **Student Dashboard UI**: Build the React page where students can view their current wallet balance, see tomorrow's menu, and check/uncheck their meals.

## Phase 4: Wallet & Payments (Upcoming)
- [ ] **Razorpay Integration**: Setup the payment gateway to allow students to recharge their wallet balance with real money.
- [ ] **Transaction History**: Create a database model to record all deductions (for special items) and recharges.

## Phase 5: Administration & Automation (Upcoming)
- [ ] **Node-cron Automation**: Write background jobs to automatically register students who have "Auto-Pilot Mode 1" enabled when the 10 PM deadline hits.
- [x] **Admin Dashboard UI**: Build a page showing real-time statistics and exact meal counts to the kitchen staff so they know exactly how much food to cook.
- [ ] **QR Code Verification**: Generate a unique QR pass for registered students and build a scanner for the mess entrance.
