import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { EmptyState } from '../components/EmptyState';
import toast from 'react-hot-toast';

export const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const { addToCart } = useCart();
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getMy();
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;
    setCancelling(true);
    try {
      await orderAPI.cancel(selectedOrder._id, { reason: cancelReason });
      toast.success('Order cancelled successfully');
      setCancelModalOpen(false);
      setCancelReason('');
      fetchOrders();
      if (selectedOrder) {
        setSelectedOrder({ ...selectedOrder, orderStatus: 'Cancelled' });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const handleReorder = async (order) => {
    try {
      await orderAPI.reorder(order._id);
      order.items.forEach(item => {
        addToCart({
          _id: item.product?._id || item.product,
          name: item.name,
          images: [item.image],
          basePrice: item.price
        }, {
          weight: item.weight,
          flavor: item.flavor,
          messageOnCake: item.messageOnCake,
          quantity: item.quantity,
          price: item.price
        });
      });
      toast.success('Items added back to your cart! 🍰');
      navigate('/cart');
    } catch (err) {
      toast.error('Failed to reorder items');
    }
  };

  const statusColors = {
    'Pending': 'bg-[#FFE9A8] text-[#71612E]',
    'Confirmed': 'bg-[#FFD9E0] text-[#733949]',
    'Baking': 'bg-[#F4A7B9] text-[#733949]',
    'Out for Delivery': 'bg-[#DFF3E8] text-[#3E4F48]',
    'Delivered': 'bg-emerald-100 text-emerald-800',
    'Cancelled': 'bg-rose-100 text-rose-800'
  };

  const timelineSteps = ['Pending', 'Confirmed', 'Baking', 'Out for Delivery', 'Delivered'];

  const getStepStatus = (currentStatus, step) => {
    if (currentStatus === 'Cancelled') return 'cancelled';
    const currentIdx = timelineSteps.indexOf(currentStatus);
    const stepIdx = timelineSteps.indexOf(step);
    if (stepIdx <= currentIdx) return 'completed';
    return 'upcoming';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#F4A7B9] border-t-[#894C5C] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FFF9F3] py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-8">
          <span className="text-[#894C5C] font-semibold text-xs uppercase tracking-widest">
            Order History
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#8A5A64] font-bold mt-1">
            My Pastry Orders
          </h1>
        </div>

        {orders.length === 0 ? (
          <EmptyState
            icon="receipt_long"
            title="No Past Orders Found"
            description="You haven’t placed any orders with Sweet Whisk yet. Start by browsing today's fresh bakery specialties!"
            buttonText="Explore Bakery Menu"
            buttonLink="/menu"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Orders List */}
            <div className="lg:col-span-7 space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className={`bg-white p-5 rounded-2xl border transition-all ${
                    selectedOrder?._id === order._id
                      ? 'border-[#894C5C] shadow-md'
                      : 'border-[#FDE8EC] shadow-sm hover:border-[#F4A7B9]'
                  }`}
                >
                  <div className="flex flex-wrap justify-between items-center pb-3 border-b border-[#FDE8EC] gap-2 mb-3">
                    <div>
                      <span className="font-serif text-base font-bold text-[#8A5A64]">
                        #{order.orderNumber}
                      </span>
                      <span className="text-xs text-[#8E7D7D] block">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColors[order.orderStatus] || 'bg-gray-100 text-gray-700'}`}>
                      {order.orderStatus}
                    </span>
                  </div>

                  {/* Items Mini Row */}
                  <div className="flex items-center gap-3 overflow-x-auto py-2">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 shrink-0 bg-[#FFF9F3] p-1.5 rounded-xl border border-[#FDE8EC]">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div className="text-[11px] pr-2">
                          <p className="font-bold text-[#8A5A64] line-clamp-1">{item.name}</p>
                          <p className="text-[#8E7D7D]">{item.weight} x {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer & Actions */}
                  <div className="flex flex-wrap justify-between items-center pt-3 border-t border-[#FDE8EC] mt-3 gap-2">
                    <div>
                      <span className="text-[11px] text-[#8E7D7D]">Total Amount: </span>
                      <span className="font-serif text-base font-bold text-[#894C5C]">₹{order.totalAmount}</span>
                      <span className="text-[11px] text-[#8E7D7D] ml-2">({order.paymentMethod})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="bg-[#FDE8EC] text-[#8A5A64] hover:bg-[#FCD1D9] px-4 py-1.5 rounded-full text-xs font-bold transition-colors"
                      >
                        View Timeline &amp; Details
                      </button>

                      <button
                        onClick={() => handleReorder(order)}
                        className="bg-[#894C5C] text-white hover:bg-[#733949] px-4 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1"
                        title="Add items to cart again"
                      >
                        <span className="material-symbols-outlined text-[14px]">refresh</span>
                        <span>Reorder</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Selected Order Deep-Dive & Timeline */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#FDE8EC] shadow-sm sticky top-28">
              {selectedOrder ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-start border-b border-[#FDE8EC] pb-4">
                    <div>
                      <span className="text-xs text-[#8E7D7D]">Selected Order</span>
                      <h3 className="font-serif text-xl font-bold text-[#8A5A64]">
                        #{selectedOrder.orderNumber}
                      </h3>
                      <p className="text-xs text-[#8E7D7D]">
                        Delivery: {selectedOrder.deliveryDate} ({selectedOrder.deliverySlot})
                      </p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColors[selectedOrder.orderStatus]}`}>
                      {selectedOrder.orderStatus}
                    </span>
                  </div>

                  {/* Status Timeline */}
                  <div>
                    <h4 className="text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-4">
                      Live Baking &amp; Delivery Timeline
                    </h4>

                    {selectedOrder.orderStatus === 'Cancelled' ? (
                      <div className="p-4 bg-rose-50 text-rose-800 rounded-2xl text-xs">
                        <p className="font-bold">Order Cancelled</p>
                        <p className="mt-1">Reason: {selectedOrder.cancelReason || 'Cancelled by customer'}</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {timelineSteps.map((step, idx) => {
                          const state = getStepStatus(selectedOrder.orderStatus, step);
                          return (
                            <div key={step} className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                  state === 'completed'
                                    ? 'bg-[#894C5C] text-white shadow-sm'
                                    : 'bg-[#FDE8EC] text-[#8E7D7D]'
                                }`}
                              >
                                {state === 'completed' ? '✓' : idx + 1}
                              </div>
                              <span
                                className={`text-xs font-semibold ${
                                  state === 'completed' ? 'text-[#8A5A64]' : 'text-[#8E7D7D]'
                                }`}
                              >
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Order Items List */}
                  <div className="space-y-3 pt-4 border-t border-[#FDE8EC]">
                    <h4 className="text-xs font-bold text-[#8A5A64] uppercase tracking-wider">
                      Items in this Bake
                    </h4>
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-[#8A5A64]">{item.name}</p>
                          <p className="text-[#8E7D7D]">{item.weight} | {item.flavor} | Qty: {item.quantity}</p>
                          {item.messageOnCake && (
                            <p className="text-[#894C5C] italic">"{item.messageOnCake}"</p>
                          )}
                        </div>
                        <span className="font-semibold text-[#894C5C]">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Address */}
                  <div className="p-4 bg-[#FFF9F3] rounded-2xl border border-[#FDE8EC] text-xs space-y-1">
                    <p className="font-bold text-[#8A5A64]">Delivery Destination:</p>
                    <p>{selectedOrder.shippingAddress?.recipientName} • {selectedOrder.shippingAddress?.phone}</p>
                    <p className="text-[#8E7D7D]">
                      {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.zipCode}
                    </p>
                  </div>

                  {/* Cancel Button (if pending) */}
                  {selectedOrder.orderStatus === 'Pending' && (
                    <button
                      onClick={() => setCancelModalOpen(true)}
                      className="w-full py-2.5 rounded-full border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors"
                    >
                      Cancel Order
                    </button>
                  )}

                  {/* Print Invoice Button */}
                  <button
                    onClick={() => window.print()}
                    className="w-full py-2.5 rounded-full bg-[#FFF9F3] border border-[#FDE8EC] text-[#8A5A64] hover:bg-[#FDE8EC] text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">print</span>
                    <span>Print Order Invoice</span>
                  </button>

                </div>
              ) : (
                <div className="text-center py-16 text-xs text-[#8E7D7D]">
                  <span className="material-symbols-outlined text-[36px] text-[#F4A7B9] mb-2 block">
                    touch_app
                  </span>
                  Click "View Timeline &amp; Details" on any order to inspect tracking history, recipient address, and invoice.
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* Cancellation Confirmation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FDE8EC] shadow-2xl max-w-md w-full">
            <h3 className="font-serif text-xl font-bold text-rose-800 mb-2">
              Cancel Order #{selectedOrder?.orderNumber}?
            </h3>
            <p className="text-xs text-[#8E7D7D] mb-4 leading-relaxed">
              Orders can only be cancelled while still in 'Pending' status before baking preparation begins.
            </p>

            <textarea
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation (e.g. ordered by mistake, date changed)"
              className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B] outline-none focus:border-[#F4A7B9] mb-4"
            ></textarea>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="flex-1 py-2.5 rounded-full bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200"
              >
                Keep Order
              </button>
              <button
                type="button"
                disabled={cancelling}
                onClick={handleCancelOrder}
                className="flex-1 py-2.5 rounded-full bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyOrders;
