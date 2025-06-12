import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        
        // Filter orders for the current user
        const userOrders = response.data.filter(order => order.user_id === user.id);
        setOrders(userOrders);
      } catch (error) {
        setError('Failed to fetch orders. Please try again later.');
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="status-icon pending" />;
      case 'completed':
        return <CheckCircle className="status-icon completed" />;
      case 'cancelled':
        return <XCircle className="status-icon cancelled" />;
      default:
        return <Package className="status-icon" />;
    }
  };

  if (loading) {
    return (
      <div className="orders-page">
        <Navbar />
        <div className="orders-container">
          <div className="loading">Loading orders...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="orders-page">
      <Navbar />
      <div className="orders-container">
        <h1>My Orders</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        {orders.length === 0 ? (
          <div className="no-orders">
            <Package size={48} />
            <p>You haven't placed any orders yet.</p>
            <button onClick={() => navigate('/store')} className="shop-now-btn">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.id}</h3>
                    <p className="order-date">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="order-status">
                    {getStatusIcon(order.status)}
                    <span className={`status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                
                <div className="order-details">
                  <div className="order-items">
                    {order.products.map((item) => (
                      <div key={item.id} className="order-item">
                        <img 
                          src={`http://localhost:8000/storage/${item.images[0]?.image_path}`} 
                          alt={item.name}
                          onError={(e) => { e.target.src = '/fallback.jpg'; }}
                        />
                        <div className="item-details">
                          <h4>{item.name}</h4>
                          <p>Quantity: {item.pivot.quantity}</p>
                          <p>Price: {item.pivot.price} dh</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="order-summary">
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>{order.total_price} dh</span>
                    </div>
                    <div className="summary-row">
                      <span>Shipping:</span>
                      <span>Free</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total:</span>
                      <span>{order.total_price} dh</span>
                    </div>
                  </div>
                </div>
                
                <div className="shipping-address">
                  <h4>Shipping Address:</h4>
                  <p>{order.shipping_address}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Orders; 