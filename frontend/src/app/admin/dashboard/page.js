'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Sidebar from '@/Component/AdminSidebar';
import AddProductForm from './add-product/page';
import AdminDashboard from './AdminDashboard';
import ProductList from './product-list/page';

const Page = () => {
  const router = useRouter();
  const adminUser = useSelector((state) => state.adminAuth.user);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'addProduct':
        return <AddProductForm />;
      case 'product-list':
        return <ProductList />;
      case 'orders':
        return <div>Orders Component</div>;
      case 'users':
        return <div>Users Component</div>;
      default:
        return <p className="text-red-600">Invalid tab selected.</p>;
    }
  };

  if (loading) return <p className="text-center mt-8">Loading...</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white text-black border-r border-gray-200 fixed h-full">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-6">
        <div className="max-w-7xl mx-auto">{renderContent()}</div>
      </main>
    </div>
  );
};

export default Page;
