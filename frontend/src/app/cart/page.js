"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "@/app/store/cartSlice";
import Image from "next/image";

export default function CartPage() {
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.auth.user?.id || null);
  const cartItems = useSelector((state) => state.cart.items);
  const loading = useSelector((state) => state.cart.loading);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    console.log("User ID:", userId);
    console.log("Cart items:", cartItems);
  }, [userId, cartItems]);

  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) return;
    dispatch(updateCartItem({ userId, productId, quantity }));
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart({ userId, productId }));
  };

  const handleClearCart = () => {
    dispatch(clearCart(userId));
  };

  const total = cartItems.reduce((acc, item) => {
    const price = item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  return (
    <div className="max-w-5xl mx-auto p-6 h-screen">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {loading ? (
        <p>Loading...</p>
      ) : cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.product_id}
                className="flex items-center justify-between border p-4 rounded-md"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={item.product?.image_url || "/placeholder.png"}
                    alt={item.product?.name || "Product"}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-contain"
                  />
                  <div>
                    <h2 className="font-semibold">
                      {item.product?.name || "Product Name"}
                    </h2>
                    <p className="text-sm text-gray-600">
                      ₹{item.product?.price || 0} × {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.product_id, +e.target.value)
                    }
                    className="w-16 p-1 border rounded"
                  />
                  <button
                    onClick={() => handleRemove(item.product_id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <p className="text-xl font-bold">Total: ₹{total.toFixed(2)}</p>
            <button
              onClick={handleClearCart}
              className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
}
