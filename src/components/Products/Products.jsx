import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import Spinner from '../Spinner/Spinner';
import { Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Products.css';

const Products = ({ products, loading, title, showDiscount  }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    const price = product.discount 
      ? parseFloat(product.price) - parseFloat(product.discount)
      : parseFloat(product.price);

    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: price,
      image: product.images[0]?.image_path,
      quantity: 1
    }));
  };

  if (loading && !showDiscount) {
    return <Spinner />;
  }

  return (
    <div className="products-section">
      {title && <h2>{title}</h2>}
      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="image-container">
              {product.images && product.images.length > 0 && (
                <>
                  <img
                    src={`http://localhost:8000/storage/${product.images[0].image_path}`}
                    alt={product.name}
                    loading="lazy"
                  />
                  <Link
                    to={`/product/${product.id}`}
                    className="eye-icon-link"
                  >
                    <div className="eye-icon">
                      <Eye size={20} color="white" />
                    </div>
                  </Link>
                </>
              )}
              { product.discount && parseFloat(product.discount) > 0 && (
                <div className="discount-badge">
                  {((parseFloat(product.discount) / parseFloat(product.price)) * 100).toFixed(0)}% OFF
                </div>
              )}
            </div>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            {product.discount && parseFloat(product.discount) > 0 ? (
              <div className="price-section">
                <span className="original-price">${parseFloat(product.price).toFixed(2)}</span>
                <span className="discounted-price">
                  ${(parseFloat(product.price) - parseFloat(product.discount)).toFixed(2)}
                </span>
              </div>
            ) : (
              <p className="price">${parseFloat(product.price).toFixed(2)}</p>
            )}
            <button 
              className="buy-button"
              onClick={() => handleAddToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
