import Link from "next/link";
import { FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-800 border-t border-gray-400">
      <div className=" mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Logo Image */}
        <div>
          <img
            src="/assets/Softcon-Logo.png"
            alt="Softcon Logo"
            className="w-40 mb-2 sm:ml-10 md:ml-2"
          />
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-[#044E78] mb-4 text-xl">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/technical-support" className="hover:text-[#044E78]">
                Technical Support
              </Link>
            </li>
            <li>
              <Link href="/how-to-buy" className="hover:text-[#044E78]">
                How to Buy
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#044E78]">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/chat-with-us" className="hover:text-[#044E78]">
                Chat with Us
              </Link>
            </li>
            <li>
              <Link href="/profile" className="hover:text-[#044E78]">
                Profile
              </Link>
            </li>
          </ul>
        </div>

        {/* Products */}
        <div>
          <h3 className="font-semibold text-[#044E78] mb-4 text-xl">Products</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/categories/Rockwel.js" className="hover:text-[#044E78]">
                Rockwell Automation
              </Link>
            </li>
            <li>
              <Link href="/products/vacon" className="hover:text-[#044E78]">
                Vacon
              </Link>
            </li>
            <li>
              <Link href="/products/danfoss" className="hover:text-[#044E78]">
                Danfoss
              </Link>
            </li>
            <li>
              <Link href="/products/bosch-rexroth" className="hover:text-[#044E78]">
                Bosch Rexroth
              </Link>
            </li>
            <li>
              <Link href="/products/heat-exchanger" className="hover:text-[#044E78]">
                Heat Exchanger
              </Link>
            </li>
            <li>
              <Link href="/products/iec-61439-cubic-panels" className="hover:text-[#044E78]">
                IEC-61439 Cubic Panels
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold text-[#044E78] mb-4 text-xl">Contact Us</h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-center gap-2"><FaMapMarkerAlt className="text-[#FFB703]" /> Pune</li>
            <li className="flex items-center gap-2"><FaMapMarkerAlt className="text-[#FFB703]" /> Mumbai</li>
            <li className="flex items-center gap-2"><FaMapMarkerAlt className="text-[#FFB703]" /> Bangalore</li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-[#FFB703]" />
              <a href="mailto:sales@softcon.net.in">sales@softcon.net.in</a>
            </li>
            <li className="flex items-center gap-2">
              <FaPhone className="text-[#FFB703]" />
              <a href="tel:+918888825314">+91-8888825314 / 15</a>
            </li>
          </ul>
        </div>
      </div>

     {/* Bottom Bar */}
<div className="bg-[#044E78] text-white text-center py-3 text-sm">
  Designed & Developed By :{" "}
  <Link href="https://vm3techsolution.com/" target="_blank" rel="noopener noreferrer" className="">
    VM3 Tech Solutions LLP
  </Link>
</div>

    </footer>
  );
}
