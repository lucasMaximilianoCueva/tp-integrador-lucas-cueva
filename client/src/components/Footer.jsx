import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const Footer = () => {
  const { darkMode } = useContext(ThemeContext);
  
  return (
    <footer className={`py-3 mt-auto ${darkMode ? 'bg-dark text-white' : 'bg-light'}`}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0">&copy; {new Date().getFullYear()} AutoService. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-center text-md-end mt-2 mt-md-0">
            <a href="#" className="text-decoration-none me-3">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="#" className="text-decoration-none me-3">
              <i className="bi bi-instagram"></i>
            </a>
            <a href="#" className="text-decoration-none me-3">
              <i className="bi bi-twitter"></i>
            </a>
            <a href="#" className="text-decoration-none">
              <i className="bi bi-linkedin"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
