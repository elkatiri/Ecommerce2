// src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { Search, Heart, ShoppingCart, User, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import "./NavBar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

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
            <button className="icon-button" aria-label="Cart">
              <ShoppingCart className="icon" size={20} />
              <span className="icon-badge">0</span>
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
            <button className="icon-button" aria-label="Cart">
              <ShoppingCart className="icon" size={20} />
              <span className="icon-badge">0</span>
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
    </nav>
  );
};

export default Navbar;
