import React from 'react';
import '../styles/components/EmptyState.css';

const EmptyState = ({
  title = 'No Content',
  message = 'There is no content available for this section yet.',
  icon = null,
  action = null
}) => {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state__icon">{icon}</div>}
      <h2 className="empty-state__title">{title}</h2>
      <p className="empty-state__message">{message}</p>
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
};

export default EmptyState;
