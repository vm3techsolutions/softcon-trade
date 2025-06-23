"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByCategory } from "@/app/store/productByCatSlice";
import { addToCart } from "@/app/store/cartSlice";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { HiOutlineChevronDoubleRight } from "react-icons/hi";

function truncateDescription(description, wordLimit = 12) {
  const words = description?.split(" ");
  return words?.length > wordLimit
    ? words.slice(0, wordLimit).join(" ") + "..."
    : description;
}

export default function ProductGrid({ activeCategoryId }) {
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false);
  const [popupProduct, setPopupProduct] = useState(null);

  const {
    data: products = [],
    loading: prodLoading,
    error: prodError,
  } = useSelector((state) => state.products || {});

  useEffect(() => {
    if (activeCategoryId) {
      dispatch(fetchProductsByCategory(activeCategoryId));
    }
  }, [activeCategoryId, dispatch]);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    setPopupProduct(product);
    setShowPopup(true);

    setTimeout(() => setShowPopup(false), 2000); // Hide popup after 2s
  };

  return (
    <div className="relative p-4 rounded-lg mx-auto w-full">
      {/* Popup */}
      {showPopup && popupProduct && (
        <div className="fixed top-5 right-5 bg-white text-black shadow-lg border border-green-400 px-4 py-2 rounded-lg z-50 transition duration-300">
          ✅ <strong>{popupProduct.name}</strong> added to cart!
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4">
        {prodLoading ? (
          <p className="text-gray-500">Loading products...</p>
        ) : prodError ? (
          <p className="text-red-500">Error loading products</p>
        ) : products.length === 0 ? (
          <p className="text-gray-400">No products found for this category.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
            {products.map((product) => (
              <div
                key={product.id}
                className="relative border p-6 rounded-xl shadow hover:shadow-md transition flex flex-col justify-between"
              >
                <button className="absolute top-4 right-4 p-2 rounded-full bg-[#FFB703] text-white hover:text-red-500 transition">
                  <FaHeart size={18} />
                </button>

                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-40 object-contain mb-2 rounded"
                  />
                )}
                <h3 className="text-md font-extrabold text-[#044E78]">
                  {product.name}
                </h3>

                <div className="text-yellow-500 text-xl mb-2">★★★★★</div>

                <p className="text-sm text-gray-600 mb-1">
                  {truncateDescription(product.description)}
                </p>

                <p className="text-sm font-semibold text-gray-800 mb-2">
                  Price: ₹ {product.price} / Piece
                </p>

                <div className="flex w-full gap-2 mt-auto">
                  <button className="flex items-center justify-center gap-1 w-1/2 text-sm bg-[#FFB703] hover:bg-blue-600 text-white px-1 py-1 font-bold rounded-2xl">
                    Know More <HiOutlineChevronDoubleRight size={14} />
                  </button>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex items-center justify-center gap-1 w-1/2 text-sm bg-[#FFB703] hover:bg-green-600 text-white px-1 py-1 font-bold rounded-2xl"
                  >
                    Add to Cart <FaShoppingCart size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
