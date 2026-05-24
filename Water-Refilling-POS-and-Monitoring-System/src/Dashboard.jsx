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

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(null);
  const [completedOrders, setCompletedOrders] = useState([]); // Permanent order history
  const [todayTransactions, setTodayTransactions] = useState([]); // Deletable today's transactions
  const [maintenanceLiters, setMaintenanceLiters] = useState(0);
  const [maintenanceCapacity] = useState(2650);
  const [transactionGoal] = useState(50);
  const [showMaintenanceConfirm, setShowMaintenanceConfirm] = useState(false);
  
  // Inventory and Products state
  const [inventory, setInventory] = useState({});
  const [products, setProducts] = useState([]);

  const fetchInventory = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/inventory/');
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          const inv = data[0];
          setInventory({
            1: inv.product_1,
            2: inv.product_2,
            3: inv.product_3,
            4: inv.product_4,
            5: inv.product_5,
            6: inv.product_6,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const updateInventory = async (newInventory) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/inventory/1/', { // Assuming id=1
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_1: newInventory[1],
          product_2: newInventory[2],
          product_3: newInventory[3],
          product_4: newInventory[4],
          product_5: newInventory[5],
          product_6: newInventory[6],
        }),
      });
      if (response.ok) {
        setInventory(newInventory);
      }
    } catch (error) {
      console.error('Error updating inventory:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/products/');
      if (response.ok) {
        const data = await response.json();
        const sortedProducts = data.sort((a, b) => a.id - b.id);
        setProducts(sortedProducts);
        
        // Keep inventory in sync
        const inv = {};
        sortedProducts.forEach(prod => {
          inv[prod.id] = prod.stock;
        });
        setInventory(inv);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/orders/');
      if (response.ok) {
        const data = await response.json();
        // Sort descending by id so newest order is first
        const sortedData = data.sort((a, b) => {
          return Number(b.id) - Number(a.id);
        });
        setCompletedOrders(sortedData);
        
        // Filter for active (not completed yet) transactions for today
        const today = new Date().toLocaleDateString();
        const activeToday = sortedData.filter(order => order.date === today && !order.isCompleted);
        setTodayTransactions(activeToday);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    const interval = setInterval(() => {
      fetchProducts();
      fetchOrders();
    }, 5000); // Poll products and orders every 5 seconds
    return () => clearInterval(interval);
  }, []);

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

  const calculateCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.subtotal || item.price), 0);
  };

  // Calculate available stock (inventory minus what's in cart)
  const getAvailableStock = (productId) => {
    const totalInventory = inventory[productId] || 0;
    const inCart = cartItems
      .filter(item => item.productId === productId)
      .reduce((sum, item) => sum + item.quantity, 0);
    return Math.max(0, totalInventory - inCart);
  };

  const handleAddProduct = (product) => {
    const availableStock = getAvailableStock(product.id);
    if (availableStock <= 0) {
      return; // Don't add if no available stock
    }
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

  const handleUpdateQuantity = (itemId, newQuantity) => {
    const item = cartItems.find(i => i.id === itemId);
    if (!item) return;
    
    const availableStock = getAvailableStock(item.productId);
    if (newQuantity > availableStock + item.quantity) {
      // Can't exceed available stock
      return;
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity, subtotal: item.price * newQuantity }
          : item
      )
    );
  };

  // Update inventory after checkout
  const updateInventoryAfterCheckout = async (items) => {
    // 1. Update legacy Inventory table
    const newInventory = { ...inventory };
    items.forEach(item => {
      const productId = item.productId;
      if (newInventory[productId] !== undefined) {
        newInventory[productId] = Math.max(0, newInventory[productId] - item.quantity);
      }
    });
    await updateInventory(newInventory);

    // 2. Update new dynamic Product table
    for (const item of items) {
      const productId = item.productId;
      const currentStock = inventory[productId] || 0;
      const newStock = Math.max(0, currentStock - item.quantity);
      
      try {
        await fetch(`http://127.0.0.1:8000/api/products/${productId}/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ stock: newStock }),
        });
      } catch (error) {
        console.error(`Error updating product ${productId} stock:`, error);
      }
    }
    
    // Refresh products
    fetchProducts();
  };

  const handleCheckout = async (order) => {
    // Update inventory before completing order
    updateInventoryAfterCheckout(order.items);
    
    let savedOrder = order;
    try {
      const response = await fetch('http://127.0.0.1:8000/api/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...order,
          isCompleted: false,
        }),
      });
      if (response.ok) {
        savedOrder = await response.json();
      } else {
        console.error('Failed to save order to backend');
      }
    } catch (error) {
      console.error('Error saving order:', error);
    }
    
    setCompletedOrders(prev => [savedOrder, ...prev]); // Add to permanent history
    setTodayTransactions(prev => [savedOrder, ...prev]); // Add to today's deletable transactions
    
    const orderLiters = (order.items || []).reduce((sum, item) => {
      return sum + (extractLitersFromProduct(item.name) * item.quantity);
    }, 0);
    setMaintenanceLiters(prev => prev + orderLiters);
    
    setShowSuccess(savedOrder);
    setShowCheckout(false);
    setCartItems([]);
  };

  const handleSuccessClose = () => {
    setShowSuccess(null);
    setActiveTab('cashier');
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/orders/${orderId}/`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setCompletedOrders(prev => prev.filter(order => order.id !== orderId));
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      setCompletedOrders(prev => prev.filter(order => order.id !== orderId));
    }
  };

  const handleDeleteTodayTransaction = async (orderId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/orders/${orderId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isCompleted: true }),
      });
      if (response.ok) {
        setTodayTransactions(prev => prev.filter(transaction => transaction.id !== orderId));
        setCompletedOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, isCompleted: true } : order
        ));
      }
    } catch (error) {
      console.error('Error completing transaction:', error);
      setTodayTransactions(prev => prev.filter(transaction => transaction.id !== orderId));
    }
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
                <OrderSuccessModal
                  order={showSuccess}
                  onClose={handleSuccessClose}
                />
              )}
              <DayTransactionList orders={todayTransactions} onDeleteOrder={handleDeleteTodayTransaction} />
            </div>
          )}

          {activeTab === 'inventory' && (
            <InventoryView products={products} inventory={inventory} />
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

