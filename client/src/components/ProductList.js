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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8 px-6">
      {filtered.map((product) => (
        <div
          key={product._id}
          className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow cursor-pointer p-4 flex flex-col items-center border"
        >
          <div onClick={() => onSelectProduct(product)} className="w-full flex flex-col items-center">
            <img
              src={
                product.image ||
                'https://via.placeholder.com/200x200?text=No+Image'
              }
              alt={product.name}
              className="w-40 h-40 object-cover rounded mb-3 bg-gray-50"
            />
            <h4 className="text-base font-medium text-gray-800 min-h-[40px] mb-2 text-center">
              {product.name}
            </h4>
            <div className="text-orange-600 font-bold text-lg mb-2">
              {product.price} บาท
            </div>
            <div className="flex justify-center items-center text-sm text-yellow-500 mb-2">
              <FaStar className="mr-1" /> 4.9 | ขายแล้ว {product.sold || Math.floor(Math.random() * 1000)} ชิ้น
            </div>
          </div>
          <button
            onClick={() => handleAddToCart(product)}
            className="mt-2 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded font-semibold shadow"
          >
            เพิ่มลงตะกร้า
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
