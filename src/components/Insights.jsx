import { useApp } from "../context/AppContext";

const Insights = () => {
  const { transactions } = useApp();

  const expenses = transactions.filter((t) => t.type === "expense");

  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);

  const highestExpense =
    expenses.length > 0
      ? expenses.reduce((max, curr) => (curr.amount > max.amount ? curr : max))
      : null;

  const savings = transactions.filter((t) => t.type === "savings");

  const highestSaving =
    savings.length > 0
      ? savings.reduce((max, curr) => (curr.amount > max.amount ? curr : max))
      : null;

  return (
    <div className="tour-insights">
      <div className="card mb-20">
        <h3 className="insights-title">Insights</h3>

        {expenses.length === 0 ? (
          <p>No expense data available</p>
        ) : (
          <div className="insights-grid">
            {/* Total Expense */}
            <div className="insight-box">
              <p className="insight-label">Total Expenses</p>
              <h2 className="insight-value red">₹{totalExpense}</h2>
            </div>

            {/* Highest Spending */}
            <div className="insight-box">
              <p className="insight-label">Highest Spending</p>
              <h2 className="insight-value">{highestExpense.category}</h2>
              <span className="insight-sub">₹{highestExpense.amount}</span>
            </div>

            {savings.length > 0 && (
              <div className="insight-box">
                <p className="insight-label">Highest Saving</p>

                {/* keep this normal (black) */}
                <h2 className="insight-value">{highestSaving.category}</h2>

                {/* make ONLY amount green */}
                <span className="insight-sub green">
                  ₹{highestSaving.amount}
                </span>
              </div>
            )}

            {/* Observation */}
            <div className="insight-box">
              <p className="insight-label">Observation</p>
              <p className="insight-text">
                You are spending most on{" "}
                <strong>{highestExpense.category}</strong>. Consider optimizing
                this category.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Insights;
