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

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    const hasPending = transactions.some(
      (t) => t.isReminder && !t.completed && t.date <= today,
    );

    if (hasPending) setShowReminder(true);
  }, [transactions]);

  return (
    <>
      <Walkthrough />
      <Header />
      <div className="app-container">
        {/* Onboarding Removed as Walkthrough is added */}
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
