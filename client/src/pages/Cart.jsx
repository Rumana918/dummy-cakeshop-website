import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { EmptyState } from '../components/EmptyState';

export const Cart = () => {
  const {
    cartItems,
    itemsPrice,
    deliveryFee,
    discountAmount,
    totalAmount,
    coupon,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    clearCart
  } = useCart();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [applying, setApplying] = useState(false);
  const navigate = useNavigate();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setApplying(true);
    await applyCoupon(couponCodeInput.trim());
    setApplying(false);
    setCouponCodeInput('');
  };

  if (cartItems.length === 0) {
    return (
      <div className="w-full bg-[#FFF9F3] py-20 min-h-screen">
        <EmptyState
          icon="shopping_basket"
          title="Your Pastry Box is Empty"
          description="It looks like you haven’t added any cakes or pastries to your order yet. Treat yourself to today's freshly baked batches!"
          buttonText="Explore Artisanal Menu"
          buttonLink="/menu"
        />
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FFF9F3] py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <span className="text-[#894C5C] font-semibold text-xs uppercase tracking-widest">
              Review Your Selection
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#8A5A64] font-bold mt-1">
              Your Pastry Box ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-red-600 hover:text-red-700 underline"
          >
            Clear Entire Box
          </button>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-[#FDE8EC] shadow-sm flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-between"
              >
                {/* Item Details */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#FDE8EC]/60 shrink-0">
                    <img
                      src={item.image || item.product?.images?.[0]}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#8A5A64]">
                      {item.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs text-[#8E7D7D] mt-1">
                      <span className="bg-[#FFF9F3] px-2 py-0.5 rounded border border-[#FDE8EC]">
                        Weight: {item.weight}
                      </span>
                      {item.flavor && (
                        <span className="bg-[#FFF9F3] px-2 py-0.5 rounded border border-[#FDE8EC]">
                          Flavor: {item.flavor}
                        </span>
                      )}
                    </div>
                    {item.messageOnCake && (
                      <p className="text-xs text-[#894C5C] italic mt-1">
                        Message: "{item.messageOnCake}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Stepper, Price, & Remove */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#FDE8EC]">
                  
                  {/* Quantity Stepper */}
                  <div className="flex items-center bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="px-3 py-1.5 text-[#6B5B5B] hover:bg-[#FDE8EC] transition-colors"
                      title="Decrease quantity"
                    >
                      <span className="material-symbols-outlined text-[16px]">remove</span>
                    </button>
                    <span className="px-3 text-xs font-bold text-[#8A5A64]">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="px-3 py-1.5 text-[#6B5B5B] hover:bg-[#FDE8EC] transition-colors"
                      title="Increase quantity"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right min-w-[80px]">
                    <span className="font-serif text-base sm:text-lg font-bold text-[#894C5C]">
                      ₹{item.price * item.quantity}
                    </span>
                    <span className="block text-[10px] text-[#8E7D7D]">₹{item.price} each</span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="p-1.5 text-[#8E7D7D] hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                    title="Remove item"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Back to Menu Link */}
            <div className="pt-2">
              <Link
                to="/menu"
                className="text-xs font-semibold text-[#894C5C] hover:text-[#733949] inline-flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>Continue Shopping &amp; Add More Delights</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary & Coupon */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#FDE8EC] shadow-sm space-y-6">
            <h3 className="font-serif text-xl font-bold text-[#8A5A64] border-b border-[#FDE8EC] pb-3">
              Order Summary
            </h3>

            {/* Coupon Box */}
            <div className="bg-[#FFF9F3] p-4 rounded-2xl border border-[#FDE8EC]">
              <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-2">
                Have a Promo Code?
              </label>

              {coupon ? (
                <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-[#F4A7B9]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#894C5C] text-[18px]">loyalty</span>
                    <span className="font-bold text-xs text-[#894C5C] uppercase">{coupon.code}</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                    placeholder="e.g. SWEET10"
                    className="w-full px-3 py-2 bg-white border border-[#FDE8EC] rounded-xl text-xs uppercase font-medium text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                  />
                  <button
                    type="submit"
                    disabled={applying}
                    className="bg-[#894C5C] text-white hover:bg-[#733949] px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0"
                  >
                    {applying ? '...' : 'Apply'}
                  </button>
                </form>
              )}
              <p className="text-[10px] text-[#8E7D7D] mt-2">
                Try <strong>SWEET10</strong> (10% off) or <strong>WELCOME50</strong> (₹50 off)
              </p>
            </div>

            {/* Calculation Breakdown */}
            <div className="space-y-3 text-sm text-[#6B5B5B]">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-[#8A5A64]">₹{itemsPrice}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon Savings ({coupon?.code}):</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Local Chilled Delivery:</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-semibold">FREE</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>

              {itemsPrice < 999 && (
                <div className="bg-[#DFF3E8] text-[#3E4F48] p-2.5 rounded-xl text-xs flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">info</span>
                  <span>Add <strong>₹{999 - itemsPrice}</strong> more for FREE delivery!</span>
                </div>
              )}

              <div className="pt-3 border-t border-[#FDE8EC] flex justify-between items-baseline">
                <span className="font-serif text-lg font-bold text-[#8A5A64]">Total Payable:</span>
                <span className="font-serif text-2xl font-bold text-[#894C5C]">
                  ₹{totalAmount}
                </span>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-[#894C5C] text-white hover:bg-[#733949] py-4 rounded-full font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              <span>Proceed to Checkout</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-[#8E7D7D]">
              <span className="material-symbols-outlined text-[16px] text-[#894C5C]">verified_user</span>
              <span>100% Safe &amp; Secure Checkout</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Cart;
