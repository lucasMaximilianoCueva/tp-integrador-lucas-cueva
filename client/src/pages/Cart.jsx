import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { ThemeContext } from '../context/ThemeContext';
import { saleApi } from '../services/api';

const Cart = () => {
  const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const { darkMode } = useContext(ThemeContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handle checkout
  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Get customer name from localStorage
      const customerName = localStorage.getItem('customerName');
      
      // Prepare sale data
      const saleData = {
        customerName,
        products: cartItems.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };
      
      // Create sale
      await saleApi.create(saleData);
      
      // Save cart items to localStorage for ticket generation
      localStorage.setItem('lastCartItems', JSON.stringify(cartItems));
      
      // Clear cart and navigate to ticket page
      clearCart();
      navigate('/ticket');
      
    } catch (err) {
      console.error('Error processing checkout:', err);
      setError('Failed to process checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Your Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className={`card shadow ${darkMode ? 'bg-dark text-white border-secondary' : ''}`}>
          <div className="card-body text-center p-5">
            <i className="bi bi-cart-x display-1 text-muted mb-3"></i>
            <h3>Your cart is empty</h3>
            <p className="mb-4">Looks like you haven't added any products to your cart yet.</p>
            <Link to="/products" className="btn btn-primary">
              <i className="bi bi-shop me-2"></i>
              Browse Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-8">
            <div className={`card shadow mb-4 ${darkMode ? 'bg-dark text-white border-secondary' : ''}`}>
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Cart Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</h5>
                <button 
                  className="btn btn-sm btn-outline-danger"
                  onClick={clearCart}
                >
                  <i className="bi bi-trash me-1"></i>
                  Clear Cart
                </button>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className={`table ${darkMode ? 'table-dark' : ''} mb-0`}>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map(item => (
                        <tr key={item.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <img 
                                src={item.image.startsWith('http') ? item.image : `http://localhost:3000${item.image}`} 
                                alt={item.name} 
                                className="img-thumbnail me-3"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://via.placeholder.com/50x50?text=NA';
                                }} 
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              />
                              <div>
                                <h6 className="mb-0">{item.name}</h6>
                                <small className={`text-${darkMode ? 'light' : 'muted'}`}>
                                  {item.category === 'phone' ? 'Phone Accessory' : 'Computer Accessory'}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>${item.price.toFixed(2)}</td>
                          <td>
                            <div className="input-group" style={{ width: '120px' }}>
                              <button 
                                className="btn btn-sm btn-outline-secondary" 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <i className="bi bi-dash"></i>
                              </button>
                              <input 
                                type="number" 
                                className={`form-control form-control-sm text-center ${darkMode ? 'bg-dark text-white border-secondary' : ''}`}
                                value={item.quantity}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  if (!isNaN(value) && value >= 0) {
                                    updateQuantity(item.id, value);
                                  }
                                }}
                                min="1"
                              />
                              <button 
                                className="btn btn-sm btn-outline-secondary" 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <i className="bi bi-plus"></i>
                              </button>
                            </div>
                          </td>
                          <td>${(item.price * item.quantity).toFixed(2)}</td>
                          <td>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="d-flex justify-content-between">
              <Link to="/products" className="btn btn-outline-secondary">
                <i className="bi bi-arrow-left me-2"></i>
                Continue Shopping
              </Link>
            </div>
          </div>
          
          <div className="col-lg-4">
            <div className={`card shadow ${darkMode ? 'bg-dark text-white border-secondary' : ''}`}>
              <div className="card-header">
                <h5 className="mb-0">Order Summary</h5>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-3">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-4">
                  <strong>Total</strong>
                  <strong>${cartTotal.toFixed(2)}</strong>
                </div>
                
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                
                <button 
                  className="btn btn-success w-100"
                  onClick={handleCheckout}
                  disabled={loading || cartItems.length === 0}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-credit-card me-2"></i>
                      Checkout
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
