import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Navbar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import axios from 'axios';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: false
  });

  // Auto-hide alerts after 3 seconds
  useEffect(() => {
    let timeoutId;
    if (status.success || status.error) {
      timeoutId = setTimeout(() => {
        setStatus(prev => ({
          ...prev,
          success: false,
          error: null
        }));
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [status.success, status.error]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus({
        loading: false,
        error: "All fields are required",
        success: false
      });
      return;
    }

    setStatus({ loading: true, error: null, success: false });

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/messages', {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (response.status === 200 || response.status === 201) {
        setStatus({ loading: false, error: null, success: true });
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus({
        loading: false,
        error: error.response?.data?.message || 'Failed to send message. Please try again.',
        success: false
      });
    }
  };

  return (
    <div className="contact-page">
      <Navbar />
      <div className="contact-container">
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p className="subtitle">We'd love to hear from you</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <div className="info-items">
              <div className="info-item">
                <Mail size={24} />
                <div>
                  <h3>Email</h3>
                  <p>contact@yourstore.com</p>
                </div>
              </div>
              <div className="info-item">
                <Phone size={24} />
                <div>
                  <h3>Phone</h3>
                  <p>+212 6XX-XXXXXX</p>
                </div>
              </div>
              <div className="info-item">
                <MapPin size={24} />
                <div>
                  <h3>Address</h3>
                  <p>123 Fashion Street, Casablanca, Morocco</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <h2>Send us a Message</h2>
            {status.success && (
              <div className="success-message">
                Thank you for your message. We will get back to you soon!
              </div>
            )}
            {status.error && (
              <div className="error-message">
                {status.error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
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
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="5"
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={status.loading}
              >
                {status.loading ? (
                  'Sending...'
                ) : (
                  <>
                    <Send size={20} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;