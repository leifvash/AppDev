import React from 'react';
import '../styles/components/StatusIndicator.css';

const StatusIndicator = ({
  status = 'default',
  text,
  icon = null
}) => {
  return (
    <div className={`status-indicator status-indicator--${status}`}>
      {icon && <span className="status-indicator__icon">{icon}</span>}
      <span className="status-indicator__text">{text}</span>
    </div>
  );
};

export default StatusIndicator;
