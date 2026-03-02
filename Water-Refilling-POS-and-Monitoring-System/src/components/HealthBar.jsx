import React from 'react';
import '../styles/components/HealthBar.css';

const HealthBar = ({ percentage, showLabel = true }) => {
  const getHealthStatus = (pct) => {
    if (pct >= 50) return 'good';
    if (pct >= 25) return 'warning';
    return 'critical';
  };

  const status = getHealthStatus(percentage);

  return (
    <div className="health-bar-container">
      <div className={`health-bar health-bar--${status}`}>
        <div
          className="health-bar__fill"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {showLabel && (
        <span className={`health-bar__label health-bar__label--${status}`}>
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
};

export default HealthBar;
