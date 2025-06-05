import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Trash, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { removeFromCart, updateQuantity } from '../../store/cartSlice';
import Navbar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import './Cart.css';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.items);
  const total = useSelector((state) => state.cart.total);

  const handleQuantityChange = (itemId, change) => {
    try {
      const item = cart.find(cartItem => cartItem.id === itemId);
      if (item) {
        const newQuantity = Math.max(1, item.quantity + change);
        dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleContinueShopping = () => {
    navigate('/store');
  };

  const handleCheckout = () => {
    navigate('/check-out');
  };

  return (
    <div className="cart-page">
      <Navbar />
      <div className="cart-container">
        <div className="cart-header">
          <h1>Shopping Cart<span>({cart.length})</span></h1>
        </div>

        {cart.length > 0 ? (
          <div className="cart-content">
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img
                      src={`http://localhost:8000/storage/${item.image}`}
                      alt={item.name}
                    />
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="item-price">{item.price} dh</p>
                  </div>
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, -1)}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="item-total">
                    <p>{(item.price * item.quantity).toFixed(2)} dh</p>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Trash size={20} />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{total.toFixed(2)} dh</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>{total.toFixed(2)} dh</span>
              </div>
              <button className="checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
              <button className="continue-shopping-btn" onClick={handleContinueShopping}>
                <ArrowLeft size={20} />
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="empty-cart">
            <ShoppingBag size={64} />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <button className="continue-shopping-btn" onClick={handleContinueShopping}>
              <ArrowLeft size={20} />
              Start Shopping
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart; 