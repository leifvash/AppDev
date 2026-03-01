import React from 'react';
import '../styles/components/DayTransactionList.css';
import Button from './Button';
import { Trash2 } from 'lucide-react';

const DayTransactionList = ({ orders, onDeleteOrder }) => {
  const calculateTotals = () => {
    return {
      totalSales: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      totalOrders: orders.length,
      totalDeliveries: orders.filter(o => o.orderType === 'delivery').length,
      totalWalkIns: orders.filter(o => o.orderType === 'walk-in').length
    };
  };

  const totals = calculateTotals();

  return (
    <div className="transactions-container">
      <h2 className="transactions__title">Today's Transactions</h2>

      {orders.length === 0 ? (
        <div className="transactions__empty">
          <p>No orders yet today</p>
        </div>
      ) : (
        <>
          <div className="transactions__summary">
            <div className="summary-card">
              <span className="summary-card__label">Total Orders</span>
              <span className="summary-card__value">{totals.totalOrders}</span>
            </div>
            <div className="summary-card">
              <span className="summary-card__label">Walk-Ins</span>
              <span className="summary-card__value">{totals.totalWalkIns}</span>
            </div>
            <div className="summary-card">
              <span className="summary-card__label">Deliveries</span>
              <span className="summary-card__value">{totals.totalDeliveries}</span>
            </div>
            <div className="summary-card summary-card--total">
              <span className="summary-card__label">Total Sales</span>
              <span className="summary-card__value">₱{totals.totalSales.toFixed(2)}</span>
            </div>
          </div>

          <div className="transactions__table-wrapper">
            <table className="transactions__table">
              <thead>
                <tr>
                  <th className="table-header">#</th>
                  <th className="table-header">Customer</th>
                  <th className="table-header">Type</th>
                  <th className="table-header">Product</th>
                  <th className="table-header">Qty</th>
                  <th className="table-header">Total</th>
                  <th className="table-header">Time</th>
                  <th className="table-header">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order.id} className="table-row">
                    <td className="table-cell">{index + 1}</td>
                    <td className="table-cell">{order.customerName}</td>
                    <td className="table-cell">
                      <span className={`badge badge--${order.orderType === 'delivery' ? 'delivery' : 'walkin'}`}>
                        {order.orderType === 'delivery' ? 'Delivery' : 'Walk-In'}
                      </span>
                    </td>
                    <td className="table-cell">{order.product.size}</td>
                    <td className="table-cell">{order.quantity}</td>
                    <td className="table-cell table-cell--amount">₱{order.totalAmount.toFixed(2)}</td>
                    <td className="table-cell">{order.time}</td>
                    <td className="table-cell table-cell--action">
                      <button
                        className="delete-btn"
                        onClick={() => onDeleteOrder(order.id)}
                        title="Delete order"
                        aria-label="Delete order"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default DayTransactionList;
