import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { getToken } from '../auth/authUtils';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useContext(CartContext);
  const { isAuthenticated, user } = useContext(AuthContext);

  const [shippingAddress, setShippingAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated && user) {
        try {
          const token = getToken();
          const response = await axios.get('http://localhost:5000/api/auth/current-user', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setShippingAddress(response.data.address || '');
          setPhoneNumber(response.data.phone || '');
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    fetchUserData();
  }, [isAuthenticated, user]);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      alert('กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ');
      return;
    }

    if (!shippingAddress || !phoneNumber) {
      alert('กรุณากรอกที่อยู่จัดส่งและเบอร์โทรศัพท์');
      return;
    }

    try {
      const token = getToken();

      // Update user's address and phone number
      if (user && user._id) { // Add this check
        await axios.put(
          `http://localhost:5000/api/auth/users/${user._id}`,
          { address: shippingAddress, phone: phoneNumber },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        console.warn('User ID not available for updating address and phone number.');
        // Optionally, you can return or show an error to the user here
      }

      // Create order
      const response = await axios.post(
        'http://localhost:5000/api/',
        {
          cart: cartItems.map(item => ({
            product: item._id,
            count: item.quantity,
            price: item.price
          })),
          cartTotal: totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('สั่งซื้อเรียบร้อยแล้ว!');
      clearCart(); // Clear cart after successful order
      navigate('/'); // Navigate to home page
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('เกิดข้อผิดพลาดในการสั่งซื้อ');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">ดำเนินการสั่งซื้อ</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Summary Section */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">สรุปรายการสั่งซื้อ</h3>
            {cartItems.length === 0 ? (
              <p className="text-gray-600">ไม่มีสินค้าในตะกร้า</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item._id} className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="text-gray-700 text-lg">{item.name} x {item.quantity}</span>
                    <span className="text-gray-800 font-medium text-lg">฿{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="pt-4 border-t-2 border-gray-300 flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-800">รวมทั้งหมด:</span>
                  <span className="text-2xl font-extrabold text-indigo-600">฿{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Shipping Address and Payment Section */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">ที่อยู่จัดส่งและเบอร์โทรศัพท์</h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="shippingAddress" className="block text-gray-700 text-sm font-bold mb-2">
                  ที่อยู่จัดส่ง:
                </label>
                <textarea
                  id="shippingAddress"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                  placeholder="กรอกที่อยู่จัดส่งของคุณ"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  rows="4"
                  required
                ></textarea>
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">
                  เบอร์โทรศัพท์:
                </label>
                <input
                  id="phoneNumber"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                  type="tel"
                  placeholder="กรอกเบอร์โทรศัพท์ของคุณ"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                >
                  ยืนยันการสั่งซื้อ
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;