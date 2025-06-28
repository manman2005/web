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
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </div>
          <Footer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
  