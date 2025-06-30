import { useState, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const Home = ({ setCustomerName }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { darkMode } = useContext(ThemeContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter your name to continue');
      return;
    }
    
    setCustomerName(name.trim());
  };

  return (
    <div className="container">
      <div className="row min-vh-100 align-items-center justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className={`card shadow ${darkMode ? 'bg-dark text-white border-secondary' : ''}`}>
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <i className="bi bi-tools display-1 text-primary"></i>
                <h1 className="mt-3">Welcome to AutoService</h1>
                <p className="lead">Your one-stop shop for tech accessories</p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="customerName" className="form-label">Enter your name to continue</label>
                  <input
                    type="text"
                    className={`form-control form-control-lg ${error ? 'is-invalid' : ''}`}
                    id="customerName"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (error) setError('');
                    }}
                  />
                  {error && <div className="invalid-feedback">{error}</div>}
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg w-100"
                >
                  Start Shopping
                  <i className="bi bi-arrow-right ms-2"></i>
                </button>
              </form>
              
              <div className="mt-4 text-center">
                <p className="text-muted">
                  <small>
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                  </small>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
