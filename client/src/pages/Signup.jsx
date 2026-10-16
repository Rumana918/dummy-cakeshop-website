import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    try {
      await register({ name, email, phone, password });
      navigate('/');
    } catch (err) {
      // toast shown in context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#FFF9F3] py-16 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-[#FDE8EC] shadow-[0_10px_30px_-4px_rgba(138,90,100,0.1)]">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#FDE8EC] text-[#894C5C] flex items-center justify-center mx-auto mb-3 shadow-inner">
            <span className="text-3xl">🧁</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#8A5A64]">
            Create Account
          </h1>
          <p className="text-xs text-[#8E7D7D] mt-1">
            Join Sweet Whisk for member discounts and easy order tracking.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Emma Watson"
              className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="emma@example.com"
              className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
              Password (min 6 chars)
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#894C5C] text-white hover:bg-[#733949] py-3.5 rounded-full font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 pt-3"
          >
            {submitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center text-xs text-[#8E7D7D] mt-6 pt-6 border-t border-[#FDE8EC]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#894C5C] font-bold hover:underline">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Signup;
