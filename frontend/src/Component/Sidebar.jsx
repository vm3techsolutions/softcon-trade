'use client';
import { UserIcon, HeartIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold text-orange-600 mb-10">User Dashboard</h2>
      <hr className="mb-6" />

      <nav className="space-y-4">
        <SidebarLink
          label="Profile"
          Icon={UserIcon}
          isActive={activeTab === 'profile'}
          onClick={() => setActiveTab('profile')}
        />
        <SidebarLink
          label="Wishlist"
          Icon={HeartIcon}
          isActive={activeTab === 'wishlist'}
          onClick={() => setActiveTab('wishlist')}
        />
      </nav>

      <button
        onClick={() => {
          localStorage.removeItem('token');
          window.location.href = '/login'; // or use router if needed
        }}
        className="mt-auto flex items-center gap-3 text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-xl font-bold"
      >
        <ArrowLeftOnRectangleIcon className="h-7 w-7" />
        Logout
      </button>
    </div>
  );
};

function SidebarLink({ label, Icon, isActive, ...rest }) {
  return (
    <button
      {...rest}
      className={`flex w-full items-center text-xl font-bold gap-3 px-3 py-2 rounded-lg text-left transition-colors 
        ${isActive ? 'text-yellow-500 bg-blue-50' : 'text-[#044E78] hover:bg-gray-100'}`}
    >
      <Icon className="h-6 w-6" />
      {label}
    </button>
  );
}

export default Sidebar;
