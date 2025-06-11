"use client";
import { useState } from "react";
import {
  UserIcon,
  HeartIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

import Profile from "./Profile";
import Wishlist from "./Wishlist";

export default function Dashboard() {
  const [active, setActive] = useState("profile");

  const renderContent = () => {
    switch (active) {
      case "profile":
        return <Profile />;
      case "wishlist":
        return <Wishlist />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ---------------- Sidebar ---------------- */}
      <aside className="w-full lg:w-64 border-r bg-white p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-orange-600 mb-10">
          User Dashboard
        </h2>
        <hr className=""/>

        {/* nav links */}
        <nav className="space-y-4">
          <SidebarLink
            label="Profile"
            Icon={UserIcon}
            isActive={active === "profile"}
            onClick={() => setActive("profile")}
          />
          <SidebarLink
            label="Wishlist"
            Icon={HeartIcon}
            isActive={active === "wishlist"}
            onClick={() => setActive("wishlist")}
          />
        </nav>

        {/* logout */}
        <button
          onClick={() => alert("Logged out!")}
          className="mt-auto flex items-center gap-3 text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-xl font-bold"
        >
          <ArrowLeftOnRectangleIcon className="h-7 w-7" />
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8 bg-gray-50 min-h-screen">
        {renderContent()}
      </main>
    </div>
  );
}

function SidebarLink({ label, Icon, isActive, ...rest }) {
  return (
    <button
      {...rest}
      className={`flex w-full items-center text-2xl font-bold text-[#044E78] gap-3 px-3 py-2 rounded-lg text-left transition-colors 
        ${
          isActive
            ? "text-yellow-400"
            : "bg-white hover:bg-gray-100"
        }
      `}
    >
      <Icon className="h-5 w-5" />
      {label}
    </button>
  );
}
