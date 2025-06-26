"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProductById } from "@/app/store/productByIdSlice";
import { removeFromWishlist } from "@/app/store/wishlistSlice";
import { addToCart } from "@/app/store/cartSlice";
import { FaShoppingCart, FaTrash } from "react-icons/fa";
import Image from "next/image";

export default function WishlistPage() {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items || []);
  const [products, setProducts] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]);
  const [errorIds, setErrorIds] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const promises = wishlistItems.map(async (id) => {
        try {
          setLoadingIds((prev) => [...prev, id]);
          const result = await dispatch(fetchProductById(id)).unwrap();
          setProducts((prev) => {
            if (!prev.find((p) => p.id === result.id)) {
              return [...prev, result];
            }
            return prev;
          });
        } catch (err) {
          setErrorIds((prev) => [...prev, id]);
        } finally {
          setLoadingIds((prev) => prev.filter((i) => i !== id));
        }
      });

      await Promise.all(promises);
    };

    if (wishlistItems.length > 0) {
      setProducts([]); // Reset before fetching
      fetchProducts();
    }
  }, [wishlistItems, dispatch]);

  const handleRemove = (productId) => {
    const userId = 1; // Replace with actual user ID
    dispatch(removeFromWishlist({ userId, productId }));
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleAddToCart = (product) => {
    const userId = 1; // Replace with actual user ID
    const cartProduct = {
      product_id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity: 1, // Default quantity
    };

    dispatch(addToCart({ userId, product: cartProduct }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty.</p>
      ) : products.length === 0 && loadingIds.length > 0 ? (
        <p className="text-gray-500">Loading wishlist...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg shadow">
              <Image
                src={product.image_url}
                alt={product.name}
                width={300}
                height={200}
                className="w-full h-40 object-contain mb-2"
              />
              <h3 className="text-lg font-semibold text-[#044E78]">
                {product.name}
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                Price: ₹{product.price}
              </p>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex items-center gap-1 text-sm bg-[#FFB703] hover:bg-green-600 text-white px-3 py-1 rounded"
                >
                  <FaShoppingCart /> Add to Cart
                </button>
                <button
                  onClick={() => handleRemove(product.id)}
                  className="flex items-center gap-1 text-sm bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  <FaTrash /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
