import React, { useContext } from 'react';
import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { clearToken } from '../auth/authUtils';

const Navbar = ({ onSearch }) => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);

  const handleLogout = () => {
    clearToken();
    logout();
  };

  const cartItemCount = cartItems.length;

  return (
    <nav className="flex items-center px-6 py-3 bg-orange-500 text-white justify-between shadow-md">
      <Link to="/" className="flex items-center flex-shrink-0 text-white no-underline">
        <img
          src="https://cdn.iconscout.com/icon/free/png-256/shopee-2296055-1911996.png"
          alt="Shopee"
          className="w-9 h-9 mr-2 bg-white rounded-lg"
        />
        <h2 className="m-0 font-bold tracking-wide text-xl">Shopee</h2>
      </Link>

      <div className="flex-grow flex justify-center mx-8">
        <input
          type="text"
          placeholder="ค้นหาสินค้า..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full max-w-2xl px-4 py-2 rounded-md border-none focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-black"
        />
      </div>

      <div className="flex items-center gap-6 flex-shrink-0">
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
    </nav>
  );
};

export default Navbar;
