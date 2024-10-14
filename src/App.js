import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './components/Admin/AdminDashboard';
import ProductForm from './components/Admin/ProductForm';
import ProductList from './components/Admin/ProductList';
import UserList from './components/Admin/UserList';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Cart from './components/Cart/Cart';
import CustomerDashboard from './components/Customer/CustomerDashboard';
import ProductDetails from './components/Products/ProductDetails';
import Home from './components/Home';
import Navbar from './components/Navbar';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import AdminProvider from './context/AdminContext';
import AuthProvider from './context/AuthContext';
import CartProvider from './context/CartContext'; 
import Checkout from './components/Payments/Checkout';
import OAuth2RedirectHandler from './components/OAuth2RedirectHandler ';


// Load your Stripe publishable key
const stripePromise = loadStripe('pk_test_51Q2r3VGbDjVgx5DZLiIPTqHlnZwCKsnU0XnNBGAHPtxi6Mbs1mX7ZMSVnnhNXijBdIRJ9m77HbboJwyNq6Z2h8DP00z9LwahGS');

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <AdminProvider>
          <Navbar />
          <Elements stripe={stripePromise}>
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<ProductList />} />
              <Route path="/admin/products/add" element={<ProductForm />} />
              <Route path="/admin/products/edit/:productId" element={<ProductForm />} />
              <Route path="/admin/users" element={<UserList />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Cart and Checkout Routes */}
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />

              {/* Customer Routes */}
              <Route path="/customer" element={<CustomerDashboard />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/:productId" element={<ProductDetails />} />

              {/* OAtuth Login */}
              <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

              {/* Home Route */}
              <Route path="/" element={<Home />} />
            </Routes>
          </Elements>
        </AdminProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
