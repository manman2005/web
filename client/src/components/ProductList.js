import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

import { toast } from 'react-toastify';

const ProductList = ({ onSelectProduct, search, category, brand }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    let apiUrl = `http://localhost:5000/api/products?search=${search}`;
    if (category) {
      apiUrl += `&category=${category}`;
    }
    if (brand) {
      apiUrl += `&brand=${brand}`;
    }

    axios
      .get(apiUrl)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log('Request canceled', err.message);
        } else {
          console.log(err);
          setError('เกิดข้อผิดพลาดในการโหลดข้อมูลสินค้า');
          setLoading(false);
        }
      });

    return () => {
      source.cancel('Operation canceled by the user.');
    };
  }, [search, category, brand]);

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      toast.error('กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าในตะกร้า');
      navigate('/login');
      return;
    }
    addToCart(product);
    toast.success('เพิ่มสินค้าในตะกร้าเรียบร้อยแล้ว!');
  };

  if (loading) {
    return <div className="text-center p-4">กำลังโหลด...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  if (products.length === 0) {
    return <div className="text-center p-4">ไม่พบสินค้า</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 p-2">
      {products.map((product) => (
        <div
          key={product._id}
          onClick={() => navigate(`/products/${product._id}`)}
          className={`bg-white rounded-sm shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col overflow-hidden ${product.lowStockAlert ? 'border-2 border-red-500' : ''}`}
        >
          <div className="w-full aspect-square overflow-hidden relative">
            {product.lowStockAlert && (
              <div className="absolute top-0 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded-br-sm z-10">
                สินค้าใกล้หมด!
              </div>
            )}
            <img
              src={
                product.images && product.images.length > 0
                  ? `http://localhost:5000${product.images[0].url}`
                  : 'https://via.placeholder.com/200x200?text=No+Image'
              }
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-2 flex flex-col flex-grow">
            <h4 className="text-sm text-gray-800 mb-1 line-clamp-2 min-h-[40px]">
              {product.name}
            </h4>
            <div className="text-orange-600 font-bold text-base mb-1">
              ฿{product.price}
            </div>
            <div className="flex items-center text-xs text-gray-500 mt-auto">
              <FaStar className="text-yellow-400 mr-1" /> 4.9 ({product.sold || Math.floor(Math.random() * 1000)} ขายแล้ว)
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click from triggering
                handleAddToCart(product);
              }}
              className="mt-2 w-full bg-orange-500 hover:bg-orange-600 text-white py-1.5 rounded-sm text-sm font-semibold shadow-sm"
            >
              เพิ่มลงตะกร้า
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
