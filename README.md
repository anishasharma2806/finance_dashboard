# Finance Dashboard UI

## Overview

This is a frontend-based Finance Dashboard designed to simulate real-world financial tracking and analysis.

The application enables users to monitor financial activity, manage transactions, and gain insights through an interactive and dynamic user interface.

It focuses on **frontend architecture, state management, and user experience**, rather than backend integration.

---

## Key Features

### Dashboard Overview

- Summary cards (Balance, Income, Expenses, Savings)
- Time-based visualization (Income vs Expense trend)
- Category-based breakdown (Expense distribution)
- Savings growth tracking

### Transactions Management

- View and search transactions
- Filter by date and month
- Add transactions (Admin only)
- Delete individual transactions
- Bulk selection with multi-delete support
- **Undo delete functionality (Gmail-style recovery)**

### Role-Based UI

- Viewer: Read-only access
- Admin: Full control (add, delete, manage)
- UI dynamically adapts based on selected role

### Guided Walkthrough (Onboarding)

- First-time user walkthrough
- Separate flows for Viewer and Admin
- Manual “Start Tour” option
- Context-aware steps based on UI state

### Insights

- Highest spending category detection
- Financial observations based on transactions
- Conditional rendering when data is available

### Smart UI Behavior

- Graceful handling of empty states
- Features appear dynamically based on data
- Reminder-based transaction handling

---

## State Management

- Implemented using **React Context API**
- Manages:
  - Transactions data
  - Filters
  - Role switching
  - UI state

- Ensures consistent and predictable data flow across components

---

## Tech Stack

- React (Functional Components + Hooks)
- JavaScript (ES6+)
- CSS (Custom styling)
- Recharts (Data visualization)

---

## Project Structure

```
src/
  components/
  context/
  data/
  App.jsx
  main.jsx
  index.css
```

---

## How to Run

```bash
npm install
npm run dev
```

---

## Technical Decisions & Trade-offs

### Why Context API?

Chosen for centralized state management without introducing unnecessary complexity like Redux.

### Why LocalStorage?

Used to simulate persistence and maintain state across sessions without requiring a backend.

### Trade-offs

- No backend → limited scalability
- LocalStorage → not suitable for large datasets
- Focus kept on frontend logic, UI behavior, and UX patterns

---

## Limitations

- No authentication system
- No backend or database integration
- Data is stored locally in the browser

---

## Future Improvements

- Backend integration (Firebase / Supabase)
- Authentication system
- Dark mode
- Export functionality (CSV / JSON)
- Advanced analytics (monthly trends, predictions)

---

## Summary

This project goes beyond a basic dashboard by implementing:

- Role-based UI behavior
- Guided onboarding system
- Bulk operations with undo functionality
- Dynamic UI rendering based on state

It focuses on simulating real product behavior rather than just displaying static data.
