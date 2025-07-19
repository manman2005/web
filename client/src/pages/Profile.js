import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { getToken } from '../auth/authUtils';
import { FiEdit, FiSave, FiXCircle, FiTruck, FiUser, FiMapPin, FiPhone } from 'react-icons/fi';

const Profile = () => {
  const { isAuthenticated, user, fetchUser } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserProfileAndOrders();
    }
  }, [isAuthenticated, user]);

  const fetchUserProfileAndOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        setError('ไม่พบโทเค็นการยืนยันตัวตน');
        setLoading(false);
        return;
      }

      // Fetch user profile
      const userRes = await axios.get('http://localhost:5000/api/auth/current-user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(userRes.data);
      setFormData({
        name: userRes.data.name || '',
        address: userRes.data.address || '',
        phone: userRes.data.phone || '',
      });

      // Fetch user orders
      const ordersRes = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(ordersRes.data);

    } catch (err) {
      console.error('Error fetching profile or orders:', err);
      setError('เกิดข้อผิดพลาดในการดึงข้อมูลโปรไฟล์หรือคำสั่งซื้อ');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form data to current user data
    setFormData({
      name: userData.name || '',
      address: userData.address || '',
      phone: userData.phone || '',
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      await axios.put(
        `http://localhost:5000/api/auth/users/${user._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('อัปเดตโปรไฟล์สำเร็จ!');
      setIsEditing(false);
      fetchUserProfileAndOrders(); // Re-fetch data to update UI
      fetchUser(); // Update AuthContext user data
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์');
    }
  };

  if (!isAuthenticated) {
    return <p className="p-4 text-red-500">กรุณาเข้าสู่ระบบเพื่อดูโปรไฟล์ของคุณ</p>;
  }

  if (loading) {
    return <div className="text-center p-4">กำลังโหลดข้อมูลโปรไฟล์...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">โปรไฟล์ของคุณ</h1>

        {/* User Profile Section */}
        <div className="mb-8 border-b pb-6 border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-700 flex items-center gap-2"><FiUser /> ข้อมูลส่วนตัว</h2>
            {!isEditing ? (
              <button
                onClick={handleEditClick}
                className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                <FiEdit /> แก้ไข
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateSubmit}
                  className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <FiSave /> บันทึก
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <FiXCircle /> ยกเลิก
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">ชื่อผู้ใช้:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">ที่อยู่จัดส่ง:</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleFormChange}
                  rows="3"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">เบอร์โทรศัพท์:</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </form>
          ) : (
            <div className="space-y-3 text-gray-700">
              <p className="flex items-center gap-2"><FiUser className="text-indigo-500" /> <span className="font-semibold">ชื่อผู้ใช้:</span> {userData?.name}</p>
              <p className="flex items-center gap-2"><FiMapPin className="text-indigo-500" /> <span className="font-semibold">ที่อยู่จัดส่ง:</span> {userData?.address || 'ยังไม่มีข้อมูลที่อยู่'}</p>
              <p className="flex items-center gap-2"><FiPhone className="text-indigo-500" /> <span className="font-semibold">เบอร์โทรศัพท์:</span> {userData?.phone || 'ยังไม่มีข้อมูลเบอร์โทรศัพท์'}</p>
            </div>
          )}
        </div>

        {/* Order History Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center gap-2"><FiTruck /> ประวัติคำสั่งซื้อ</h2>
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="bg-gray-100 p-4 rounded-md shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg text-gray-800">คำสั่งซื้อ #{order._id.substring(0, 8)}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.orderstatus === 'Completed' ? 'bg-green-200 text-green-800' : order.orderstatus === 'Processing' ? 'bg-blue-200 text-blue-800' : 'bg-yellow-200 text-yellow-800'}`}>
                      {order.orderstatus}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">วันที่สั่งซื้อ: {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="text-gray-600 text-sm mb-2">ยอดรวม: <span className="font-bold text-indigo-600">฿{order.cartTotal.toFixed(2)}</span></p>
                  <div className="mt-3">
                    <p className="font-semibold text-gray-700">รายการสินค้า:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 ml-4">
                      {order.products.map((item) => (
                        <li key={item._id}>
                          {item.product?.name} x {item.count} (฿{item.price.toFixed(2)})
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">คุณยังไม่มีคำสั่งซื้อ</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
