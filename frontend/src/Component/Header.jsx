// components/Header.js
import { Mail, Phone, Search, User, Heart, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="border-b">
      <div className="flex items-center justify-between px-4 py-2 text-sm">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Image src="/logo.png" alt="Softcon Logo" width={40} height={40} />
          <div>
            <p className="font-bold text-xl text-blue-800">Softcon</p>
            <p className="text-xs text-gray-500 -mt-1">We Mean Solution...</p>
          </div>
        </div>

        {/* Email and Phone */}
        <div className="hidden md:flex items-center space-x-6 text-gray-700">
          <div className="flex items-center space-x-1">
            <Mail className="w-4 h-4 text-yellow-500" />
            <span>sales@softcon.net.in</span>
          </div>
          <div className="flex items-center space-x-1">
            <Phone className="w-4 h-4 text-yellow-500" />
            <span>+91 - 8888825314 / 15</span>
          </div>
        </div>
      </div>

      {/* Bottom Header */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Search bar */}
        <div className="relative w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500" />
          <input
            type="text"
            placeholder="Type here to search..."
            className="pl-10 pr-4 py-2 rounded-full border border-gray-300 w-full focus:outline-none"
          />
        </div>

        {/* Navigation Links */}
        <nav className="flex space-x-6 font-semibold text-sm text-blue-900">
          <a href="#">Technical Support</a>
          <a href="#">How to Buy</a>
          <a href="#">Contact</a>
          <a href="#">Chat with Us</a>
        </nav>

        {/* Icons */}
        <div className="flex space-x-4 text-yellow-500">
          <User className="w-5 h-5 cursor-pointer" />
          <Heart className="w-5 h-5 cursor-pointer" />
          <ShoppingCart className="w-5 h-5 cursor-pointer" />
        </div>
      </div>
    </header>
  );
}
