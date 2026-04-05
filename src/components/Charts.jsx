import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Cell,
} from "recharts";
import { useApp } from "../context/AppContext";

const Charts = () => {
  const { filteredTransactions: transactions } = useApp();

  // Line data
  const lineData = transactions.map((t, index) => ({
    name: `T${index + 1}`,
    income: t.type === "income" ? t.amount : 0,
    expense: t.type === "expense" ? t.amount : 0,
    savings: t.type === "savings" ? t.amount : 0,
  }));

  // Savings trend
  let total = 0;
  const savingsTrend = transactions
    .filter((t) => t.type === "savings")
    .map((t, i) => {
      total += t.amount;
      return { name: `S${i + 1}`, value: total };
    });

  // Expense pie
  const expenseData = Object.values(
    transactions.reduce((acc, t) => {
      if (t.type === "expense") {
        if (!acc[t.category]) {
          acc[t.category] = { name: t.category, value: 0 };
        }
        acc[t.category].value += t.amount;
      }
      return acc;
    }, {}),
  );

  // ✅ NEW: Income pie
  const incomeData = Object.values(
    transactions.reduce((acc, t) => {
      if (t.type === "income") {
        if (!acc[t.category]) {
          acc[t.category] = { name: t.category, value: 0 };
        }
        acc[t.category].value += t.amount;
      }
      return acc;
    }, {}),
  );

  const COLORS = ["#2563eb", "#16a34a", "#dc2626", "#f59e0b", "#8b5cf6"];

  return (
    <div className="tour-charts">
      <div className="charts-grid">
        {/* MAIN */}
        <div className="card chart-main">
          <h3>Income vs Expense</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line dataKey="income" stroke="#16a34a" />
              <Line dataKey="expense" stroke="#dc2626" />
              <Line dataKey="savings" stroke="#8b5cf6" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* EXPENSE PIE */}
        <div className="card chart-expense">
          <h3>Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={expenseData} dataKey="value" outerRadius={80}>
                {expenseData.map((entry, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* SAVINGS */}
        <div className="card chart-savings">
          <h3>Savings Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={savingsTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line dataKey="value" stroke="#8b5cf6" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ✅ INCOME PIE */}
        <div className="card chart-income">
          <h3>Income Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={incomeData} dataKey="value" outerRadius={80}>
                {incomeData.map((entry, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Charts;
