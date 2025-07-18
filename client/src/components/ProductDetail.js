import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { FaStar } from 'react-icons/fa';

const Rating = ({ value, text, color = '#fde047' }) => {
  return (
    <div className="flex items-center">
      <div className="flex text-yellow-400 mr-1">
        {[...Array(5)].map((_, i) => {
          const ratingValue = i + 1;
          return (
            <FaStar
              key={i}
              className={ratingValue <= value ? 'text-yellow-400' : 'text-gray-300'}
            />
          );
        })}
      </div>
      <span className="text-gray-600 text-sm">{text && text}</span>
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const { addToCart } = useContext(CartContext);
  const { isAuthenticated, user, token } = useContext(AuthContext);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loadingProductReview, setLoadingProductReview] = useState(false);
  const [errorProductReview, setErrorProductReview] = useState(null);

  const fetchProduct = () => {
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
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

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
    const maxQty = product?.quantity || 0;
    if (value > 0 && value <= maxQty) {
      setQuantity(value);
    } else if (value > maxQty) {
      alert(`สินค้ามีในสต็อกเพียง ${maxQty} ชิ้น`);
      setQuantity(maxQty);
    } else {
      setQuantity(1);
    }
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    setLoadingProductReview(true);
    setErrorProductReview(null);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.post(`http://localhost:5000/api/products/${id}/reviews`, { rating, comment }, config);
      setLoadingProductReview(false);
      setRating(0);
      setComment('');
      alert('ขอบคุณสำหรับรีวิวครับ!');
      fetchProduct(); 
    } catch (error) {
      const message = error.response && error.response.data.message ? error.response.data.message : error.message;
      setErrorProductReview(message);
      setLoadingProductReview(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="container mx-auto p-2 sm:p-4 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-4">
          <img src={mainImage || 'https://via.placeholder.com/400x400?text=No+Image'} alt={product.name} className="w-full h-auto object-contain rounded-lg shadow-md" />
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-2 mt-4 overflow-x-auto">
              {product.images.map((img, index) => (
                <img key={index} src={`http://localhost:5000${img.url}`} alt={`${product.name} thumbnail ${index + 1}`} className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${mainImage === `http://localhost:5000${img.url}` ? 'border-indigo-500' : 'border-gray-200'}`} onClick={() => setMainImage(`http://localhost:5000${img.url}`)} />
              ))}
            </div>
          )}
        </div>

        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="mb-4">
              <Rating value={product.rating} text={`${product.numReviews} reviews`} />
            </div>
            <div className="text-4xl font-bold text-indigo-600 mb-4">฿{product.price}</div>
            <p className="text-gray-700 mb-4 leading-relaxed">{product.detail || 'ไม่มีรายละเอียดสินค้า'}</p>
            <div className="mb-4"><span className="font-semibold text-gray-800">สินค้าคงเหลือ: </span><span className="text-gray-600">{product.quantity} ชิ้น</span></div>
            <div className="flex items-center mb-6">
              <span className="font-semibold text-gray-800 mr-4">จำนวน:</span>
              <div className="flex items-center">
                <button onClick={() => setQuantity(prev => Math.max(1, prev - 1))} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-l-md hover:bg-gray-300">-</button>
                <input type="number" value={quantity} onChange={handleQuantityChange} className="w-16 text-center border-t border-b border-gray-200 py-1" min="1" max={product.quantity} />
                <button onClick={() => setQuantity(prev => Math.min(product.quantity, prev + 1))} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-r-md hover:bg-gray-300">+</button>
              </div>
            </div>
          </div>
          <div className="flex space-x-4 mt-auto">
            <button onClick={handleAddToCart} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg">เพิ่มลงตะกร้า</button>
            <button onClick={() => navigate(-1)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg">กลับ</button>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">รีวิวสินค้า</h2>
          {product.reviews.length === 0 && <div className="p-4 rounded-lg bg-gray-100">ยังไม่มีรีวิว</div>}
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <div key={review._id} className="p-4 border rounded-lg shadow-sm bg-white">
                <div className="font-bold text-gray-800">{review.name}</div>
                <div className="my-1"><Rating value={review.rating} /></div>
                <p className="text-gray-500 text-sm mb-2">{new Date(review.createdAt).toLocaleDateString('th-TH')}</p>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">เขียนรีวิวของคุณ</h2>
          {isAuthenticated ? (
            product.reviews.find(r => r.user === user._id) ? (
              <div className="p-4 rounded-lg bg-blue-100 text-blue-800">คุณได้รีวิวสินค้านี้แล้ว</div>
            ) : (
              <form onSubmit={submitReviewHandler} className="p-4 border rounded-lg bg-white shadow-sm">
                {errorProductReview && <div className="p-3 mb-4 bg-red-100 text-red-700 rounded">{errorProductReview}</div>}
                <div className="mb-4">
                  <label htmlFor="rating" className="block font-semibold mb-1">ให้คะแนน</label>
                  <select id="rating" value={rating} onChange={(e) => setRating(e.target.value)} required className="w-full p-2 border rounded">
                    <option value="">เลือก...</option>
                    <option value="1">1 - ไม่พอใจอย่างมาก</option>
                    <option value="2">2 - ไม่พอใจ</option>
                    <option value="3">3 - พอใช้</option>
                    <option value="4">4 - พอใจ</option>
                    <option value="5">5 - พอใจอย่างมาก</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="comment" className="block font-semibold mb-1">ความคิดเห็น</label>
                  <textarea id="comment" rows="4" value={comment} onChange={(e) => setComment(e.target.value)} required className="w-full p-2 border rounded"></textarea>
                </div>
                <button type="submit" disabled={loadingProductReview} className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 disabled:bg-indigo-300">
                  {loadingProductReview ? 'กำลังส่ง...' : 'ส่งรีวิว'}
                </button>
              </form>
            )
          ) : (
            <div className="p-4 rounded-lg bg-gray-100">
              กรุณา <Link to="/login" className="text-indigo-600 hover:underline">เข้าสู่ระบบ</Link> เพื่อเขียนรีวิว
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
