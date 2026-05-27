# Expense Tracker

A single-page app to track personal expenses with user authentication and an admin panel.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, shadcn/ui
- **Backend:** Node.js, Express
- **Database:** MongoDB, Mongoose
- **Auth:** JWT, bcryptjs

## How to Run

**Requirements:** Node.js and MongoDB running locally.

```bash
# Backend
cd backend
cp .env.example .env   # then set your own JWT_SECRET
npm install
npm run dev            # http://localhost:5001

# Frontend (new terminal)
cd frontend
npm install
npm run dev            # http://localhost:5173
```

## Features

- Register and login with hashed passwords and JWT
- Each user sees only their own expenses
- Add, edit, delete expenses
- Live search and category filter
- Summary cards and spending charts
- Activity log (login, logout, CRUD actions tracked)
- Admin panel to manage users and view their activity

## Admin Access

Register an account, then open MongoDB Compass and change `role` from `"user"` to `"admin"` for that account.

Test admin credentials:
- **Email:** admin@gmail.com
- **Password:** qwerty

## Folder Structure

```
expense-tracker/
├── backend/
│   └── src/
│       ├── index.js          # Express entry point
│       ├── middleware/        # JWT auth middleware
│       ├── models/            # Expense, User, UserActivity schemas
│       └── routes/            # auth, expenses, admin routes
└── frontend/
    └── src/
        ├── App.jsx            # Root component, auth state
        ├── lib/api.js         # All API calls
        └── components/        # AuthPage, AdminPanel, ExpenseList, charts
```

## Database Export

The following CSV files in the root folder contain the database exports:

- `expense-tracker.expenses.csv` — expenses collection
- `expense-tracker.users.csv` — users collection
- `expense-tracker.useractivities.csv` — user activity logs collection

## Workload Allocation

This project was completed individually by **Shashank Nayak**. All files were written by Shashank Nayak.
