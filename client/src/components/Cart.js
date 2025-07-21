import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, increaseQty, decreaseQty, totalPrice, toggleItemSelection, selectedCartItems } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">กรุณาเข้าสู่ระบบ</h2>
          <p className="text-gray-600 mb-6">คุณต้องเข้าสู่ระบบก่อนเพื่อดูตะกร้าสินค้า</p>
          <Link
            to="/login"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
          >
            เข้าสู่ระบบ
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">ตะกร้าสินค้า</h2>
          <p className="text-gray-600 mb-6">ยังไม่มีสินค้าในตะกร้า</p>
          <Link
            to="/"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
          >
            เลือกซื้อสินค้า
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">ตะกร้าสินค้า</h2>

        {cartItems.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600 text-xl mb-6">ยังไม่มีสินค้าในตะกร้า</p>
            <Link
              to="/"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-200 transform hover:scale-105 inline-block"
            >
              เลือกซื้อสินค้า
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {cartItems.map(item => (
                <div key={item._id} className="flex flex-col md:flex-row items-center bg-gray-50 p-4 rounded-lg shadow-sm space-y-4 md:space-y-0 md:space-x-4">
                  <input
                    type="checkbox"
                    checked={item.isSelected}
                    onChange={() => toggleItemSelection(item._id)}
                    className="form-checkbox h-5 w-5 text-indigo-600"
                  />
                  <img src={`http://localhost:5000${item.image}`} alt={item.name} className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md flex-shrink-0" />
                  <div className="flex-grow">
                    <p className="font-semibold text-lg text-gray-800">{item.name}</p>
                    <p className="text-gray-600 text-base">ราคา: ฿{item.price.toFixed(2)}</p>
                    <p className="text-gray-500 text-sm">สต็อก: {item.stock} ชิ้น</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => decreaseQty(item._id)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md transition duration-200"
                      >
                        −
                      </button>
                      <span className="font-medium text-gray-800">{item.quantity}</span>
                      <button
                        onClick={() => increaseQty(item._id)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md transition duration-200"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2 mt-4 md:mt-0">
                    <p className="text-lg font-semibold text-gray-800">รวม: ฿{(item.price * item.quantity).toFixed(2)}</p>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-700 font-medium transition duration-200"
                    >
                      ลบ
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t-2 border-gray-200 flex flex-col sm:flex-row justify-between items-center">
              <p className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">ราคารวม: <span className="text-indigo-600">฿{totalPrice.toFixed(2)}</span></p>
              <Link
                to="/checkout"
                className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 ${selectedCartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={(e) => selectedCartItems.length === 0 && e.preventDefault()}
              >
                ดำเนินการชำระเงิน
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
