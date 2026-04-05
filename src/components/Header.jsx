import { useState } from "react";
import { useApp } from "../context/AppContext";

const Header = () => {
  const {
    role,
    setRole,
    setMonthFilter,
    availableMonths,
    setStartDate,
    setEndDate,
  } = useApp();

  const [rangeType, setRangeType] = useState("all");

  const handleChange = (e) => {
    const value = e.target.value;
    setRangeType(value);

    if (value === "all") {
      setMonthFilter("all");
    }

    if (value === "current") {
      const now = new Date();
      setMonthFilter({
        year: now.getFullYear(),
        month: now.getMonth(),
      });
    }

    if (value === "last") {
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);

      setMonthFilter({
        year: lastMonth.getFullYear(),
        month: lastMonth.getMonth(),
      });
    }

    if (value.includes("-")) {
      const [year, month] = value.split("-");
      setMonthFilter({
        year: Number(year),
        month: Number(month),
      });
    }
  };

  // ✅ FIXED START TOUR (NO DOM, NO RELOAD)
  const handleStartTour = () => {
    if (role === "admin") {
      localStorage.removeItem("seenAdminTour");
    } else {
      localStorage.removeItem("seenViewerTour");
    }

    window.dispatchEvent(new Event("start-tour"));
  };

  return (
    <div className="header">
      <h1 className="title">Finance Dashboard</h1>

      <div className="header-right">
        {/* ✅ START TOUR BUTTON */}
        <button className="btn" onClick={handleStartTour}>
          Start Tour
        </button>

        {/* 🔽 FILTER */}
        <div className="tour-filter">
          <div className="filter-group">
            <label className="filter-label">Filter</label>
            <select onChange={handleChange} className="select">
              <option value="all">All Time</option>
              <option value="current">This Month</option>
              <option value="last">Last Month</option>
              <option value="custom">Custom Range</option>

              {availableMonths?.map((m, index) => (
                <option key={index} value={`${m.year}-${m.month}`}>
                  {new Date(m.year, m.month).toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 📅 CUSTOM RANGE */}
        {rangeType === "custom" && (
          <div className="date-range">
            <div className="date-field">
              <label>Start Date</label>
              <input
                type="date"
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="date-field">
              <label>End Date</label>
              <input type="date" onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
        )}

        {/* 👤 ROLE */}
        <div className="filter-group">
          <label className="filter-label">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="select"
          >
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Header;
