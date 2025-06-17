import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Truck, Shield } from 'lucide-react';
import { clearCart } from '../../store/cartSlice';
import { setCredentials } from '../../store/authSlice';
import Navbar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import './Checkout.css';
import axios from 'axios';
import { notifications } from '@mantine/notifications';
import { Button } from '@mantine/core';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.items);
  const total = useSelector((state) => state.cart.total);
  const user = useSelector((state) => state.auth.user);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');


  useEffect(() => {
    if (cart.length === 0) navigate('/cart');
  }, [cart.length, navigate]);

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Morocco'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode'];
    for (let field of requiredFields) {
      if (!formData[field].trim()) {
        setError(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      notifications.show({
        title: 'Form Error',
        message: error,
        color: 'red',
        autoClose: 4000,
      });
      return;
    }
    
    setShowConfirmation(true);
  };

 const confirmOrder = async () => {
  if (isLoading) return;
  setIsLoading(true);
  setError('');

  try {
    const orderData = {
      user_id: user?.id || null, // null si pas d'utilisateur connecté
      total_price: parseFloat(total),
      status: 'pending',
      shipping_address: `${formData.address}, ${formData.city}, ${formData.postalCode}, ${formData.country}`,
      customer_info: !user ? {
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone
      } : null,
      products: cart.map(item => ({
        product_id: item.id,
        quantity: parseInt(item.quantity),
        price: parseFloat(item.price)
      }))
    };

    console.log('Sending order data:', orderData); // For debugging

    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await axios.post('http://localhost:8000/api/orders', orderData, {
      headers
    });

    if (response.data) {
      dispatch(clearCart());
      setShowConfirmation(false);
      
      notifications.show({
        title: 'Commande Confirmée! 🎉',
        message: `Votre commande #${response.data.id} a été placée avec succès. Montant total: ${total.toFixed(2)} dh`,
        color: 'green',
        autoClose: 5000,
      });
      
      // Redirect to orders page or home after a short delay
     
    }
  } catch (error) {
    console.error('Order creation error:', error);
    
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.errors ? 
                        Object.values(error.response.data.errors).flat().join(', ') :
                        error.message ||
                        'Une erreur est survenue lors de la commande. Veuillez réessayer.';
    
    setError(errorMessage);
    setShowConfirmation(false);
    
    notifications.show({
      title: 'Erreur de Commande ❌',
      message: errorMessage,
      color: 'red',
      autoClose: 6000,
    });
  } finally {
    setIsLoading(false);
  }
};

  const cancelOrder = () => {
    setShowConfirmation(false);
    setError('');
  };

  if (cart.length === 0) return null;

  return (
    <div className="checkout-page">
      <Navbar />
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Checkout</h1>
        </div>

        <div className="checkout-content">
          <div className="checkout-form-container">
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-step">
                <h2>Shipping Information</h2>

                {error && (
                  <div className="error-message" style={{ 
                    color: 'red', 
                    background: '#fee', 
                    padding: '10px', 
                    borderRadius: '4px', 
                    marginBottom: '15px' 
                  }}>
                    {error}
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      name="firstName" 
                      value={formData.firstName} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      name="lastName" 
                      value={formData.lastName} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input 
                    type="text" 
                    id="address" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input 
                      type="text" 
                      id="city" 
                      name="city" 
                      value={formData.city} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="postalCode">Postal Code</label>
                    <input 
                      type="text" 
                      id="postalCode" 
                      name="postalCode" 
                      value={formData.postalCode} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <select 
                    id="country" 
                    name="country" 
                    value={formData.country} 
                    onChange={handleInputChange} 
                    required
                  >
                    <option value="Morocco">Morocco</option>
                  </select>
                </div>

                <Button 
                  type="submit" 
                  className="submit-order"
                  disabled={isLoading}
                  loading={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Place Order'}
                </Button>
              </div>
            </form>
          </div>

          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="order-items">
              {cart.map(item => (
                <div key={item.id} className="order-item">
                  <div className="item-image">
                    <img 
                      src={item.image ? `http://localhost:8000/storage/${item.image}` : '/fallback.jpg'} 
                      onError={(e) => { e.target.src = '/fallback.jpg'; }} 
                      alt={item.name} 
                    />
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="item-quantity">Quantity: {item.quantity}</p>
                    <p className="item-price">{parseFloat(item.price).toFixed(2)} dh</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-total">
              <div className="total-row">
                <span>Subtotal</span>
                <span>{parseFloat(total).toFixed(2)} dh</span>
              </div>
              <div className="total-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="total-row final">
                <span>Total</span>
                <span>{parseFloat(total).toFixed(2)} dh</span>
              </div>
            </div>
            <div className="order-features">
              <div className="feature">
                <Truck size={24} />
                <span>Free Shipping</span>
              </div>
              <div className="feature">
                <Shield size={24} />
                <span>Secure Order</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-modal">
            <h3>Confirm Your Order</h3>
            <p>Are you sure you want to place this order for {parseFloat(total).toFixed(2)} dh?</p>
            <div className="confirmation-buttons">
              <button 
                onClick={confirmOrder} 
                className="confirm-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Yes, Place Order'}
              </button>
              <button 
                onClick={cancelOrder} 
                className="cancel-btn"
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Checkout;