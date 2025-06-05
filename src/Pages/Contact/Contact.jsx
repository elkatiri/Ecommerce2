import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Navbar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the form submission
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    // Show success message
    alert('Thank you for your message. We will get back to you soon!');
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
              <button type="submit" className="submit-btn">
                <Send size={20} />
                Send Message
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