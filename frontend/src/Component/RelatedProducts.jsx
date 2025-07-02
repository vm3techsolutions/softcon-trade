"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByCategory } from "@/app/store/productByCatSlice";
import Link from "next/link";
import Image from "next/image";

export default function RelatedProducts({ categoryId, currentProductId }) {
  const dispatch = useDispatch();
  const { data: relatedProducts, loading } = useSelector((state) => state.products);

  useEffect(() => {
  if (categoryId) {
    dispatch(fetchProductsByCategory(categoryId));
  }
}, [dispatch, categoryId]);

const filteredProducts = relatedProducts.filter(
  (product) => product.id !== currentProductId
);

  if (loading) return <p>Loading related products...</p>;

  if (!filteredProducts.length) return <p>No related products found.</p>;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <Link href={`/product/${product.id}`} key={product.id} className="block border p-4 rounded hover:shadow">
            <Image
              src={product.image_url || "/placeholder.png"}
              alt={product.name}
              width={200}
              height={200}
              className="w-full h-40 object-contain"
            />
            <h3 className="font-semibold text-sm mt-2">{product.name}</h3>
            <p className="text-green-600 font-semibold text-sm">
              ₹{product.price?.toLocaleString("en-IN")}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
