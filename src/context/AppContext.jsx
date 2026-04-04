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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
