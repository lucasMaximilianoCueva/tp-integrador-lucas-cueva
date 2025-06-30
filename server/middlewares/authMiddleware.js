const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware to check if user is authenticated
exports.isAuthenticated = (req, res, next) => {
  // Check if user is authenticated via session
  if (req.session && req.session.user) {
    return next();
  }
  
  // Check if user is authenticated via JWT
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  try {
    const decoded = jwt.verify(token, 'tech-accessories-autoservice-jwt-secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to check if user is admin
exports.isAdmin = async (req, res, next) => {
  try {
    // If user is authenticated via session
    if (req.session && req.session.user && req.session.user.isAdmin) {
      return next();
    }
    
    // If user is authenticated via JWT
    if (req.user) {
      const user = await User.findByPk(req.user.id);
      if (user && user.isAdmin) {
        return next();
      }
    }
    
    return res.status(403).json({ message: 'Admin access required' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
