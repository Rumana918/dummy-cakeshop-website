import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
      await authAPI.resetPassword(token, { password });
      toast.success('Password successfully reset! Logging you in...');
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      toast.error(err.message || 'Password reset token is invalid or expired');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#FFF9F3] py-16 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-[#FDE8EC] shadow-sm">
        
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-[#FFD9E0] text-[#733949] flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-[28px]">key</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#8A5A64]">
            Set New Password
          </h1>
          <p className="text-xs text-[#8E7D7D] mt-1">
            Create a strong new password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
              New Password (min 6 chars)
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
              Confirm New Password
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
            className="w-full bg-[#894C5C] text-white hover:bg-[#733949] py-3 rounded-full font-bold text-sm shadow-md transition-all"
          >
            {submitting ? 'Resetting Password...' : 'Save New Password'}
          </button>
        </form>

        <div className="text-center pt-4">
          <Link to="/login" className="text-xs text-[#8E7D7D] hover:text-[#8A5A64]">
            Back to login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;
