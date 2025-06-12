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

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.items);
  const total = useSelector((state) => state.cart.total);
  const user = useSelector((state) => state.auth.user);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

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
    country: 'Morocco',
    password: '',
    password_confirmation: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      // Register new user
      setIsRegistering(true);
      try {
        const registerData = {
          firstname: formData.firstName,
          lastname: formData.lastName,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation
        };

        const response = await axios.post('http://localhost:8000/api/register', registerData);
        const { access_token, user: newUser } = response.data;

        // Store auth data
        localStorage.setItem('token', access_token);
        dispatch(setCredentials({
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
          },
          token: access_token
        }));

        setIsRegistering(false);
        setShowConfirmation(true);
      } catch (error) {
        setError(error.response?.data?.message || 'Registration failed. Please try again.');
        setIsRegistering(false);
        return;
      }
    } else {
      setShowConfirmation(true);
    }
  };

  const confirmOrder = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please try again.');
        setShowConfirmation(false);
        return;
      }

      const currentUser = user || JSON.parse(localStorage.getItem('user'));
      if (!currentUser?.id) {
        setError('User information not found. Please try again.');
        setShowConfirmation(false);
        return;
      }

      const orderData = {
        user_id: currentUser.id,
        total_price: total,
        status: 'pending',
        shipping_address: `${formData.address}, ${formData.city}, ${formData.postalCode}, ${formData.country}`,
        products: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const response = await axios.post('http://localhost:8000/api/orders', orderData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.data) {
        dispatch(clearCart());
        setShowConfirmation(false);
        alert('Order placed successfully! Thank you for your purchase.');
        navigate('/');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred during checkout. Please try again.');
      setShowConfirmation(false);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelOrder = () => setShowConfirmation(false);

  if (cart.length === 0) return null;

  return (
    <div className="checkout-page">
      <Navbar />
      <div className="checkout-container">
        <div className="checkout-header"><h1>Checkout</h1></div>

        <div className="checkout-content">
          <div className="checkout-form-container">
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-step">
                <h2>{!user ? 'Create Account & Shipping Information' : 'Shipping Information'}</h2>

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

                {!user && (
                  <>
                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password_confirmation">Confirm Password</label>
                      <input 
                        type="password" 
                        id="password_confirmation" 
                        name="password_confirmation" 
                        value={formData.password_confirmation} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                  </>
                )}

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

                <button 
                  type="submit" 
                  className="submit-order"
                  disabled={isLoading || isRegistering}
                >
                  {isLoading ? 'Processing...' : isRegistering ? 'Creating Account...' : 'Place Order'}
                </button>
              </div>
            </form>
          </div>

          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="order-items">
              {cart.map(item => (
                <div key={item.id} className="order-item">
                  <div className="item-image">
                    <img src={`http://localhost:8000/storage/${item.image}`} onError={(e) => { e.target.src = '/fallback.jpg'; }} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="item-quantity">Quantity: {item.quantity}</p>
                    <p className="item-price">{item.price} dh</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-total">
              <div className="total-row"><span>Subtotal</span><span>{total.toFixed(2)} dh</span></div>
              <div className="total-row"><span>Shipping</span><span>Free</span></div>
              <div className="total-row final"><span>Total</span><span>{total.toFixed(2)} dh</span></div>
            </div>
            <div className="order-features">
              <div className="feature"><Truck size={24} /><span>Free Shipping</span></div>
              <div className="feature"><Shield size={24} /><span>Secure Order</span></div>
            </div>
          </div>
        </div>
      </div>

      {showConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-modal">
            <h3>Confirm Your Order</h3>
            <p>{error || 'Are you sure you want to place this order?'}</p>
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
