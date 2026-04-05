# Finance Dashboard UI

## Overview

This project is a frontend-based Finance Dashboard built to visualize and manage financial data in a clean and interactive way.

It allows users to:

- View financial summaries
- Explore transactions
- Analyze spending patterns
- Switch roles (Admin / Viewer)

---

## Features

### Dashboard Overview

- Summary cards (Balance, Income, Expenses)
- Time-based visualization (trend chart)
- Category-based visualization (expense breakdown)

### Transactions

- View transaction list
- Filter by date/month
- Add transactions (Admin only)
- Search / sorting support

### Role-Based UI

- Viewer → read-only access
- Admin → add/manage transactions

### Insights

- Highest spending category
- Monthly comparison
- Smart financial observations

### State Management

- Centralized using React Context API
- Filters and UI stay in sync

---

## Tech Stack

- React
- JavaScript (ES6+)
- CSS
- Recharts (for charts)

---

## Responsiveness

- Works across desktop and smaller screens
- Flexible grid layout

---

## Optional Enhancements Implemented

- Role switching
- Modal-based transaction entry
- Interactive UI elements

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

## Approach

This project focuses on:

- Clean component structure
- Reusable UI
- Centralized state management
- Real-world dashboard behavior simulation

---

## Notes

- Works on Frontend no backend integrated
- Designed for frontend evaluation purposes

---

## Future Improvements

- Dark mode
- API integration
- Export data (CSV/JSON)
- Advanced analytics

---
