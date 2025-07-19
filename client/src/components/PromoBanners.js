
import React from 'react';
import { Link } from 'react-router-dom';

const PromoBanners = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 px-4 sm:px-0">
      {/* Main Banner (50%) */}
      <div className="w-full md:w-1/2">
        <Link to="/promotions/main">
          <div className="relative overflow-hidden rounded-lg shadow-lg h-full">
            <img 
              src="/images/man08.png" 
              alt="Main Promotion" 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          </div>
        </Link>
      </div>

      {/* Side Banners (2x 25%) */}
      <div className="w-full md:w-1/2 flex flex-col gap-4">
        <div className="flex-1">
          <Link to="/promotions/side1">
            <div className="relative overflow-hidden rounded-lg shadow-lg h-full">
              <img 
                src="/images/man09.png" 
                alt="Side Promotion 1" 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>
          </Link>
        </div>
        <div className="flex-1">
          <Link to="/promotions/side2">
            <div className="relative overflow-hidden rounded-lg shadow-lg h-full">
              <img 
                src="/images/man11.png" 
                alt="Side Promotion 2" 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PromoBanners;
