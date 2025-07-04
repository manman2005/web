import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { FaStar } from 'react-icons/fa';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const { addToCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert('กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าในตะกร้า');
      navigate('/login');
      return;
    }
    if (product && quantity > 0) {
      addToCart({ ...product, quantity });
      alert('เพิ่มสินค้าลงในตะกร้าแล้ว!');
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    const maxQty = product?.quantity || 0; // Ensure maxQty is a number, default to 0
    if (value > 0 && value <= maxQty) {
      setQuantity(value);
    } else if (value > maxQty) {
      alert(`สินค้ามีในสต็อกเพียง ${maxQty} ชิ้น`);
      setQuantity(maxQty);
    } else {
      setQuantity(1);
    }
  };

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
        if (res.data.images && res.data.images.length > 0) {
          setMainImage(`http://localhost:5000${res.data.images[0].url}`);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden md:flex">
        {/* Product Image Gallery */}
        <div className="md:w-1/2 p-4">
          {mainImage ? (
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-auto object-contain rounded-lg shadow-md"
            />
          ) : (
            <img
              src="https://via.placeholder.com/400x400?text=No+Image"
              alt="No Image"
              className="w-full h-auto object-contain rounded-lg shadow-md"
            />
          )}
          {product.images && product.images.length > 0 && (
            <div className="flex space-x-2 mt-4 overflow-x-auto">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={`http://localhost:5000${img.url}`}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${mainImage === `http://localhost:5000${img.url}` ? 'border-indigo-500' : 'border-gray-200'} hover:border-indigo-500 transition-all`}
                  onClick={() => setMainImage(`http://localhost:5000${img.url}`)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400 mr-2">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar className="text-gray-300" />
              </div>
              <span className="text-gray-600 text-sm">(4.0) | {product.sold || Math.floor(Math.random() * 100)} ขายแล้ว</span>
            </div>

            <div className="text-4xl font-bold text-indigo-600 mb-4">
              ฿{product.price}
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed">{product.description}</p>

            <div className="mb-4">
              <span className="font-semibold text-gray-800">หมวดหมู่: </span>
              <span className="text-gray-600">{product.category || 'N/A'}</span>
            </div>
            <div className="mb-4">
              <span className="font-semibold text-gray-800">แบรนด์: </span>
              <span className="text-gray-600">{product.brand || 'N/A'}</span>
            </div>
            <div className="mb-4">
              <span className="font-semibold text-gray-800">สินค้าคงเหลือ: </span>
              <span className="text-gray-600">{product.quantity} ชิ้น</span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center mb-6">
              <span className="font-semibold text-gray-800 mr-4">จำนวน:</span>
              <button
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-l-md hover:bg-gray-300 focus:outline-none"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-16 text-center border-t border-b border-gray-200 py-1 focus:outline-none focus:border-indigo-500"
                min="1"
                max={product?.quantity || 0}
              />
              <button
                onClick={() => handleQuantityChange({ target: { value: quantity + 1 } })}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-r-md hover:bg-gray-300 focus:outline-none"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-auto">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              เพิ่มลงตะกร้า
            </button>
            <button
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              กลับ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
