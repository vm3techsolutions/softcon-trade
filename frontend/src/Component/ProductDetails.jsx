"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { FaHeart, FaShoppingCart, FaTag } from "react-icons/fa";
import { fetchProductById } from "@/app/store/productByIdSlice";
import { fetchWishlist } from "@/app/store/wishlistSlice";
import { fetchCart } from "@/app/store/cartSlice";
import { fetchProductsByCategory } from "@/app/store/productByCatSlice";
import useAddToCart from "@/app/hooks/useAddToCart";
import { useWishlist } from "@/app/hooks/useWishlist";
import RelatedProducts from "./RelatedProducts";
// import ProductGrid from "@/Component/ProductGrid";

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    data: product,
    loading,
    error,
  } = useSelector((state) => state.productById);

  const relatedProducts = useSelector(
    (state) => state.products?.data || []
  );
  console.log("Related Products:", relatedProducts);
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);

  const userId = user?.id;

  const { handleAddToCart, showPopupCart, popupMessageCart } = useAddToCart();
  const {
    wishlistItems,
    toggleWishlist,
    isInWishlist,
    popupMessage,
    showPopup,
  } = useWishlist(userId);

  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchWishlist(userId));
      dispatch(fetchCart(userId));
    }
  }, [userId, dispatch]);

  useEffect(() => {
    if (product?.image_url) {
      setSelectedImage(product.image_url);
    }
  }, [product]);

  useEffect(() => {
    if (product && cartItems?.length > 0) {
      const foundInCart = cartItems.some(
        (item) => item.product_id === product.id || item.id === product.id
      );
      setAddedToCart(foundInCart);
    }
  }, [product, cartItems]);

  useEffect(() => {
    if (product?.category && product.category.trim()) {
      dispatch(fetchProductsByCategory(product.category));
    }
  }, [dispatch, product?.category]);

  const handleWishlistClick = () => {
    toggleWishlist(product.id, product.name);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(value > 0 ? value : 1);
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-600">{error}</div>;
  if (!product)
    return <div className="text-center py-10">Product not found.</div>;

  const images = product.gallery_images?.length
    ? product.gallery_images
    : [product.image_url];

  // Filter related products to exclude current product
  const filteredRelatedProducts = relatedProducts.filter(
    (p) => p.id !== product.id
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image section */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            {[product.image_url, ...images].map((img, index) => (
              <Image
                key={index}
                src={img}
                alt={`thumbnail-${index}`}
                width={60}
                height={60}
                className={`cursor-pointer border ${
                  selectedImage === img
                    ? "border-blue-500"
                    : "border-transparent"
                } rounded`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>

          <div className="relative bg-gray-100 rounded overflow-hidden flex items-center justify-center w-[400px] h-[400px]">
            <Image
              src={selectedImage || "/placeholder.png"}
              alt={product.name}
              fill
              className="object-contain"
            />

            <button
              onClick={handleWishlistClick}
              className={`absolute top-4 right-4 p-2 rounded-full bg-[#FFB703] transition ${
                isInWishlist(product.id) ? "text-red-500" : "text-white"
              }`}
              title={
                isInWishlist(product.id)
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
            >
              <FaHeart size={18} />
            </button>
          </div>
        </div>

        {/* Product details */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-[#044E78]">{product.name}</h1>
          <div className="text-[#FFB703] flex font-medium text-sm mb-2">
            <FaTag className="mt-1 mr-1" /> {product.category}
          </div>{" "}
          <p className="text-xl text-green-600 font-semibold">
            ₹
            {product.price
              ? Number(product.price).toLocaleString("en-IN")
              : "0"}{" "}
            / 1 Piece
          </p>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-md font-semibold text-gray-700">
            Total: ₹
            {(product.price * quantity).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center border rounded-full overflow-hidden p-2">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className={`w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-lg font-bold ${
                  quantity === 1 ? "text-gray-400" : "text-gray-900"
                }`}
                disabled={quantity === 1}
              >
                −
              </button>
              <div className="px-4 w-10 text-center select-none">
                {quantity}
              </div>
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-lg font-bold text-gray-900"
              >
                +
              </button>
            </div>

            <button
              onClick={() => {
                if (addedToCart) {
                  router.push("/cart");
                } else {
                  handleAddToCart({ ...product, quantity });
                  setAddedToCart(true);
                }
              }}
              className="primaryButton flex items-center gap-2 bg-[#FFB703] hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-3xl"
            >
              <FaShoppingCart />
              {addedToCart ? "Go to Cart" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>

      {/* Popups */}
      {showPopup && popupMessage && (
        <div className="fixed top-5 right-5 bg-white text-black shadow-lg border border-green-400 px-4 py-2 rounded-lg z-50 transition duration-300">
          {popupMessage}
        </div>
      )}
      {showPopupCart && popupMessageCart && (
        <div className="fixed top-5 right-5 bg-white text-black shadow-lg border border-blue-400 px-4 py-2 rounded-lg z-50 transition duration-300">
          {popupMessageCart}
        </div>
      )}

      {/* Related Products */}
      <RelatedProducts 
      categoryId={product.category_id}
      currentProductId={product.id}/>

    </div>
  );
};

export default ProductDetailsPage;
