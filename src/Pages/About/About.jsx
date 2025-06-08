import React from 'react';
import Navbar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import { Award, Users, Globe, Heart } from 'lucide-react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <Navbar />
      <div className="about-container">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="hero-content">
            <h1>Welcome to Cyber</h1>
            <p className="hero-subtitle">Redefining the Future of E-commerce</p>
          </div>
        </section>

        {/* Vision Section */}
        <section className="vision-section">
          <div className="vision-content">
            <h2>Our Vision</h2>
            <p>
              To be the world's most customer-centric e-commerce platform, where innovation meets 
              convenience, and every shopping experience is exceptional.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stat-card">
            <Users size={40} />
            <h3>1M+</h3>
            <p>Happy Customers</p>
          </div>
          <div className="stat-card">
            <Globe size={40} />
            <h3>50+</h3>
            <p>Countries Served</p>
          </div>
          <div className="stat-card">
            <Award size={40} />
            <h3>1000+</h3>
            <p>Products</p>
          </div>
          <div className="stat-card">
            <Heart size={40} />
            <h3>98%</h3>
            <p>Customer Satisfaction</p>
          </div>
        </section>

        {/* Core Values */}
        <section className="values-section">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <Award size={32} />
              </div>
              <h3>Excellence</h3>
              <p>We strive for excellence in every aspect of our business, from product selection to customer service.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <Users size={32} />
              </div>
              <h3>Customer First</h3>
              <p>Our customers are at the heart of everything we do. Their satisfaction drives our success.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <Globe size={32} />
              </div>
              <h3>Innovation</h3>
              <p>We embrace change and continuously innovate to provide the best shopping experience.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <Heart size={32} />
              </div>
              <h3>Integrity</h3>
              <p>We conduct our business with honesty, transparency, and ethical practices.</p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <h2>Leadership Team</h2>
          <div className="team-grid">
            <div className="team-card">
              <div className="team-image">
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80" alt="CEO" />
              </div>
              <div className="team-info">
                <h3>Michael Chen</h3>
                <p>Chief Executive Officer</p>
              </div>
            </div>
            <div className="team-card">
              <div className="team-image">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" alt="CTO" />
              </div>
              <div className="team-info">
                <h3>Sarah Johnson</h3>
                <p>Chief Technology Officer</p>
              </div>
            </div>
            <div className="team-card">
              <div className="team-image">
                <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80" alt="COO" />
              </div>
              <div className="team-info">
                <h3>David Kim</h3>
                <p>Chief Operations Officer</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Join Our Journey</h2>
            <p>Experience the future of e-commerce with Cyber</p>
            <button className="cta-button">Explore Our Store</button>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default About;
