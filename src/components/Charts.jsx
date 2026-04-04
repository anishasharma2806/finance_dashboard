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

  // ✅ Line data
  const lineData = transactions.map((t, index) => ({
    name: `T${index + 1}`,
    income: t.type === "income" ? t.amount : 0,
    expense: t.type === "expense" ? t.amount : 0,
    savings: t.type === "savings" ? t.amount : 0,
  }));

  // ✅ Savings growth (cumulative)
  let total = 0;
  const savingsTrend = transactions
    .filter((t) => t.type === "savings")
    .map((t, i) => {
      total += t.amount;
      return {
        name: `S${i + 1}`,
        value: total,
      };
    });

  // ✅ Pie data
  const categoryData = Object.values(
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

  const COLORS = ["#2563eb", "#16a34a", "#dc2626", "#f59e0b", "#8b5cf6"];

  return (
    <div className="charts-grid">
      {/* Main Chart */}
      <div className="card">
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

      {/* Pie Chart */}
      <div className="card">
        <h3>Expense Breakdown</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
            >
              {categoryData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Savings Growth */}
      <div className="card">
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
    </div>
  );
};

export default Charts;
