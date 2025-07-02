"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "@/app/store/cartSlice";
import { fetchProductById } from "@/app/store/productByIdSlice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CartPage() {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?.id || null);
  const cartItems = useSelector((state) => state.cart.items);
  const loading = useSelector((state) => state.cart.loading);
  const router = useRouter(); // ⬅️ initialize
  const [productDetails, setProductDetails] = useState({});

  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId));
    }
  }, [dispatch, userId]);

  // Fetch product details for each cart item
  useEffect(() => {
    const fetchDetails = async () => {
      const details = {};
      for (const item of cartItems) {
        if (!productDetails[item.product_id]) {
          const res = await dispatch(fetchProductById(item.product_id));
          if (res.meta.requestStatus === "fulfilled") {
            details[item.product_id] = res.payload;
          }
        }
      }
      setProductDetails((prev) => ({ ...prev, ...details }));
    };

    if (cartItems.length > 0) {
      fetchDetails();
    }
    // eslint-disable-next-line
  }, [cartItems, dispatch]);

  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) return;
    dispatch(updateCartItem({ userId, productId, quantity }));
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart({ userId, productId }));
    setProductDetails((prev) => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
  };

  const handleClearCart = () => {
    dispatch(clearCart(userId));
    setProductDetails({});
  };

  console.log("productDetails", productDetails);

  const total = cartItems.reduce((acc, item) => {
    const product = productDetails[item.product_id];
    const price = product?.price || 0;
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
            {cartItems.map((item) => {
              const product = productDetails[item.product_id];
              return (
                <div
                  key={item.product_id}
                  className="flex items-center justify-between border p-4 rounded-md"
                >
                  <div className="flex items-center gap-4">
                    <Link href={`product/${item.product_id}`}>
                      <Image
                        src={product?.image_url || "/placeholder.png"}
                        alt={product?.name || "Product"}
                        width={64}
                        height={64}
                        className="w-16 h-16 object-contain"
                      />
                    </Link>

                    <div>
                      <Link href={`product/${item.product_id}`}>
                        <h2 className="font-semibold">
                          {product?.name || "Product Name"}
                        </h2>
                      </Link>
                      <p className="text-sm text-gray-600">
                        ₹{" "}
                        {product?.price
                          ? Number(product.price).toLocaleString("en-IN")
                          : "0"}{" "}
                        × {item.quantity}
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
              );
            })}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div>
              <p className="text-xl font-bold">Total: ₹{total.toFixed(2)}</p>
            </div>
            <div>
              <button
                onClick={handleClearCart}
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
              >
                Clear Cart
              </button>

              <button
                onClick={() => router.push("/checkout")}
                className="bg-[#FFB703] text-white px-4 py-2 rounded hover:bg-green-600 ml-4"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
