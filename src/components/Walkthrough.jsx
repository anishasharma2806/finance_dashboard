import { useState, useEffect } from "react";

const steps = [
  {
    selector: ".tour-summary",
    text: "This shows your financial summary.",
  },
  {
    selector: ".tour-add-btn",
    text: "Click here to add transactions (Admin only).",
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
  const [stepIndex, setStepIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("seenTour");
    if (!seen) {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!started) return;

    const step = steps[stepIndex];
    const element = document.querySelector(step.selector);

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });

      // 🔥 Highlight effect
      element.classList.add("tour-highlight");

      return () => {
        element.classList.remove("tour-highlight");
      };
    }
  }, [stepIndex, started]);

  if (!visible) return null;

  // 👉 BEFORE START SCREEN
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

  // 👉 MAIN TOUR
  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      localStorage.setItem("seenTour", true);
      setVisible(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("seenTour", true);
    setVisible(false);
  };

  return (
    <div className="tour-overlay">
      <div className="tour-box">
        <p>{steps[stepIndex].text}</p>

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
