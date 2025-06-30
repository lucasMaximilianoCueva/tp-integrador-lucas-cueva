const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const saleController = require('../controllers/saleController');
const authController = require('../controllers/authController');
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');
const { uploadProductImage } = require('../middlewares/uploadMiddleware');

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);
router.get('/auth/user', isAuthenticated, authController.getCurrentUser);

// Product routes
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', isAuthenticated, isAdmin, uploadProductImage, productController.createProduct);
router.put('/products/:id', isAuthenticated, isAdmin, uploadProductImage, productController.updateProduct);
router.patch('/products/:id/toggle-status', isAuthenticated, isAdmin, productController.toggleProductStatus);
router.delete('/products/:id', isAuthenticated, isAdmin, productController.deleteProduct);

// Sale routes
router.post('/sales', saleController.createSale);
// router.get('/sales', isAuthenticated, isAdmin, saleController.getAllSales);
// router.get('/sales/:id', isAuthenticated, isAdmin, saleController.getSaleById);



module.exports = router;
