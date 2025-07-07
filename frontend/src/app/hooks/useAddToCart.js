import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/app/store/cartSlice";
import { useState } from "react";

const useAddToCart = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id;

  const [showPopupCart, setShowPopupCart] = useState(false);
  const [popupMessageCart, setPopupMessageCart] = useState("");

  const handleAddToCart = (product, quantity = 1) => {
  const payload = {
    userId,
    product: {
      product_id: product.id,
      quantity,
      ...product, // include name, price etc.
    },
  };

    dispatch(addToCart(payload))
      .unwrap()
      .then(() => {
        setPopupMessageCart(`✅ ${product.name} added to cart`);
        setShowPopupCart(true);
      })
      .catch(() => {
        setPopupMessageCart("❌ Failed to add item to cart");
        setShowPopupCart(true);
      });

    setTimeout(() => {
      setShowPopupCart(false);
      setPopupMessageCart("");
    }, 2000);
  };

  const hidePopup = () => {
    setTimeout(() => {
      setShowPopupCart(false);
      setPopupMessageCart("");
    }, 2000);
  };

  return {
    handleAddToCart,
    showPopupCart,
    popupMessageCart,
  };
};

export default useAddToCart;
