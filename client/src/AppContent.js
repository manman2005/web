import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './index.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import { AuthContext } from './context/AuthContext';
import Login from './auth/Login';
import Register from './auth/Register';
import Logout from './auth/Logout';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Checkout from './pages/Checkout';
import AddProduct from './pages/AddProduct';
import Cart from './components/Cart';
import Home from './pages/Home';

function AppContent() {
  const [search, setSearch] = useState('');
  const { isAuthReady } = useContext(AuthContext);

  return (
    <CartProvider>
      {isAuthReady ? (
        <Router>
          <Navbar onSearch={setSearch} />
          <div className="min-h-screen flex flex-col">
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home search={search} />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/add-product" element={<AddProduct />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
              </Routes>
            </main>
          </div>
          <Footer />
        </Router>
      ) : (
        <div className="flex justify-center items-center min-h-screen text-xl">Loading...</div>
      )}
    </CartProvider>
  );
}

export default AppContent;
