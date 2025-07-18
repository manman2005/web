import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DEFAULT_CATEGORIES = [
  'ความงามและของใช้ส่วนตัว',
  'เสื้อผ้าแฟชั่นผู้ชาย',
  'กระเป๋า',
  'รองเท้าผู้หญิง',
  'นาฬิกาและแว่นตา',
  'อุปกรณ์อิเล็กทรอนิกส์',
  'เครื่องใช้ไฟฟ้าภายในบ้าน',
  'กล้องและอุปกรณ์ถ่ายภาพ',
  'ของเล่น สินค้าแม่และเด็ก',
  'สัตว์เลี้ยง',
  'กลุ่มผลิตภัณฑ์เพื่อสุขภาพ',
  'เสื้อผ้าแฟชั่นผู้หญิง',
  'รองเท้าผู้ชาย',
  'เครื่องประดับ',
  'เครื่องใช้ในบ้าน',
  'มือถือ และแท็บเล็ต',
  'คอมพิวเตอร์และแล็ปท็อป',
  'อาหารและเครื่องดื่ม',
  'กีฬาและกิจกรรมกลางแจ้ง',
  'เกมและอุปกรณ์เสริม',
];

const CategoryBar = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        const productCategories = res.data.map(product => product.category).filter(Boolean);
        const combinedCategories = [...new Set([...DEFAULT_CATEGORIES, ...productCategories])];
        setCategories(combinedCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4">หมวดหมู่</h3>
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-10 gap-4">
        {categories.map((cat) => (
          <div
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform p-2 rounded-lg hover:bg-gray-50"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-100 flex items-center justify-center mb-1 overflow-hidden">
              {/* สามารถเพิ่มรูปภาพตามหมวดหมู่ได้ในอนาคต */}
              <img src="https://via.placeholder.com/40?text=Cat" alt={cat} className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
            </div>
            <div className="text-xs text-center text-gray-700 font-medium leading-tight">{cat}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryBar; 