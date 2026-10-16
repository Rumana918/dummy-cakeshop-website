import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/admin', label: 'Dashboard', icon: 'dashboard', end: true },
    { to: '/admin/orders', label: 'Orders', icon: 'receipt_long' },
    { to: '/admin/products', label: 'Products', icon: 'bakery_dining' },
    { to: '/admin/categories', label: 'Categories', icon: 'category' },
    { to: '/admin/custom-requests', label: 'Custom Cakes', icon: 'cake' },
    { to: '/admin/customers', label: 'Customers', icon: 'group' },
    { to: '/admin/reviews', label: 'Reviews', icon: 'star' },
    { to: '/admin/coupons', label: 'Coupons', icon: 'loyalty' },
    { to: '/admin/gallery', label: 'Gallery', icon: 'photo_library' },
    { to: '/admin/messages', label: 'Messages', icon: 'mail' },
    { to: '/admin/settings', label: 'Shop Settings', icon: 'settings' },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
      isActive
        ? 'bg-[#F4A7B9] text-[#733949] shadow-sm'
        : 'text-[#6B5B5B] hover:bg-[#FDE8EC] hover:text-[#8A5A64]'
    }`;

  return (
    <div className="min-h-screen bg-[#FFF9F3] flex text-[#6B5B5B]">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#FDE8EC]/70 border-r border-[#F4A7B9]/30 fixed top-0 bottom-0 left-0 z-40 py-6 px-4">
        
        {/* Brand */}
        <div className="px-3 mb-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="text-2xl">🍰</span>
            <div>
              <span className="font-serif text-xl font-bold text-[#8A5A64] block leading-tight">
                Sweet Whisk
              </span>
              <span className="text-[10px] tracking-wider uppercase text-[#894C5C] font-bold">
                Admin Studio
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={linkClass}
            >
              <span className="material-symbols-outlined text-[20px] text-[#894C5C]">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Storefront & Logout */}
        <div className="pt-4 border-t border-[#F4A7B9]/30 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#8A5A64] hover:bg-white rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            <span>View Public Shop</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Exit Admin</span>
          </button>
        </div>

      </aside>

      {/* Main Admin Body Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[#FFF9F3]/90 backdrop-blur-md border-b border-[#FDE8EC] h-16 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-xl text-[#6B5B5B] hover:bg-[#FDE8EC]"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8A5A64]">
              Bakery Administration
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/menu"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 bg-white border border-[#FDE8EC] text-[#8A5A64] hover:bg-[#FDE8EC] px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span>Live Site</span>
            </Link>

            <div className="flex items-center gap-2.5 pl-2 border-l border-[#FDE8EC]">
              <div className="w-8 h-8 rounded-full bg-[#894C5C] text-white flex items-center justify-center font-bold text-xs">
                {user?.name ? user.name[0].toUpperCase() : 'A'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-[#8A5A64] leading-none">{user?.name}</p>
                <p className="text-[10px] text-[#8E7D7D] leading-none mt-1">Bakery Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden flex"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <div
              className="w-64 bg-[#FFF9F3] h-full p-6 shadow-xl flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="font-serif text-xl font-bold text-[#8A5A64]">Sweet Whisk</span>
                  <button onClick={() => setMobileSidebarOpen(false)} className="text-[#8E7D7D]">
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>
                <nav className="space-y-1">
                  {navLinks.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={linkClass}
                    >
                      <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>

              <div className="pt-4 border-t border-[#FDE8EC]">
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 text-xs font-bold text-rose-700 py-2"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Admin Content Outlet */}
        <main className="flex-1 p-4 sm:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;
