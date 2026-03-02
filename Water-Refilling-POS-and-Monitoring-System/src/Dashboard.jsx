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
import HealthBar from './components/HealthBar';
import MaintenanceConfirmationModal from './components/MaintenanceConfirmationModal';
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(null);
  const [completedOrders, setCompletedOrders] = useState([]); // Permanent order history
  const [todayTransactions, setTodayTransactions] = useState([]); // Deletable today's transactions
  const [maintenanceLiters, setMaintenanceLiters] = useState(0);
  const [maintenanceCapacity] = useState(250);
  const [transactionGoal] = useState(50);
  const [showMaintenanceConfirm, setShowMaintenanceConfirm] = useState(false);
  const navigate = useNavigate();
  // Extract liters from product name
  const extractLitersFromProduct = (productName) => {
    const match = productName.match(/(\d+)\s*(?:Liter|L)/i);
    return match ? parseInt(match[1]) : 0;
  };
  // Calculate today's stats
  const calculateTodayStats = () => {
    const today = new Date().toLocaleDateString();
    const todayOrders = completedOrders.filter(order => order.date === today);
    const totalSales = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalLiters = todayOrders.reduce((sum, order) => {
      const orderLiters = (order.items || []).reduce((itemSum, item) => {
        return itemSum + (extractLitersFromProduct(item.name) * item.quantity);
      }, 0);
      return sum + orderLiters;
    }, 0);
    return {
      totalSales,
      totalLiters,
      transactionCount: todayOrders.length,
    };
  };
  // Get maintenance alert status based on health (remaining capacity)
  const getMaintenanceStatus = () => {
    const remainingLiters = maintenanceCapacity - maintenanceLiters;
    const healthPercentage = (remainingLiters / maintenanceCapacity) * 100;
    if (healthPercentage < 25) {
      return {
        status: 'critical',
        message: 'Warning: production should halt. Maintenance must be executed as soon as possible',
        buttonText: 'Fix',
        healthPercentage,
      };
    } else if (healthPercentage >= 25 && healthPercentage < 50) {
      return {
        status: 'alert',
        message: 'You are almost at the maintenance pace. Please prepare your necessary tools and filters',
        buttonText: 'Fix',
        healthPercentage,
      };
    } else {
      return {
        status: 'good',
        message: 'You are good',
        buttonText: 'Fix',
        healthPercentage,
      };
    }
  };
  // ✅ FIX 1 & 2: Call the functions and store results in variables
  const stats = calculateTodayStats();
  const maintenanceStatus = getMaintenanceStatus();
  // Handle maintenance fix
  const handleMaintenanceFix = () => {
    setShowMaintenanceConfirm(true);
  };
  // Handle maintenance confirmation
  const handleMaintenanceConfirm = () => {
    setMaintenanceLiters(0);
    setShowMaintenanceConfirm(false);
    setActiveTab('dashboard');
  };
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
      subtotal: product.price,
    };
    handleAddItem(cartItem);
  };
  const handleCheckout = (order) => {
    setCompletedOrders(prev => [order, ...prev]); // Add to permanent history
    setTodayTransactions(prev => [order, ...prev]); // Add to today's deletable transactions
    const orderLiters = (order.items || []).reduce((sum, item) => {
      return sum + (extractLitersFromProduct(item.name) * item.quantity);
    }, 0);
    setMaintenanceLiters(prev => prev + orderLiters);
    setShowSuccess(order);
    setShowCheckout(false);
    setCartItems([]);
  };
  const handleSuccessClose = () => {
    setShowSuccess(null);
    setActiveTab('cashier');
  };
  const handleDeleteOrder = (orderId) => {
    setCompletedOrders(prev => prev.filter(order => order.id !== orderId));
  };
  const handleDeleteTodayTransaction = (orderId) => {
    setTodayTransactions(prev => prev.filter(transaction => transaction.id !== orderId));
  };
  const navItems = [
    { id: 'dashboard', icon: <BarChart2 size={24} />, label: 'Dashboard' },
    { id: 'cashier', icon: <LayoutDashboard size={24} />, label: 'Cashier' },
    { id: 'inventory', icon: <ClipboardList size={24} />, label: 'Inventory' },
    { id: 'history', icon: <History size={24} />, label: 'Order History' },
  ];
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
                value={`P ${stats.totalSales.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`}
              />
              <StatCard
                title="Liters Refilled"
                value={`${stats.totalLiters} Liters`}
                isBluHighlight={true}
              />
              <StatCard
                title="Deliveries Completed"
                value={stats.transactionCount}
                isBluHighlight={true}
              >
                <ProgressBar
                  percentage={Math.min((stats.transactionCount / transactionGoal) * 100, 100)}
                  label={`${Math.min(Math.round((stats.transactionCount / transactionGoal) * 100), 100)}% of Goal`}
                />
              </StatCard>
              <StatCard
                title="Maintenance Status"
                value={`${maintenanceCapacity - maintenanceLiters}L / ${maintenanceCapacity}L`}
              >
                <div className="maintenance-info">
                  <p className={`maintenance-message maintenance-message--${maintenanceStatus.status}`}>
                    {maintenanceStatus.message}
                  </p>
                  <HealthBar percentage={maintenanceStatus.healthPercentage} showLabel={true} />
                  <Button
                    variant={maintenanceStatus.status === 'critical' ? 'danger' : 'secondary'}
                    size="medium"
                    icon={maintenanceStatus.status === 'critical' ? <AlertTriangle size={16} /> : undefined}
                    onClick={handleMaintenanceFix}
                    className={maintenanceStatus.status === 'critical' ? 'btn--pulse' : ''}
                  >
                    {maintenanceStatus.buttonText}
                  </Button>
                </div>
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
                    onPayNow={() => setShowCheckout(true)}
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
              <DayTransactionList orders={todayTransactions} onDeleteOrder={handleDeleteTodayTransaction} />
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
              <DayTransactionList orders={completedOrders} onDeleteOrder={handleDeleteOrder} canDelete={false} />
            </div>
          )}
          {showMaintenanceConfirm && (
            <MaintenanceConfirmationModal
              onConfirm={handleMaintenanceConfirm}
              onCancel={() => setShowMaintenanceConfirm(false)}
            />
          )}
        </main>
      </div>
    </div>
  );
};
export default Dashboard;