import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [role, setRole] = useState("viewer");
  const [filter, setFilter] = useState("");

  // ✅ Filters
  const [monthFilter, setMonthFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const getDashboardData = () => {
    const data = getFilteredTransactions();

    let income = 0;
    let expenses = 0;
    let savings = 0;

    const categoryMap = {};
    const monthlyMap = {};

    data.forEach((t) => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

      // totals
      if (t.type === "income") income += t.amount;
      if (t.type === "expense") expenses += t.amount;
      if (t.type === "savings") savings += t.amount;

      // category
      if (t.type === "expense") {
        categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
      }

      // monthly trend
      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { income: 0, expense: 0 };
      }

      if (t.type === "income") monthlyMap[monthKey].income += t.amount;
      if (t.type === "expense") monthlyMap[monthKey].expense += t.amount;
    });

    const balance = income - expenses - savings;

    return {
      income,
      expenses,
      savings,
      balance,
      categoryData: Object.entries(categoryMap).map(([k, v]) => ({
        name: k,
        value: v,
      })),
      monthlyData: Object.entries(monthlyMap).map(([k, v]) => ({
        name: k,
        ...v,
      })),
    };
  };

  // ✅ Load data
  useEffect(() => {
    const stored = localStorage.getItem("transactions");
    if (stored) setTransactions(JSON.parse(stored));
    else setTransactions([]);
  }, []);

  // ✅ Save data
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // ✅ Add Transaction
  const addTransaction = (newTransaction) => {
    setTransactions((prev) => [
      ...prev,
      {
        ...newTransaction,
        id: Date.now(),
        isReminder:
          newTransaction.type === "expense" ? newTransaction.isReminder : false,
        completed: newTransaction.type === "savings" ? true : false,
      },
    ]);
  };

  // ✅ Delete
  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // ✅ Toggle
  const toggleComplete = (id) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  // ✅ Filter Logic (CLEAN)
  const getFilteredTransactions = () => {
    let data = [...transactions];

    // Month filter
    if (monthFilter !== "all") {
      data = data.filter((t) => {
        const d = new Date(t.date);
        return (
          d.getMonth() === monthFilter.month &&
          d.getFullYear() === monthFilter.year
        );
      });
    }

    // Date range filter
    if (startDate && endDate) {
      data = data.filter((t) => t.date >= startDate && t.date <= endDate);
    }

    return data;
  };

  // ✅ Dynamic months
  const getAvailableMonths = () => {
    const uniqueMonths = new Set();

    transactions.forEach((t) => {
      const date = new Date(t.date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      uniqueMonths.add(key);
    });

    return Array.from(uniqueMonths)
      .map((m) => {
        const [year, month] = m.split("-");
        return {
          year: Number(year),
          month: Number(month),
        };
      })
      .sort((a, b) => {
        if (a.year === b.year) return b.month - a.month;
        return b.year - a.year;
      });
  };

  return (
    <AppContext.Provider
      value={{
        transactions,
        role,
        setRole,
        filter,
        setFilter,
        addTransaction,
        deleteTransaction,
        toggleComplete,

        // Filters
        monthFilter,
        setMonthFilter,
        startDate,
        endDate,
        setStartDate,
        setEndDate,

        filteredTransactions: getFilteredTransactions(),
        availableMonths: getAvailableMonths(),
        dashboardData: getDashboardData(),
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
