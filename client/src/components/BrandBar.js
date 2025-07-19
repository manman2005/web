import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BrandBar = ({ onSelectBrand }) => {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        const productBrands = res.data.map(product => product.brand).filter(Boolean);
        const uniqueBrands = [...new Set(productBrands)];
        setBrands(uniqueBrands);
      } catch (err) {
        console.error('Error fetching brands:', err);
      }
    };
    fetchBrands();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4">แบรนด์</h3>
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-10 gap-4">
        {brands.map((brand) => (
          <div
            key={brand}
            onClick={() => onSelectBrand(brand)}
            className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform p-2 rounded-lg hover:bg-gray-50"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-100 flex items-center justify-center mb-1 overflow-hidden">
              {/* สามารถเพิ่มรูปภาพตามแบรนด์ได้ในอนาคต */}
              <img src="https://via.placeholder.com/40?text=Brand" alt={brand} className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
            </div>
            <div className="text-xs text-center text-gray-700 font-medium leading-tight">{brand}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandBar;