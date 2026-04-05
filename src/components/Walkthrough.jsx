import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";

const baseSteps = [
  {
    selector: ".tour-summary",
    text: "This shows your financial summary.",
  },
  {
    selector: ".tour-add-btn",
    text: "Click here to add transactions (Admin only).",
    adminOnly: true,
  },
  {
    selector: ".tour-filter",
    text: "Use filters to analyze your data.",
  },
  {
    selector: ".tour-charts",
    text: "Charts help visualize trends.",
  },
  {
    selector: ".table",
    text: "This is your transaction history.",
  },
];

const Walkthrough = () => {
  const { role, transactions } = useApp();

  const [stepIndex, setStepIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [started, setStarted] = useState(false);
  const [activeElement, setActiveElement] = useState(null);
  const [showFinal, setShowFinal] = useState(false);

  // ✅ Filter steps based on role
  const steps = baseSteps.filter((step) => !step.adminOnly || role === "admin");

  // ✅ Show only first time
  useEffect(() => {
    const seen = localStorage.getItem("seenTour");
    if (!seen) setVisible(true);
  }, []);

  // ✅ Highlight logic (stable)
  useEffect(() => {
    if (!started || showFinal) return;

    const step = steps[stepIndex];
    if (!step) return;

    const element = document.querySelector(step.selector);
    if (!element) return;

    // Remove previous highlight
    if (activeElement) {
      activeElement.classList.remove("tour-highlight");
    }

    setActiveElement(element);

    element.scrollIntoView({ behavior: "smooth", block: "center" });

    const timer = setTimeout(() => {
      element.classList.add("tour-highlight");
    }, 150);

    return () => {
      clearTimeout(timer);
    };
  }, [stepIndex, started, role, showFinal]);

  if (!visible) return null;

  // 👉 STEP 1: Welcome screen
  if (!started) {
    return (
      <div className="tour-overlay">
        <div className="tour-box">
          <h3>Welcome 👋</h3>
          <p>
            Hi! Let’s walk through the dashboard to help you understand how it
            works.
          </p>

          <div className="tour-actions">
            <button
              onClick={() => {
                localStorage.setItem("seenTour", true);
                setVisible(false);
              }}
            >
              Skip
            </button>

            <button onClick={() => setStarted(true)}>Get Started</button>
          </div>
        </div>
      </div>
    );
  }

  // 👉 STEP 3: Final screen (conditional)
  if (showFinal) {
    return (
      <div className="tour-overlay">
        <div className="tour-box">
          <h3>You're all set 🎉</h3>

          <p style={{ marginTop: "10px" }}>
            Some features will appear once you start adding data:
          </p>

          <ul
            style={{
              textAlign: "left",
              marginTop: "10px",
              paddingLeft: "18px",
            }}
          >
            <li>
              <strong>Done / Undo:</strong> Manage reminders
            </li>
            <li>
              <strong>Reminder Popup:</strong> Alerts for pending tasks
            </li>
            <li>
              <strong>Status Labels:</strong> Shows transaction state
            </li>
          </ul>

          <p style={{ marginTop: "10px", color: "#555" }}>
            Switch to <strong>Admin</strong> and add transactions to explore
            them.
          </p>

          <div className="tour-actions">
            <button
              onClick={() => {
                localStorage.setItem("seenTour", true);
                setVisible(false);
              }}
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 👉 STEP 2: Main walkthrough
  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      // Only show final screen if no data
      if (transactions.length === 0) {
        setShowFinal(true);
      } else {
        localStorage.setItem("seenTour", true);
        setVisible(false);
      }
    }
  };

  const handleSkip = () => {
    localStorage.setItem("seenTour", true);
    setVisible(false);
  };

  return (
    <div className="tour-overlay">
      <div className="tour-box">
        <p>{steps[stepIndex]?.text}</p>

        <div className="tour-actions">
          <button onClick={handleSkip}>Skip</button>

          <button onClick={handleNext}>
            {stepIndex === steps.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Walkthrough;
