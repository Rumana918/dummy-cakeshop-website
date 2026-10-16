import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderAPI, paymentAPI, authAPI } from '../services/api';
import toast from 'react-hot-toast';

export const Checkout = () => {
  const { user, updateUser } = useAuth();
  const {
    cartItems,
    itemsPrice,
    deliveryFee,
    discountAmount,
    totalAmount,
    coupon,
    deliveryDate,
    setDeliveryDate,
    deliverySlot,
    setDeliverySlot,
    clearCart
  } = useCart();

  const navigate = useNavigate();

  // Address selection state
  const savedAddresses = user?.addresses || [];
  const defaultAddr = savedAddresses.find(a => a.isDefault) || savedAddresses[0] || null;

  const [useExistingAddress, setUseExistingAddress] = useState(savedAddresses.length > 0);
  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddr?._id || '');

  // New address form fields
  const [recipientName, setRecipientName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Bloom City');
  const [state, setState] = useState('Maharashtra');
  const [zipCode, setZipCode] = useState('400001');
  const [saveAddressToProfile, setSaveAddressToProfile] = useState(true);

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [notes, setNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  // If cart is empty, redirect
  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Prepare address object
    let shippingAddress = null;

    if (useExistingAddress && selectedAddressId) {
      const found = savedAddresses.find(a => a._id === selectedAddressId);
      if (found) {
        shippingAddress = {
          recipientName: found.recipientName,
          phone: found.phone,
          street: found.street,
          city: found.city,
          state: found.state,
          zipCode: found.zipCode
        };
      }
    }

    if (!shippingAddress) {
      if (!recipientName || !phone || !street || !city || !zipCode) {
        toast.error('Please fill in complete address and contact details');
        return;
      }
      shippingAddress = {
        recipientName,
        phone,
        street,
        city,
        state,
        zipCode
      };

      // Save new address to profile if checked
      if (saveAddressToProfile) {
        try {
          const res = await authAPI.addAddress({
            recipientName,
            phone,
            street,
            city,
            state,
            zipCode,
            label: 'Home'
          });
          if (res.data?.addresses) {
            updateUser({ ...user, addresses: res.data.addresses });
          }
        } catch (err) {
          console.warn('Address save warning:', err.message);
        }
      }
    }

    setProcessing(true);

    try {
      // 1. Create order in database
      const orderPayload = {
        items: cartItems.map(item => ({
          product: item.product?._id || item.product,
          name: item.name,
          image: item.image,
          weight: item.weight,
          flavor: item.flavor,
          messageOnCake: item.messageOnCake,
          quantity: item.quantity,
          price: item.price,
          deliveryDate: item.deliveryDate || deliveryDate
        })),
        shippingAddress,
        deliverySlot,
        deliveryDate,
        paymentMethod,
        couponCode: coupon?.code || '',
        notes
      };

      const res = await orderAPI.create(orderPayload);
      const createdOrder = res.data.order;

      // 2. Handle Payment Flow
      if (paymentMethod === 'COD') {
        clearCart();
        toast.success('Order placed successfully! We’re preheating the ovens 🍰');
        navigate(`/order-success/${createdOrder._id}`, { state: { order: createdOrder } });
        return;
      }

      // If Razorpay payment
      if (paymentMethod === 'Razorpay') {
        const payRes = await paymentAPI.createOrder(createdOrder._id);
        const { isMock, razorpayOrder, key } = payRes.data;

        if (isMock || !window.Razorpay || key === 'rzp_test_placeholder') {
          // Simulation / Test Sandbox Modal flow
          toast('Opening Razorpay UPI & Cards Sandbox...', { icon: '💳' });
          setTimeout(async () => {
            try {
              await paymentAPI.verify({
                orderId: createdOrder._id,
                razorpay_order_id: razorpayOrder.id,
                razorpay_payment_id: 'pay_test_' + Date.now(),
                isMock: true
              });
              clearCart();
              toast.success('Payment verified successfully! 🎉');
              navigate(`/order-success/${createdOrder._id}`, { state: { order: createdOrder } });
            } catch (verErr) {
              toast.error(verErr.message || 'Payment verification failed');
            } finally {
              setProcessing(false);
            }
          }, 1500);
          return;
        }

        // Live / Test Razorpay popup
        const options = {
          key,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: 'Sweet Whisk Bakery',
          description: `Order #${createdOrder.orderNumber}`,
          order_id: razorpayOrder.id,
          handler: async (response) => {
            try {
              await paymentAPI.verify({
                orderId: createdOrder._id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });
              clearCart();
              toast.success('Payment successful! Your bake is confirmed ✨');
              navigate(`/order-success/${createdOrder._id}`, { state: { order: createdOrder } });
            } catch (vErr) {
              toast.error('Payment verification failed. Please contact support.');
            }
          },
          prefill: {
            name: shippingAddress.recipientName,
            email: user?.email,
            contact: shippingAddress.phone
          },
          theme: {
            color: '#894C5C'
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp) {
          toast.error(`Payment Failed: ${resp.error.description}`);
          setProcessing(false);
        });
        rzp.open();
      }

    } catch (err) {
      toast.error(err.message || 'Failed to place order');
      setProcessing(false);
    }
  };

  return (
    <div className="w-full bg-[#FFF9F3] py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-8">
          <span className="text-[#894C5C] font-semibold text-xs uppercase tracking-widest">
            Almost Ready
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#8A5A64] font-bold mt-1">
            Secure Checkout
          </h1>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Form: Delivery Address & Schedule */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. Address Section */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FDE8EC] shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-full bg-[#FFD9E0] text-[#733949] flex items-center justify-center font-bold text-sm">
                  1
                </span>
                <h2 className="font-serif text-xl font-bold text-[#8A5A64]">
                  Delivery Address
                </h2>
              </div>

              {/* Saved Addresses Option */}
              {savedAddresses.length > 0 && (
                <div className="mb-6">
                  <div className="flex gap-4 mb-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#8A5A64]">
                      <input
                        type="radio"
                        checked={useExistingAddress}
                        onChange={() => setUseExistingAddress(true)}
                        className="accent-[#894C5C]"
                      />
                      <span>Select Saved Address</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#8A5A64]">
                      <input
                        type="radio"
                        checked={!useExistingAddress}
                        onChange={() => setUseExistingAddress(false)}
                        className="accent-[#894C5C]"
                      />
                      <span>Enter New Address</span>
                    </label>
                  </div>

                  {useExistingAddress && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {savedAddresses.map((addr) => (
                        <div
                          key={addr._id}
                          onClick={() => setSelectedAddressId(addr._id)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            selectedAddressId === addr._id
                              ? 'border-[#894C5C] bg-[#FFF9F3] shadow-sm'
                              : 'border-[#FDE8EC] hover:border-[#F4A7B9]'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-xs text-[#8A5A64]">{addr.label}</span>
                            {addr.isDefault && (
                              <span className="text-[10px] bg-[#FFE9A8] text-[#71612E] px-2 py-0.5 rounded-full font-bold">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="font-semibold text-sm text-[#6B5B5B]">{addr.recipientName}</p>
                          <p className="text-xs text-[#8E7D7D] mt-1 leading-relaxed">
                            {addr.street}, {addr.city}, {addr.state} - {addr.zipCode}
                          </p>
                          <p className="text-xs text-[#8E7D7D] mt-1">📞 {addr.phone}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* New Address Inputs (shown if no saved addresses or if user selected 'Enter New Address') */}
              {(!useExistingAddress || savedAddresses.length === 0) && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#8E7D7D] mb-1">Recipient Name</label>
                      <input
                        type="text"
                        required
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#8E7D7D] mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#8E7D7D] mb-1">Street Address / House / Flat No.</label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="e.g. Flat 301, Magnolia Blossom Court"
                      className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#8E7D7D] mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#8E7D7D] mb-1">State</label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#8E7D7D] mb-1">Pin Code</label>
                      <input
                        type="text"
                        required
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      checked={saveAddressToProfile}
                      onChange={(e) => setSaveAddressToProfile(e.target.checked)}
                      className="accent-[#894C5C] rounded"
                    />
                    <span className="text-xs text-[#8E7D7D]">Save this address to my profile for future orders</span>
                  </label>
                </div>
              )}
            </div>

            {/* 2. Delivery Date & Slot */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FDE8EC] shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-full bg-[#FFD9E0] text-[#733949] flex items-center justify-center font-bold text-sm">
                  2
                </span>
                <h2 className="font-serif text-xl font-bold text-[#8A5A64]">
                  Delivery Date &amp; Time Slot
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-2">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-2">
                    Delivery Time Slot
                  </label>
                  <select
                    value={deliverySlot}
                    onChange={(e) => setDeliverySlot(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9] cursor-pointer"
                  >
                    <option value="Morning (9:00 AM - 12:00 PM)">Morning (9:00 AM - 12:00 PM)</option>
                    <option value="Afternoon (1:00 PM - 4:00 PM)">Afternoon (1:00 PM - 4:00 PM)</option>
                    <option value="Evening (5:00 PM - 8:00 PM)">Evening (5:00 PM - 8:00 PM)</option>
                    <option value="Express Delivery (within 2 hours)">Express Delivery (within 2 hours)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-2">
                  Special Delivery Instructions / Gate Code (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Ring the bell twice, leave with security if unavailable"
                  className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                />
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FDE8EC] shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-full bg-[#FFD9E0] text-[#733949] flex items-center justify-center font-bold text-sm">
                  3
                </span>
                <h2 className="font-serif text-xl font-bold text-[#8A5A64]">
                  Payment Method
                </h2>
              </div>

              <div className="space-y-3">
                <label
                  onClick={() => setPaymentMethod('Razorpay')}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'Razorpay'
                      ? 'border-[#894C5C] bg-[#FFF9F3] shadow-sm'
                      : 'border-[#FDE8EC] hover:border-[#F4A7B9]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'Razorpay'}
                      onChange={() => setPaymentMethod('Razorpay')}
                      className="accent-[#894C5C]"
                    />
                    <div>
                      <p className="font-bold text-sm text-[#8A5A64]">
                        Online Payment (UPI, Cards, Netbanking)
                      </p>
                      <p className="text-xs text-[#8E7D7D]">
                        Instant confirmation via Google Pay, PhonePe, Paytm, or Credit/Debit cards.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#894C5C] font-semibold bg-[#FFD9E0] px-2.5 py-1 rounded-full">
                    <span>Razorpay</span>
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMethod('COD')}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'COD'
                      ? 'border-[#894C5C] bg-[#FFF9F3] shadow-sm'
                      : 'border-[#FDE8EC] hover:border-[#F4A7B9]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="accent-[#894C5C]"
                    />
                    <div>
                      <p className="font-bold text-sm text-[#8A5A64]">
                        Cash on Delivery (COD)
                      </p>
                      <p className="text-xs text-[#8E7D7D]">
                        Pay in cash or UPI QR code when our temperature-controlled van arrives.
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#894C5C] text-[24px]">payments</span>
                </label>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary & Place Order Button */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#FDE8EC] shadow-sm space-y-6 sticky top-28">
            <h3 className="font-serif text-xl font-bold text-[#8A5A64] border-b border-[#FDE8EC] pb-3">
              Order Breakdown
            </h3>

            {/* Items Mini List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.image || item.product?.images?.[0]}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover bg-[#FDE8EC]"
                    />
                    <div>
                      <p className="font-bold text-[#8A5A64] line-clamp-1">{item.name}</p>
                      <p className="text-[#8E7D7D]">{item.weight} • Qty {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-[#894C5C] shrink-0">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 text-xs sm:text-sm text-[#6B5B5B] pt-4 border-t border-[#FDE8EC]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold text-[#8A5A64]">₹{itemsPrice}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount ({coupon?.code}):</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Chilled Delivery:</span>
                <span>
                  {deliveryFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${deliveryFee}`}
                </span>
              </div>

              <div className="pt-3 border-t border-[#FDE8EC] flex justify-between items-baseline">
                <span className="font-serif text-base sm:text-lg font-bold text-[#8A5A64]">Final Amount:</span>
                <span className="font-serif text-2xl font-bold text-[#894C5C]">
                  ₹{totalAmount}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={processing}
              className="w-full bg-[#894C5C] text-white hover:bg-[#733949] py-4 rounded-full font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Scheduling Your Bake...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  <span>Place Order • ₹{totalAmount}</span>
                </>
              )}
            </button>

            <div className="text-center text-[11px] text-[#8E7D7D]">
              By placing your order, you agree to Sweet Whisk's handcrafted freshness terms and delivery guidelines.
            </div>

          </div>

        </form>

      </div>
    </div>
  );
};

export default Checkout;
