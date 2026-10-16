import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    toast.success('Thank you for subscribing to Sweet Whisk news & secret recipes! 💌', {
      style: {
        background: '#FFF9F3',
        color: '#8A5A64',
        border: '1px solid #F4A7B9'
      }
    });
    setEmail('');
  };

  return (
    <footer className="w-full bg-[#FDE8EC]/70 pt-16 pb-10 border-t border-[#F4A7B9]/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="flex flex-col items-start">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <span className="text-2xl">🍰</span>
              <span className="font-serif text-2xl font-bold text-[#8A5A64]">Sweet Whisk</span>
            </Link>
            <p className="text-sm text-[#6B5B5B] leading-relaxed mb-6 max-w-sm">
              Artisanal cakes, delicate French macarons, and handcrafted morning pastries baked fresh daily with 100% pure organic ingredients and endless love.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white text-[#894C5C] hover:bg-[#F4A7B9] hover:text-[#733949] flex items-center justify-center shadow-sm transition-all"
                title="Instagram"
              >
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white text-[#894C5C] hover:bg-[#F4A7B9] hover:text-[#733949] flex items-center justify-center shadow-sm transition-all"
                title="Facebook"
              >
                <span className="material-symbols-outlined text-[18px]">share</span>
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white text-[#894C5C] hover:bg-[#F4A7B9] hover:text-[#733949] flex items-center justify-center shadow-sm transition-all"
                title="Pinterest"
              >
                <span className="material-symbols-outlined text-[18px]">public</span>
              </a>
            </div>
          </div>

          {/* Visit Us */}
          <div>
            <h4 className="font-serif text-lg font-bold text-[#8A5A64] mb-4">Visit Our Patisserie</h4>
            <div className="space-y-3 text-sm text-[#6B5B5B]">
              <p className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#894C5C] text-[18px] shrink-0 mt-0.5">location_on</span>
                <span>123 Pastry Lane, Sugarloaf District, Bloom City, 400001</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#894C5C] text-[18px] shrink-0">call</span>
                <span>+91 98765 43210</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#894C5C] text-[18px] shrink-0">mail</span>
                <span>hello@sweetwhisk.com</span>
              </p>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-serif text-lg font-bold text-[#8A5A64] mb-4">Baking Hours</h4>
            <div className="space-y-2 text-sm text-[#6B5B5B]">
              <p className="flex justify-between border-b border-[#FDE8EC] pb-1.5">
                <span className="font-medium">Monday - Friday:</span>
                <span>7:00 AM - 7:00 PM</span>
              </p>
              <p className="flex justify-between border-b border-[#FDE8EC] pb-1.5">
                <span className="font-medium">Saturday - Sunday:</span>
                <span>8:00 AM - 6:00 PM</span>
              </p>
              <p className="text-xs text-[#8E7D7D] pt-1">
                * Same-day delivery orders close at 5:00 PM daily.
              </p>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="font-serif text-lg font-bold text-[#8A5A64] mb-4">Sweet Newsletter</h4>
            <p className="text-sm text-[#6B5B5B] mb-4">
              Subscribe for seasonal flavor launches, secret pastry recipes, and member discounts.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your sweet email..."
                  className="w-full bg-white px-4 py-2.5 rounded-full border border-[#F4A7B9]/50 text-sm text-[#6B5B5B] outline-none focus:border-[#894C5C] shadow-sm transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#894C5C] text-white hover:bg-[#F4A7B9] hover:text-[#733949] px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm shrink-0"
                >
                  Join
                </button>
              </div>
              <p className="text-[11px] text-[#8E7D7D]">No spam ever. Only warm oven updates.</p>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#F4A7B9]/30 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8E7D7D] gap-4">
          <p>© {new Date().getFullYear()} Sweet Whisk Artisanal Bakery & Patisserie. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-[#8A5A64] transition-colors">Our Story</Link>
            <Link to="/menu" className="hover:text-[#8A5A64] transition-colors">Full Menu</Link>
            <Link to="/custom-cake" className="hover:text-[#8A5A64] transition-colors">Custom Orders</Link>
            <Link to="/contact" className="hover:text-[#8A5A64] transition-colors">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
