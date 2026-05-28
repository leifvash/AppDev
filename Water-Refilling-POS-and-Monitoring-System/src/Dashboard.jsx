import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ClipboardList, History, LogOut, AlertTriangle, BarChart2 } from 'lucide-react';
import './styles/Dashboard.css';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import Button from './components/Button';
import ProgressBar from './components/ProgressBar';
import ProductGrid from './components/ProductGrid';
import OrderSummary from './components/OrderSummary';
import PaymentSummaryNew from './components/PaymentSummaryNew';
import CheckoutForm from './components/CheckoutForm';
import OrderSuccessModal from './components/OrderSuccessModal';
import DayTransactionList from './components/DayTransactionList';
import HealthBar from './components/HealthBar';
import MaintenanceConfirmationModal from './components/MaintenanceConfirmationModal';
import InventoryView from './components/InventoryView';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API_URL = import.meta.env.VITE_API_URL;
const WS_URL = import.meta.env.VITE_WS_URL;

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(null);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [todayTransactions, setTodayTransactions] = useState([]);
  const [transactionGoal] = useState(50);
  const [showMaintenanceConfirm, setShowMaintenanceConfirm] = useState(false);
  const [predictions, setPredictions] = useState([]);

  // ── Maintenance state (API-driven) ──────────────────────────────────
  const [maintenanceLiters, setMaintenanceLiters] = useState(0);
  const [maintenanceCapacity, setMaintenanceCapacity] = useState(2650);
  const [maintenanceId, setMaintenanceId] = useState(null);

  // ── Inventory / Products ────────────────────────────────────────────────
  const [inventory, setInventory] = useState({});
  const [products, setProducts] = useState([]);

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return null;

    const response = await fetch(`${API_URL}/api/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken })
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('accessToken', data.access);
      return data.access;
    } else {
      console.error('Failed to refresh token');
      return null;
    }
  };
  const fetchMaintenance = async () => {
    try {
      const response = await fetch(`${API_URL}/api/maintenance/`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setMaintenanceId(data[0].id);
          setMaintenanceLiters(data[0].liters_since_last_service);
          setMaintenanceCapacity(data[0].capacity);
        }
      }
    } catch (error) {
      console.error('Error fetching maintenance:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products/`);
      if (response.ok) {
        const data = await response.json();
        const sortedProducts = data.sort((a, b) => a.id - b.id);
        setProducts(sortedProducts);
        const inv = {};
        sortedProducts.forEach(prod => { inv[prod.id] = prod.stock; });
        setInventory(inv);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async (date = null) => {
    try {
      let url = `${API_URL}/api/orders/`;
      if (date) {
        const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD
        url += `?date=${formattedDate}`;
      }
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const sortedData = data.sort((a, b) => Number(b.id) - Number(a.id));
        setCompletedOrders(sortedData);
      }
    } catch (error) {
      console.error("Error fetching orders: ", error);
    }
  };

  const fetchPredictions = async () => {
    try {
      let token = localStorage.getItem('accessToken');
      let response = await fetch(`${API_URL}/api/predictions/`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!token) {
        console.warn('No access token, skipping predictions');
        return; // ← add this
      }

      // If token expired, refresh and retry
      if (response.status === 401) {
        token = await refreshAccessToken();
        if (token) {
          response = await fetch(`${API_URL}/api/predictions/`, {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        }
      }

      if (response.ok) {
        const data = await response.json();
        setPredictions(data.predictions);
      } else {
        console.error('Prediction fetch failed:', response.status);
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchMaintenance(); // ← FIX 2: load on mount
    fetchPredictions(); // ← FIX 3: load predictions on mount

    const interval = setInterval(() => {
      fetchProducts();
      fetchOrders();
    }, 5000);

    // ── WebSocket ────────────────────────────────────────────────
    const ws = new WebSocket(`${WS_URL}/ws/dashboard/`);

    ws.onopen = () => console.log('WebSocket connected');

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.event === 'new_order') {
        fetchProducts();
        fetchOrders();
        fetchMaintenance();
      }
    };

    ws.onclose = () => console.log('WebSocket disconnected');

    

    // ── Cleanup: close WS and stop polling when component unmounts
    return () => {
      ws.close();
      clearInterval(interval);
    };
    
  }, []);

  const navigate = useNavigate();

  const calculateTodayStats = () => {
    const today = new Date().toLocaleDateString();
    const todayOrders = completedOrders.filter(order => order.date === today);
    const totalSales = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalLiters = todayOrders.reduce((sum, order) => {
      return sum + (order.items || []).reduce((itemSum, item) => {
        const match = item.name.match(/(\d+)\s*(?:Liter|L)/i);
        return itemSum + ((match ? parseInt(match[1]) : 0) * item.quantity);
      }, 0);
    }, 0);
    return { totalSales, totalLiters, transactionCount: todayOrders.length };
  };

  const getMaintenanceStatus = () => {
    const remainingLiters = maintenanceCapacity - maintenanceLiters;
    const healthPercentage = (remainingLiters / maintenanceCapacity) * 100;
    if (healthPercentage < 25) {
      return { status: 'critical', message: 'Warning: production should halt. Maintenance must be executed as soon as possible', buttonText: 'Fix', healthPercentage };
    } else if (healthPercentage < 50) {
      return { status: 'alert', message: 'You are almost at the maintenance pace. Please prepare your necessary tools and filters', buttonText: 'Fix', healthPercentage };
    }
    return { status: 'good', message: 'You are good', buttonText: 'Fix', healthPercentage };
  };

  const stats = calculateTodayStats();
  const maintenanceStatus = getMaintenanceStatus();

  const handleMaintenanceFix = () => setShowMaintenanceConfirm(true);

  // ── FIX 2: Confirm calls the reset endpoint instead of local setState ───
  const handleMaintenanceConfirm = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/maintenance/${maintenanceId}/reset/`,
        { method: 'POST' }
      );
      if (response.ok) {
        setMaintenanceLiters(0);
      }
    } catch (error) {
      console.error('Error resetting maintenance:', error);
    }
    setShowMaintenanceConfirm(false);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate('/');
  };

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
  const handleAddItem = (item) => setCartItems(prev => [...prev, item]);
  const handleRemoveItem = (itemId) => setCartItems(prev => prev.filter(item => item.id !== itemId));
  const calculateCartTotal = () => cartItems.reduce((sum, item) => sum + (item.subtotal || item.price), 0);

  const getAvailableStock = (productId) => {
    const totalInventory = inventory[productId] || 0;
    const inCart = cartItems
      .filter(item => item.productId === productId)
      .reduce((sum, item) => sum + item.quantity, 0);
    return Math.max(0, totalInventory - inCart);
  };

  const handleAddProduct = (product) => {
    if (getAvailableStock(product.id) <= 0) return;
    handleAddItem({
      id: Date.now(),
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      subtotal: product.price,
      liters: product.liters || 0, // pass liters per unit for maintenance tally
    });
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    const item = cartItems.find(i => i.id === itemId);
    if (!item) return;
    if (newQuantity > getAvailableStock(item.productId) + item.quantity) return;
    setCartItems(prev =>
      prev.map(i => i.id === itemId ? { ...i, quantity: newQuantity, subtotal: i.price * newQuantity } : i)
    );
  };

  // ── FIX 1: No more manual stock deduction — backend handles it via OrderSerializer ──
  const handleCheckout = async (order) => {
    let savedOrder = order;
    try {
      const response = await fetch(`${API_URL}/api/orders/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...order, isCompleted: false }),
      });
      if (response.ok) {
        savedOrder = await response.json();
        // Re-fetch products so UI stock reflects what the backend actually set
        await fetchProducts();
        // Re-fetch maintenance so liters_since_last_service is up to date
        await fetchMaintenance();
      } else {
        console.error('Failed to save order to backend');
      }
    } catch (error) {
      console.error('Error saving order:', error);
    }

    setCompletedOrders(prev => [savedOrder, ...prev]);
    setTodayTransactions(prev => [savedOrder, ...prev]);
    setShowSuccess(savedOrder);
    setShowCheckout(false);
    setCartItems([]);
    setRefreshCashier(prev => !prev); // toggle to trigger refetch
  };

  const handleSuccessClose = () => {
    setShowSuccess(null);
    setActiveTab('cashier');
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}/`, { method: 'DELETE' });
      if (response.ok) setCompletedOrders(prev => prev.filter(order => order.id !== orderId));
    } catch (error) {
      console.error('Error deleting order:', error);
      setCompletedOrders(prev => prev.filter(order => order.id !== orderId));
    }
  };

  const handleDeleteTodayTransaction = async (orderId) => {
    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: true }),
      });
      if (response.ok) {
        setTodayTransactions(prev => prev.filter(t => t.id !== orderId));
        setCompletedOrders(prev => prev.map(o => o.id === orderId ? { ...o, isCompleted: true } : o));
      }
    } catch (error) {
      console.error('Error completing transaction:', error);
      setTodayTransactions(prev => prev.filter(t => t.id !== orderId));
    }
  };

  const navItems = [
    { id: 'dashboard', icon: <BarChart2 size={24} />, label: 'Dashboard' },
    { id: 'cashier', icon: <LayoutDashboard size={24} />, label: 'Cashier' },
    { id: 'inventory', icon: <ClipboardList size={24} />, label: 'Inventory' },
    { id: 'history', icon: <History size={24} />, label: 'Order History' },
  ];

  const logoutBtn = (
    <Button variant="danger" size="medium" icon={<LogOut size={18} />} onClick={handleLogout}>
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
            <div className="dashboard-tab">
              <section className="stats-grid">
                <StatCard
                  title="Today's Sales"
                  value={`P ${stats.totalSales.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`}
                />
                <StatCard title="Liters Refilled" value={`${stats.totalLiters} Liters`} isBluHighlight={true} />
                <StatCard title="Deliveries Completed" value={stats.transactionCount} isBluHighlight={true}>
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

              {/* ── 7-Day Sales Forecast ─────────────────────────────── */}
              {predictions.length > 0 && (
                <section className="predictions-section">
                  <h2 className="predictions-title">
                    <BarChart2 size={20} /> 7-Day Sales Forecast
                  </h2>
                  <div className="predictions-grid">
                    {predictions.map((p, i) => (
                      <div key={i} className="prediction-card">
                        <span className="prediction-day">{p.day.slice(0, 3)}</span>
                        <span className="prediction-date">{p.date}</span>
                        <div
                          className="prediction-bar"
                          style={{
                            height: `${Math.round((p.predicted_revenue / Math.max(...predictions.map(x => x.predicted_revenue))) * 100)}px`
                          }}
                        />
                        <span className="prediction-amount">₱{p.predicted_revenue.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {activeTab === 'cashier' && (
            <div className="cashier-section">
              <div className="cashier-layout">
                <div className="cashier-left">
                  <ProductGrid
                    products={products}
                    onAddProduct={handleAddProduct}
                    inventory={inventory}
                    cartItems={cartItems}
                  />
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
                  <OrderSuccessModal order={showSuccess} onClose={handleSuccessClose} />
                )}
                <DayTransactionList
                  orders={todayTransactions}
                  onDeleteOrder={handleDeleteTodayTransaction}
                  mode="cashier"
                />
              </div>
            )}

          {activeTab === 'inventory' && (
            <InventoryView products={products} inventory={inventory} />
          )}

          {activeTab === 'history' && (
            <div className="order-history-section">
              <DayTransactionList
                orders={completedOrders}
                onDeleteOrder={handleDeleteOrder}
                mode="history"
              />
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