"use client";

import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "@/app/store/wishlistSlice";
import { addToCart } from "@/app/store/cartSlice";
import { FaShoppingCart, FaTrash } from "react-icons/fa";

export default function WishlistPage() {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items || []);

  const handleRemove = (id) => {
    dispatch(removeFromWishlist(id));
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlistItems.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg shadow">
              <img
                src={product.image_url}
                alt={product.name}
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
