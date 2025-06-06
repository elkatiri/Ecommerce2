// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Heart, ShoppingCart, User, Menu, X, ShoppingBag, Trash, Plus, Minus, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../../store/cartSlice";
import { logout } from "../../store/authSlice";
import axios from 'axios';
import "./NavBar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [isUserMenuVisible, setIsUserMenuVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const total = useSelector((state) => state.cart.total);
  const user = useSelector((state) => state.auth.user);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleCart = () => setIsCartVisible(!isCartVisible);
  const toggleUserMenu = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setIsUserMenuVisible(!isUserMenuVisible);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuVisible && !event.target.closest('.user-menu')) {
        setIsUserMenuVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuVisible]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post("/api/logout", {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("email");
      dispatch(logout());
      navigate("/");
    }
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname === path;
  };

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

  const getUserFirstName = () => {
    if (!user?.name) return '';
    return user.name.split(' ')[0];
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
            <div className="user-menu-container">
              <button className="icon-button" aria-label="Account" onClick={toggleUserMenu}>
                <User className="icon" size={20} />
                {user && <span className="user-name">{getUserFirstName()}</span>}
              </button>
              {isUserMenuVisible && user && (
                <div className="user-menu">
                  <div className="user-info">
                    <span className="user-full-name">{user.name}</span>
                    <span className="user-email">{user.email}</span>
                  </div>
                  <button onClick={handleLogout} className="menu-item">
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
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
            <div className="user-menu-container">
              <button className="icon-button" aria-label="Account" onClick={toggleUserMenu}>
                <User className="icon" size={20} />
                {user && <span className="user-name">{getUserFirstName()}</span>}
              </button>
              {isUserMenuVisible && user && (
                <div className="user-menu">
                  <div className="user-info">
                    <span className="user-full-name">{user.name}</span>
                    <span className="user-email">{user.email}</span>
                  </div>
                  <button onClick={handleLogout} className="menu-item">
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
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
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/fallback.jpg';
                  }}
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
          <p>{total.toFixed(2)} dh</p>
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