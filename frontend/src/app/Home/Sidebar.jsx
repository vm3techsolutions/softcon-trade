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

  useEffect(() => {
    console.log("Dispatching fetchCategories...");
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (categories.length > 0 && activeCategoryId === null) {
      const firstCategoryId = categories[0]._id;
      setActiveCategoryId(firstCategoryId);
      dispatch(fetchProductsByCategory(firstCategoryId));
    }
  }, [categories, activeCategoryId, dispatch]);

  const handleCategoryClick = (id) => {
    setActiveCategoryId(id);
    dispatch(fetchProductsByCategory(id));
  };

  return (
    <section>
      <div className="flex flex-col-reverse md:flex-row p-4 md:p-8 gap-4">
        {/* Sidebar */}
        <div className="w-full md:w-2/5 bg-white p-4 border shadow-md rounded-xl">
          {catLoading ? (
            <p className="text-gray-500">Loading categories...</p>
          ) : catError ? (
            <p className="text-red-500">Error loading categories</p>
          ) : (
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category._id} className="border-b border-gray-300">
                  <button
                    onClick={() => handleCategoryClick(category._id)}
                    className={`w-full text-left py-2 text-lg font-bold transition-colors duration-200 text-[#044E78] cursor-pointer ${
                      activeCategoryId === category._id
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

        <div className="w-full h-[200px] md:h-[350px] relative overflow-hidden shadow-lg mb-4 md:mb-8">
          <Image
            src="/assets/Sidebar-right.png"
            alt="Industrial Automation"
            layout="fill"
            objectFit="cover"
          />
        </div>
      </div>

      {/* Product Section */}
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
                  key={product._id}
                  className="border p-4 rounded-md shadow hover:shadow-md transition"
                >
                  <h3 className="text-lg font-semibold text-[#044E78]">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600">{product.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
