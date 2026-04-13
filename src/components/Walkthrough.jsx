import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";

/* =========================
   👁️ VIEWER STEPS
========================= */
const viewerSteps = [
  { selector: ".summary-grid", text: "This shows your financial summary." },
  { selector: ".tour-filter", text: "Use filters to analyze your data." },
  { selector: ".charts-grid", text: "Charts help visualize trends." },
  { selector: ".tour-transactions", text: "This is your transactions list." },
  { selector: ".tour-insights", text: "Here are your financial insights." },
];

/* =========================
   🔐 ADMIN STEPS (DYNAMIC)
========================= */
const getAdminSteps = (hasData) => {
  const steps = [
    {
      selector: ".tour-add-btn",
      text: "Click here to add transactions.",
    },
  ];

  if (hasData) {
    steps.push(
      {
        selector: ".tour-transactions",
        text: "Manage your transactions here.",
      },
      {
        selector: ".delete-btn",
        text: "You can delete transactions here.",
      },
    );
  }

  return steps;
};

const Walkthrough = () => {
  const { role, transactions } = useApp();

  const [visible, setVisible] = useState(false);
  const [started, setStarted] = useState(false);
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [activeEl, setActiveEl] = useState(null);
  const [mode, setMode] = useState("");
  const [showFinal, setShowFinal] = useState(false);

  /* =========================
     🎯 START TOUR BUTTON
  ========================= */
  useEffect(() => {
    const handler = () => {
      const hasData = transactions.length > 0;

      if (role === "admin") {
        setSteps([...viewerSteps, ...getAdminSteps(hasData)]);
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
  }, [role, transactions]);

  /* =========================
     🎯 FIRST VISIT (VIEWER)
  ========================= */
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

  /* =========================
     🎯 FIRST ADMIN SWITCH
  ========================= */
  useEffect(() => {
    const seenAdmin = localStorage.getItem("seenAdminTour");

    if (role === "admin" && !seenAdmin) {
      const hasData = transactions.length > 0;

      setSteps(getAdminSteps(hasData)); // ✅ FIXED
      setMode("first-admin");
      setVisible(true);
      setStarted(false);
      setStepIndex(0);
      setShowFinal(false);
    }
  }, [role, transactions]);

  /* =========================
     🎯 HIGHLIGHT ENGINE
  ========================= */
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

  /* =========================
     👉 WELCOME SCREEN
  ========================= */
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

  /* =========================
     👉 FINAL SCREEN
  ========================= */
  if (showFinal) {
    return (
      <div className="tour-overlay">
        <div className="tour-box">
          <h3>You're all set 🎉</h3>

          <p>These features will appear once you add data:</p>

          <ul style={{ textAlign: "left", marginTop: "10px" }}>
            <li>✔ Done / Undo buttons</li>
            <li>✔ Reminder popup alerts</li>
            <li>✔ Transaction tracking</li>
            <li>✔ Dynamic insights</li>
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

  /* =========================
     👉 NEXT STEP LOGIC
  ========================= */
  const next = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex((p) => p + 1);
    } else {
      if (
        transactions.length === 0 &&
        (mode === "first-viewer" || mode === "manual-admin")
      ) {
        setShowFinal(true);
        return;
      }

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
