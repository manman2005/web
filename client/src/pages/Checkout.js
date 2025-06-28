import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const Checkout = () => {
  const { cartItems, totalPrice } = useContext(CartContext);

  const handleCheckout = () => {
    // เรียก API หรือ redirect ไปหน้าชำระเงิน
    alert('สั่งซื้อเรียบร้อยแล้ว!');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">สรุปรายการสั่งซื้อ</h2>
      <div className="space-y-4">
        {cartItems.map(item => (
          <div key={item._id} className="flex justify-between border-b pb-2">
            <span>{item.name} x {item.quantity}</span>
            <span>฿{item.price * item.quantity}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-right text-lg font-semibold">
        รวมทั้งหมด: ฿{totalPrice}
      </div>

      <form className="mt-6 space-y-3">
        <input className="w-full border p-2 rounded" type="text" placeholder="ชื่อผู้รับ" required />
        <input className="w-full border p-2 rounded" type="text" placeholder="ที่อยู่จัดส่ง" required />
        <input className="w-full border p-2 rounded" type="tel" placeholder="เบอร์โทรศัพท์" required />
        <button
          type="button"
          onClick={handleCheckout}
          className="w-full bg-green-500 text-white p-2 rounded mt-4"
        >
          ยืนยันการสั่งซื้อ
        </button>
      </form>
    </div>
  );
};

export default Checkout;
