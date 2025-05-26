import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
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
          <p className="price">${parseFloat(product.price).toFixed(2)}</p>
          <button className="buy-button">Buy Now</button>
        </div>
      ))}
    </div>
  );
};

export default Products;
