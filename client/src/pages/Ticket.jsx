import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import html2pdf from 'html2pdf.js';

const Ticket = ({ customerName }) => {
  const { darkMode } = useContext(ThemeContext);
  const [ticketData, setTicketData] = useState(null);
  const [ticketId, setTicketId] = useState(null);

  useEffect(() => {
    // Generate random ticket ID
    const randomId = Math.floor(100000 + Math.random() * 900000);
    setTicketId(randomId);
    
    // Get cart history from localStorage
    const lastCartItems = JSON.parse(localStorage.getItem('lastCartItems'));
    
    if (lastCartItems && lastCartItems.length > 0) {
      // Calculate total
      const total = lastCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      setTicketData({
        date: new Date().toISOString(),
        customerName: customerName,
        items: lastCartItems,
        total: total
      });
    } else {
      // Fallback if no cart data is available
      setTicketData({
        date: new Date().toISOString(),
        customerName: customerName,
        items: [
          { name: 'Product not available', price: 0, quantity: 0 }
        ],
        total: 0
      });
    }
  }, [customerName]);

  const handleDownloadPDF = () => {
    const ticketElement = document.getElementById('ticket-content');
    
    // Save the current theme class
    const hasThemeClass = ticketElement.classList.contains('dark-theme');
    
    // Temporarily remove dark theme for PDF generation
    if (hasThemeClass) {
      ticketElement.classList.remove('dark-theme');
    }
    
    const options = {
      margin: 10,
      filename: `autoservice-receipt-${ticketId}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().from(ticketElement).set(options).save().then(() => {
      // Restore theme class if it was removed
      if (hasThemeClass) {
        ticketElement.classList.add('dark-theme');
      }
    });
  };

  if (!ticketData) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className={`card shadow ${darkMode ? 'bg-dark text-white border-secondary' : ''}`}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Purchase Receipt</h5>
              <button 
                className="btn btn-sm btn-primary"
                onClick={handleDownloadPDF}
              >
                <i className="bi bi-download me-2"></i>
                Download PDF
              </button>
            </div>
            
            <div className="card-body">
              <div id="ticket-content" className={darkMode ? 'dark-theme' : ''}>
                <div className="p-4">
                  <div className="text-center mb-4">
                    <h2 className="mb-1">AutoService</h2>
                    <p className="mb-0">Tech Accessories Store</p>
                    <p className="mb-0">123 Main Street, City, Country</p>
                    <p>Phone: (123) 456-7890</p>
                  </div>
                  
                  <div className="row mb-4">
                    <div className="col-6">
                      <p className="mb-1"><strong>Receipt #:</strong> {ticketId}</p>
                      <p className="mb-0"><strong>Date:</strong> {new Date(ticketData.date).toLocaleDateString()}</p>
                    </div>
                    <div className="col-6 text-end">
                      <p className="mb-0"><strong>Customer:</strong> {ticketData.customerName}</p>
                    </div>
                  </div>
                  
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th className="text-center">Qty</th>
                        <th className="text-end">Price</th>
                        <th className="text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ticketData.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td className="text-center">{item.quantity}</td>
                          <td className="text-end">${item.price.toFixed(2)}</td>
                          <td className="text-end">${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                        <td className="text-end"><strong>${ticketData.total.toFixed(2)}</strong></td>
                      </tr>
                    </tfoot>
                  </table>
                  
                  <div className="mt-4 pt-3 border-top">
                    <p className="text-center mb-1">Thank you for your purchase!</p>
                    <p className="text-center mb-0">Please keep this receipt for your records.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <Link to="/" className="btn btn-primary">
              <i className="bi bi-house me-2"></i>
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
