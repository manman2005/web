import React from 'react';

// ตัวอย่างหมวดหมู่พร้อมรูปภาพ (เปลี่ยน path รูปได้ตามต้องการ)
const categories = [
  { name: 'ความงามและของใช้ส่วนตัว', img: 'https://cdn-icons-png.flaticon.com/128/2921/2921822.png' },
  { name: 'เสื้อผ้าแฟชั่นผู้ชาย', img: 'https://cdn-icons-png.flaticon.com/128/892/892458.png' },
  { name: 'กระเป๋า', img: 'https://cdn-icons-png.flaticon.com/128/1077/1077114.png' },
  { name: 'รองเท้าผู้หญิง', img: 'https://cdn-icons-png.flaticon.com/128/892/892458.png' },
  { name: 'นาฬิกาและแว่นตา', img: 'https://cdn-icons-png.flaticon.com/128/2921/2921822.png' },
  { name: 'อุปกรณ์อิเล็กทรอนิกส์', img: 'https://cdn-icons-png.flaticon.com/128/2921/2921822.png' },
  { name: 'เครื่องใช้ไฟฟ้าภายในบ้าน', img: 'https://cdn-icons-png.flaticon.com/128/1046/1046857.png' },
  { name: 'กล้องและอุปกรณ์ถ่ายภาพ', img: 'https://cdn-icons-png.flaticon.com/128/2921/2921822.png' },
  { name: 'ของเล่น สินค้าแม่และเด็ก', img: 'https://cdn-icons-png.flaticon.com/128/2921/2921822.png' },
  { name: 'สัตว์เลี้ยง', img: 'https://cdn-icons-png.flaticon.com/128/616/616408.png' },
  { name: 'กลุ่มผลิตภัณฑ์เพื่อสุขภาพ', img: 'https://cdn-icons-png.flaticon.com/128/2921/2921822.png' },
  { name: 'เสื้อผ้าแฟชั่นผู้หญิง', img: 'https://cdn-icons-png.flaticon.com/128/892/892458.png' },
  { name: 'รองเท้าผู้ชาย', img: 'https://cdn-icons-png.flaticon.com/128/892/892458.png' },
  { name: 'เครื่องประดับ', img: 'https://cdn-icons-png.flaticon.com/128/1077/1077114.png' },
  { name: 'เครื่องใช้ในบ้าน', img: 'https://cdn-icons-png.flaticon.com/128/1046/1046857.png' },
  { name: 'มือถือ และแท็บเล็ต', img: 'https://cdn-icons-png.flaticon.com/128/2921/2921822.png' },
  { name: 'คอมพิวเตอร์และแล็ปท็อป', img: 'https://cdn-icons-png.flaticon.com/128/2921/2921822.png' },
  { name: 'อาหารและเครื่องดื่ม', img: 'https://cdn-icons-png.flaticon.com/128/2921/2921822.png' },
  { name: 'กีฬาและกิจกรรมกลางแจ้ง', img: 'https://cdn-icons-png.flaticon.com/128/2921/2921822.png' },
  { name: 'เกมและอุปกรณ์เสริม', img: 'https://cdn-icons-png.flaticon.com/128/2921/2921822.png' },
];

const CategoryBar = () => (
  <div className="bg-white rounded-xl shadow p-6 mb-8">
    <h3 className="text-lg font-semibold mb-4">หมวดหมู่</h3>
    <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
      {categories.map((cat) => (
        <div
          key={cat.name}
          className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform p-2 rounded-lg hover:bg-gray-50"
        >
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-1 overflow-hidden">
            <img src={cat.img} alt={cat.name} className="w-10 h-10 object-contain" />
          </div>
          <div className="text-xs text-center text-gray-700 font-medium leading-tight">{cat.name}</div>
        </div>
      ))}
    </div>
  </div>
);

export default CategoryBar; 