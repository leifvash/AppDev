import React from 'react';
import '../styles/components/StatCard.css';

const StatCard = ({
  title,
  value,
  subtitle = null,
  isBluHighlight = false,
  children = null
}) => {
  return (
    <div className="stat-card">
      <h3 className="stat-card__title">{title}</h3>
      <p className={`stat-card__value ${isBluHighlight ? 'stat-card__value--highlight' : ''}`}>
        {value}
      </p>
      {subtitle && <p className="stat-card__subtitle">{subtitle}</p>}
      {children && <div className="stat-card__content">{children}</div>}
    </div>
  );
};

export default StatCard;
