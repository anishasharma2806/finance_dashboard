import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";

const viewerSteps = [
  { selector: ".summary-grid", text: "This shows your financial summary." },
  { selector: ".tour-filter", text: "Use filters to analyze your data." },
  { selector: ".charts-grid", text: "Charts help visualize trends." },
  { selector: ".tour-transactions", text: "This is your transactions list." },
  { selector: ".tour-insights", text: "Here are your financial insights." },
];

const adminSteps = [
  { selector: ".tour-add-btn", text: "Click here to add transactions." },
];

const Walkthrough = () => {
  const { role, transactions } = useApp();

  const [visible, setVisible] = useState(false);
  const [started, setStarted] = useState(false);
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [activeEl, setActiveEl] = useState(null);
  const [mode, setMode] = useState(""); // 👈 key fix
  const [showFinal, setShowFinal] = useState(false);

  // =========================
  // 🎯 START TOUR BUTTON
  // =========================
  useEffect(() => {
    const handler = () => {
      if (role === "admin") {
        setSteps([...viewerSteps, ...adminSteps]); // FULL ADMIN TOUR
        setMode("manual-admin");
      } else {
        setSteps(viewerSteps);
        setMode("manual-viewer");
      }

      setVisible(true);
      setStarted(false);
      setStepIndex(0);
      setShowFinal(false);
    };

    window.addEventListener("start-tour", handler);
    return () => window.removeEventListener("start-tour", handler);
  }, [role]);

  // =========================
  // 🎯 FIRST VISIT (VIEWER ONLY)
  // =========================
  useEffect(() => {
    const seenViewer = localStorage.getItem("seenViewerTour");

    if (!seenViewer && role === "viewer") {
      setSteps(viewerSteps);
      setMode("first-viewer");
      setVisible(true);
      setStarted(false);
      setStepIndex(0);
      setShowFinal(false);
    }
  }, [role]);

  // =========================
  // 🎯 FIRST ADMIN SWITCH
  // =========================
  useEffect(() => {
    const seenAdmin = localStorage.getItem("seenAdminTour");

    if (role === "admin" && !seenAdmin) {
      setSteps(adminSteps); // 👈 ONLY ADMIN
      setMode("first-admin");
      setVisible(true);
      setStarted(false);
      setStepIndex(0);
      setShowFinal(false);
    }
  }, [role]);

  // =========================
  // 🎯 HIGHLIGHT ENGINE
  // =========================
  useEffect(() => {
    if (!started || showFinal) return;

    const step = steps[stepIndex];
    if (!step) return;

    const el = document.querySelector(step.selector);
    if (!el) return;

    if (activeEl) activeEl.classList.remove("tour-highlight");

    setActiveEl(el);

    el.scrollIntoView({ behavior: "smooth", block: "center" });

    const timer = setTimeout(() => {
      el.classList.add("tour-highlight");
    }, 300);

    return () => clearTimeout(timer);
  }, [stepIndex, started, steps]);

  if (!visible) return null;

  // =========================
  // 👉 WELCOME
  // =========================
  if (!started) {
    return (
      <div className="tour-overlay">
        <div className="tour-box">
          <h3>Welcome 👋</h3>
          <p>Let’s walk through the dashboard.</p>

          <div className="tour-actions">
            <button onClick={() => setVisible(false)}>Skip</button>
            <button onClick={() => setStarted(true)}>Start</button>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // 👉 FINAL SCREEN (FIXED)
  // =========================
  if (showFinal) {
    return (
      <div className="tour-overlay">
        <div className="tour-box">
          <h3>You're all set 🎉</h3>

          <p>These features will appear once you add data:</p>

          <ul style={{ textAlign: "left", marginTop: "10px" }}>
            <li>✔ Done / Undo buttons</li>
            <li>✔ Reminder popup alerts</li>
            <li>✔ Transaction completion tracking</li>
            <li>✔ Dynamic insights updates</li>
          </ul>

          <div className="tour-actions">
            <button
              onClick={() => {
                localStorage.setItem("seenViewerTour", true);
                localStorage.setItem("seenAdminTour", true);
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

  // =========================
  // 👉 NEXT LOGIC (CRITICAL FIX)
  // =========================
  const next = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex((p) => p + 1);
    } else {
      // 👇 show final ONLY for first viewer OR manual full tour
      if (
        transactions.length === 0 &&
        (mode === "first-viewer" || mode === "manual-admin")
      ) {
        setShowFinal(true);
        return;
      }

      // mark completion properly
      if (mode === "first-viewer") {
        localStorage.setItem("seenViewerTour", true);
      }

      if (mode === "first-admin") {
        localStorage.setItem("seenAdminTour", true);
      }

      if (mode === "manual-admin") {
        localStorage.setItem("seenViewerTour", true);
        localStorage.setItem("seenAdminTour", true);
      }

      setVisible(false);
    }
  };

  return (
    <div className="tour-overlay">
      <div className="tour-box">
        <p>{steps[stepIndex]?.text}</p>

        <div className="tour-actions">
          <button onClick={() => setVisible(false)}>Skip</button>
          <button onClick={next}>
            {stepIndex === steps.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Walkthrough;
