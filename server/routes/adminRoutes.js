const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');
const { uploadProductImage } = require('../middlewares/uploadMiddleware');
const adminController = require('../controllers/adminController');

// Login page (accessible without authentication)
router.get('/login', adminController.renderLoginPage);

// Middleware to check authentication and admin privileges for all other admin routes
router.use((req, res, next) => {
  if (req.path === '/login') {
    return next();
  }
  // Apply both middlewares in sequence
  isAuthenticated(req, res, (err) => {
    if (err) return next(err);
    isAdmin(req, res, next);
  });
});

// Dashboard page
router.get('/dashboard', isAdmin, adminController.renderDashboard);

// Product management routes
router.get('/products/create', isAdmin, adminController.renderCreateProductPage);
router.get('/products/edit/:id', isAdmin, adminController.renderEditProductPage);
router.post('/products/create', isAdmin, uploadProductImage, adminController.createProduct);
router.post('/products/edit/:id', isAdmin, uploadProductImage, adminController.updateProduct);
router.post('/products/toggle/:id', isAdmin, adminController.toggleProductStatus);

module.exports = router;
