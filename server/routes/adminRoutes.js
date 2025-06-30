const express = require('express');
const router = express.Router();
const { Product, Sale } = require('../models');
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');
const { uploadProductImage } = require('../middlewares/uploadMiddleware');
const path = require('path');

// Login page (accessible without authentication)
router.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/admin/dashboard');
  }
  res.render('login', { title: 'Admin Login' });
});

// Middleware to check authentication for all other admin routes
router.use((req, res, next) => {
  if (req.path === '/login') {
    return next();
  }
  isAuthenticated(req, res, next);
});



// Dashboard page
router.get('/dashboard', isAdmin, async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [['category', 'ASC'], ['name', 'ASC']]
    });
    
    const phoneProducts = products.filter(p => p.category === 'phone');
    const computerProducts = products.filter(p => p.category === 'computer');
    
    res.render('dashboard', { 
      title: 'Admin Dashboard',
      phoneProducts,
      computerProducts,
      user: req.session.user
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Server error', error });
  }
});

// Create product page
router.get('/products/create', isAdmin, (req, res) => {
  res.render('create', { 
    title: 'Create Product',
    user: req.session.user
  });
});

// Edit product page
router.get('/products/edit/:id', isAdmin, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).render('error', { message: 'Product not found' });
    }
    
    res.render('edit', { 
      title: 'Edit Product',
      product,
      user: req.session.user
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Server error', error });
  }
});









// Process create product form
router.post('/products/create', isAdmin, uploadProductImage, async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    
    if (!req.file) {
      return res.status(400).render('create', { 
        title: 'Create Product',
        error: 'Image is required',
        formData: req.body,
        user: req.session.user
      });
    }
    
    const image = `/uploads/products/${req.file.filename}`;
    
    await Product.create({
      name,
      description,
      price,
      category,
      image,
      active: true
    });
    
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).render('create', { 
      title: 'Create Product',
      error: 'Failed to create product',
      formData: req.body,
      user: req.session.user
    });
  }
});

// Process edit product form
router.post('/products/edit/:id', isAdmin, uploadProductImage, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category } = req.body;
    
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).render('error', { message: 'Product not found' });
    }
    
    let image = product.image;
    
    if (req.file) {
      image = `/uploads/products/${req.file.filename}`;
    }
    
    await product.update({
      name,
      description,
      price,
      category,
      image
    });
    
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).render('edit', { 
      title: 'Edit Product',
      error: 'Failed to update product',
      product: { ...req.body, id: req.params.id },
      user: req.session.user
    });
  }
});

// Toggle product status
router.post('/products/toggle/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await product.update({ active: !product.active });
    
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
