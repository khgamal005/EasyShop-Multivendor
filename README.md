**EasyShop** is a modern multi-vendor e-commerce platform where multiple sellers can register and sell products, and users can browse, filter, and purchase using different payment methods. The platform includes full seller and admin dashboards, real-time order management, and secure authentication.

---

## 🚀 Features

### 👤 User

- Register/Login with email verification
- Edit profile, view order history
- Secure checkout with Stripe, PayPal, or Cash on Delivery
- Write product reviews and rate items

### 🛒 Seller

- Register as a vendor
- Register/Login with email verification

- Create and manage products with images, colors, and categories
- Manage orders and see income statistics
- Seller dashboard with sales overview

### 🛠️ Admin

- Full admin panel to manage:
  - Users
  - Sellers
  - Products
  - Orders
  - Brands
  - Categories/Subcategories
- Approve/block sellers and products
- Manage site banners and homepage content

---

## 🧰 Tech Stack

### Frontend

- React
- Redux Toolkit
- Tailwind CSS
- Axios

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- Cloudinary for image storage
- Nodemailer for email activation
- Stripe & PayPal integration

---

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/khgamal005/EasyShop-Multivendor.git
cd Easyshop


Frontend: https://easy-shop-multivendor.vercel.app/

Backend: https://backend-misty-haze-1431.fly.dev

2. Setup the Backend
cd backend
npm install
npm run dev
 Backend .env Example
 
 PORT=8000
MONGODB_URI=your-mongodb-connection-uri
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8000

JWT_SECRET_KEY=your-jwt-secret
JWT_EXPIRES=7d
ACTIVATION_SECRET=your-activation-secret

SMPT_SERVICE=gmail
SMPT_HOST=smtp.gmail.com
SMPT_PORT=465
SMPT_PASSWORD=your-gmail-app-password

STRIPE_API_KEY=your-stripe-public-key
STRIPE_SECRET_KEY=your-stripe-secret-key

NODE_ENV=development



  3. Setup the Frontend

  cd frontend
npm install
npm run dev

 frontend .env Example


VITE_API_BASE_URL=http://localhost:8000/

VITE_PRODUCT_IMAGE_PATH=products/
VITE_Shop_IMAGE_PATH=sellers/
VITE_user_IMAGE_PATH=users/
VITE_EVENT_IMAGE_PATH=events/
VITE_Category_IMAGE_PATH=category/
```

![screenshot](./screenshots/Vite-React-07-16-2025_03_37_AM.png)
![screenshot](./screenshots/Vite-React-07-16-2025_03_46_AM.png)
![screenshot](./screenshots/Vite-React-07-16-2025_03_48_AM.png)
![screenshot](./screenshots/Vite-React-07-16-2025_03_49_AM.png)
![screenshot](./screenshots/Vite-React-07-16-2025_03_51_AM.png)
![screenshot](./screenshots/Vite-React-07-16-2025_03_52_AM.png)
![screenshot](./screenshots/Vite-React-07-16-2025_03_54_AM.png)
![screenshot](./screenshots/Vite-React-07-16-2025_03_56_AM.png)
![screenshot](./screenshots/Vite-React-07-16-2025_03_57_AM.png)
![screenshot](./screenshots/Vite-React-07-16-2025_03_58_AM.png)
![screenshot](./screenshots/Vite-React-07-16-2025_03_59_AM.png)
![screenshot](./screenshots/Vite-React-07-16-2025_03_59_AM.png)
![screenshot](./screenshots/Vite-React-07-16-2025_04_02_AM.png)
![screenshot](./screenshots/Vite-React-07-16-2025_04_02_AM.png)
![screenshot](./screenshots/Vite-React-07-16-2025_04_04_AM.png)
![screenshot](./screenshots/Vite-React-07-16-2025_04_06_AM.png)
![screenshot](./screenshots/Vite-React-07-16-2025_04_10_AM.png)
![screenshot](./screenshots/Vite-React-07-16-2025_04_11_AM.png)
![screenshot](./screenshots/Vite-React-07-16-2025_04_12_AM.png)
![screenshot](./screenshots/Vite-React-07-16-2025_04_13_AM.png)
![screenshot](./screenshots/Vite-React-07-16-2025_04_14_AM.png)
![screenshot](./screenshots/Vite-React-07-16-2025_04_16_AM.png)
![screenshot](./screenshots/Vite-React-07-16-2025_04_17_AM.png)
![screenshot](./screenshots/Vite-React-07-16-2025_04_18_AM.png)
![screenshot](./screenshots/Vite-React-07-16-2025_04_20_AM.png)
![screenshot](./screenshots/Vite-React-07-16-2025_04_21_AM.png)
