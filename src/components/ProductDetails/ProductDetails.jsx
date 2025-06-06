import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import axios from 'axios';
import { ChevronLeft, ShoppingCart, Star, Truck, Shield, RefreshCw, Minus, Plus } from 'lucide-react';
import Spinner from '../Spinner/Spinner';
import Navbar from '../NavBar/NavBar';
import Footer from '../Footer/Footer';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch product details');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      setIsAddingToCart(true);
      const price = product.discount 
        ? parseFloat(product.price) - parseFloat(product.discount)
        : parseFloat(product.price);
        
      dispatch(addToCart({
        id: product.id,
        name: product.name,
        price: price,
        image: product.images[selectedImage]?.image_path,
        quantity: quantity
      }));
      setTimeout(() => setIsAddingToCart(false), 1000);
    }
  };

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleQuantityInput = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="loading-container">
        <Spinner />
      </div>
      <Footer />
    </>
  );
  
  if (error) return (
    <>
      <Navbar />
      <div className="error-message">{error}</div>
      <Footer />
    </>
  );
  
  if (!product) return (
    <>
      <Navbar />
      <div className="error-message">Product not found</div>
      <Footer />
    </>
  );

  const discountedPrice = product.discount 
    ? parseFloat(product.price) - parseFloat(product.discount)
    : parseFloat(product.price);

  const totalPrice = discountedPrice * quantity;

  return (
    <>
      <Navbar />
      <div className="product-details-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ChevronLeft size={20} />
          Back
        </button>

        <div className="product-details-content">
          <div className="product-images">
            <div className="main-image">
              <img
                src={`http://localhost:8000/storage/${product.images[selectedImage]?.image_path}`}
                alt={product.name}
              />
            </div>
            <div className="thumbnail-images">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={`http://localhost:8000/storage/${image.image_path}`}
                    alt={`${product.name} - ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="product-info">
            <h1>{product.name}</h1>
            
            <div className="pric-section">
              {product.discount ? (
                <>
                  <span className="original-price">${parseFloat(product.price).toFixed(2)}</span>
                  <span className="discounted-price">${(parseFloat(product.price) - parseFloat(product.discount)).toFixed(2)}</span>
                </>
              ) : (
                <span className="price">${parseFloat(product.price).toFixed(2)}</span>
              )}
            </div>

            <p className="description">{product.description}</p>

            <div className="quantity-section">
              <div className="quantity-controls">
                <button 
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityInput}
                  className="quantity-input"
                />
                <button 
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(1)}
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="quantity-summary">
                <span className="quantity-label">Selected Quantity:</span>
                <span className="quantity-value">{quantity}</span>
                <span className="quantity-total">Total: ${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button 
              className={`add-to-cart-button ${isAddingToCart ? 'adding' : ''}`}
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              <ShoppingCart size={20} />
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </button>

            <div className="product-features">
              <div className="feature">
                <Truck size={24} />
                <div>
                  <h4>Free Shipping</h4>
                  <p>On orders over $50</p>
                </div>
              </div>
              <div className="feature">
                <Shield size={24} />
                <div>
                  <h4>Secure Payment</h4>
                  <p>100% secure payment</p>
                </div>
              </div>
              <div className="feature">
                <RefreshCw size={24} />
                <div>
                  <h4>Easy Returns</h4>
                  <p>30 days return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails; 