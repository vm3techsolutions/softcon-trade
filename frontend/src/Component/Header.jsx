// components/Header.js
import { Mail, Phone, Search, User, Heart, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="border-b">
      <div className="flex items-center justify-between px-7 py-2 text-sm">
        {/* Logo */}
        <div className="flex items-center space-x-2">

          <Image src="/assets/Softcon-Logo.png"
           alt="Softcon Logo"
            width={40} height={40}
            className='w-32' />
         
        </div>

        {/* Email and Phone */}
       <div className="hidden md:flex flex-col items-start mr- space-y-2 text-gray-700">
  <div className="flex items-center space-x-2">
    <Mail className="w-4 h-4 text-yellow-500" />
    <span>sales@softcon.net.in</span>
  </div>
  <div className="flex items-center space-x-2">
    <Phone className="w-4 h-4 text-yellow-500" />
    <span>+91 - 8888825314 / 15</span>
  </div>
</div>

      </div>
<hr></hr>
      {/* Bottom Header */}
      <div className="flex items-center justify-between px-7 py-3">
        {/* Search bar */}
      <div className="relative w-full max-w-sm">
  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pr-3 border-r border-black">
    <Search className="text-yellow-500 w-5 h-5" />
  </div>
  <input
    type="text"
    placeholder="Type here to search..."
    className="pl-12 pr-4 py-1 rounded-full border border-black w-full focus:outline-none"
  />
</div>


        {/* Navigation Links */}
        <nav className="flex space-x-7 font-bold text-lg text-[#044E78]">
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