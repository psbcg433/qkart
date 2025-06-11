# QKart - E-Commerce Platform

![QKart Logo](public/logo_dark.svg)

QKart is a full-stack e-commerce platform built with React, Material-UI, and Node.js, featuring product browsing, cart management, user authentication, and checkout functionality.

## Live Demo

[![QKART Web App ](public/homepage.png)](https://qkart-blush.vercel.app/)

## Features

- **User Authentication**
  - Secure login/register system
  - Session persistence using JWT tokens
  - Protected routes for checkout

- **Product Management**
  - Browse products with images and details
  - Real-time search functionality
  - Product rating system

- **Shopping Cart**
  - Add/remove items
  - Quantity adjustment
  - Real-time cart value calculation

- **Checkout Process**
  - Address management (add/delete)
  - Wallet balance integration
  - Order confirmation page

- **UI/UX**
  - Responsive design
  - Material-UI components
  - Toast notifications
  - Consistent theme across application

## Tech Stack

**Frontend:**
- React 18
- Material-UI (v7)
- React Router (v6)
- Axios for API calls
- Notistack for notifications

**Backend:**
- Node.js (hosted on Render)
- REST API architecture

## Project Structure

```
qkart/
├── public/                  # Static assets
│   ├── index.html
│   ├── logo_dark.svg
│   └── logo_light.svg
├── src/
│   ├── assets/              # Additional assets
│   ├── components/          # React components
│   │   ├── Cart.js          # Shopping cart logic
│   │   ├── Checkout.js      # Checkout process
│   │   ├── Footer.js        # App footer
│   │   ├── Header.js        # Navigation header
│   │   ├── Login.js         # Login form
│   │   ├── ProductCard.js   # Product display
│   │   ├── Products.js      # Product listing
│   │   ├── Register.js      # Registration form
│   │   └── Thanks.js        # Order confirmation
│   ├── App.js               # Main app with routes
│   ├── index.js             # Entry point
│   ├── theme.js             # MUI theme config
│   └── index.css            # Global styles
├── .gitignore
├── package.json             # Project dependencies
└── README.md                # Project documentation
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/psbcg433/qkart.git
   cd qkart
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

| Endpoint | Method | Description | Requires Auth |
|----------|--------|-------------|---------------|
| `/api/v1/auth/register` | POST | Register new user | No |
| `/api/v1/auth/login` | POST | Authenticate user | No |
| `/api/v1/products` | GET | Get all products | No |
| `/api/v1/products/search` | GET | Search products | No |
| `/api/v1/cart` | GET | Get user's cart | Yes |
| `/api/v1/cart` | POST | Add item to cart | Yes |
| `/api/v1/cart/checkout` | POST | Process order checkout | Yes |
| `/api/v1/user/addresses` | GET | Get user addresses | Yes |
| `/api/v1/user/addresses` | POST | Add new address | Yes |
| `/api/v1/user/addresses/{addressId}` | DELETE | Delete address | Yes |



## Configuration

The app connects to a backend API hosted on Render. The endpoint is configured in `src/App.js`:

```javascript
export const config = {
  endpoint: `https://qkartapp.onrender.com/api/v1`,
};
```

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm run build`: Builds the app for production






