import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      // toast shown in context
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLogin = async (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setSubmitting(true);
    try {
      await login(demoEmail, demoPass);
      navigate(from, { replace: true });
    } catch (err) {
      // toast shown in context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#FFF9F3] py-16 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-[#FDE8EC] shadow-[0_10px_30px_-4px_rgba(138,90,100,0.1)]">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#FDE8EC] text-[#894C5C] flex items-center justify-center mx-auto mb-3 shadow-inner">
            <span className="text-3xl">🍰</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#8A5A64]">
            Welcome Back
          </h1>
          <p className="text-xs text-[#8E7D7D] mt-1">
            Sign in to access your pastry box, orders, and saved addresses.
          </p>
        </div>

        {/* Demo Quick Logins Bar */}
        <div className="bg-[#FFF9F3] p-3 rounded-2xl border border-[#FDE8EC] mb-6">
          <p className="text-[11px] font-bold text-[#8A5A64] text-center mb-2 uppercase tracking-wider">
            ⚡ Quick 1-Click Demo Login
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@sweetwhisk.com', 'Admin@123')}
              className="py-1.5 px-2 bg-[#894C5C] text-white rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              👑 Admin Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('demo@sweetwhisk.com', 'Customer@123')}
              className="py-1.5 px-2 bg-[#F4A7B9] text-[#733949] rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              🧁 Customer Demo
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full px-4 py-3 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9] transition-colors"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-[#894C5C] hover:underline font-medium">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#894C5C] text-white hover:bg-[#733949] py-3.5 rounded-full font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 pt-3"
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-xs text-[#8E7D7D] mt-6 pt-6 border-t border-[#FDE8EC]">
          Don’t have a Sweet Whisk account yet?{' '}
          <Link to="/signup" className="text-[#894C5C] font-bold hover:underline">
            Create One
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
