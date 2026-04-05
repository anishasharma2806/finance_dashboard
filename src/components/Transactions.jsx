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
    addTransaction,
  } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState([]);

  // 🔥 UNDO STATE
  const [deletedItems, setDeletedItems] = useState([]);
  const [showUndo, setShowUndo] = useState(false);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const selectAll = (filtered) => {
    if (selected.length === filtered.length) {
      setSelected([]);
    } else {
      setSelected(filtered.map((t) => t.id));
    }
  };

  const deleteSelected = () => {
    const toDelete = transactions.filter((t) => selected.includes(t.id));

    setDeletedItems(toDelete);

    toDelete.forEach((t) => deleteTransaction(t.id));

    setSelected([]);
    setShowUndo(true);

    setTimeout(() => setShowUndo(false), 5000);
  };

  const undoDelete = () => {
    deletedItems.forEach((t) => addTransaction(t));
    setDeletedItems([]);
    setShowUndo(false);
  };

  const filtered = transactions.filter((t) =>
    t.category.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <>
      <div className="tour-transactions">
        <div className="card mb-20">
          {/* TOP BAR */}
          <div className="flex-row">
            <input
              className="input"
              placeholder="Search..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />

            {role === "admin" && (
              <>
                <div className="tour-add-btn">
                  <button className="btn" onClick={() => setShowModal(true)}>
                    + Add
                  </button>
                </div>

                {selected.length > 0 && (
                  <button className="delete-btn" onClick={deleteSelected}>
                    Delete ({selected.length})
                  </button>
                )}
              </>
            )}
          </div>

          {filtered.length === 0 ? (
            <p style={{ textAlign: "center", padding: "20px" }}>
              No transactions yet.
            </p>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    {role === "admin" && (
                      <th>
                        <input
                          type="checkbox"
                          checked={selected.length === filtered.length}
                          onChange={() => selectAll(filtered)}
                        />
                      </th>
                    )}
                    <th>Date</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Type</th>
                    {role === "admin" && <th>Action</th>}
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((t) => (
                    <tr key={t.id}>
                      {role === "admin" && (
                        <td>
                          <input
                            type="checkbox"
                            checked={selected.includes(t.id)}
                            onChange={() => toggleSelect(t.id)}
                          />
                        </td>
                      )}

                      <td>{t.date}</td>
                      <td>{t.category}</td>
                      <td>₹{t.amount}</td>
                      <td>{t.type}</td>

                      {role === "admin" && (
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() => {
                              setDeletedItems([t]);
                              deleteTransaction(t.id);
                              setShowUndo(true);
                              setTimeout(() => setShowUndo(false), 5000);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 🔥 UNDO BAR */}
      {showUndo && (
        <div className="undo-bar">
          Transaction deleted
          <button onClick={undoDelete}>Undo</button>
        </div>
      )}

      {showModal && <AddTransactionModal close={() => setShowModal(false)} />}
    </>
  );
};

export default Transactions;
