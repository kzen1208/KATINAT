# Katinat Coffee Shop

A full-stack web application for Katinat Coffee Shop with a responsive frontend and Node.js/Express/MongoDB backend.

## Features

- Responsive design for mobile and desktop
- Product catalog with customization options
- Store locator with details
- News and promotions
- User authentication and profiles
- Shopping cart and checkout
- Admin dashboard for managing products, orders, and content

## Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript
- Responsive design

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4 or higher)

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/katinat-coffee.git
cd katinat-coffee
```

2. Install dependencies
```
npm install
```

3. Create a .env file in the root directory with the following variables
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/katinat
JWT_SECRET=your_jwt_secret
```

4. Seed the database with initial data
```
npm run seed
```

5. Start the server
```
npm start
```

For development with auto-restart:
```
npm run dev
```

6. Access the application
- Frontend: http://localhost:5000
- API: http://localhost:5000/api

## API Endpoints

### Products
- GET /api/products - Get all products
- GET /api/products/:id - Get a specific product
- POST /api/products - Create a new product (Admin only)
- PUT /api/products/:id - Update a product (Admin only)
- DELETE /api/products/:id - Delete a product (Admin only)

### Orders
- GET /api/orders - Get all orders (Admin only)
- GET /api/orders/my-orders - Get current user's orders
- GET /api/orders/:id - Get a specific order
- POST /api/orders - Create a new order
- PATCH /api/orders/:id/status - Update order status (Admin only)
- PATCH /api/orders/:id/cancel - Cancel an order

### Users
- POST /api/users/register - Register a new user
- POST /api/users/login - Login user
- GET /api/users/profile - Get current user profile
- PUT /api/users/profile - Update user profile
- POST /api/users/address - Add a new address

### Stores
- GET /api/stores - Get all stores
- GET /api/stores/:id - Get a specific store
- POST /api/stores - Create a new store (Admin only)
- PUT /api/stores/:id - Update a store (Admin only)
- DELETE /api/stores/:id - Delete a store (Admin only)

### News
- GET /api/news - Get all published news
- GET /api/news/all - Get all news including unpublished (Admin only)
- GET /api/news/:id - Get a specific news article
- POST /api/news - Create a new news article (Admin only)
- PUT /api/news/:id - Update a news article (Admin only)
- DELETE /api/news/:id - Delete a news article (Admin only)

## Admin Access

Default admin credentials:
- Email: admin@katinat.com
- Password: admin123

## License

This project is licensed under the MIT License.