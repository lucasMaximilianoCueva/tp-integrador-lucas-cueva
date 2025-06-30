const { Sale, Product, SaleProduct, sequelize } = require('../models');

// Create a new sale
exports.createSale = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { customerName, products } = req.body;
    
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Products are required' });
    }

    // Calculate total amount
    let totalAmount = 0;
    const productIds = products.map(p => p.id);
    
    // Get all products from DB to verify they exist and get their prices
    const dbProducts = await Product.findAll({
      where: { 
        id: productIds,
        active: true
      }
    });

    if (dbProducts.length !== productIds.length) {
      await t.rollback();
      return res.status(400).json({ message: 'Some products are invalid or inactive' });
    }

    // Create a map of products for easier access
    const productMap = {};
    dbProducts.forEach(p => {
      productMap[p.id] = p;
    });

    // Calculate total amount and prepare sale products
    const saleProducts = [];
    for (const product of products) {
      const dbProduct = productMap[product.id];
      if (!dbProduct) {
        await t.rollback();
        return res.status(400).json({ message: `Product with id ${product.id} not found or inactive` });
      }
      
      const quantity = product.quantity || 1;
      const price = dbProduct.price;
      totalAmount += price * quantity;
      
      saleProducts.push({
        productId: product.id,
        quantity,
        price
      });
    }

    // Create the sale
    const sale = await Sale.create({
      customerName,
      totalAmount,
      date: new Date()
    }, { transaction: t });

    // Create sale products
    for (const product of saleProducts) {
      await SaleProduct.create({
        saleId: sale.id,
        productId: product.productId,
        quantity: product.quantity,
        price: product.price
      }, { transaction: t });
    }

    await t.commit();

    // Get the complete sale with products
    const completeSale = await Sale.findByPk(sale.id, {
      include: [
        {
          model: Product,
          through: {
            attributes: ['quantity', 'price']
          }
        }
      ]
    });

    res.status(201).json(completeSale);
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all sales
exports.getAllSales = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Sale.findAndCountAll({
      limit,
      offset,
      order: [['date', 'DESC']],
      include: [
        {
          model: Product,
          through: {
            attributes: ['quantity', 'price']
          }
        }
      ]
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      sales: rows,
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

// Get a single sale by ID
exports.getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          through: {
            attributes: ['quantity', 'price']
          }
        }
      ]
    });
    
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    res.json(sale);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get top expensive sales
exports.getTopExpensiveSales = async (req, res) => {
  try {
    const sales = await Sale.findAll({
      order: [['totalAmount', 'DESC']],
      limit: 10,
      include: [
        {
          model: Product,
          through: {
            attributes: ['quantity', 'price']
          }
        }
      ]
    });

    res.json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get sales by date range
exports.getSalesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const sales = await Sale.findAll({
      where: {
        date: {
          [sequelize.Op.between]: [new Date(startDate), new Date(endDate)]
        }
      },
      include: [
        {
          model: Product,
          through: {
            attributes: ['quantity', 'price']
          }
        }
      ],
      order: [['date', 'DESC']]
    });

    res.json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
