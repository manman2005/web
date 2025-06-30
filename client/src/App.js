import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './index.css';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import CategoryBar from './components/CategoryBar';
import Footer from './components/Footer';
import Banner from './components/Banner';
import Cart from './components/Cart';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Login from './auth/Login';
import Register from './auth/Register';
import Logout from './auth/Logout';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Checkout from './pages/Checkout';
import AddProduct from './pages/AddProduct'; // Import AddProduct

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState('');

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar onSearch={setSearch} />
          <Banner />
          <CategoryBar />
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
            <Routes>
              <Route
                path="/"
                element={
                  <ProductList
                    onSelectProduct={setSelectedProduct}
                    search={search}
                  />
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/add-product" element={<AddProduct />} /> {/* Add new route for AddProduct */}
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </div>
          <Footer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
  