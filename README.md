# Expense Tracker

This app gives you a simple logbook for every transaction with enough structure (categories, dates, amounts) to actually answer those questions without spreadsheets.
the app is a true single-page application. All views (overview, expense list, add/edit forms, delete confirmations) are handled by tab switching and modal dialogs within a single HTML page.

## Tech Stack

**Frontend** React via vite  
**Styling** Tailwind CSS + shadcn/ui  
**Charts** Recharts (via shadcn chart components)
**Backend** Node.js + Express  
**Database** MongoDB (local),Mongoose

## Features

- **Add, edit, and delete expenses**
- **10 spending categories** Food & Dining, Transport, Shopping, Entertainment, Health, Housing, Education, Travel, Personal Care, Other
- **Monthly bar chart** visualises the last 6 months of spending
- **Category donut chart** shows the percentage breakdown of all-time spending by category
- **Summary cards** total spent, this month's total, top category, and number of categories used
- **Search and filter** filter the expense list by keyword or category in real time
- **Inline edit/delete** action buttons appear on row hover, keeping the table clean
- **Delete confirmation dialog** prevents accidental data loss
- **Responsive layout** works on mobile and desktop
- **Form validation** required fields and amount checks before any data is sent

**Prerequisites:** Node.js and MongoDB running locally.

```bash
# Terminal 1 — backend
cd backend
npm install
npm run dev

# Terminal 2 — frontend
cd frontend
npm install
npm run dev
```

## Challenges

The trickiest part was getting Prisma to work with a local MongoDB instance — Prisma requires MongoDB to run as a replica set even for basic operations, which isn't the default on a local install. Rather than reconfiguring MongoDB, I switched to Mongoose, which works fine with a standalone instance

Wiring up the shadcn chart components took some trial and error. The `ChartContainer` uses a React context to pass colour config down to the tooltip and legend, so the colour variables needed to be threaded through correctly it wasn't obvious at first why the tooltip colours weren't showing up.

On the frontend side, keeping the expense list and the summary cards in sync after mutations (add/edit/delete) without over fetching was something I thought about carefully. The solution was a shared `refresh()` function in `App.jsx` that re fetches both the expense list and the summary data together, so the charts and cards always reflect the current state.
