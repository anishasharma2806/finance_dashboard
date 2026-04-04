import { useApp } from "../context/AppContext";
import { useEffect, useState } from "react";

const ReminderModal = ({ close }) => {
  const { transactions, toggleComplete } = useApp();
  const [pending, setPending] = useState([]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    const filtered = transactions.filter(
      (t) => t.isReminder && !t.completed && t.date <= today,
    );

    setPending(filtered);
  }, [transactions]);

  if (pending.length === 0) return null;

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={close}>
          ✕
        </button>
        <h3>Pending Reminders</h3>
        <div className="reminder-list">
          {pending.map((t) => (
            <div key={t.id} className="reminder-item">
              <span>
                {t.category} (₹{t.amount})
              </span>

              <button className="done-btn" onClick={() => toggleComplete(t.id)}>
                Done
              </button>
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button className="btn-primary" onClick={close}>
            OK
          </button>

          <button className="btn-danger" onClick={close}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReminderModal;
