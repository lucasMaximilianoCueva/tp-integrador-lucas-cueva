import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Ticket from './pages/Ticket';
import AdminLogin from './pages/AdminLogin';
import './assets/css/styles.css';

function App() {
  const [customerName, setCustomerName] = useState('');
  
  // Check if customer name is stored in localStorage
  useEffect(() => {
    const storedName = localStorage.getItem('customerName');
    if (storedName) {
      setCustomerName(storedName);
    }
  }, []);

  // Save customer name to localStorage when it changes
  useEffect(() => {
    if (customerName) {
      localStorage.setItem('customerName', customerName);
    }
  }, [customerName]);

  // Reset customer flow
  const resetCustomerFlow = () => {
    setCustomerName('');
    localStorage.removeItem('customerName');
  };

  return (
    <ThemeProvider>
      <CartProvider>
        <Router>
          <div className="app-container d-flex flex-column min-vh-100">
            <Header customerName={customerName} />
            
            <main className="flex-grow-1">
              <Routes>
                <Route 
                  path="/" 
                  element={customerName ? <Navigate to="/products" /> : <Home setCustomerName={setCustomerName} />} 
                />
                <Route 
                  path="/products" 
                  element={customerName ? <Products /> : <Navigate to="/" />} 
                />
                <Route 
                  path="/products/:id" 
                  element={customerName ? <ProductDetail /> : <Navigate to="/" />} 
                />

                <Route 
                  path="/cart" 
                  element={customerName ? <Cart /> : <Navigate to="/" />} 
                />
                <Route 
                  path="/ticket" 
                  element={customerName ? <Ticket customerName={customerName} /> : <Navigate to="/" />} 
                />

                <Route path="/admin" element={<AdminLogin />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
            
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;