import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { orderAPI } from '../services/api';
import confetti from 'canvas-confetti';

export const OrderSuccess = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    // Fire festive celebration confetti!
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F4A7B9', '#894C5C', '#FFE9A8', '#DFF3E8']
    });

    if (!order) {
      const fetchOrder = async () => {
        try {
          const res = await orderAPI.getById(orderId);
          setOrder(res.data.order);
        } catch (err) {
          console.error('Failed to load order:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [orderId, order]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#F4A7B9] border-t-[#894C5C] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FFF9F3] py-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Success Icon */}
        <div className="w-24 h-24 rounded-full bg-[#DFF3E8] text-[#3E4F48] flex items-center justify-center mx-auto mb-6 shadow-md border-4 border-white">
          <span className="material-symbols-outlined text-[48px]">cake</span>
        </div>

        <span className="bg-[#FFD9E0] text-[#733949] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
          Order Successfully Placed
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#8A5A64] font-medium mt-3 mb-2">
          Thank You For Your Order!
        </h1>

        <p className="text-sm sm:text-base text-[#6B5B5B] max-w-lg mx-auto mb-8">
          We’ve received your order{' '}
          <strong className="text-[#894C5C]">#{order?.orderNumber || orderId}</strong>. A confirmation email has been dispatched to your inbox.
        </p>

        {/* Order Card Preview */}
        {order && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FDE8EC] shadow-sm text-left mb-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-[#FDE8EC] gap-2">
              <div>
                <span className="text-xs text-[#8E7D7D] block">Delivery Schedule</span>
                <span className="font-serif text-lg font-bold text-[#8A5A64]">
                  {order.deliveryDate} • {order.deliverySlot}
                </span>
              </div>
              <div className="sm:text-right">
                <span className="text-xs text-[#8E7D7D] block">Payment Method</span>
                <span className="text-xs font-bold text-[#894C5C] bg-[#FFF9F3] px-3 py-1 rounded-full border border-[#FDE8EC]">
                  {order.paymentMethod} ({order.paymentStatus})
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#8A5A64] uppercase tracking-wider">Bakes in this Order</h4>
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs sm:text-sm py-1 border-b border-[#FDE8EC]/50 last:border-none">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-11 h-11 rounded-xl object-cover bg-[#FDE8EC]"
                    />
                    <div>
                      <p className="font-bold text-[#8A5A64]">{item.name}</p>
                      <p className="text-xs text-[#8E7D7D]">{item.weight} | {item.flavor} | Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-[#894C5C]">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Address */}
            <div className="p-4 bg-[#FFF9F3] rounded-2xl border border-[#FDE8EC] text-xs text-[#6B5B5B]">
              <p className="font-bold text-[#8A5A64] mb-1">Delivering to:</p>
              <p>{order.shippingAddress?.recipientName} • {order.shippingAddress?.phone}</p>
              <p>{order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zipCode}</p>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="font-serif text-base font-bold text-[#8A5A64]">Total Paid / Due:</span>
              <span className="font-serif text-2xl font-bold text-[#894C5C]">₹{order.totalAmount}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/my-orders"
            className="bg-[#894C5C] text-white hover:bg-[#733949] px-8 py-3.5 rounded-full text-sm font-semibold shadow-md transition-all inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            <span>Track in My Orders</span>
          </Link>

          <Link
            to="/menu"
            className="bg-[#FDE8EC] text-[#8A5A64] hover:bg-[#FCD1D9] px-8 py-3.5 rounded-full text-sm font-semibold shadow-sm transition-all"
          >
            Explore More Treats
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;
