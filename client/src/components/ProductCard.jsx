import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { ThemeContext } from '../context/ThemeContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { darkMode } = useContext(ThemeContext);
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
  };
  
  return (
    <div className={`card h-100 shadow-sm ${darkMode ? 'bg-dark text-white border-secondary' : ''}`}>
      <div className="position-relative">
        <img 
          src={product.image.startsWith('http') ? product.image : `http://localhost:3000${product.image}`} 
          className="card-img-top" 
          alt={product.name}
          style={{ height: '200px', objectFit: 'cover' }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
          }}
        />
        <span className={`position-absolute top-0 end-0 badge ${product.category === 'phone' ? 'bg-info' : 'bg-primary'} m-2`}>
          {product.category === 'phone' ? 'Phone' : 'Computer'}
        </span>
      </div>
      
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text text-truncate mb-3">{product.description}</p>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className="fw-bold">${product.price.toFixed(2)}</span>
          <div>
            <button 
              onClick={handleAddToCart}
              className="btn btn-sm btn-outline-primary me-2"
            >
              <i className="bi bi-cart-plus"></i>
            </button>
            <Link 
              to={`/products/${product.id}`} 
              className="btn btn-sm btn-primary"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
