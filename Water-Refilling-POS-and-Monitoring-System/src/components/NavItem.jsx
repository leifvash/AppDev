import React from 'react';
import '../styles/components/NavItem.css';

const NavItem = ({
  icon,
  label,
  isActive = false,
  onClick,
  badge = null
}) => {
  return (
    <button
      className={`nav-item ${isActive ? 'nav-item--active' : ''}`}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className="nav-item__icon">{icon}</span>
      <span className="nav-item__label">{label}</span>
      {badge && <span className="nav-item__badge">{badge}</span>}
    </button>
  );
};

export default NavItem;
