import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Search } from 'lucide-react';
import Products from '../../components/Products/Products';
import Navbar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import './Store.css';

const Store = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { category } = useParams();
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');

  // Fetch categories
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/categories')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  // Fetch products
  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        // Always fetch all products first
        const response = await axios.get('http://127.0.0.1:8000/api/products');
        if (Array.isArray(response.data)) {
          setProducts(response.data);
          // If there's a category in URL, set it as selected
          if (category) {
            setSelectedCategory(category);
          } else {
            setSelectedCategory('all');
          }
        } else {
          console.error('Unexpected products response format:', response.data);
          setError('Invalid data format received from server');
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error.response || error);
        setError(error.response?.data?.message || 'Failed to fetch data');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  // Handle price input changes
  const handleMinPriceChange = (e) => {
    const value = Number(e.target.value);
    if (value <= maxPrice) {
      setMinPrice(value);
    }
  };

  const handleMaxPriceChange = (e) => {
    const value = Number(e.target.value);
    if (value >= minPrice) {
      setMaxPrice(value);
    }
  };

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      // Category filter
      const matchesCategory = selectedCategory === 'all' || 
        (product.category_id && categories.find(cat => 
          cat.id === product.category_id && cat.name === selectedCategory
        ));
      
      // Price filter
      const price = parseFloat(product.price);
      const matchesPrice = price >= minPrice && price <= maxPrice;
      
      // Search filter
      const matchesSearch = searchTerm === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesPrice && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price-high':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  return (
    <div className="store-page">
      <Navbar />
      <div className="store-container">
        <aside className="filters-sidebar">
          <div className="filters-section">
            <h3>Filters</h3>
            <div className="filter-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="search">Search Products</label>
              <div className="search-input-container">
                <Search className="search-icon" size={18} />
                <input
                  type="text"
                  id="search"
                  placeholder="Search by name or description"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Price Range</label>
              <div className="price-inputs">
                <div className="price-input">
                  <span>$</span>
                  <input
                    type="number"
                    min="0"
                    max={maxPrice}
                    value={minPrice}
                    onChange={handleMinPriceChange}
                    placeholder="Min"
                  />
                </div>
                <span className="price-separator">-</span>
                <div className="price-input">
                  <span>$</span>
                  <input
                    type="number"
                    min={minPrice}
                    value={maxPrice}
                    onChange={handleMaxPriceChange}
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>

            <div className="filter-group">
              <label htmlFor="sort">Sort By</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>
        </aside>

        <main className="all">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          <div className="products-header">
            <h2>{selectedCategory !== 'all' ? `Products in "${selectedCategory}"` : 'All Products'}</h2>
            <div className="products-count">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          </div>
          <Products 
            products={filteredProducts}
            loading={loading}
            title=""
          />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Store;
