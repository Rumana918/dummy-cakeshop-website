import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [debugToken, setDebugToken] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    try {
      const res = await authAPI.forgotPassword({ email });
      setSubmitted(true);
      if (res.data?.debugResetToken) {
        setDebugToken(res.data.debugResetToken);
      }
      toast.success('Password reset instructions sent to your email!');
    } catch (err) {
      toast.error(err.message || 'Error requesting password reset');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#FFF9F3] py-16 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-[#FDE8EC] shadow-sm">
        
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-[#FFD9E0] text-[#733949] flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-[28px]">lock_reset</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#8A5A64]">
            Forgot Password
          </h1>
          <p className="text-xs text-[#8E7D7D] mt-1">
            Enter your email to receive a password reset link.
          </p>
        </div>

        {submitted ? (
          <div className="space-y-4 text-center">
            <div className="p-4 bg-[#DFF3E8] rounded-2xl text-xs text-[#3E4F48] leading-relaxed">
              We’ve dispatched a reset link to <strong>{email}</strong>. Check your inbox and spam folder.
            </div>

            {debugToken && (
              <div className="p-3 bg-[#FFE9A8] rounded-xl text-xs text-[#71612E] text-left">
                <span className="font-bold">Development Fast Link:</span>
                <Link
                  to={`/reset-password/${debugToken}`}
                  className="block mt-1 underline break-all text-[#894C5C]"
                >
                  Click here to Reset Password now
                </Link>
              </div>
            )}

            <Link
              to="/login"
              className="inline-block mt-4 text-xs font-semibold text-[#894C5C] hover:underline"
            >
              Back to Login
            </Link>
          </div>
        ) : (
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
                className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#894C5C] text-white hover:bg-[#733949] py-3 rounded-full font-bold text-sm shadow-md transition-all"
            >
              {submitting ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div className="text-center pt-3">
              <Link to="/login" className="text-xs text-[#8E7D7D] hover:text-[#8A5A64]">
                Remember password? Return to login
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default ForgotPassword;
