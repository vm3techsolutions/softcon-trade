// app/search/SearchResults.js
'use client';
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { searchProducts, fetchProductsByCategory } from "@/app/store/productByCatSlice";
import ProductGrid from "@/Component/ProductGrid";

export default function SearchResult() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const { data: filteredProducts, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (query) {
      dispatch(fetchProductsByCategory("all")).then(() => {
        dispatch(searchProducts(query));
      });
    }
  }, [dispatch, query]);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
}
