"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../store/categorySlice";

export default function Sidebar({ activeCategoryId, onCategorySelect }) {
  const dispatch = useDispatch();

  const {
    data: categories = [],
    loading: catLoading,
    error: catError,
  } = useSelector((state) => state.categories || {});

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="w-full md:w-2/5 bg-white p-4 border shadow-md rounded-xl h-full overflow-auto">
      {catLoading ? (
        <p className="text-gray-500">Loading categories...</p>
      ) : catError ? (
        <p className="text-red-500">Error loading categories</p>
      ) : (
        <ul className="space-y-3">
          <li key="all" className="border-b border-gray-300">
            <button
              onClick={() => onCategorySelect("all")}
              className={`w-full text-left py-2 text-lg font-bold transition-colors duration-200 text-[#044E78] cursor-pointer ${
                activeCategoryId === "all"
                  ? "text-yellow-400"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              All
            </button>
          </li>
          {categories.map((category) => (
            <li key={category.id} className="border-b border-gray-300">
              <button
                onClick={() => onCategorySelect(category.id)}
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
  );
}
