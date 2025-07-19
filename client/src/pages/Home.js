import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Banner from '../components/Banner';
import PromoBanners from '../components/PromoBanners';
import CategoryBar from '../components/CategoryBar';
import BrandBar from '../components/BrandBar'; // Import BrandBar
import ProductList from '../components/ProductList';

const Home = ({ search }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null); // New state for brand

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setSelectedBrand(null); // Reset brand when category changes
  };

  const handleSelectBrand = (brand) => {
    setSelectedBrand(brand);
    setSelectedCategory(null); // Reset category when brand changes
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Banner />
        </div>
        <div className="mb-8">
          <PromoBanners />
        </div>
        <CategoryBar onSelectCategory={handleSelectCategory} />
        <BrandBar onSelectBrand={handleSelectBrand} /> {/* Use BrandBar */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 px-4 sm:px-0">สินค้าแนะนำ</h2>
          <ProductList search={search} category={selectedCategory} brand={selectedBrand} />
        </div>
      </div>
    </div>
  );
};

export default Home;
