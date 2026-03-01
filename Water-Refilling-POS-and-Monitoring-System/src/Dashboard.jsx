import React, { useState } from 'react';
import { LayoutDashboard, ClipboardList, History, LogOut, AlertTriangle, BarChart2 } from 'lucide-react';
import './styles/Dashboard.css';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import Button from './components/Button';
import ProgressBar from './components/ProgressBar';
import EmptyState from './components/EmptyState';
import CashierForm from './components/CashierForm';
import OrderReceipt from './components/OrderReceipt';
import DayTransactionList from './components/DayTransactionList';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [cashierOrders, setCashierOrders] = useState([]);
  const [showReceipt, setShowReceipt] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleOrderSubmit = (order) => {
    // Add order to cashier orders
    setCashierOrders(prev => [order, ...prev]);
    // Show receipt
    setShowReceipt(order);
  };

  const handleDeleteOrder = (orderId) => {
    setCashierOrders(prev => prev.filter(order => order.id !== orderId));
  };

  // Navigation items configuration
  const navItems = [
    { id: 'dashboard', icon: <BarChart2 size={24} />, label: 'Dashboard' },
    { id: 'cashier', icon: <LayoutDashboard size={24} />, label: 'Cashier' },
    { id: 'inventory', icon: <ClipboardList size={24} />, label: 'Inventory' },
    { id: 'history', icon: <History size={24} />, label: 'Order History' },
  ];

  // Logout button component
  const logoutBtn = (
    <Button
      variant="danger"
      size="medium"
      icon={<LogOut size={18} />}
      onClick={handleLogout}
    >
      Logout
    </Button>
  );

  return (
    <div className="dashboard-page">
      <Header title="Water Refilling POS" />
      <div className="dashboard-container">
        <Sidebar
          navItems={navItems}
          activeTab={activeTab}
          onNavChange={setActiveTab}
          logoutButton={logoutBtn}
          isCollapsed={sidebarCollapsed}
          onToggleSidebar={toggleSidebar}
        />

        <main className="main-content">
          {activeTab === 'dashboard' && (
            <section className="stats-grid">
              <StatCard
                title="Today's Sales"
                value="P 25,000.00"
              />

              <StatCard
                title="Gallons Refilled"
                value="15,000 Gallons"
                isBluHighlight={true}
              />

              <StatCard
                title="Deliveries Completed"
                value="200"
                isBluHighlight={true}
              >
                <ProgressBar
                  percentage={75}
                  label="75% of Goal"
                />
              </StatCard>

              <StatCard
                title="Maintenance Status"
                value="100L / 250L"
              >
                <Button
                  variant="danger"
                  size="medium"
                  icon={<AlertTriangle size={16} />}
                  className="btn--pulse"
                >
                  Action Required!
                </Button>
              </StatCard>
            </section>
          )}

          {activeTab === 'cashier' && (
            <div className="cashier-section">
              <CashierForm onOrderSubmit={handleOrderSubmit} />
              <DayTransactionList orders={cashierOrders} onDeleteOrder={handleDeleteOrder} />
              {showReceipt && (
                <OrderReceipt
                  orderData={showReceipt}
                  onClose={() => setShowReceipt(null)}
                />
              )}
            </div>
          )}

          {activeTab === 'inventory' && (
            <EmptyState
              title="Inventory Section"
              message="There is no content available for this section yet."
            />
          )}

          {activeTab === 'history' && (
            <EmptyState
              title="Order History"
              message="There is no content available for this section yet."
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;