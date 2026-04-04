import { useState } from "react";
import { useApp } from "../context/AppContext";

const AddTransactionModal = ({ close }) => {
  const { addTransaction } = useApp();

  const [form, setForm] = useState({
    amount: "",
    category: "",
    type: "expense",
    date: "",
    isReminder: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.amount || !form.category || !form.date) return;

    const normalizedType = form.type.toLowerCase();

    addTransaction({
      amount: Number(form.amount),
      category: form.category,
      date: form.date,
      type: normalizedType,

      // ✅ enforce clean data BEFORE sending
      isReminder: normalizedType === "expense" ? form.isReminder : false,
    });

    close();
  };

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={close}>
          ✕
        </button>

        <h3>Add Transaction</h3>

        <form onSubmit={handleSubmit} className="modal-form">
          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />

          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />

          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
            <option value="savings">Savings</option>
          </select>

          <div className="reminder-toggle">
            <label className="reminder-label">
              <input
                type="checkbox"
                checked={form.isReminder}
                onChange={(e) =>
                  setForm({ ...form, isReminder: e.target.checked })
                }
              />
              <span>Mark as Reminder</span>
            </label>
          </div>

          <button type="submit" className="btn">
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
