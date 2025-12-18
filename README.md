# 📱 E-Commerce Mobile Application (MERN Stack)

A full-stack **E-commerce mobile application** built using **React Native** for the frontend and **Node.js, Express.js, MongoDB** for the backend.  
The app provides a complete shopping experience including product browsing, authentication, cart management, and order handling.

---

## 🛠 Tech Stack

### Frontend
- React Native
- JavaScript
- Axios
- React Navigation

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Other Tools
- JWT Authentication
- REST APIs
- Git & GitHub

---

## 📁 Project Structure

```
Ecommerce-mobile_app/
│
├── client/                          # React Native Frontend
│   ├── android/                     # Android native files
│   ├── ios/                         # iOS native files
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   ├── ProductCard.js
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   │   └── LoadingSpinner.js
│   │   ├── screens/                 # App screens
│   │   │   ├── Auth/
│   │   │   │   ├── LoginScreen.js
│   │   │   │   └── RegisterScreen.js
│   │   │   ├── Home/
│   │   │   │   └── HomeScreen.js
│   │   │   ├── Product/
│   │   │   │   ├── ProductListScreen.js
│   │   │   │   └── ProductDetailScreen.js
│   │   │   ├── Cart/
│   │   │   │   └── CartScreen.js
│   │   │   ├── Order/
│   │   │   │   ├── CheckoutScreen.js
│   │   │   │   └── OrderHistoryScreen.js
│   │   │   └── Profile/
│   │   │       └── ProfileScreen.js
│   │   ├── navigation/              # Navigation setup
│   │   │   ├── AppNavigator.js
│   │   │   └── AuthNavigator.js
│   │   ├── services/                # API calls
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   │   └── orderService.js
│   │   ├── context/                 # Context API / State Management
│   │   │   ├── AuthContext.js
│   │   │   └── CartContext.js
│   │   ├── utils/                   # Utility functions
│   │   │   ├── helpers.js
│   │   │   └── constants.js
│   │   └── assets/                  # Images, fonts, etc.
│   │       ├── images/
│   │       └── fonts/
│   ├── App.js                       # Root component
│   ├── package.json
│   └── .env                         # Environment variables
│
├── server/                          # Node.js Backend
│   ├── config/                      # Configuration files
│   │   ├── db.js                    # Database connection
│   │   └── config.js                # App configurations
│   ├── controllers/                 # Request handlers
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── categoryController.js
│   │   └── userController.js
│   ├── models/                      # Mongoose schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Category.js
│   ├── routes/                      # API routes
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── categoryRoutes.js
│   │   └── userRoutes.js
│   ├── middleware/                  # Custom middleware
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── adminMiddleware.js
│   ├── utils/                       # Utility functions
│   │   ├── tokenGenerator.js
│   │   └── validators.js
│   ├── server.js                    # Entry point
│   ├── package.json
│   └── .env                         # Environment variables
│
├── .gitignore
└── README.md
```

---

## ✨ Features

### User Features
- User registration & login
- Secure authentication using JWT
- Browse products by category
- View product details
- Add/remove items from cart
- Place orders
- View order history

### Admin Features
- Add / update / delete products
- Manage categories
- View all orders
- Manage users

---
