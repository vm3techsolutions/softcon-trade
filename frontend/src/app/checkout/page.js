"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { fetchProductById } from "@/app/store/productByIdSlice";

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id || null;

  useEffect(() => {
    if (!userId) {
      router.push("/Login"); // Redirect to login if not logged in
    }
  }, [userId, router]);

  const [productDetails, setProductDetails] = useState({});
  const [extraNote, setExtraNote] = useState("");

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Mock: Replace this with real DB fetch
  useEffect(() => {
    if (userId) {
      setUserInfo({
        name: user?.name || "John Doe",
        email: user?.email || "john@example.com",
        phone: user?.phone || "1234567890",
        address: user?.address || "123 Main Street",
      });
    }
  }, [userId, user]);

  useEffect(() => {
    const fetchDetails = async () => {
      const details = {};
      for (const item of cartItems) {
        const res = await dispatch(fetchProductById(item.product_id));
        if (res.meta.requestStatus === "fulfilled") {
          details[item.product_id] = res.payload;
        }
      }
      setProductDetails(details);
    };

    if (cartItems.length > 0) {
      fetchDetails();
    }
  }, [cartItems, dispatch]);

  const subtotal = cartItems.reduce((acc, item) => {
    const product = productDetails[item.product_id];
    const price = product?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  const cgst = subtotal * 0.09;
  const sgst = subtotal * 0.09;
  const shipping = 50; // flat rate
  const grandTotal = subtotal + cgst + sgst + shipping;

  const handlePlaceOrder = () => {
    alert("Order placed successfully!");
    router.push("/order-success");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left Side: User Form */}
      <div>
        <h2 className="text-xl font-bold mb-4">Shipping Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              type="text"
              value={userInfo.name}
              readOnly
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={userInfo.email}
              readOnly
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone Number</label>
            <input
              type="text"
              value={userInfo.phone}
              readOnly
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Address</label>
            <textarea
              value={userInfo.address}
              readOnly
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Extra Note</label>
            <textarea
              value={extraNote}
              onChange={(e) => setExtraNote(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Add any extra instructions here..."
            />
          </div>
        </div>
      </div>

      {/* Right Side: Cart Summary */}
      <div className="bg-gray-100 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <div className="space-y-4">
          {cartItems.map((item) => {
            const product = productDetails[item.product_id];
            return (
              <div
                key={item.product_id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={product?.image_url || "/placeholder.png"}
                    alt={product?.name || "Product"}
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                  <div>
                    <p className="font-medium">{product?.name}</p>
                    <p className="text-sm text-gray-600">
                      ₹{(product?.price || 0).toLocaleString("en-IN")} ×{" "}
                      {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-semibold">
                  ₹
                  {((product?.price || 0) * item.quantity).toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </p>
              </div>
            );
          })}
        </div>

        {/* Charges */}
        <div className="mt-6 space-y-2 border-t pt-4 text-sm text-gray-700">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>
              ₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between">
            <span>CGST (9%):</span>
            <span>
              ₹{cgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between">
            <span>SGST (9%):</span>
            <span>
              ₹{sgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Shipping Charges:</span>
            <span>
              ₹{shipping.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-3">
            <span>Total:</span>
            <span>
              ₹
              {grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          className="w-full mt-6 bg-[#FFB703] hover:bg-green-600 text-white font-semibold py-2 rounded"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
