"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByCategory } from "@/app/store/productByCatSlice";

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
    <div className="p-4 bg-white shadow-md rounded-lg min-h-[200px]">
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
              className="border p-4 rounded-md shadow hover:shadow-md transition"
            >
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
              <p className="text-sm text-gray-600 mb-1">{product.description}</p>
              <p className="text-xs text-gray-500 mb-1">
                <span className="font-semibold">Category:</span>{" "}
                {product.category}
              </p>
              <p className="text-xs text-gray-500 mb-1">
                <span className="font-semibold">Price:</span> ₹
                {product.price} / Piece
              </p>
              <p className="text-xs text-gray-500 mb-2">
                <span className="font-semibold">Stock:</span> {product.stock}
              </p>
              {product.gallery_images?.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {product.gallery_images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Gallery ${idx + 1}`}
                      className="w-10 h-10 object-cover rounded border"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
