import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { getToken } from '../auth/authUtils';

const Orders = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        const token = getToken();
        const response = await axios.get('http://localhost:5000/api/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('ไม่สามารถดึงข้อมูลคำสั่งซื้อได้');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, user]);

  if (loading) {
    return <div className="text-center p-4">กำลังโหลดคำสั่งซื้อ...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  if (!isAuthenticated) {
    return <div className="text-center p-4">กรุณาเข้าสู่ระบบเพื่อดูคำสั่งซื้อของคุณ</div>;
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">สถานะคำสั่งซื้อของคุณ</h2>
      {orders.length === 0 ? (
        <div className="text-center text-gray-600">คุณยังไม่มีคำสั่งซื้อ</div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white shadow-md rounded-lg p-5 border border-gray-200">
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold">คำสั่งซื้อ #{order._id.substring(0, 8)}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.orderstatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.orderstatus === 'Processing' ? 'bg-blue-100 text-blue-800' :
                  order.orderstatus === 'Completed' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.orderstatus}
                </span>
              </div>
              <p className="text-gray-600 mb-2">วันที่สั่งซื้อ: {new Date(order.createdAt).toLocaleDateString('th-TH', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}</p>
              <p className="text-gray-700 font-medium mb-3">ยอดรวม: ฿{order.cartTotal.toFixed(2)}</p>
              <div className="mb-3">
                <h4 className="text-md font-semibold mb-2">สินค้าในคำสั่งซื้อ:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {order.products.map((item) => (
                    <li key={item._id} className="flex justify-between items-center">
                      <span>{item.product ? item.product.name : 'สินค้าไม่พบ'} x {item.count}</span>
                      <span>฿{(item.price * item.count).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
