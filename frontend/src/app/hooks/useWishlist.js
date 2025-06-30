// hooks/useWishlist.js
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
} from "@/app/store/wishlistSlice";
import { useState } from "react";

export const useWishlist = (userId) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items || []);
  const wishlistLoading = useSelector((state) => state.wishlist.loading);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const triggerPopup = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      setPopupMessage("");
    }, 2000);
  };

  const isInWishlist = (productId) => wishlistItems.includes(productId);

  const toggleWishlist = (productId, productName = "Item") => {
    if (!userId) {
      triggerPopup("⚠️ Please login first to manage wishlist");
      return;
    }

    if (isInWishlist(productId)) {
      dispatch(removeFromWishlist({ userId, productId }));
      triggerPopup(`❌ ${productName} removed from wishlist`);
    } else {
      dispatch(addToWishlist({ userId, productId }));
      triggerPopup(`❤️ ${productName} added to wishlist`);
    }
  };

  const loadWishlist = () => {
    if (userId) dispatch(fetchWishlist(userId));
  };

  return {
    wishlistItems,
    wishlistLoading,
    isInWishlist,
    toggleWishlist,
    loadWishlist,
    popupMessage,
    showPopup,
  };
};
