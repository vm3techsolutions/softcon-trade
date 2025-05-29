"use client";
import { useState } from "react";
import { Mail, Phone, Search, User, Heart, ShoppingCart, Menu, X } from "lucide-react";
import Image from "next/image";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b bg-white shadow-sm">
      {/* Top Header */}
      <div className="flex items-center justify-between px-5 py-2 text-sm">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Image
            src="/assets/Softcon-Logo.png"
            alt="Softcon Logo"
            width={40}
            height={40}
            className="w-32 object-contain"
          />
        </div>

        {/* Email and Phone (hidden on mobile) */}
        <div className="hidden md:flex flex-col items-start text-gray-700">
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-[#FFB703]" />
            <span>sales@softcon.net.in</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-[#FFB703]" />
            <span>+91 - 8888825314 / 15</span>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-[#FFB703]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <hr />

      {/* Bottom Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-5 py-3 gap-4">
        {/* Search bar */}
        <div className="relative w-full md:max-w-sm">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pr-3 border-r border-black">
            <Search className="text-[#FFB703] w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Type here to search..."
            className="pl-12 pr-4 py-2 rounded-full border border-black w-full focus:outline-none"
          />
        </div>

        {/* Navigation Links - visible on desktop and collapsible on mobile */}
        <nav
          className={`${
            menuOpen ? "flex" : "hidden"
          } flex-col md:flex md:flex-row md:items-center md:space-x-7 font-bold text-lg text-[#044E78] space-y-2 md:space-y-0`}
        >
          <a href="#">Technical Support</a>
          <a href="#">How to Buy</a>
          <a href="#">Contact</a>
          <a href="#">Chat with Us</a>
        </nav>

        {/* Icons */}
        <div className="flex space-x-4 text-[#FFB703] justify-end">
          <User className="w-5 h-5 cursor-pointer" />
          <Heart className="w-5 h-5 cursor-pointer" />
          <ShoppingCart className="w-5 h-5 cursor-pointer" />
        </div>
      </div>
    </header>
  );
}
