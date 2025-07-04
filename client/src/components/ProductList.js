import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const ProductList = ({ onSelectProduct, search }) => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/products')
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      alert('กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าในตะกร้า');
      navigate('/login');
      return;
    }
    addToCart(product);
    alert('เพิ่มสินค้าในตะกร้าเรียบร้อยแล้ว!');
  };

  const filtered = search
    ? products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    : products;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 p-2">
      {filtered.map((product) => (
        <div
          key={product._id}
          onClick={() => navigate(`/products/${product._id}`)}
          className="bg-white rounded-sm shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col overflow-hidden"
        >
          <div className="w-full aspect-square overflow-hidden">
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
