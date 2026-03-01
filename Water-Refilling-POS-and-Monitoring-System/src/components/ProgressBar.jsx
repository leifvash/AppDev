import React from 'react';
import '../styles/components/ProgressBar.css';

const ProgressBar = ({
  percentage = 0,
  label = null,
  height = 'normal'
}) => {
  const validPercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="progress-container">
      <div className={`progress-bar progress-bar--${height}`}>
        <div
          className="progress-bar__fill"
          style={{ width: `${validPercentage}%` }}
        />
      </div>
      {label && <span className="progress-label">{label}</span>}
    </div>
  );
};

export default ProgressBar;
