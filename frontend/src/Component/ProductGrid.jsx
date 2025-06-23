"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByCategory } from "@/app/store/productByCatSlice";
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

  return (
    <div className=" p-4 bg-white shadow-md rounded-lg ">
      {prodLoading ? (
        <p className="text-gray-500">Loading products...</p>
      ) : prodError ? (
        <p className="text-red-500">Error loading products</p>
      ) : products.length === 0 ? (
        <p className="text-gray-400">No products found for this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="relative border p-6 rounded-xl shadow hover:shadow-md transition flex flex-col justify-between"
            >
              {/* Wishlist Icon */}
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

              {/* Static 5-star rating */}
              <div className="text-yellow-500 text-xl mb-2">★★★★★</div>

              <p className="text-sm text-gray-600 mb-1">
                {truncateDescription(product.description)}
              </p>

              <p className="text-sm font-semibold text-gray-800 mb-2">
                Price: ₹ {product.price} / Piece
              </p>

              <div className="flex w-full gap-2 mt-auto">
                <button className="flex items-center justify-center gap-1 w-1/2 text-md bg-[#FFB703] hover:bg-blue-600 text-white px-3 py-1 font-bold rounded-2xl">
                  Know More <HiOutlineChevronDoubleRight size={14} />
                </button>
                <button className="flex items-center justify-center gap-1 w-1/2 text-md bg-[#FFB703] hover:bg-green-600 text-white px-3 py-1 font-bold rounded-2xl">
                  Add to Cart <FaShoppingCart size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
