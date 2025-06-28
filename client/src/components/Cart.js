import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, increaseQty, decreaseQty, totalPrice } = useContext(CartContext);
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
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">ตะกร้าสินค้า</h2>
      <div className="space-y-4">
        {cartItems.map(item => (
          <div key={item._id} className="flex justify-between items-center border-b pb-2">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p>ราคา: ฿{item.price}</p>
              <div className="flex gap-2 mt-1">
                <button onClick={() => decreaseQty(item._id)} className="px-2 bg-gray-200 rounded">−</button>
                <span>{item.quantity}</span>
                <button onClick={() => increaseQty(item._id)} className="px-2 bg-gray-200 rounded">+</button>
              </div>
            </div>
            <div className="text-right">
              <p>รวม: ฿{item.price * item.quantity}</p>
              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-500 mt-2"
              >
                ลบ
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-right text-lg font-semibold">
        ราคารวม: ฿{totalPrice}
      </div>

      <div className="mt-4 text-right">
        <Link
          to="/checkout"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          ดำเนินการสั่งซื้อ
        </Link>
      </div>
    </div>
  );
};

export default Cart;
