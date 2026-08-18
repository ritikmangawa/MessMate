# MessMate 🍽️

MessMate is a comprehensive, production-ready full-stack web application designed to digitize and streamline hostel mess operations. It provides a robust platform for both Students (to manage their meals, wallets, and late-night snacks) and Administrators (to publish menus, track headcounts, and fulfill orders).

Built with the **MERN Stack** (MongoDB, Express, React, Node.js) and styled with **Tailwind CSS**.

---

## 🌟 Key Features

### 🏢 Multi-Tenancy Architecture
- The system supports multiple distinct messes (e.g., "Block A Mess", "Block B Mess") within the same application.
- Data (Users, Menus, Orders, Polls) is strictly isolated. Students and Admins only interact with data pertaining to their selected Mess.

### 🎓 For Students
- **Daily Meal Registration**: View tomorrow's menu and opt-in/opt-out for Breakfast, Lunch, and Dinner before the strict 10:00 PM cutoff.
- **Auto-Pilot Mode**: Enable "Auto-Pilot" to automatically register for all basic meals via a background cron job every night.
- **Digital Wallet**: Maintain a digital balance to pay for special add-on items or night canteen snacks without carrying cash.
- **Night Canteen**: Order late-night snacks (like Maggi, Coffee) directly from the dashboard using wallet funds.
- **QR Code Entry Pass**: Generate a daily QR code pass upon successful meal registration to scan at the dining hall entrance.
- **Live Polls**: Vote on upcoming special menu items directly from the dashboard.

### 👨‍🍳 For Administrators
- **Analytics Dashboard**: View precise real-time statistics on exactly how many students are registered for Breakfast, Lunch, and Dinner tomorrow to prevent food wastage.
- **Menu Management**: Publish the daily menu to all students in their assigned mess.
- **Order Fulfillment**: View a live table of incoming Night Canteen orders and click to mark them as "Delivered".
- **Poll Creation**: Create and publish dynamic polls to gather student feedback on future meals.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), React Router DOM, Tailwind CSS, Axios, Context API
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) stored securely in HTTP-only cookies, bcryptjs
- **Automation**: node-cron (for 10 PM background auto-registrations)

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js installed on your machine
- MongoDB installed locally or a MongoDB Atlas URI

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/MessMate.git
cd MessMate
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory with the following variables:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/messmate
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The application should now be running on `http://localhost:5173`.

---

## 🧪 Testing the Application

1. **Initial Setup**: When the backend starts, it will automatically "seed" (create) two default Messes (`Block A Mess` and `Block B Mess`) and some default Canteen Items if the database is completely empty.
2. **Student Account**: Go to `/register` and create an account. Be sure to select a Mess from the dropdown.
3. **Admin Account**: Register a second account. To make it an Admin, open MongoDB Compass, find the user document, and change the `"role"` field from `"student"` to `"admin"`.
4. **Login**: Log in as the Admin to upload a menu and create a poll. Then log in as the student to vote, check your wallet, and order from the canteen!
