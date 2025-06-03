'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';

export default function MicroControlSystems() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    fetch('/Rockwell.json')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error loading products:', err));
  }, []);

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Separate products by category
  const microProducts = products.filter((p) => p.category === 'micro');
  const smallProducts = products.filter((p) => p.category === 'small');

  const renderProductCard = (product) => (
    <div
      key={product.id}
      className="relative border rounded-lg p-4 shadow-md hover:shadow-lg transition-all"
    >
      <button
        onClick={() => toggleWishlist(product.id)}
        className="absolute top-2 right-2 text-2xl cursor-pointer"
        aria-label="Toggle Wishlist"
      >
        <FaHeart
          className={`transition-colors duration-300 ${
            wishlist.includes(product.id) ? 'text-yellow-400' : 'text-gray-300'
          }`}
        />
      </button>

      <div className="flex justify-center mb-4">
        <Image
          src={product.image}
          alt={product.title}
          width={120}
          height={120}
          className="object-contain h-28 w-full"
        />
      </div>

      <h2 className="font-semibold text-md text-[#044E78] mb-2">{product.title}</h2>
      <div className="text-orange-500 mb-2">⭐⭐⭐⭐⭐</div>
      <p className="text-sm text-gray-600 mb-2 h-20 overflow-hidden">{product.description}</p>
      <div className="font-bold mb-3">Price : $ {product.price}</div>

      <div className="flex gap-2">
        
        <Link
          href={product.link}
          className="bg-[#FFB703] text-white text-sm sm:px-4 px-1 py-1 rounded-2xl inline-block"
        >
          Know More
        </Link>

        <button className="bg-[#FFB703] text-white text-sm sm:px-4 px-1 py-1 rounded-2xl flex items-center gap-1">
          Add to Cart <FaShoppingCart />
        </button>
      </div>
    </div>
  );

  return (
    <div className="px-4 pb-8">
      {/* Micro Control Systems */}
      <h1 className="text-3xl font-bold text-center mb-8">Micro Control Systems</h1>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {microProducts.map(renderProductCard)}
      </div>

       <div className="flex justify-center mt-8">
        <Link
          href=""
          className="bg-[#044E78] text-white px-6 py-2 rounded-3xl"
        >
          View More
        </Link>
      </div>

      {/* Small Control Systems */}
      <h1 className="text-3xl font-bold text-center my-8 pt-6">Small Control Systems</h1>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {smallProducts.map(renderProductCard)}
      </div>

      <div className="flex justify-center mt-8">
        <Link
          href=""
          className="bg-[#044E78] text-white px-6 py-2 rounded-3xl"
        >
          View More
        </Link>
      </div>
    </div>
  );
}
