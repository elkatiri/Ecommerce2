import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import one from '../../assets/one.jpeg';
import two from '../../assets/two.jpeg';
import three from '../../assets/three.png';
import Navbar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import './Home.css';
import Products from '../../components/Products/Products';
import TopDiscountedProducts from '../../components/TopDiscountedProducts/TopDiscountedProducts';

const slides = [
  {
    id: 1,
    image: three,
    title: 'Latest Smartphones',
    description: 'Discover our newest collection of smartphones'
  },
  {
    id: 2,
    image: two,
    title: 'Premium Laptops',
    description: 'Powerful laptops for work and gaming'
  },
  {
    id: 3,
    image: one,
    title: 'Wireless Headphones',
    description: 'Experience music like never before'
  }
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [categories, setCategories] = useState([]);
  const [isHovering, setIsHovering] = useState(false);
  const scrollRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  useEffect(() => {
    let slideInterval;
    if (isAutoPlaying) {
      slideInterval = setInterval(() => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      }, 4000);
    }
    return () => clearInterval(slideInterval);
  }, [isAutoPlaying]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/categories")
      .then((response) => {
        const uniqueCategories = Array.from(
          new Map(response.data.map(item => [item.name, item])).values()
        );
        setCategories(uniqueCategories);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  useEffect(() => {
    const startAutoScroll = () => {
      if (!isHovering && scrollRef.current) {
        scrollIntervalRef.current = setInterval(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollLeft += 1;
            if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth - scrollRef.current.clientWidth) {
              scrollRef.current.scrollLeft = 0;
            }
          }
        }, 10);
      }
    };

    const stopAutoScroll = () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };

    if (!isHovering) {
      startAutoScroll();
    } else {
      stopAutoScroll();
    }

    return () => stopAutoScroll();
  }, [isHovering]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setIsAutoPlaying(false);
  };

  const scrollCategories = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="home">
      <Navbar />
      <section className="slideshow-section">
        <div className="slideshow">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
            >
              <img src={slide.image} alt={slide.title} className="slide-image" />
              <div className="slide-content">
                <h2>{slide.title}</h2>
                <p>{slide.description}</p>
              </div>
            </div>
          ))}
          <div className="slide-button prev" onClick={prevSlide}>
            <ChevronLeft size={24} />
          </div>
          <div className="slide-button next" onClick={nextSlide}>
            <ChevronRight size={24} />
          </div>
          <div className="slide-dots">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => {
                  setCurrentSlide(index);
                  setIsAutoPlaying(false);
                }}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="categories-section">
        <h2>Browse By Category</h2>
        <div 
          className="categories-container"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <button 
            className="scroll-button left" 
            onClick={() => scrollCategories("left")}
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="categories-list" ref={scrollRef}>
            {categories.map((category) => (
              <div key={category.id} className="category-item">
                <span>{category.name}</span>
              </div>
            ))}
          </div>
          <button 
            className="scroll-button right" 
            onClick={() => scrollCategories("right")}
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </section>

      <Products />
      <TopDiscountedProducts />
      <Footer />
    </div>
  );
};

export default Home;
