# MessMate - Project Progress Tracker

This document tracks all completed and upcoming tasks for the MessMate project, explaining the purpose of each feature.

## Phase 1: Project Setup & Infrastructure
- [x] **Initialize Frontend & Backend Directories**: Set up the fundamental MERN stack (React + Node) structure to separate client and server logic.
- [x] **Git Repository Setup**: Created a root `.gitignore` and secured the repository to prevent uploading massive `node_modules` and sensitive database passwords (`.env`).

## Phase 2: Authentication System
- [x] **Database Connection**: Connected the Express backend to MongoDB via Mongoose.
- [x] **User Model (`user.model.js`)**: Defined the database schema for Students and Admins, including properties like `walletBalance`, `hostel`, `roomNumber`, and `autoPilotMode`.
- [x] **Auth Controller & Routes**: Implemented secure Registration, Login, and Logout API endpoints.
- [x] **JWT & Cookies Security**: Configured JSON Web Tokens to be sent as HTTP-only cookies, protecting user sessions from XSS attacks.
- [x] **Frontend Auth UI**: Built modern, responsive login and registration forms using Tailwind CSS.
- [x] **React State Management (`AuthContext.jsx`)**: Created a global React Context to securely store and share the logged-in user's data across the entire application.

## Phase 3: Core Meal System
- [x] **Menu Model (`menu.model.js`)**: Created the schema for administrators to upload the daily mess menu.
- [x] **Registration Model (`registration.model.js`)**: Created the schema to track individual student choices (Breakfast/Lunch/Dinner) and special paid items.
- [x] **Auth Middleware (`authMiddleware.js`)**: Implemented a backend security gatekeeper.
- [x] **Meal Controller & Routes**: Built the backend logic to fetch tomorrow's menu and allow students to submit their registrations (enforcing the 10 PM deadline).
- [x] **Student Dashboard UI**: Built the React page where students can view their current wallet balance, see tomorrow's menu, and check/uncheck their meals.

## Phase 4: Wallet & Payments (Mocked)
- [x] **Razorpay Integration (Mocked)**: Setup a mock payment gateway to allow students to recharge their wallet balance instantly for testing.
- [x] **Transaction History**: Create a database model to record all deductions (for special items) and recharges.

## Phase 5: Administration & Automation
- [x] **Node-cron Automation**: Wrote background jobs to automatically register students who have "Auto-Pilot Mode 1" enabled when the 10 PM deadline hits.
- [x] **Admin Dashboard UI**: Built a page showing real-time statistics and exact meal counts to the kitchen staff.
- [x] **QR Code Verification**: Integrated `qrcode.react` to generate unique QR passes on the student dashboard for mess entry.

## Phase 6: Multi-Tenancy Architecture (Multi-Mess)
- [x] **Mess Model**: Introduced `mess.model.js` to support multiple different hostels/messes within the same application.
- [x] **Database Migration**: Added `messId` to Users, Menus, and Registrations so data is strictly isolated per mess.
- [x] **Registration Selection**: Students now dynamically fetch and select which specific Mess they belong to when signing up.

## Phase 7: Final Features
- [x] **Night Canteen System**: Built models, backend routes, and a dedicated frontend page (`Canteen.jsx`) allowing students to order late-night snacks directly using their wallet balance. Admins can view and fulfill orders on their dashboard.
- [x] **Menu Polls**: Built a live polling widget (`PollWidget.jsx`) for students to vote on upcoming special meals. Admins can create and publish these polls from their dashboard.

## Next Possible Steps (Phase 8)
- [ ] **Profile / Settings Page**: Allow students to update their password, room number, or autopilot preferences.
- [ ] **Production Deployment**: Host the backend on Render/Heroku and frontend on Vercel.
- [ ] **Real Payment Gateway**: Swap out the mock wallet integration for real Razorpay keys.
