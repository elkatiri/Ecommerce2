import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/products')
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading products...</p>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
     {products.map(product => {
  // 👉 Ajoute ici
  console.log(product.images[0]?.path);
  console.log(`http://127.0.0.1:8000/storage/${product.images[0]?.path}`);

  return (
    <div key={product.id} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
      <h3>{product.name}</h3>
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Quantity:</strong> {product.quantity}</p>
      {product.images && product.images.length > 0 && (
        <img
        src={`http://127.0.0.1:8000/storage/${product.images[0].image_path}`}
        alt={product.name}
        style={{ width: '100%', borderRadius: '6px' }}
      />
      )}
    </div>
  );
})}

    </div>
  );
};

export default ProductList;
