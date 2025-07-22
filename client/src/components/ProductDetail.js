import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { FaStar } from 'react-icons/fa';

import { toast } from 'react-toastify';

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
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelatedProducts, setLoadingRelatedProducts] = useState(true);

  const fetchProduct = () => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
        if (res.data.images && res.data.images.length > 0) {
          setMainImage(`http://localhost:5000${res.data.images[0].url}`);
        }
        // Fetch related products after product data is loaded
        if (res.data.category) {
          fetchRelatedProducts(res.data.category, res.data._id);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const fetchRelatedProducts = (category, currentProductId) => {
    setLoadingRelatedProducts(true);
    axios.get(`http://localhost:5000/api/products/category/${category}`)
      .then((res) => {
        // Filter out the current product from related products
        const filteredProducts = res.data.filter(p => p._id !== currentProductId);
        setRelatedProducts(filteredProducts);
        setLoadingRelatedProducts(false);
      })
      .catch((err) => {
        console.error("Error fetching related products:", err);
        setLoadingRelatedProducts(false);
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าในตะกร้า');
      navigate('/login');
      return;
    }
    if (product && quantity > 0) {
      addToCart(product, quantity);
      toast.success('เพิ่มสินค้าลงในตะกร้าแล้ว!');
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    const maxQty = product?.quantity || 0;
    if (value > 0 && value <= maxQty) {
      setQuantity(value);
    } else if (value > maxQty) {
      toast.warn(`สินค้ามีในสต็อกเพียง ${maxQty} ชิ้น`);
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
      toast.success('ขอบคุณสำหรับรีวิวครับ!');
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
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Product Image Section */}
        <div className="w-full lg:w-1/2 p-4 flex flex-col items-center justify-center">
          <img src={mainImage || 'https://via.placeholder.com/400x400?text=No+Image'} alt={product.name} className="w-full max-w-md h-auto object-contain rounded-lg shadow-md" />
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-2 mt-4 overflow-x-auto p-2 bg-gray-50 rounded-lg shadow-inner">
              {product.images.map((img, index) => (
                <img key={index} src={`http://localhost:5000${img.url}`} alt={`${product.name} thumbnail ${index + 1}`} className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${mainImage === `http://localhost:5000${img.url}` ? 'border-indigo-500' : 'border-gray-200'} transition duration-200 transform hover:scale-105`} onClick={() => setMainImage(`http://localhost:5000${img.url}`)} />
              ))}
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="w-full lg:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-gray-600 text-sm mb-1">หมวดหมู่: {product.category}</p>
            <p className="text-gray-600 text-sm mb-4">แบรนด์: {product.brand}</p>
            <div className="mb-4">
              <Rating value={product.rating} text={`${product.numReviews} reviews`} />
            </div>
            <div className="text-5xl font-extrabold text-indigo-700 mb-4">฿{product.price}</div>
            <p className="text-gray-700 mb-4 leading-relaxed">{product.detail || 'ไม่มีรายละเอียดสินค้า'}</p>
            <div className="mb-4 text-lg"><span className="font-semibold text-gray-800">สินค้าคงเหลือ: </span><span className="text-gray-600">{product.quantity} ชิ้น</span></div>
            <div className="flex items-center mb-6">
              <span className="font-semibold text-gray-800 mr-4 text-lg">จำนวน:</span>
              <div className="flex items-center">
                <button onClick={() => setQuantity(prev => Math.max(1, prev - 1))} className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-l-lg hover:bg-indigo-200 transition duration-200 font-bold text-xl">-</button>
                <input type="number" value={quantity} onChange={handleQuantityChange} className="w-20 text-center border-t border-b border-indigo-200 py-2 text-lg font-semibold" min="1" max={product.quantity} />
                <button onClick={() => setQuantity(prev => Math.min(product.quantity, prev + 1))} className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-r-lg hover:bg-indigo-200 transition duration-200 font-bold text-xl">+</button>
              </div>
            </div>
          </div>
          <div className="flex space-x-4 mt-auto">
            <button onClick={() => navigate(-1)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">กลับ</button>
            <button onClick={handleAddToCart} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">เพิ่มลงตะกร้า</button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">รีวิวสินค้า</h2>
          {product.reviews.length === 0 && <div className="p-6 rounded-lg bg-gray-100 text-gray-700 text-center">ยังไม่มีรีวิวสำหรับสินค้านี้</div>}
          <div className="space-y-6">
            {product.reviews.map((review) => (
              <div key={review._id} className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
                <div className="font-bold text-gray-800 text-lg">{review.name}</div>
                <div className="my-1"><Rating value={review.rating} /></div>
                <p className="text-gray-500 text-sm mb-2">{new Date(review.createdAt).toLocaleDateString('th-TH')}</p>
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">เขียนรีวิวของคุณ</h2>
          {isAuthenticated ? (
            product.reviews.find(r => r.user === user._id) ? (
              <div className="p-6 rounded-lg bg-blue-100 text-blue-800 text-center">คุณได้รีวิวสินค้านี้แล้ว</div>
            ) : (
              <form onSubmit={submitReviewHandler} className="space-y-6">
                {errorProductReview && <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-lg">{errorProductReview}</div>}
                <div className="mb-4">
                  <label htmlFor="rating" className="block font-semibold mb-2 text-gray-700 text-lg">ให้คะแนน</label>
                  <select id="rating" value={rating} onChange={(e) => setRating(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200">
                    <option value="">เลือก...</option>
                    <option value="1">1 - ไม่พอใจอย่างมาก</option>
                    <option value="2">2 - ไม่พอใจ</option>
                    <option value="3">3 - พอใช้</option>
                    <option value="4">4 - พอใจ</option>
                    <option value="5">5 - พอใจอย่างมาก</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="comment" className="block font-semibold mb-2 text-gray-700 text-lg">ความคิดเห็น</label>
                  <textarea id="comment" rows="4" value={comment} onChange={(e) => setComment(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"></textarea>
                </div>
                <button type="submit" disabled={loadingProductReview} className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 font-bold transition duration-300 ease-in-out transform hover:scale-105">
                  {loadingProductReview ? 'กำลังส่ง...' : 'ส่งรีวิว'}
                </button>
              </form>
            )
          ) : (
            <div className="p-6 rounded-lg bg-gray-100 text-gray-700 text-center">
              กรุณา <Link to="/login" className="text-indigo-600 hover:underline font-semibold">เข้าสู่ระบบ</Link> เพื่อเขียนรีวิว
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-12 bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">สินค้าหมวดเดียวกัน</h2>
        {loadingRelatedProducts ? (
          <p className="text-gray-600 text-center">กำลังโหลดสินค้า...</p>
        ) : relatedProducts.length === 0 ? (
          <p className="text-gray-600 text-center">ไม่พบสินค้าในหมวดหมู่เดียวกัน</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map(relatedProduct => (
              <Link to={`/products/${relatedProduct._id}`} key={relatedProduct._id} className="block bg-gray-50 rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl">
                <img src={`http://localhost:5000${relatedProduct.images[0]?.url || ''}`} alt={relatedProduct.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800 truncate">{relatedProduct.name}</h3>
                  <p className="text-indigo-600 font-bold text-xl mt-1">฿{relatedProduct.price}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
