import React, { useState, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/components/DayTransactionList.css';
import Button from './Button';
import { Check } from 'lucide-react';
import OrderDetailsModal from './OrderDetailsModal';

const DayTransactionList = ({ mode = "cashier", orders = [], onDeleteOrder }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [transactionToConfirm, setTransactionToConfirm] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Totals
  const totals = useMemo(() => ({
    totalSales: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
    totalOrders: orders.length,
    totalDeliveries: orders.filter(o => o.orderType === 'delivery').length,
    totalWalkIns: orders.filter(o => o.orderType === 'walk-in').length
  }), [orders]);

  const getProductsDisplay = (items) =>
    !items || items.length === 0 ? 'N/A' : items.map(item => item.name).join(', ');

  const getTotalQty = (items) =>
    !items || items.length === 0 ? 0 : items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="transactions-container">
      <h2 className="transactions__title">
        {mode === "cashier" ? "Cashier Transactions" : "Order History"}
      </h2>

      <div className="datepicker-container">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="MM/dd/yyyy"
        />
      </div>

      {orders.length === 0 ? (
        <div className="transactions__empty">
          <p>No orders for this date</p>
        </div>
      ) : (
        <>
          <div className="transactions_summary">
            <div className="summary-card">
              <span className="summary-card_label">Total Orders</span>
              <span className="summary-card_value">{totals.totalOrders}</span>
            </div>
            <div className="summary-card">
              <span className="summary-card_label">Walk-Ins</span>
              <span className="summary-card_value">{totals.totalWalkIns}</span>
            </div>
            <div className="summary-card">
              <span className="summary-card_label">Deliveries</span>
              <span className="summary-card_value">{totals.totalDeliveries}</span>
            </div>
            <div className="summary-card summary-card--total">
              <span className="summary-card_label">Total Sales</span>
              <span className="summary-card_value">₱{totals.totalSales.toFixed(2)}</span>
            </div>
          </div>

          <div className="transactions__table-wrapper">
            <table className="transactions__table">
              <thead>
                <tr>
                  <th className="table-header">#</th>
                  <th className="table-header">Customer</th>
                  <th className="table-header">Type</th>
                  <th className="table-header">Products</th>
                  <th className="table-header">Qty</th>
                  <th className="table-header">Total</th>
                  <th className="table-header">Time</th>
                  {mode === "cashier" && <th className="table-header">Action</th>}
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr
                    key={order.id}
                    className="table-row table-row--clickable"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="table-cell">{index + 1}</td>
                    <td className="table-cell">{order.customerName}</td>
                    <td className="table-cell">
                      <span className={`badge badge--${order.orderType === 'delivery' ? 'delivery' : 'walkin'}`}>
                        {order.orderType === 'delivery' ? 'Delivery' : 'Walk-In'}
                      </span>
                    </td>
                    <td className="table-cell table-cell--products">{getProductsDisplay(order.items)}</td>
                    <td className="table-cell">{getTotalQty(order.items)}</td>
                    <td className="table-cell table-cell--amount">₱{order.totalAmount.toFixed(2)}</td>
                    <td className="table-cell">{order.time}</td>
                    {mode === "cashier" && (
                      <td className="table-cell table-cell--action">
                        <button
                          className="delete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTransactionToConfirm(order);
                          }}
                          title="Mark as Complete"
                          aria-label="Mark transaction as complete"
                        >
                          <Check size={18} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {transactionToConfirm && mode === "cashier" && (
        <div className="confirmation-overlay">
          <div className="confirmation-modal">
            <div className="confirmation-header">
              <h2 className="confirmation-title">Mark Transaction as Complete?</h2>
            </div>
            <div className="confirmation-content">
              <p className="confirmation-message">
                Customer: <strong>{transactionToConfirm.customerName}</strong>
              </p>
              <p className="confirmation-subtitle">
                Order Total: <strong>₱{transactionToConfirm.totalAmount.toFixed(2)}</strong>
              </p>
              <p className="confirmation-subtitle">
                Are you sure you want to mark this transaction as complete?
              </p>
            </div>
            <div className="confirmation-actions">
              <Button
                variant="primary"
                size="medium"
                onClick={() => {
                  onDeleteOrder(transactionToConfirm.id);
                  setTransactionToConfirm(null);
                }}
              >
                Yes, Mark as Complete
              </Button>
              <Button
                variant="secondary"
                size="medium"
                onClick={() => setTransactionToConfirm(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DayTransactionList;
