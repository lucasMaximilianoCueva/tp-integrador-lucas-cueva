const { Product, Sale } = require('../models');

// Render login page
exports.renderLoginPage = (req, res) => {
  if (req.session.user) {
    return res.redirect('/admin/dashboard');
  }
  res.render('login', { title: 'Admin Login' });
};

// Render dashboard page
exports.renderDashboard = async (req, res) => {
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
};

// Render create product page
exports.renderCreateProductPage = (req, res) => {
  res.render('create', { 
    title: 'Create Product',
    user: req.session.user
  });
};

// Render edit product page
exports.renderEditProductPage = async (req, res) => {
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
};

// Create a new product
exports.createProduct = async (req, res) => {
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
};

// Update an existing product
exports.updateProduct = async (req, res) => {
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
};

// Toggle product status (active/inactive)
exports.toggleProductStatus = async (req, res) => {
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
};
