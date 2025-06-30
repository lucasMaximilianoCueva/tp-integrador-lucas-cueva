const { User } = require('./models');
const bcrypt = require('bcrypt');

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ where: { email: 'admin@example.com' } });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }
    
    // Create admin user
    const adminUser = await User.create({
      email: 'admin@example.com',
      password: 'admin123', // Will be hashed by the User model hooks
      isAdmin: true
    });
    
    console.log('Admin user created successfully:', adminUser.email);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    process.exit();
  }
}

createAdminUser();
