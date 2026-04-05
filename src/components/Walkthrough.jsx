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
  const [stepIndex, setStepIndex] = useState(0);
  const [steps, setSteps] = useState([]);
  const [activeElement, setActiveElement] = useState(null);
  const [trigger, setTrigger] = useState(0);
  const [showFinal, setShowFinal] = useState(false);

  // ✅ LISTEN FOR BUTTON TRIGGER
  useEffect(() => {
    const handler = () => setTrigger((prev) => prev + 1);
    window.addEventListener("start-tour", handler);
    return () => window.removeEventListener("start-tour", handler);
  }, []);

  // ✅ DETERMINE TOUR TYPE
  useEffect(() => {
    const seenViewer = localStorage.getItem("seenViewerTour");
    const seenAdmin = localStorage.getItem("seenAdminTour");

    if (role === "viewer" && !seenViewer) {
      setSteps(viewerSteps);
      setVisible(true);
      setStarted(false);
      setStepIndex(0);
      setShowFinal(false);
    }

    if (role === "admin" && !seenAdmin) {
      setSteps([...viewerSteps, ...adminSteps]); // 🔥 FULL ADMIN TOUR
      setVisible(true);
      setStarted(false);
      setStepIndex(0);
      setShowFinal(false);
    }
  }, [role, trigger]);

  // ✅ HIGHLIGHT ENGINE (FIXED)
  useEffect(() => {
    if (!started || showFinal) return;

    const step = steps[stepIndex];
    if (!step) return;

    const element = document.querySelector(step.selector);
    if (!element) return;

    if (activeElement) {
      activeElement.classList.remove("tour-highlight");
    }

    setActiveElement(element);

    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    const timer = setTimeout(() => {
      element.classList.add("tour-highlight");
    }, 250);

    return () => clearTimeout(timer);
  }, [stepIndex, started]);

  if (!visible) return null;

  // 👉 WELCOME
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

  // 👉 FINAL SCREEN (RESTORED)
  if (showFinal) {
    return (
      <div className="tour-overlay">
        <div className="tour-box">
          <h3>You're all set 🎉</h3>

          <p>These features will appear after adding data:</p>

          <ul style={{ textAlign: "left", marginTop: "10px" }}>
            <li>Done / Undo buttons</li>
            <li>Reminder popup alerts</li>
            <li>Transaction status updates</li>
          </ul>

          <div className="tour-actions">
            <button
              onClick={() => {
                localStorage.setItem("seenViewerTour", true);
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

  // 👉 NEXT
  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      if (role === "viewer" && transactions.length === 0) {
        setShowFinal(true);
      } else {
        if (role === "viewer") {
          localStorage.setItem("seenViewerTour", true);
        } else {
          localStorage.setItem("seenAdminTour", true);
        }

        setVisible(false);
      }
    }
  };

  return (
    <div className="tour-overlay">
      <div className="tour-box">
        <p>{steps[stepIndex]?.text}</p>

        <div className="tour-actions">
          <button onClick={() => setVisible(false)}>Skip</button>
          <button onClick={handleNext}>
            {stepIndex === steps.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Walkthrough;
