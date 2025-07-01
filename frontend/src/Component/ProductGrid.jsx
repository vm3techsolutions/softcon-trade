"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByCategory } from "@/app/store/productByCatSlice";
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
} from "@/app/store/wishlistSlice";
import { fetchCart, addToCart } from "@/app/store/cartSlice"; // ✅ Import addToCart
import { FaHeart, FaShoppingCart, FaTag } from "react-icons/fa";
import { HiOutlineChevronDoubleRight } from "react-icons/hi";
import Link from "next/link";

function truncateDescription(description, wordLimit = 12) {
  const words = description?.split(" ");
  return words?.length > wordLimit
    ? words.slice(0, wordLimit).join(" ") + "..."
    : description;
}

export default function ProductGrid({ activeCategoryId }) {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const userId = user?.id;

  const wishlistItems = useSelector((state) => state.wishlist.items || []);
  const wishlistLoading = useSelector((state) => state.wishlist.loading);

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  // const cartItems = useSelector((state) => state.cart.items || []);

  console.log("Wishlist Items:", wishlistItems);

  const {
    data: products = [],
    loading: prodLoading,
    error: prodError,
  } = useSelector((state) => state.products || {});

  // Fetch products on category change
  useEffect(() => {
    if (activeCategoryId) {
      dispatch(fetchProductsByCategory(activeCategoryId));
    }
  }, [activeCategoryId, dispatch]);

  const handleAddToCart = (product) => {
    const payload = {
      userId,
      product: {
        product_id: product.id,
        quantity: 1, // default to 1; can be made dynamic later
      },
    };

    dispatch(addToCart(payload))
      .unwrap()
      .then(() => {
        setPopupMessage(`✅ ${product.name} added to cart`);
        setShowPopup(true);
      })
      .catch(() => {
        setPopupMessage("❌ Failed to add item to cart");
        setShowPopup(true);
      });

    setTimeout(() => {
      setShowPopup(false);
      setPopupMessage("");
    }, 2000);
  };

  // ✅ Fetch cart items when user is logged in
  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId));
    }
  }, [userId, dispatch]);

  // Fetch wishlist when user ID is ready
  useEffect(() => {
    if (userId) {
      dispatch(fetchWishlist(userId));
    }
  }, [userId, dispatch]);

  const handleWishlistClick = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (!userId) {
      setPopupMessage("⚠️ Please login first to manage wishlist");
      setShowPopup(true);
    } else {
      if (wishlistItems.includes(productId)) {
        dispatch(removeFromWishlist({ userId, productId }));
        setPopupMessage(`❌ ${product?.name || "Item"} removed from wishlist`);
      } else {
        dispatch(addToWishlist({ userId, productId }));
        setPopupMessage(`❤️ ${product?.name || "Item"} added to wishlist`);
      }
      setShowPopup(true);
    }

    // Hide popup after 2 seconds
    setTimeout(() => {
      setShowPopup(false);
      setPopupMessage("");
    }, 2000);
  };

  return (
    <div className="p-2 md:p-4">
      {prodLoading || wishlistLoading ? (
        <p className="text-gray-500">Loading products...</p>
      ) : prodError ? (
        <p className="text-red-500">Error loading products</p>
      ) : products.length === 0 ? (
        <p className="text-gray-400">No products found for this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="relative border p-3 md:p-6 rounded-md md:rounded-xl shadow hover:shadow-md transition flex flex-col justify-between overflow-hidden"
            >
              {/* Wishlist Icon */}
              <button
                onClick={() => handleWishlistClick(product.id)}
                className={`absolute top-4 right-4 p-2 rounded-full bg-[#FFB703] transition ${
                  wishlistItems.includes(product.id)
                    ? "text-red-500"
                    : "text-white"
                }`}
                title={
                  wishlistItems.includes(product.id)
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
              >
                <FaHeart size={18} />
              </button>

              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-40 object-contain mb-2 rounded"
                />
              )}

              <h3 className="text-md md:text-lg font-bold text-[#044E78]">
                {product.name}
              </h3>

              {/* <div className="text-yellow-500 text-xl mb-2">★★★★★</div> */}

              <div className="text-[#FFB703] flex font-medium text-sm mb-2">
                <FaTag className="mt-1 mr-1"/> {product.category}
              </div>

              <p className="text-sm text-gray-600 mb-1">
                {truncateDescription(product.description)}
              </p>

              <p className="text-sm font-semibold text-gray-800 mb-2">
                Price: ₹ {product.price} / Piece
              </p>

              <div className="flex w-full gap-2 mt-auto">
                <Link
                  href={`/product/${product.id}`}
                  className="primaryButton flex items-center justify-center gap-1 w-1/2 text-[12px] md:text-sm bg-[#FFB703] text-white px-1 py-1 font-bold rounded-2xl"
                >
                  Know More <HiOutlineChevronDoubleRight size={14} />
                </Link>
                <button
                  onClick={() => handleAddToCart(product)}
                  className=" primaryButton flex items-center justify-center gap-1 w-1/2 text-sm bg-[#FFB703] hover:bg-green-600 text-white px-1 py-1 font-bold rounded-2xl"
                >
                  <span className="hidden md:inline-block">Add to Cart</span> <FaShoppingCart size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popup */}
      {showPopup && popupMessage && (
        <div className="fixed top-5 right-5 bg-white text-black shadow-lg border border-green-400 px-4 py-2 rounded-lg z-50 transition duration-300">
          {popupMessage}
        </div>
      )}
    </div>
  );
}
// This component displays a grid of products based on the selected category.
