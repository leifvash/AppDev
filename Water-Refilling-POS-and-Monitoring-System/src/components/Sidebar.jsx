import React from 'react';
import '../styles/components/Sidebar.css';
import NavItem from './NavItem';

const Sidebar = ({
  navItems,
  activeTab,
  onNavChange,
  logoutButton,
  isCollapsed = false,
  onToggleSidebar = null
}) => {
  return (
    <aside className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : ''}`}>
      {onToggleSidebar && (
        <button className="sidebar__toggle" onClick={onToggleSidebar}>
          ☰
        </button>
      )}

      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeTab === item.id}
            onClick={() => onNavChange(item.id)}
            badge={item.badge}
          />
        ))}
      </nav>

      <div className="sidebar__footer">
        {logoutButton}
      </div>
    </aside>
  );
};

export default Sidebar;
