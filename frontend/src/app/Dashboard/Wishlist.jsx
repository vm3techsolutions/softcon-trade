"use client";

export default function Wishlist() {
  // Placeholder list — replace with real data
  const items = [];

  return (
    <section>
      <h1 className="text-3xl font-semibold mb-6">Your Wishlist</h1>

      {items.length === 0 ? (
        <p className="text-gray-600">No items in wishlist yet.</p>
      ) : (
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <li key={item.id} className="p-4 bg-white rounded-xl shadow">
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
