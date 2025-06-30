# AutoService - Tech Accessories Store

A full-stack web application for a tech accessories store with a React frontend and Node.js/Express backend. The application includes both a customer-facing e-commerce site and an admin panel for managing products and sales.

## Features

### Customer Features
- Browse tech accessories by category (phone and computer accessories)
- View product details
- Add products to cart
- Complete purchase and receive digital receipt
- Light/dark theme toggle

### Admin Features
- Secure login with session authentication
- Dashboard with product management
- Add/edit products with image upload
- View sales records and statistics

## Technology Stack

### Frontend
- React 18
- React Router v6
- Context API for state management
- Bootstrap 5 for styling
- Bootstrap Icons
- Axios for API requests
- HTML2PDF for ticket generation

### Backend
- Node.js with Express
- SQLite with Sequelize ORM
- EJS templating for admin views
- JWT and session-based authentication
- Multer for file uploads
- bcrypt for password encryption

## Project Structure

```
tp-integrador-prog3/
├── 📁 client/ (React)
│   ├── 📁 public/
│   ├── 📁 src/
│   │   ├── 📁 assets/
│   │   │   └── 📁 css/
│   │   │       └── styles.css
│   │   ├── 📁 components/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ProductCard.jsx
│   │   ├── 📁 context/
│   │   │   ├── CartContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── 📁 pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Ticket.jsx
│   │   │   └── AdminLogin.jsx
│   │   ├── 📁 services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── 📁 server/ (Node.js + Express + EJS)
│   ├── 📁 controllers/
│   │   ├── productController.js
│   │   ├── saleController.js
│   │   └── authController.js
│   ├── 📁 middlewares/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── 📁 models/
│   │   ├── index.js
│   │   ├── product.js
│   │   ├── user.js
│   │   ├── sale.js
│   │   └── saleProduct.js
│   ├── 📁 routes/
│   │   ├── apiRoutes.js
│   │   └── adminRoutes.js
│   ├── 📁 views/ (EJS)
│   │   ├── login.ejs
│   │   ├── dashboard.ejs
│   │   ├── create.ejs
│   │   ├── edit.ejs
│   │   └── error.ejs
│   ├── 📁 uploads/
│   │   └── 📁 products/
│   ├── app.js
│   └── package.json
│
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create uploads directory:
   ```bash
   mkdir -p uploads/products
   ```

4. Start the server:
   ```bash
   node app.js
   ```
   The server will run on http://localhost:3000

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The client will run on http://localhost:5173

## Default Admin Credentials
- Email: admin@example.com
- Password: admin123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new admin user
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/logout` - Logout (clear session)
- `GET /api/auth/me` - Get current user info

### Products
- `GET /api/products` - Get all products (with pagination and filtering)
- `GET /api/products/:id` - Get a specific product
- `POST /api/products` - Create a new product (with image upload)
- `PUT /api/products/:id` - Update a product
- `PATCH /api/products/:id/toggle` - Toggle product active status
- `GET /api/products/top-selling` - Get top selling products

### Sales
- `POST /api/sales` - Create a new sale
- `GET /api/sales` - Get all sales (with pagination)
- `GET /api/sales/top-expensive` - Get top expensive sales

## License
This project is licensed under the MIT License.
