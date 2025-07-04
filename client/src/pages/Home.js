import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Banner from '../components/Banner';
import CategoryBar from '../components/CategoryBar';
import ProductList from '../components/ProductList';

const Home = ({ search }) => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Banner />
        <CategoryBar />
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 px-4 sm:px-0">สินค้าแนะนำ</h2>
          <ProductList search={search} />
        </div>
      </div>
    </div>
  );
};

export default Home;
