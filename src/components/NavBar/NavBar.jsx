// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Heart, ShoppingCart, User, Menu, X, ShoppingBag, Trash, Plus, Minus } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../../store/cartSlice";
import "./NavBar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const total = useSelector((state) => state.cart.total);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleCart = () => setIsCartVisible(!isCartVisible);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname === path;
  };

  const handleQuantityChange = (itemId, change) => {
    try {
      // Find the item in the cart
      const item = cart.find(cartItem => cartItem.id === itemId);
      if (item) {
        const newQuantity = Math.max(1, item.quantity + change); // Ensure quantity doesn't go below 1
        dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      // You could add a toast notification here to show the error to the user
    }
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="logo">
            <span className="logo-text">cyber</span>
          </Link>
        </div>

        <div className="search-bar">
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="search-input"
          />
        </div>
        <ul className={`nav-links ${isOpen ? "open" : ""}`}>
          <li>
            <Link 
              to="/" 
              className={isActive("/") ? "active home-active" : ""}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/store" 
              className={isActive("/store") ? "active" : ""}
              onClick={() => setIsOpen(false)}
            >
              Store
            </Link>
          </li>
          <li>
            <Link 
              to="/blog" 
              className={isActive("/blog") ? "active" : ""}
              onClick={() => setIsOpen(false)}
            >
              Blog
            </Link>
          </li>
          <li>
            <Link 
              to="/contact" 
              className={isActive("/contact") ? "active" : ""}
              onClick={() => setIsOpen(false)}
            >
              Contact Us
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              className={isActive("/about") ? "active" : ""}
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
          </li>
          <div className="mobile-icons">
            <button className="icon-button" aria-label="Wishlist">
              <Heart className="icon" size={20} />
              <span className="icon-badge">0</span>
            </button>
            <button className="icon-button" aria-label="Cart" onClick={toggleCart}>
              <ShoppingCart className="icon" size={20} />
              <span className="icon-badge">{cart.length}</span>
            </button>
            <button className="icon-button" aria-label="Account">
              <User className="icon" size={20} />
            </button>
          </div>
        </ul>

        <div className="navbar-right">
          <div className="navbar-icons desktop-only">
            <button className="icon-button" aria-label="Wishlist">
              <Heart className="icon" size={20} />
              <span className="icon-badge">0</span>
            </button>
            <button className="icon-button" aria-label="Cart" onClick={toggleCart}>
              <ShoppingCart className="icon" size={20} />
              <span className="icon-badge">{cart.length}</span>
            </button>
            <button className="icon-button" aria-label="Account">
              <User className="icon" size={20} />
            </button>
          </div>
          <div className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </div>
        </div>
      </div>

      <div className={`shopping-cart ${isCartVisible ? 'visible' : ''}`}>
        <div className="shopping-cart-header">
          <h1>Shopping Cart</h1>
          <ShoppingBag className="ShoppingBag" onClick={toggleCart} />
        </div>
        <div className="shopping-cart-container">
          {cart.length > 0 ? (
            cart.map((item, index) => (
              <div key={index} className="shopping-cart-element">
                <img
                  src={`http://localhost:8000/storage/${item.image}`}
                  alt={item.name}
                />
                <p>{item.name}</p>
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
                <p>{item.price * item.quantity} dh</p>
                <button
                  className="remove-btn"
                  onClick={() => dispatch(removeFromCart(item.id))}
                >
                  <Trash color="#B88E2F" />
                </button>
              </div>
            ))
          ) : (
            <p className="empty-cart">Your cart is empty.</p>
          )}
        </div>
        <div className="shopping-totale">
          <h1>Subtotal</h1>
          <p>
            {total.toFixed(2)} dh
          </p>
        </div>
        <hr />
        <div className="shopping-buttons">
          <button onClick={() => navigate("/cart")}>Cart</button>
          <button onClick={() => navigate("/check-out")}>Check-out</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;