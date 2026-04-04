import { useApp } from "../context/AppContext";

const SummaryCards = () => {
  const { filteredTransactions: transactions } = useApp();

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const savings = transactions
    .filter((t) => t.type === "savings")
    .reduce((sum, t) => sum + t.amount, 0);

  const mainBalance = income - expenses - savings;

  const format = (num) => new Intl.NumberFormat("en-IN").format(num);

  // ✅ Monthly comparison
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const current = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const last = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth - 1 && d.getFullYear() === currentYear;
  });

  const currentIncome = current
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);

  const lastIncome = last
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);

  const incomeChange =
    lastIncome > 0
      ? (((currentIncome - lastIncome) / lastIncome) * 100).toFixed(1)
      : 0;

  return (
    <div className="summary-grid">
      <div className="card premium highlight">
        <p>Main Balance</p>
        <h2>₹{format(mainBalance)}</h2>
      </div>

      <div className="card premium savings">
        <p>Savings</p>
        <h2>₹{format(savings)}</h2>
      </div>

      <div className="card premium income">
        <p>Income</p>
        <h2>₹{format(income)}</h2>
        <span className="trend">{incomeChange}% vs last month</span>
      </div>

      <div className="card premium expense">
        <p>Expenses</p>
        <h2>₹{format(expenses)}</h2>
      </div>
    </div>
  );
};

export default SummaryCards;
