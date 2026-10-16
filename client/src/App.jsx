import React from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Route Guards
import { PrivateRoute } from './routes/PrivateRoute';
import { AdminRoute } from './routes/AdminRoute';

// Layout Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AdminLayout } from './components/AdminLayout';

// Public Pages
import { Home } from './pages/Home';
import { Menu } from './pages/Menu';
import { ProductDetails } from './pages/ProductDetails';
import { CustomCake } from './pages/CustomCake';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Profile } from './pages/Profile';
import { MyOrders } from './pages/MyOrders';
import { Wishlist } from './pages/Wishlist';
import { About } from './pages/About';
import { Gallery } from './pages/Gallery';
import { Contact } from './pages/Contact';
import { NotFound } from './pages/NotFound';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminProductForm } from './pages/admin/AdminProductForm';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminOrderDetail } from './pages/admin/AdminOrderDetail';
import { AdminCustomRequests } from './pages/admin/AdminCustomRequests';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminReviews } from './pages/admin/AdminReviews';
import { AdminCoupons } from './pages/admin/AdminCoupons';
import { AdminGallery } from './pages/admin/AdminGallery';
import { AdminMessages } from './pages/admin/AdminMessages';
import { AdminSettings } from './pages/admin/AdminSettings';

// Public Layout Wrapper
const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFF9F3] text-[#6B5B5B]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Scroll to top helper on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ScrollToTop />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#FFF9F3',
                color: '#8A5A64',
                border: '1px solid #FDE8EC',
                boxShadow: '0 4px 15px rgba(138, 90, 100, 0.1)',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '13px'
              }
            }}
          />

          <Routes>
            {/* Public Storefront Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/menu/:category" element={<Menu />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/custom-cake" element={<CustomCake />} />
              <Route path="/cart" element={<Cart />} />
              
              {/* Protected Customer Routes */}
              <Route path="/checkout" element={
                <PrivateRoute>
                  <Checkout />
                </PrivateRoute>
              } />
              <Route path="/order-success/:orderId" element={<OrderSuccess />} />
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              <Route path="/my-orders" element={
                <PrivateRoute>
                  <MyOrders />
                </PrivateRoute>
              } />
              <Route path="/my-orders/:id" element={
                <PrivateRoute>
                  <MyOrders />
                </PrivateRoute>
              } />
              <Route path="/wishlist" element={
                <PrivateRoute>
                  <Wishlist />
                </PrivateRoute>
              } />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              {/* General Static Pages */}
              <Route path="/about" element={<About />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<Contact />} />

              {/* 404 Catch-All */}
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Admin Panel Routes (Protected & Admin Only) */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/add" element={<AdminProductForm />} />
              <Route path="products/edit/:id" element={<AdminProductForm />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="orders/:id" element={<AdminOrderDetail />} />
              <Route path="custom-requests" element={<AdminCustomRequests />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="coupons" element={<AdminCoupons />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
