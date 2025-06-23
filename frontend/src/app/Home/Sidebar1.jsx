"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { fetchCategories } from "../store/categorySlice";
import { fetchProductsByCategory } from "../store/productByCatSlice";

export default function Sidebar() {
  const dispatch = useDispatch();

  const [activeCategoryId, setActiveCategoryId] = useState(null);

  const {
    data: categories = [],
    loading: catLoading,
    error: catError,
  } = useSelector((state) => state.categories || {});

  const {
    data: products = [],
    loading: prodLoading,
    error: prodError,
  } = useSelector((state) => state.products || {});

  // Fetch categories on mount
  useEffect(() => {
    console.log("Dispatching fetchCategories...");
    dispatch(fetchCategories());
  }, [dispatch]);

  // Load all products initially
  useEffect(() => {
    if (categories.length > 0 && activeCategoryId === null) {
      setActiveCategoryId("all");
      dispatch(fetchProductsByCategory("all"));
    }
  }, [categories, activeCategoryId, dispatch]);

  // Handle category click
  const handleCategoryClick = (id) => {
    setActiveCategoryId(id);
    dispatch(fetchProductsByCategory(id));
  };

  // console.log("all categories:", categories);
  // console.log("activeCategoryId:", activeCategoryId);
  // console.log("products for active category:", products);

  return (
    <section className="mx-12">
      <div className="flex flex-col-reverse md:flex-row md:p-8 gap-12 md:h-[600px]">
        {/* Sidebar */}
        <div className="w-full md:w-2/5 bg-white p-4 border shadow-md rounded-xl h-full overflow-auto">
          {catLoading ? (
            <p className="text-gray-500">Loading categories...</p>
          ) : catError ? (
            <p className="text-red-500">Error loading categories</p>
          ) : (
            <ul className="space-y-3">
              {/* All Button */}
              <li key="all" className="border-b border-gray-300">
                <button
                  onClick={() => handleCategoryClick("all")}
                  className={`w-full text-left py-2 text-lg font-bold transition-colors duration-200 text-[#044E78] cursor-pointer ${
                    activeCategoryId === "all"
                      ? "text-yellow-400"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  All
                </button>
              </li>

              {/* Dynamic Category List */}
              {categories.map((category) => (
                <li key={category.id} className="border-b border-gray-300">
                  <button
                    onClick={() => handleCategoryClick(category.id)}
                    className={`w-full text-left py-2 text-lg font-bold transition-colors duration-200 text-[#044E78] cursor-pointer ${
                      activeCategoryId === category.id
                        ? "text-yellow-400"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="w-full relative h-[200px] md:h-full overflow-hidden shadow-lg mb-4 md:mb-8">
          <Image
            src="/assets/Sidebar-right.png"
            alt="Industrial Automation"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Product Display */}
      <div className="w-full md:w-4/5">
        <div className="p-4 bg-white shadow-md rounded-lg min-h-[200px]">
          {prodLoading ? (
            <p className="text-gray-500">Loading products...</p>
          ) : prodError ? (
            <p className="text-red-500">Error loading products</p>
          ) : activeCategoryId && products.length === 0 ? (
            <p className="text-gray-400">
              No products found for this category.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="border p-4 rounded-md shadow hover:shadow-md transition"
                >
                  {/* Main Image */}
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-40 object-contain mb-2 rounded"
                    />
                  )}
                  <h3 className="text-lg font-semibold text-[#044E78]">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {product.description}
                  </p>
                  <p className="text-xs text-gray-500 mb-1">
                    <span className="font-semibold">Category:</span>{" "}
                    {product.category}
                  </p>
                  <p className="text-xs text-gray-500 mb-1">
                    <span className="font-semibold">Price:</span> ₹
                    {product.price} / Piece
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    <span className="font-semibold">Stock:</span>{" "}
                    {product.stock}
                  </p>
                  {/* Gallery Images */}
                  {product.gallery_images &&
                    product.gallery_images.length > 0 && (
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
      </div>
    </section>
  );
}
