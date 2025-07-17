import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { getToken } from '../auth/authUtils';
import axios from 'axios';

const Checkout = () => {
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
      alert('สั่งซื้อเรียบร้อยแล้ว!');
      clearCart(); // Clear cart after successful order
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('เกิดข้อผิดพลาดในการสั่งซื้อ');
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">สรุปรายการสั่งซื้อ</h2>
      <div className="space-y-4">
        {cartItems.map(item => (
          <div key={item._id} className="flex flex-col sm:flex-row sm:justify-between border-b pb-2">
            <span className="w-full">{item.name} x {item.quantity}</span>
            <span className="w-full sm:w-auto text-left sm:text-right">฿{item.price * item.quantity}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-right text-lg font-semibold">
        รวมทั้งหมด: ฿{totalPrice}
      </div>

      <form className="mt-6 space-y-3">
        <textarea
          className="w-full border p-2 rounded"
          placeholder="ที่อยู่จัดส่ง"
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          required
        ></textarea>
        <input
          className="w-full border p-2 rounded"
          type="tel"
          placeholder="เบอร์โทรศัพท์"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <button
          type="button"
          onClick={handleCheckout}
          className="w-full bg-green-500 text-white p-2 rounded mt-4"
        >
          ยืนยันการสั่งซื้อ
        </button>
      </form>
    </div>
  );
};

export default Checkout;