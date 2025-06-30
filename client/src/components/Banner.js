import React, { useState, useEffect } from 'react';

const images = [
  '/images/man1.png',
  '/images/man2.png',
  '/images/man09.png',
  '/images/man11.png',
];

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-lg shadow-lg">
      <img
        src={images[currentIndex]}
        alt="โปรโมชั่น"
        className="w-full h-96 object-cover transition-opacity duration-1000 ease-in-out"
      />
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full ${currentIndex === index ? 'bg-white' : 'bg-gray-400'}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Banner;