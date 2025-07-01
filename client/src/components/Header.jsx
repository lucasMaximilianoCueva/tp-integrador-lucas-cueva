import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { CartContext } from '../context/CartContext';

const Header = ({ customerName }) => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { itemCount } = useContext(CartContext);
  const location = useLocation();

  // Don't show navigation on welcome page
  const isWelcomePage = location.pathname === '/' && !customerName;
  
  return (
    <header className={`navbar navbar-expand-lg ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'} shadow-sm`}>
      <div className="container">
        <Link to={customerName ? '/products' : '/'} className="navbar-brand d-flex align-items-center">
          <i className="bi bi-tools me-2"></i>
          <span>AutoService</span>
        </Link>
        
        {!isWelcomePage && (
          <div className="d-flex align-items-center ms-auto">
            {customerName && (
              <Link to="/cart" className="btn btn-outline-primary position-relative me-3">
                <i className="bi bi-cart"></i>
                {itemCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {itemCount}
                  </span>
                )}
              </Link>
            )}
            
            <button 
              onClick={toggleTheme} 
              className={`btn ${darkMode ? 'btn-light' : 'btn-dark'}`}
              aria-label="Toggle theme"
            >
              <i className={`bi ${darkMode ? 'bi-sun' : 'bi-moon'}`}></i>
            </button>
            
            <a 
              href="http://localhost:3000/admin/login" 
              className="btn btn-outline-secondary ms-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-shield-lock me-1"></i>
              Admin
            </a>
            
            {customerName && (
              <div className="ms-3 d-none d-sm-block">
                <span className={`${darkMode ? 'text-light' : 'text-muted'} me-2`}>Welcome,</span>
                <span className="fw-bold">{customerName}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
