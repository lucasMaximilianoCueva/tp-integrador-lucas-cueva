import { useState, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { authApi } from '../services/api';

const AdminLogin = () => {
  const { darkMode } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Auto-fill test credentials
  const fillTestCredentials = () => {
    setFormData({
      email: 'admin@example.com',
      password: 'admin123'
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Call login API
      const response = await authApi.login(formData);
      
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      
      // Redirect to admin panel on the backend server
      window.location.href = 'http://localhost:3000/admin/dashboard';
      
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className={`card shadow ${darkMode ? 'bg-dark text-white border-secondary' : ''}`}>
            <div className="card-body p-4">
              <div className="text-center mb-4">
                <i className="bi bi-shield-lock display-1 text-primary"></i>
                <h2 className="mt-3">Admin Login</h2>
                <p className="text-muted">Enter your credentials to access the admin panel</p>
              </div>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    className={`form-control ${darkMode ? 'bg-dark text-white border-secondary' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="admin@example.com"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className={`form-control ${darkMode ? 'bg-dark text-white border-secondary' : ''}`}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="••••••••"
                  />
                </div>
                
                <div className="d-grid mb-3">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Logging in...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Login
                      </>
                    )}
                  </button>
                </div>
                
                <div className="text-center">
                  <button 
                    type="button" 
                    className="btn btn-sm btn-link"
                    onClick={fillTestCredentials}
                  >
                    <i className="bi bi-lightning-fill me-1"></i>
                    Quick Access (Test Credentials)
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
