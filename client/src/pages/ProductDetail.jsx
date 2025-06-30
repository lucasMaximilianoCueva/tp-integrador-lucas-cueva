import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productApi } from '../services/api';
import { CartContext } from '../context/CartContext';
import { ThemeContext } from '../context/ThemeContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);
  const { darkMode } = useContext(ThemeContext);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productApi.getById(id);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again later.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Handle add to cart
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  // Handle quantity change
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  return (
    <div className="container py-5">
      {/* Loading state */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading product details...</p>
        </div>
      )}
      
      {/* Error state */}
      {error && !loading && (
        <div className="alert alert-danger" role="alert">
          {error}
          <div className="mt-3">
            <Link to="/products" className="btn btn-primary">
              <i className="bi bi-arrow-left me-2"></i>
              Back to Products
            </Link>
          </div>
        </div>
      )}
      
      {/* Product details */}
      {!loading && !error && product && (
        <div className={`card shadow ${darkMode ? 'bg-dark text-white border-secondary' : ''}`}>
          <div className="row g-0">
            <div className="col-md-6">
              <img 
                src={product.image.startsWith('http') ? product.image : `http://localhost:3000${product.image}`} 
                alt={product.name} 
                className="img-fluid rounded-start" 
                style={{ maxHeight: '500px', width: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/500x500?text=Image+Not+Available';
                }}
              />
            </div>
            <div className="col-md-6">
              <div className="card-body p-4">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/products">Products</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      {product.name}
                    </li>
                  </ol>
                </nav>
                
                <h1 className="card-title mb-3">{product.name}</h1>
                
                <span className={`badge ${product.category === 'phone' ? 'bg-info' : 'bg-primary'} mb-3`}>
                  {product.category === 'phone' ? 'Phone Accessory' : 'Computer Accessory'}
                </span>
                
                <p className="card-text fs-5 mb-4">{product.description}</p>
                
                <h3 className="mb-4">${product.price.toFixed(2)}</h3>
                
                <div className="d-flex align-items-center mb-4">
                  <div className="input-group me-3" style={{ maxWidth: '150px' }}>
                    <button 
                      className="btn btn-outline-secondary" 
                      type="button"
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    >
                      <i className="bi bi-dash"></i>
                    </button>
                    <input 
                      type="number" 
                      className={`form-control text-center ${darkMode ? 'bg-dark text-white border-secondary' : ''}`}
                      value={quantity}
                      onChange={handleQuantityChange}
                      min="1"
                    />
                    <button 
                      className="btn btn-outline-secondary" 
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <i className="bi bi-plus"></i>
                    </button>
                  </div>
                  
                  <button 
                    className="btn btn-primary"
                    onClick={handleAddToCart}
                  >
                    <i className="bi bi-cart-plus me-2"></i>
                    Add to Cart
                  </button>
                </div>
                
                <hr />
                
                <div className="d-flex justify-content-between">
                  <Link to="/products" className="btn btn-outline-secondary">
                    <i className="bi bi-arrow-left me-2"></i>
                    Continue Shopping
                  </Link>
                  <Link to="/cart" className="btn btn-success">
                    <i className="bi bi-cart me-2"></i>
                    View Cart
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
