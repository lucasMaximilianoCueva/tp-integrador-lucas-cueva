const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new admin user
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const user = await User.create({
      email,
      password,
      isAdmin: true
    });
    
    // Remove password from response
    const userResponse = { ...user.get() };
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.render('login', { error: 'Invalid credentials' });
    }
    
    // Check password
    const isPasswordValid = await user.validPassword(password);
    if (!isPasswordValid) {
      return res.render('login', { error: 'Invalid credentials' });
    }
    
    // Check if user is admin
    if (!user.isAdmin) {
      return res.render('login', { error: 'You do not have admin privileges' });
    }
    
    // Create token
    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.isAdmin },
      'tech-accessories-autoservice-jwt-secret',
      { expiresIn: '1d' }
    );
    
    // Set session
    req.session.user = {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin
    };
    
    // Check if request is from API or form
    const isApiRequest = req.xhr || 
                        req.headers['content-type']?.includes('application/json') || 
                        req.headers.accept?.includes('application/json');
    
    if (isApiRequest) {
      // Return JSON for API requests
      return res.json({
        user: {
          id: user.id,
          email: user.email,
          isAdmin: user.isAdmin
        },
        token
      });
    } else {
      // Redirect to admin dashboard for form submissions
      return res.redirect('/admin/dashboard');
    }
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Server error', error });
  }
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed', error: err.message });
    }
    res.clearCookie('connect.sid');
    
    // Check if request is AJAX/API call or form submission
    const isApiRequest = req.xhr || req.headers.accept?.includes('application/json');
    
    if (isApiRequest) {
      // If API request, return JSON response
      return res.json({ message: 'Logged out successfully' });
    } else {
      // If form submission, redirect to admin login page
      return res.redirect('/admin/login');
    }
  });
};

// Get current user
exports.getCurrentUser = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  res.json(req.session.user);
};


