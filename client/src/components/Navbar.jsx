import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    navigate('/');
  };

  const navClass = ({ isActive }) =>
    isActive
      ? 'bg-[#F4A7B9] text-[#733949] font-bold rounded-full px-4 py-2 transition-all shadow-sm'
      : 'text-[#6B5B5B] hover:text-[#8A5A64] hover:bg-[#FDE8EC]/60 px-4 py-2 rounded-full transition-all font-medium text-sm';

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#FDE8EC] text-[#8A5A64] py-1.5 px-4 text-center text-xs md:text-sm font-medium border-b border-[#F4A7B9]/30 flex items-center justify-center gap-2">
        <span className="material-symbols-outlined text-[16px] text-[#F4A7B9]">sparkles</span>
        <span>Free delivery across Bloom City on orders above ₹999! Fresh artisanal batches baked at 6 AM.</span>
      </div>

      {/* Main Header / Navigation */}
      <header className="sticky top-0 w-full z-50 bg-[#FFF9F3]/95 backdrop-blur-md shadow-[0_2px_15px_rgba(138,90,100,0.06)] border-b border-[#FDE8EC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-[#FDE8EC] flex items-center justify-center border border-[#F4A7B9]/40 group-hover:scale-105 transition-transform">
              <span className="text-2xl">🍰</span>
            </div>
            <div>
              <span className="font-serif text-2xl font-bold text-[#8A5A64] tracking-tight group-hover:text-[#894C5C] transition-colors">
                Sweet Whisk
              </span>
              <span className="block text-[10px] tracking-widest uppercase text-[#8E7D7D] font-medium -mt-1">
                Patisserie & Bakery
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <NavLink to="/" className={navClass}>Home</NavLink>
            <NavLink to="/menu" className={navClass}>Menu</NavLink>
            <NavLink to="/custom-cake" className={navClass}>Custom Cakes</NavLink>
            <NavLink to="/about" className={navClass}>About</NavLink>
            <NavLink to="/gallery" className={navClass}>Gallery</NavLink>
            <NavLink to="/contact" className={navClass}>Contact</NavLink>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-2.5 rounded-full hover:bg-[#FDE8EC] text-[#6B5B5B] hover:text-[#8A5A64] transition-colors"
              title="My Wishlist"
            >
              <span className="material-symbols-outlined text-[24px]">favorite</span>
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#F4A7B9] text-[#733949] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-full hover:bg-[#FDE8EC] text-[#6B5B5B] hover:text-[#8A5A64] transition-colors"
              title="Shopping Cart"
            >
              <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#894C5C] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Quick Order Now CTA (Desktop) */}
            <Link
              to="/menu"
              className="hidden sm:inline-flex bg-[#F4A7B9] text-[#733949] hover:bg-[#894C5C] hover:text-white transition-all px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">cake</span>
              <span>Order Now</span>
            </Link>

            {/* User Account / Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-10 h-10 rounded-full bg-[#894C5C] text-white flex items-center justify-center shadow-sm hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#F4A7B9]"
                aria-label="User Menu"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="material-symbols-outlined text-[20px]">person</span>
                )}
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-[#FDE8EC] py-2 z-50 animate-fadeIn"
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 border-b border-[#FDE8EC]">
                        <p className="text-xs text-[#8E7D7D]">Signed in as</p>
                        <p className="font-semibold text-sm text-[#8A5A64] truncate">{user.name}</p>
                        <p className="text-xs text-[#8E7D7D] truncate">{user.email}</p>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-[#894C5C] hover:bg-[#FDE8EC] transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">dashboard</span>
                          Admin Panel
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#6B5B5B] hover:text-[#8A5A64] hover:bg-[#FDE8EC]/50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">account_circle</span>
                        My Profile
                      </Link>

                      <Link
                        to="/my-orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#6B5B5B] hover:text-[#8A5A64] hover:bg-[#FDE8EC]/50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                        My Orders
                      </Link>

                      <Link
                        to="/wishlist"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#6B5B5B] hover:text-[#8A5A64] hover:bg-[#FDE8EC]/50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">favorite</span>
                        My Wishlist ({wishlistCount})
                      </Link>

                      <div className="border-t border-[#FDE8EC] mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">logout</span>
                          Log Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 text-xs text-[#8E7D7D]">Welcome to Sweet Whisk!</div>
                      <Link
                        to="/login"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#6B5B5B] hover:text-[#8A5A64] hover:bg-[#FDE8EC]/60 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">login</span>
                        Sign In
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-[#8A5A64] hover:bg-[#FDE8EC] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">person_add</span>
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#6B5B5B] hover:bg-[#FDE8EC] transition-colors"
              aria-label="Toggle Menu"
            >
              <span className="material-symbols-outlined text-[26px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FFF9F3] border-b border-[#FDE8EC] px-4 pt-2 pb-6 space-y-2 shadow-lg animate-fadeIn">
            <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={navClass + ' block w-full text-left'}>
              Home
            </NavLink>
            <NavLink to="/menu" onClick={() => setMobileMenuOpen(false)} className={navClass + ' block w-full text-left'}>
              Menu
            </NavLink>
            <NavLink to="/custom-cake" onClick={() => setMobileMenuOpen(false)} className={navClass + ' block w-full text-left'}>
              Custom Cakes
            </NavLink>
            <NavLink to="/about" onClick={() => setMobileMenuOpen(false)} className={navClass + ' block w-full text-left'}>
              About
            </NavLink>
            <NavLink to="/gallery" onClick={() => setMobileMenuOpen(false)} className={navClass + ' block w-full text-left'}>
              Gallery
            </NavLink>
            <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)} className={navClass + ' block w-full text-left'}>
              Contact
            </NavLink>

            <div className="pt-4 border-t border-[#FDE8EC] flex flex-col gap-2">
              <Link
                to="/menu"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-[#F4A7B9] text-[#733949] font-bold py-3 rounded-full text-sm shadow-sm"
              >
                Order Online Now
              </Link>
              {!isAuthenticated && (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2.5 rounded-full border border-[#894C5C] text-[#894C5C] text-sm font-medium"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2.5 rounded-full bg-[#894C5C] text-white text-sm font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
