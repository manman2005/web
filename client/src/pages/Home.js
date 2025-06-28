import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/api/products') // ดึงสินค้าทั้งหมด
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">ยินดีต้อนรับสู่ร้านค้าออนไลน์</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product._id} className="bg-white rounded-xl shadow p-4">
            <img src={product.image} alt={product.name} className="h-40 w-full object-cover rounded" />
            <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
            <p className="text-green-600 mt-1">฿{product.price}</p>
            <Link
              to={`/products/${product._id}`}
              className="mt-3 inline-block bg-blue-500 text-white px-4 py-1 rounded"
            >
              ดูรายละเอียด
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
