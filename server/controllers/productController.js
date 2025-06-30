const { Product } = require('../models');
const path = require('path');
const fs = require('fs');

// Get all products (paginated)
exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit; // Calculate the offset for pagination***
    const category = req.query.category;
    
    let whereCondition = { active: true };
    if (category) {
      whereCondition.category = category;
    }

    const { count, rows } = await Product.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [['id', 'ASC']]
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      products: rows,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: page,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all products for admin (including inactive)
exports.getAllProductsAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Product.findAndCountAll({
      limit,
      offset,
      order: [['id', 'ASC']]
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      products: rows,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: page,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const image = `/uploads/${req.file.filename}`;
    
    const product = await Product.create({
      name,
      description,
      price,
      category,
      image,
      active: true
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, active } = req.body;
    
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let image = product.image;
    
    // If a new image is uploaded
    if (req.file) {
      // Delete old image if it exists
      if (product.image) {
        const oldImagePath = path.join(__dirname, '..', product.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      image = `/uploads/${req.file.filename}`;
    }

    await product.update({
      name,
      description,
      price,
      category,
      image,
      active: active !== undefined ? active : product.active
    });

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Toggle product active status
exports.toggleProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.update({ active: !product.active });

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a product (hard delete - not used, we use toggle instead)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete image file
    if (product.image) {
      const imagePath = path.join(__dirname, '..', product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await product.destroy();

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get top selling products
exports.getTopSellingProducts = async (req, res) => {
  try {
    const [results] = await Product.sequelize.query(`
      SELECT 
        Products.id, 
        Products.name, 
        Products.price, 
        Products.image, 
        Products.category,
        SUM(SaleProducts.quantity) as totalSold
      FROM Products
      JOIN SaleProducts ON Products.id = SaleProducts.productId
      GROUP BY Products.id
      ORDER BY totalSold DESC
      LIMIT 10
    `);

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
