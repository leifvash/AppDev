import React, { useState } from 'react';
import { LayoutDashboard, ClipboardList, History, LogOut, AlertTriangle, BarChart2 } from 'lucide-react';
import './styles/Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('history');

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h1 className="brand-title">Water Refilling POS</h1>
        
        <nav className="nav-menu">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <BarChart2 size={24} />
            Dashboard
          </button>

          <button 
            className={`nav-item ${activeTab === 'cashier' ? 'active' : ''}`}
            onClick={() => setActiveTab('cashier')}
          >
            <LayoutDashboard size={24} />
            Cashier
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            <ClipboardList size={24} />
            Inventory
          </button>

          <button 
            className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <History size={24} />
            Order History
          </button>
          
        </nav>

        <button className="logout-btn">
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <main className="main-content">
        <header className="header">
          Friday, February 14, 2026 - 11:59 PM
        </header>

        {activeTab === 'dashboard' && (
          <section className="stats-grid">
            <div className="stat-card">
              <h3>Today's Sales</h3>
              <p className="stat-value">P 25,000.00</p>
            </div>
            
            <div className="stat-card">
              <h3>Gallons Refilled</h3>
              <p className="stat-value highlight-blue">15,000 Gallons</p>
            </div>

            <div className="stat-card space-between">
              <h3>Deliveries Completed</h3>
              <p className="stat-value big-text highlight-blue">200</p>
              <div className="progress-container">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '75%' }}></div>
                </div>
                <span>75% of Goal</span>
              </div>
            </div>
            
            <div className="stat-card space-between">
              <h3>Maintenance Status</h3>
              <p className="maintenance-text">100L / 250L</p>
              <button className="action-btn animate-pulse">
                <AlertTriangle size={16} />
                Action Required!
              </button>
            </div>
          </section>
        )}

        {activeTab === 'cashier' && (
          <div className="empty-view">
            <h2>Cashier Section</h2>
            <p>There is no content available for this section yet.</p>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="empty-view">
            <h2>Inventory Section</h2>
            <p>There is no content available for this section yet.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;