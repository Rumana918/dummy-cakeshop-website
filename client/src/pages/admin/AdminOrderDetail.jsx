import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../../services/api';
import toast from 'react-hot-toast';

export const AdminOrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    try {
      const res = await orderAPI.getById(id);
      setOrder(res.data.order);
      setNewStatus(res.data.order.orderStatus);
      setNewPaymentStatus(res.data.order.paymentStatus);
    } catch (err) {
      toast.error('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await orderAPI.updateStatus(id, {
        status: newStatus,
        paymentStatus: newPaymentStatus,
        note: statusNote
      });
      setOrder(res.data.order);
      setStatusNote('');
      toast.success('Order status updated and customer notified via email! 📧');
    } catch (err) {
      toast.error(err.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !order) {
    return (
      <div className="py-20 text-center text-xs text-[#8E7D7D]">Loading order details...</div>
    );
  }

  const statusColors = {
    'Pending': 'bg-[#FFE9A8] text-[#71612E]',
    'Confirmed': 'bg-[#FFD9E0] text-[#733949]',
    'Baking': 'bg-[#F4A7B9] text-[#733949]',
    'Out for Delivery': 'bg-[#DFF3E8] text-[#3E4F48]',
    'Delivered': 'bg-emerald-100 text-emerald-800',
    'Cancelled': 'bg-rose-100 text-rose-800'
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link to="/admin/orders" className="text-xs text-[#894C5C] font-semibold hover:underline inline-flex items-center gap-1 mb-1">
            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
            Back to All Orders
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl font-bold text-[#8A5A64]">
              Order #{order.orderNumber}
            </h1>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColors[order.orderStatus]}`}>
              {order.orderStatus}
            </span>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="bg-[#FFF9F3] border border-[#FDE8EC] hover:bg-[#FDE8EC] text-[#8A5A64] px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">print</span>
          <span>Print Customer Invoice</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Order Items & Delivery Details */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Items Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FDE8EC] shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#8A5A64] border-b border-[#FDE8EC] pb-3">
              Ordered Cakes &amp; Confections
            </h3>

            <div className="space-y-4">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-start justify-between gap-4 pb-3 border-b border-[#FDE8EC]/60 last:border-none">
                  <div className="flex items-start gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-2xl object-cover bg-[#FDE8EC] shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-[#8A5A64]">{item.name}</h4>
                      <p className="text-xs text-[#8E7D7D] mt-0.5">
                        Weight: {item.weight} • Flavor: {item.flavor}
                      </p>
                      {item.messageOnCake && (
                        <p className="text-xs text-[#894C5C] italic mt-1 font-medium">
                          Piped Message: "{item.messageOnCake}"
                        </p>
                      )}
                      <p className="text-xs text-[#6B5B5B] mt-1">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-serif font-bold text-sm text-[#894C5C] shrink-0">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="pt-3 border-t border-[#FDE8EC] space-y-2 text-xs text-[#6B5B5B]">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-[#8A5A64]">₹{order.itemsPrice}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount ({order.couponCode}):</span>
                  <span>-₹{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                <span>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-[#FDE8EC]">
                <span className="font-serif text-base font-bold text-[#8A5A64]">Total Payable:</span>
                <span className="font-serif text-xl font-bold text-[#894C5C]">₹{order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Customer Info Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FDE8EC] shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#8A5A64] border-b border-[#FDE8EC] pb-3">
              Delivery Destination &amp; Customer
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-[#8E7D7D] uppercase font-bold text-[10px] tracking-wider">Customer Name</p>
                <p className="font-semibold text-sm text-[#6B5B5B] mt-0.5">
                  {order.shippingAddress?.recipientName}
                </p>
                <p className="text-[#8E7D7D] mt-1">📞 {order.shippingAddress?.phone}</p>
                <p className="text-[#8E7D7D]">✉️ {order.user?.email || 'N/A'}</p>
              </div>

              <div>
                <p className="text-[#8E7D7D] uppercase font-bold text-[10px] tracking-wider">Delivery Window</p>
                <p className="font-semibold text-sm text-[#894C5C] mt-0.5">
                  {order.deliveryDate}
                </p>
                <p className="text-[#8E7D7D] mt-0.5">{order.deliverySlot}</p>
              </div>
            </div>

            <div className="pt-2 text-xs">
              <p className="text-[#8E7D7D] uppercase font-bold text-[10px] tracking-wider mb-1">Shipping Address</p>
              <p className="text-[#6B5B5B] leading-relaxed">
                {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zipCode}
              </p>
            </div>

            {order.notes && (
              <div className="p-3 bg-[#FFF9F3] rounded-2xl border border-[#FDE8EC] text-xs">
                <span className="font-bold text-[#8A5A64] block">Customer Special Notes:</span>
                <span className="text-[#6B5B5B]">{order.notes}</span>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Update Status & Tracking History */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Status Update Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FDE8EC] shadow-sm">
            <h3 className="font-serif text-lg font-bold text-[#8A5A64] mb-4">
              Update Fulfillment Status
            </h3>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1.5">
                  Order Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs sm:text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9] cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Baking">Baking (In Oven)</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1.5">
                  Payment Status
                </label>
                <select
                  value={newPaymentStatus}
                  onChange={(e) => setNewPaymentStatus(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs sm:text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9] cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed (Paid)</option>
                  <option value="Failed">Failed</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1.5">
                  Status Update Note (Included in Customer Email)
                </label>
                <input
                  type="text"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="e.g. Master decorator added fresh raspberries; out in van #2"
                  className="w-full px-4 py-2 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full bg-[#894C5C] text-white hover:bg-[#733949] py-3 rounded-full text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                {updating ? 'Updating & Notifying...' : 'Save & Notify Customer'}
              </button>
            </form>
          </div>

          {/* Tracking History */}
          <div className="bg-white p-6 rounded-3xl border border-[#FDE8EC] shadow-sm space-y-3">
            <h4 className="font-serif text-base font-bold text-[#8A5A64]">
              Tracking History
            </h4>

            <div className="space-y-3">
              {order.trackingHistory?.map((hist, idx) => (
                <div key={idx} className="p-3 bg-[#FFF9F3] rounded-xl text-xs border border-[#FDE8EC]/60">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-[#894C5C]">{hist.status}</span>
                    <span className="text-[10px] text-[#8E7D7D]">
                      {new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {hist.note && <p className="text-[#6B5B5B]">{hist.note}</p>}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminOrderDetail;
