import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TopDiscountedProducts.css';

const TopDiscountedProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/top-discounted-products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div className="top-discounted-products">
      <h2>Famous Discounted Products:</h2>
      <div className="product-grid">
        {products.map(product => (
          <div className="product-card" key={product.id}>
            <div className="image-container">
              {product.images && product.images.length > 0 && (
                <img
                  src={`http://localhost:8000/storage/${product.images[0].image_path}`}
                  alt={product.name}
                  loading="lazy"
                />
              )}
            </div>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <div className="price-section">
              <span className="original-price">${parseFloat(product.price).toFixed(2)}</span>
              <span className="discounted-price">
                ${(parseFloat(product.price) - parseFloat(product.discount)).toFixed(2)}
              </span>
              {parseFloat(product.discount) > 0 && (
                <span className="discount-badge">
                  {((parseFloat(product.discount) / parseFloat(product.price)) * 100).toFixed(0)}%
                </span>
              )}
            </div>
            <button className="buy-button">Buy Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopDiscountedProducts; 