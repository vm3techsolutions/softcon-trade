import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Products", href: "/admin/products" },
    { name: "Orders", href: "/admin/orders" },
    { name: "Users", href: "/admin/users" },
  ];

  return (
    <div className="w-64 bg-white border-r shadow-sm min-h-screen p-4 hidden md:block">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Admin Panel</h2>
      <ul className="space-y-4">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`block px-4 py-2 rounded ${
                pathname === item.href
                  ? "bg-green-100 text-green-700 font-semibold"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      <button
        onClick={() => {
          localStorage.removeItem("adminToken");
          window.location.href = "/admin/login";
        }}
        className="flex items-center gap-2 mt-12 text-sm text-red-600 hover:text-red-800"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
