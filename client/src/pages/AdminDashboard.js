import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../auth/authUtils';
import { Link } from 'react-router-dom';
import { FiUsers, FiShoppingCart, FiEdit, FiPlusCircle, FiXCircle, FiBox } from 'react-icons/fi';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]); // Add state for products
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({ name: '', role: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', price: 0, quantity: 0, description: '', category: '', brand: '', images: [] });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [addingProduct, setAddingProduct] = useState(false);
  const [addProductForm, setAddProductForm] = useState({
    name: '', price: 0, quantity: 0, description: '', category: '', brand: '', images: []
  });
  const [addSelectedFiles, setAddSelectedFiles] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchUsers();
    fetchProducts(); // Fetch products on component mount
  }, []);

  const fetchOrders = async () => {
    try {
      const token = getToken();
      const response = await axios.get('http://localhost:5000/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = getToken();
      const response = await axios.get('http://localhost:5000/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Function to fetch products
  const fetchProducts = async () => {
    try {
      const token = getToken(); // Assuming admin auth is needed
      const response = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = getToken();
      await axios.put(
        'http://localhost:5000/api/order/order-status',
        { orderId, orderStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({ name: user.name, role: user.role });
  };

  const handleUserFormChange = (e) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      await axios.put(
        `http://localhost:5000/api/auth/users/${editingUser._id}`,
        userForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingUser(null);
      setUserForm({ name: '', role: '' });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      description: product.description,
      category: product.category,
      brand: product.brand,
      images: product.images,
    });
    setSelectedFiles([]); // Clear selected files when opening for edit
  };

  const handleImageChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleProductFormChange = (e) => {
    const { name, value } = e.target;
    setProductForm({ ...productForm, [name]: value });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      const formData = new FormData();
      for (const key in productForm) {
        if (key !== 'images') { // Don't append images directly, handle separately
          formData.append(key, productForm[key]);
        }
      }
      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      await axios.put(
        `http://localhost:5000/api/products/${editingProduct._id}`,
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setEditingProduct(null);
      setProductForm({ name: '', price: 0, quantity: 0, description: '', category: '', brand: '', images: [] });
      setSelectedFiles([]);
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = getToken();
        await axios.delete(`http://localhost:5000/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleAddProductFormChange = (e) => {
    const { name, value } = e.target;
    setAddProductForm({ ...addProductForm, [name]: value });
  };

  const handleAddImageChange = (e) => {
    setAddSelectedFiles(Array.from(e.target.files));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      const formData = new FormData();
      for (const key in addProductForm) {
        if (key !== 'images') {
          formData.append(key, addProductForm[key]);
        }
      }
      addSelectedFiles.forEach((file) => {
        formData.append('images', file);
      });
      await axios.post('http://localhost:5000/api/products', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setAddingProduct(false);
      setAddProductForm({ name: '', price: 0, quantity: 0, description: '', category: '', brand: '', images: [] });
      setAddSelectedFiles([]);
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>

        {/* Users Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-700 flex items-center gap-3"><FiUsers /> All Users</h2>
            <input
              type="text"
              placeholder="Search users..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users
                  .filter((user) =>
                    user.name.toLowerCase().includes(userSearch.toLowerCase())
                  )
                  .map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEditUser(user)} className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1">
                        <FiEdit /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-700 flex items-center gap-3"><FiBox /> All Products</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search products..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Link
                to="#"
                onClick={() => setAddingProduct(true)}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
              >
                <FiPlusCircle />
                Add New Product
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products
                  .filter((product) =>
                    product.name.toLowerCase().includes(productSearch.toLowerCase())
                  )
                  .map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">฿{product.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end items-center gap-2">
                      <button onClick={() => handleEditProduct(product)} className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1">
                        <FiEdit /> Edit
                      </button>
                      <button onClick={() => handleDeleteProduct(product._id)} className="text-red-600 hover:text-red-900 flex items-center gap-1">
                        <FiXCircle /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-700 flex items-center gap-3"><FiShoppingCart /> รายการสั่งซื้อทั้งหมด</h2>
            <input
              type="text"
              placeholder="Search orders by ID..."
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="space-y-6">
            {orders
              .filter((order) =>
                order._id.toLowerCase().includes(orderSearch.toLowerCase())
              )
              .map((order) => (
              <div key={order._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex flex-wrap justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-800">รหัสคำสั่งซื้อ: <span className="font-normal text-gray-600">{order._id}</span></p>
                    <p className="font-semibold text-gray-800">ชื่อลูกค้า: <span className="font-normal text-gray-600">{order.orderBy?.name || 'N/A'}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">ราคารวม: <span className="font-bold text-indigo-600">฿{order.cartTotal}</span></p>
                    <span className={`text-sm font-medium mr-2 px-2.5 py-0.5 rounded ${getStatusBadge(order.orderstatus)}`}>
                      {order.orderstatus}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="font-semibold text-gray-700 mb-2">รายการสินค้า:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    {order.products.map((item) => (
                      <li key={item._id}>
                        {item.product?.name || 'N/A'} x {item.count} (฿{item.price})
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <label htmlFor={`status-${order._id}`} className="block text-sm font-medium text-gray-700 mb-1">อัพเดทสถานะ:</label>
                  <select
                    id={`status-${order._id}`}
                    value={order.orderstatus}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option>ยังไม่ดำเนินการ</option>
                    <option>กำลังดำเนินการ</option>
                    <option>ยกเลิก</option>
                    <option>เสร็จสมบูรณ์</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Edit User</h3>
              <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-gray-600">
                <FiXCircle size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdateUser}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userForm.name}
                  onChange={handleUserFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  value={userForm.role}
                  onChange={handleUserFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">แก้ไขสินค้า</h3>
              <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-gray-600">
                <FiXCircle size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdateProduct}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productName">ชื่อสินค้า</label>
                  <input
                    type="text"
                    id="productName"
                    name="name"
                    value={productForm.name}
                    onChange={handleProductFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productPrice">ราคา</label>
                  <input
                    type="number"
                    id="productPrice"
                    name="price"
                    value={productForm.price}
                    onChange={handleProductFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productQuantity">จำนวน</label>
                  <input
                    type="number"
                    id="productQuantity"
                    name="quantity"
                    value={productForm.quantity}
                    onChange={handleProductFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productCategory">หมวดหมู่</label>
                  <input
                    type="text"
                    id="productCategory"
                    name="category"
                    value={productForm.category}
                    onChange={handleProductFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productBrand">แบรนด์</label>
                  <input
                    type="text"
                    id="productBrand"
                    name="brand"
                    value={productForm.brand}
                    onChange={handleProductFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productDescription">รายละเอียด</label>
                <textarea
                  id="productDescription"
                  name="description"
                  value={productForm.description}
                  onChange={handleProductFormChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productImages">รูปภาพสินค้า</label>
                <input
                  type="file"
                  id="productImages"
                  name="images"
                  multiple
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {/* Image handling can be more complex, for now, just display if any */}
              {productForm.images && productForm.images.length > 0 && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">รูปภาพปัจจุบัน:</label>
                  <div className="flex flex-wrap gap-2">
                    {productForm.images.map((img, index) => (
                      <img key={index} src={`http://localhost:5000${img.url}`} alt={`Product Image ${index + 1}`} className="w-20 h-20 object-cover rounded-md" />
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
                >
                  อัพเดทสินค้า
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {addingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">เพิ่มสินค้าใหม่</h3>
              <button onClick={() => setAddingProduct(false)} className="text-gray-400 hover:text-gray-600">
                <FiXCircle size={24} />
              </button>
            </div>
            <form onSubmit={handleAddProduct}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productName">ชื่อสินค้า</label>
                  <input
                    type="text"
                    id="productName"
                    name="name"
                    value={addProductForm.name}
                    onChange={handleAddProductFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productPrice">ราคา</label>
                  <input
                    type="number"
                    id="productPrice"
                    name="price"
                    value={addProductForm.price}
                    onChange={handleAddProductFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productQuantity">จำนวน</label>
                  <input
                    type="number"
                    id="productQuantity"
                    name="quantity"
                    value={addProductForm.quantity}
                    onChange={handleAddProductFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productCategory">หมวดหมู่</label>
                  <input
                    type="text"
                    id="productCategory"
                    name="category"
                    value={addProductForm.category}
                    onChange={handleAddProductFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productBrand">แบรนด์</label>
                  <input
                    type="text"
                    id="productBrand"
                    name="brand"
                    value={addProductForm.brand}
                    onChange={handleAddProductFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productDescription">รายละเอียด</label>
                <textarea
                  id="productDescription"
                  name="description"
                  value={addProductForm.description}
                  onChange={handleAddProductFormChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productImages">รูปภาพสินค้า</label>
                <input
                  type="file"
                  id="productImages"
                  name="images"
                  multiple
                  onChange={handleAddImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setAddingProduct(false)}
                  className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
                >
                  เพิ่มสินค้า
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
