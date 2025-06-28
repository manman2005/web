import React, { useContext } from 'react';
import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { clearToken } from '../auth/authUtils';

const Navbar = ({ onSearch }) => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);

  const handleLogout = () => {
    clearToken();
    logout();
  };

  const cartItemCount = cartItems.length;

  return (
    <nav className="flex items-center px-4 py-4 bg-orange-500 text-white justify-between">
      <div className="flex items-center">
        <img
          src="https://cdn.iconscout.com/icon/free/png-256/shopee-2296055-1911996.png"
          alt="Shopee"
          className="w-10 h-10 mr-3 bg-white rounded-lg"
        />
        <h2 className="m-0 font-bold tracking-wide text-xl">Shopee</h2>
      </div>

      <input
        type="text"
        placeholder="ค้นหาสินค้า..."
        onChange={(e) => onSearch(e.target.value)}
        className="flex-1 mx-8 px-3 py-2 rounded border-none max-w-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-black"
      />

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <Link
              to="/profile"
              className="text-white no-underline flex items-center text-base hover:text-orange-100 transition-colors"
            >
              <FaUser className="mr-1.5" />
              โปรไฟล์
            </Link>
            <Link
              to="/cart"
              className="text-white no-underline flex items-center text-2xl relative hover:text-orange-100 transition-colors"
            >
              <FaShoppingCart />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button
              onClick={handleLogout}
              className="bg-transparent text-white border-none text-base cursor-pointer flex items-center hover:text-orange-100 transition-colors"
            >
              <FaSignOutAlt className="mr-1.5" />
              ออกจากระบบ
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-white no-underline flex items-center text-base hover:text-orange-100 transition-colors"
            >
              <FaUser className="mr-1.5" />
              เข้าสู่ระบบ
            </Link>
            <Link
              to="/register"
              className="text-white no-underline text-base hover:text-orange-100 transition-colors"
            >
              สมัครสมาชิก
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
