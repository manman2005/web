import React, { useContext, useState } from 'react';
import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { FiMenu, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { clearToken } from '../auth/authUtils';

const Navbar = ({ onSearch }) => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    clearToken();
    logout();
  };

  const cartItemCount = cartItems.length;

  return (
    <nav className="flex items-center px-6 py-3 bg-orange-500 text-white justify-between shadow-md relative">
      <Link to="/" className="flex items-center flex-shrink-0 text-white no-underline">
        <img
          src="https://cdn.iconscout.com/icon/free/png-256/shopee-2296055-1911996.png"
          alt="Shopee"
          className="w-9 h-9 mr-2 bg-white rounded-lg"
        />
        <h2 className="m-0 font-bold tracking-wide text-xl">Shopee</h2>
      </Link>

      {/* Hamburger menu button for mobile */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white focus:outline-none">
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex flex-grow justify-center mx-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearch(e.target.elements.search.value);
          }}
          className="flex w-full max-w-2xl"
        >
          <input
            type="text"
            name="search"
            placeholder="ค้นหาสินค้า..."
            className="w-full px-4 py-2 rounded-l-md border-none focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-black"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-orange-600 text-white rounded-r-md hover:bg-orange-700 focus:outline-none"
          >
            ค้นหา
          </button>
        </form>
      </div>

      <div className="hidden md:flex items-center gap-6 flex-shrink-0">
        {isAuthenticated ? (
          <>
            {user && user.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className="text-white no-underline flex items-center text-sm hover:text-orange-100 transition-colors"
              >
                Admin
              </Link>
            )}
            <Link
              to="/profile"
              className="text-white no-underline flex items-center text-sm hover:text-orange-100 transition-colors"
            >
              <FaUser className="mr-1" />
              โปรไฟล์
            </Link>
            <Link
              to="/orders"
              className="text-white no-underline flex items-center text-sm hover:text-orange-100 transition-colors"
            >
              ติดตามสถานะสินค้า
            </Link>
            <Link
              to="/cart"
              className="text-white no-underline flex items-center text-xl relative hover:text-orange-100 transition-colors"
            >
              <FaShoppingCart />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button
              onClick={handleLogout}
              className="bg-transparent text-white border-none text-sm cursor-pointer flex items-center hover:text-orange-100 transition-colors"
            >
              <FaSignOutAlt className="mr-1" />
              ออก
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-white no-underline flex items-center text-sm hover:text-orange-100 transition-colors"
            >
              เข้าสู่ระบบ
            </Link>
            <Link
              to="/register"
              className="text-white no-underline text-sm hover:text-orange-100 transition-colors"
            >
              สมัคร
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-orange-500 shadow-md py-4 z-50">
          <div className="flex flex-col items-center space-y-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSearch(e.target.elements.search.value);
                setIsMobileMenuOpen(false); // Close menu after search
              }}
              className="flex w-11/12 max-w-md"
            >
              <input
                type="text"
                name="search"
                placeholder="ค้นหาสินค้า..."
                className="w-full px-4 py-2 rounded-l-md border-none focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-black"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-orange-600 text-white rounded-r-md hover:bg-orange-700 focus:outline-none"
              >
                ค้นหา
              </button>
            </form>
            {isAuthenticated ? (
              <>
                {user && user.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="text-white no-underline flex items-center text-base hover:text-orange-100 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="text-white no-underline flex items-center text-base hover:text-orange-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaUser className="mr-1" />
                  โปรไฟล์
                </Link>
                <Link
                  to="/orders"
                  className="text-white no-underline flex items-center text-base hover:text-orange-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ติดตามสถานะสินค้า
                </Link>
                <Link
                  to="/cart"
                  className="text-white no-underline flex items-center text-base relative hover:text-orange-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaShoppingCart />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center font-bold">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="bg-transparent text-white border-none text-base cursor-pointer flex items-center hover:text-orange-100 transition-colors"
                >
                  <FaSignOutAlt className="mr-1" />
                  ออก
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white no-underline flex items-center text-base hover:text-orange-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  to="/register"
                  className="text-white no-underline text-base hover:text-orange-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  สมัคร
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
