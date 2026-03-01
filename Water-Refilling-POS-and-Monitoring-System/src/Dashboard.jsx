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
import ProductGrid from './components/ProductGrid';
import OrderSummary from './components/OrderSummary';
import PaymentSummaryNew from './components/PaymentSummaryNew';
import CheckoutForm from './components/CheckoutForm';
import OrderSuccessModal from './components/OrderSuccessModal';
import DayTransactionList from './components/DayTransactionList';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(null);
  const [completedOrders, setCompletedOrders] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleAddItem = (item) => {
    setCartItems(prev => [...prev, item]);
  };

  const handleRemoveItem = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity, subtotal: item.price * newQuantity }
          : item
      )
    );
  };

  const calculateCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.subtotal || item.price), 0);
  };

  const handleAddProduct = (product) => {
    const cartItem = {
      id: Date.now(),
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      subtotal: product.price
    };
    handleAddItem(cartItem);
  };

  const handleCheckout = (order) => {
    // Add to completed orders
    setCompletedOrders(prev => [order, ...prev]);
    // Show success modal
    setShowSuccess(order);
    // Close checkout form
    setShowCheckout(false);
    // Clear cart
    setCartItems([]);
  };

  const handleSuccessClose = () => {
    // Close success modal and redirect to cashier
    setShowSuccess(null);
    setActiveTab('cashier');
  };

  const handleDeleteOrder = (orderId) => {
    setCompletedOrders(prev => prev.filter(order => order.id !== orderId));
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
              <div className="cashier-layout">
                <div className="cashier-left">
                  <ProductGrid onAddProduct={handleAddProduct} />
                </div>
                <div className="cashier-right">
                  <OrderSummary
                    items={cartItems}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                  />
                  <PaymentSummaryNew
                    items={cartItems}
                    onPayNow={(totals) => setShowCheckout(true)}
                    isDisabled={cartItems.length === 0}
                  />
                </div>
              </div>

              {showCheckout && (
                <CheckoutForm
                  cartItems={cartItems}
                  totalAmount={calculateCartTotal()}
                  onCheckout={handleCheckout}
                  onClose={() => setShowCheckout(false)}
                />
              )}
              {showSuccess && (
                <OrderSuccessModal
                  order={showSuccess}
                  onClose={handleSuccessClose}
                />
              )}
              <DayTransactionList orders={completedOrders} onDeleteOrder={handleDeleteOrder} />
            </div>
          )}

          {activeTab === 'inventory' && (
            <EmptyState
              title="Inventory Section"
              message="There is no content available for this section yet."
            />
          )}

          {activeTab === 'history' && (
            <div className="order-history-section">
              <DayTransactionList orders={completedOrders} onDeleteOrder={handleDeleteOrder} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;