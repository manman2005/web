import React from 'react';

const Footer = () => (
  <footer className="bg-gray-50 border-t mt-12">
    <div className="max-w-7xl mx-auto py-10 px-4 grid grid-cols-2 md:grid-cols-5 gap-8 text-sm text-gray-700">
      {/* ศูนย์ช่วยเหลือ */}
      <div>
        <h4 className="font-bold mb-3">ศูนย์ช่วยเหลือ</h4>
        <ul className="space-y-1">
          <li>Help Centre</li>
          <li>สั่งซื้อสินค้าอย่างไร</li>
          <li>เริ่มขายสินค้าอย่างไร</li>
          <li>ช่องทางการชำระเงินใน Shopee</li>
          <li>Shopee Coins</li>
          <li>การจัดส่งสินค้า</li>
          <li>การคืนเงินและคืนสินค้า</li>
          <li>การันตีโดย Shopee คืออะไร?</li>
          <li>ติดต่อ Shopee</li>
        </ul>
      </div>
      {/* เกี่ยวกับ Shopee */}
      <div>
        <h4 className="font-bold mb-3">เกี่ยวกับ SHOPEE</h4>
        <ul className="space-y-1">
          <li>เกี่ยวกับเรา</li>
          <li>โปรแกรม Affiliate</li>
          <li>ร่วมงานกับเรา</li>
          <li>นโยบายของ Shopee</li>
          <li>นโยบายความเป็นส่วนตัว</li>
          <li>Shopee Blog</li>
          <li>Shopee Mall</li>
          <li>Seller Centre</li>
          <li>Flash Deals</li>
          <li>ผู้ติดต่อออนไลน์</li>
        </ul>
      </div>
      {/* วิธีการชำระเงิน */}
      <div>
        <h4 className="font-bold mb-3">วิธีการชำระเงิน</h4>
        <div className="flex flex-wrap gap-2 mb-4">
          <img src="https://cdn.shopeemobile.com/shopee/shopee-pcmall-live-sg/payment/ae.png" alt="AMEX" className="h-6" />
          <img src="https://cdn.shopeemobile.com/shopee/shopee-pcmall-live-sg/payment/visa.png" alt="VISA" className="h-6" />
          <img src="https://cdn.shopeemobile.com/shopee/shopee-pcmall-live-sg/payment/master.png" alt="MasterCard" className="h-6" />
          <img src="https://cdn.shopeemobile.com/shopee/shopee-pcmall-live-sg/payment/cod.png" alt="COD" className="h-6" />
          {/* เพิ่มเติมตามต้องการ */}
        </div>
        <h4 className="font-bold mb-3">บริการจัดส่ง</h4>
        <div className="flex flex-wrap gap-2">
          <img src="https://cdn.shopeemobile.com/shopee/shopee-pcmall-live-sg/shipping/spx.png" alt="SPX" className="h-6" />
          <img src="https://cdn.shopeemobile.com/shopee/shopee-pcmall-live-sg/shipping/jnt.png" alt="J&T" className="h-6" />
          <img src="https://cdn.shopeemobile.com/shopee/shopee-pcmall-live-sg/shipping/dhl.png" alt="DHL" className="h-6" />
          {/* เพิ่มเติมตามต้องการ */}
        </div>
      </div>
      {/* ติดตามเรา */}
      <div>
        <h4 className="font-bold mb-3">ติดตามเรา</h4>
        <ul className="space-y-2">
          <li className="flex items-center gap-2"><span>📘</span> Facebook</li>
          <li className="flex items-center gap-2"><span>📸</span> Instagram</li>
          <li className="flex items-center gap-2"><span>💬</span> Line</li>
          <li className="flex items-center gap-2"><span>💼</span> LinkedIn</li>
        </ul>
      </div>
      {/* ดาวน์โหลดแอป */}
      <div>
        <h4 className="font-bold mb-3">ดาวน์โหลดแอปพลิเคชัน</h4>
        <div className="flex flex-col items-center gap-2">
          <img src="https://www.qr-code-generator.com/wp-content/themes/qr/new_structure/assets/media/images/qrcode/qrcode.svg" alt="QR" className="h-20 w-20" />
          <div className="flex gap-2 mt-2">
            <img src="https://cdn.shopeemobile.com/shopee/shopee-pcmall-live-sg/footer/appstore.png" alt="App Store" className="h-8" />
            <img src="https://cdn.shopeemobile.com/shopee/shopee-pcmall-live-sg/footer/googleplay.png" alt="Google Play" className="h-8" />
            <img src="https://cdn.shopeemobile.com/shopee/shopee-pcmall-live-sg/footer/appgallery.png" alt="App Gallery" className="h-8" />
          </div>
        </div>
      </div>
    </div>
    <div className="text-center text-xs text-gray-400 py-4 border-t">
      &copy; {new Date().getFullYear()} Shopee. All Rights Reserved
    </div>
  </footer>
);

export default Footer; 