import React from 'react';
import { NavLink } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="brand">
            <h3 className="brand-title">cyber</h3>
            <p className="address">
              400 University Drive Suite 200 Coral Gables,
              <br />
              FL 33134 USA
            </p>
          </div>

          <div className="footer-sections">
            <div className="section">
              <h4 className="section-title">Links</h4>
              <ul className="list">
                <li className="list-item">
                  <NavLink to="/" className="link" end>
                    Home
                  </NavLink>
                </li>
                <li className="list-item">
                  <NavLink to="/store" className="link">
                    Store
                  </NavLink>
                </li>
                <li className="list-item">
                  <NavLink to="/blog" className="link">
                    Blog
                  </NavLink>
                </li>
                <li className="list-item">
                  <NavLink to="/contact" className="link">
                    Contact
                  </NavLink>
                </li>
                <li className="list-item">
                  <NavLink to="/about" className="link">
                    About
                  </NavLink>
                </li>
              </ul>
            </div>

            <div className="section">
              <h4 className="section-title">Help</h4>
              <ul className="list">
                <li className="list-item">
                  <a href="/payment" className="link">
                    Payment Options
                  </a>
                </li>
                <li className="list-item">
                  <a href="/returns" className="link">
                    Returns
                  </a>
                </li>
                <li className="list-item">
                  <a href="/privacy" className="link">
                    Privacy Policies
                  </a>
                </li>
              </ul>
            </div>

            <div className="section">
              <h4 className="section-title">Newsletter</h4>
              <div className="newsletter">
                <div className="newsletter-input">
                  <Mail className="mail-icon" size={18} />
                  <input
                    type="email"
                    placeholder="Enter Your Email Address"
                    className="input"
                  />
                </div>
                <button className="subscribe-button">SUBSCRIBE</button>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="social-links">
            <a href="https://facebook.com" className="social-link" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href="https://twitter.com" className="social-link" aria-label="Twitter">
              <Twitter size={20} />
            </a>
            <a href="https://instagram.com" className="social-link" aria-label="Instagram">
              <Instagram size={20} />
            </a>
          </div>
          <p className="copyright">2024 cyber. All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;