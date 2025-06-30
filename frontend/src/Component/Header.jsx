"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  Search,
  User,
  Heart,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation"; // For App Router
import { logout } from "@/app/store/authSlice";
import { fetchWishlist } from "@/app/store/wishlistSlice";
import { fetchCart } from "@/app/store/cartSlice";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchWishlist(user.id));
    }
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    router.push("/Login");
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && searchTerm.trim().length > 2) {
      const query = searchTerm.trim();
      setSearchTerm(""); // Clear input after submitting
      router.push(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="flex items-center justify-between px-10 py-2 text-sm">
        <Link href="/">
          <Image
            src="/assets/Softcon-Logo.png"
            alt="Softcon Logo"
            width={40}
            height={40}
            className="w-32 object-contain cursor-pointer"
          />
        </Link>

        <div className="hidden md:flex flex-col items-start text-gray-700">
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-[#FFB703]" />
            <a
              href="mailto:sales@softcon.net.in"
              className="hover:text-[#044E78]"
            >
              sales@softcon.net.in
            </a>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-[#FFB703]" />
            <a href="tel:+918888825314" className="hover:text-[#044E78]">
              +91 - 8888825314 / 15
            </a>
          </div>
        </div>

        <button
          className="md:hidden text-[#FFB703]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <hr />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-10 py-3 gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:max-w-lg">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pr-3 border-r border-black">
            <Search className="text-[#FFB703] w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Type here to search..."
            className="pl-12 pr-4 py-2 rounded-full border border-black w-full focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>

        <div>
          <ul className="flex gap-4 text-[#044E78] font-bold">
            <li><Link href='/technical-support'>Technical Support</Link></li>
            <li><Link href='/how-to-buy'>How To Buy</Link></li>
            <li><Link href='/contact'>Contact</Link></li>
          </ul>
        </div>

        {/* Icons */}
        <div className="flex space-x-4 text-[#FFB703] relative justify-end items-center">
          {user ? (
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <User className="w-5 h-5 cursor-pointer" />
              {dropdownOpen && (
                <div className="absolute right-0 w-48 bg-white border rounded-lg shadow-lg text-black py-2 z-50">
                  <p className="px-4 py-2 font-medium border-b">
                    Hi, {user?.name || "Guest"}
                  </p>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    My Account
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/Login">
              <User className="w-5 h-5 cursor-pointer" />
            </Link>
          )}

          <div className="relative">
            <Link href="/wishlist">
              <Heart className="w-5 h-5 cursor-pointer" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
          </div>

          <div className="relative">
            <Link href="/cart">
              <ShoppingCart className="w-5 h-5 cursor-pointer" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
