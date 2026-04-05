import Header from "./components/Header";
import SummaryCards from "./components/SummaryCards";
import Charts from "./components/Charts";
import Transactions from "./components/Transactions";
import Insights from "./components/Insights";
import ReminderModal from "./components/ReminderModal";
import Walkthrough from "./components/Walkthrough";
import { useState, useEffect } from "react";
import { useApp } from "./context/AppContext";

function App() {
  const [showReminder, setShowReminder] = useState(false);
  const { transactions } = useApp();

  // ✅ Ask notification permission once
  useEffect(() => {
    const permission = localStorage.getItem("notificationPermission");

    if (!permission) {
      if ("Notification" in window) {
        Notification.requestPermission().then((perm) => {
          localStorage.setItem("notificationPermission", perm);
        });
      }
    }
  }, []);

  // ✅ Reminder logic (existing + notifications)
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    const pending = transactions.filter(
      (t) => t.isReminder && !t.completed && t.date <= today,
    );

    if (pending.length > 0) {
      setShowReminder(true);

      // 🔥 SEND NOTIFICATIONS (no spam)
      const notifiedIds =
        JSON.parse(localStorage.getItem("notifiedReminders")) || [];

      pending.forEach((t) => {
        if (!notifiedIds.includes(t.id)) {
          if (Notification.permission === "granted") {
            new Notification("Reminder 🔔", {
              body: `${t.category} - ₹${t.amount}`,
            });
          }

          notifiedIds.push(t.id);
        }
      });

      localStorage.setItem("notifiedReminders", JSON.stringify(notifiedIds));
    }
  }, [transactions]);

  return (
    <>
      <Walkthrough />
      <Header />
      {/*Removd Onboarding and replaced it with Walkthrough*/}
      <div className="app-container">
        <SummaryCards />
        <Charts />
        <Transactions />
        <Insights />

        {showReminder && <ReminderModal close={() => setShowReminder(false)} />}
      </div>
    </>
  );
}

export default App;
