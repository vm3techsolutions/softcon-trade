'use client';
import { useState } from 'react';
import Sidebar from '@/Component/Sidebar';
import Profile from './profile/page.js';
import Wishlist from './wishlist/page.js';

const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <Profile />;
      case 'wishlist':
        return <Wishlist />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Fixed Width */}
      <aside className="w-64 bg-white text-black p-4 fixed h-full border-r">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </aside>

      {/* Main Content - Margin Left Equal to Sidebar Width */}
      <main className="ml-64 flex-1 p-6 bg-gray-50">{renderContent()}</main>
    </div>
  );
};

export default DashboardLayout;
