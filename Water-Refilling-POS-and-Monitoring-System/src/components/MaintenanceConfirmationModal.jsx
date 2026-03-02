import React, { useState } from 'react';
import '../styles/components/MaintenanceConfirmationModal.css';
import { CheckCircle } from 'lucide-react';
import Button from './Button';

const MaintenanceConfirmationModal = ({ onConfirm, onCancel }) => {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleYes = () => {
    setIsCompleted(true);
    // Auto-redirect after 2 seconds
    setTimeout(() => {
      onConfirm();
    }, 2000);
  };

  if (isCompleted) {
    return (
      <div className="confirmation-overlay">
        <div className="confirmation-modal confirmation-modal--completed">
          <div className="completed-content">
            <div className="completed-icon">
              <CheckCircle size={80} />
            </div>
            <h2 className="completed-title">Maintenance Completed!</h2>
            <p className="completed-message">The system has been reset to full capacity.</p>
            <p className="auto-redirect-text">Redirecting to dashboard in 2 seconds...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="confirmation-overlay">
      <div className="confirmation-modal">
        <div className="confirmation-header">
          <h2 className="confirmation-title">Confirm Maintenance</h2>
        </div>

        <div className="confirmation-content">
          <p className="confirmation-message">Are you sure you want to mark maintenance as completed?</p>
          <p className="confirmation-subtitle">This will reset the system to full capacity (250L/250L).</p>
        </div>

        <div className="confirmation-actions">
          <Button
            variant="primary"
            size="medium"
            onClick={handleYes}
          >
            Yes, Complete
          </Button>
          <Button
            variant="secondary"
            size="medium"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceConfirmationModal;
