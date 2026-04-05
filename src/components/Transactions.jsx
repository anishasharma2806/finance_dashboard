import { useState } from "react";
import { useApp } from "../context/AppContext";
import AddTransactionModal from "./AddTransactionModal";

const Transactions = () => {
  const {
    transactions,
    role,
    filter,
    setFilter,
    deleteTransaction,
    toggleComplete,
  } = useApp();

  const [showModal, setShowModal] = useState(false);

  const getStatus = (t) => {
    const today = new Date().toISOString().split("T")[0];

    if (t.type === "savings") return "completed";
    if (t.completed) return "completed";

    // ✅ FIX: instant expenses auto-complete
    if (t.type === "expense" && !t.isReminder) {
      return "completed";
    }

    if (t.type === "income" && !t.isReminder) {
      if (t.date > today) return "upcoming";
      return "completed";
    }

    if (t.date > today) return "upcoming";
    if (t.date === today) return "today";

    return "missed";
  };

  const filtered = transactions.filter((t) =>
    t.category.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <>
      <div className="tour-transactions">
        <div className="card mb-20">
          <div className="flex-row">
            <input
              className="input"
              placeholder="Search..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />

            {role === "admin" && (
              <div className="tour-add-btn">
                <button className="btn" onClick={() => setShowModal(true)}>
                  + Add
                </button>
              </div>
            )}
          </div>

          {filtered.length === 0 ? (
            <p style={{ textAlign: "center", padding: "20px", color: "#666" }}>
              No transactions yet. Switch to Admin to add.
            </p>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Type</th>
                    {role === "admin" && <th>Action</th>}
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((t) => (
                    <tr key={t.id}>
                      <td>{t.date}</td>
                      <td>{t.category}</td>
                      <td>₹{t.amount}</td>

                      <td
                        className={
                          t.type === "income"
                            ? "green"
                            : t.type === "savings"
                              ? "purple"
                              : "red"
                        }
                      >
                        {t.type}
                      </td>

                      {role === "admin" && (
                        <td>
                          {(() => {
                            const today = new Date()
                              .toISOString()
                              .split("T")[0];

                            if (t.type === "savings") return null;

                            if (t.type === "expense" && t.isReminder) {
                              return (
                                <button
                                  className={`done-btn ${
                                    t.completed ? "undo" : ""
                                  }`}
                                  onClick={() => toggleComplete(t.id)}
                                >
                                  {t.completed ? "Undo" : "Done"}
                                </button>
                              );
                            }

                            if (
                              t.type === "income" &&
                              t.isReminder &&
                              !t.completed &&
                              t.date > today
                            ) {
                              return (
                                <button
                                  className="done-btn"
                                  onClick={() => toggleComplete(t.id)}
                                >
                                  Done
                                </button>
                              );
                            }

                            return null;
                          })()}

                          <button
                            className="delete-btn"
                            onClick={() => deleteTransaction(t.id)}
                          >
                            Delete
                          </button>
                        </td>
                      )}

                      <td>
                        <span className={`status ${getStatus(t)}`}>
                          {getStatus(t)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && <AddTransactionModal close={() => setShowModal(false)} />}
    </>
  );
};

export default Transactions;
