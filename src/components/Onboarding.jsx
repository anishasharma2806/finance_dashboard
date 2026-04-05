import { useApp } from "../context/AppContext";

const Onboarding = () => {
  const { transactions, role } = useApp();

  if (transactions.length > 0) return null;

  return (
    <div className="card mb-20">
      <h3>Welcome 👋</h3>

      <p style={{ marginTop: "10px", color: "#555" }}>
        This dashboard helps you track your finances.
      </p>

      <ul style={{ marginTop: "10px", paddingLeft: "18px", color: "#444" }}>
        <li>
          Switch to <strong>Admin</strong> to add transactions
        </li>
        <li>Use filters to analyze your data</li>
        <li>View charts and insights automatically</li>
      </ul>

      {role === "viewer" && (
        <p style={{ marginTop: "10px", color: "#dc2626" }}>
          Switch to Admin to start adding data
        </p>
      )}
    </div>
  );
};

export default Onboarding;
