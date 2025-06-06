import React from "react";

export default function DashboardProfile() {
  const user = {
    name: "Vishal Bhange",
    email: "vishalbhange333@gmail.com",
    phone: "8459471443",
    location: "Pune, Maharashtra",
  };

  const products = [
    {
      id: 1,
      name: "Smart Sensor",
      price: "₹1500",
      status: "In Stock",
    },
    {
      id: 2,
      name: "Control Panel",
      price: "₹7500",
      status: "Out of Stock",
    },
    {
      id: 3,
      name: "Temperature Module",
      price: "₹2300",
      status: "In Stock",
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Details */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">👤 User Details</h2>
          <p><span className="font-medium">Name:</span> {user.name}</p>
          <p><span className="font-medium">Email:</span> {user.email}</p>
          <p><span className="font-medium">Phone:</span> {user.phone}</p>
          <p><span className="font-medium">Location:</span> {user.location}</p>
        </div>

        {/* Product Details */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📦 Product Details</h2>
          <ul className="space-y-4">
            {products.map((product) => (
              <li key={product.id} className="border rounded-xl p-4 hover:bg-gray-50">
                <p><span className="font-medium">Name:</span> {product.name}</p>
                <p><span className="font-medium">Price:</span> {product.price}</p>
                <p><span className="font-medium">Status:</span> 
                  <span className={`ml-1 font-semibold ${product.status === "In Stock" ? "text-green-600" : "text-red-500"}`}>
                    {product.status}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
