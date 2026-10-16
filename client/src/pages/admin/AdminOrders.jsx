import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { orderAPI } from '../../services/api';

export const AdminOrders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  const [paymentMethod, setPaymentMethod] = useState('all');
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {};
      if (status !== 'all') params.status = status;
      if (paymentMethod !== 'all') params.paymentMethod = paymentMethod;
      if (search.trim()) params.search = search.trim();
      if (date) params.date = date;

      const res = await orderAPI.getAll(params);
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [status, paymentMethod, date]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const statusColors = {
    'Pending': 'bg-[#FFE9A8] text-[#71612E]',
    'Confirmed': 'bg-[#FFD9E0] text-[#733949]',
    'Baking': 'bg-[#F4A7B9] text-[#733949]',
    'Out for Delivery': 'bg-[#DFF3E8] text-[#3E4F48]',
    'Delivered': 'bg-emerald-100 text-emerald-800',
    'Cancelled': 'bg-rose-100 text-rose-800'
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#894C5C]">
            Fulfillment Dashboard
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#8A5A64]">
            Customer Orders ({orders.length})
          </h1>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#FDE8EC] shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#8E7D7D] text-[18px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Order #, name, or phone..."
            className="w-full pl-9 pr-4 py-2 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
          />
        </form>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3.5 py-2 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B] outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending (To Bake)</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Baking">In The Oven (Baking)</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="px-3.5 py-2 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B] outline-none cursor-pointer"
          >
            <option value="all">All Payments</option>
            <option value="Razorpay">Razorpay Online</option>
            <option value="COD">Cash on Delivery</option>
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-1.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B] outline-none"
          />

          {(status !== 'all' || paymentMethod !== 'all' || search || date) && (
            <button
              onClick={() => {
                setStatus('all');
                setPaymentMethod('all');
                setSearch('');
                setDate('');
              }}
              className="text-xs text-[#894C5C] underline px-2"
            >
              Reset
            </button>
          )}
        </div>

      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#FDE8EC] shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-[#8E7D7D]">Loading orders...</div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#FFF9F3] text-[#8E7D7D] border-b border-[#FDE8EC] text-xs">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Order Number</th>
                  <th className="py-3.5 px-4 font-semibold">Customer &amp; Phone</th>
                  <th className="py-3.5 px-4 font-semibold">Delivery Schedule</th>
                  <th className="py-3.5 px-4 font-semibold">Payment</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Total</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FDE8EC]/60">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-[#FFF9F3]/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#894C5C]">
                      #{ord.orderNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-[#8A5A64]">
                        {ord.shippingAddress?.recipientName || ord.user?.name || 'Customer'}
                      </p>
                      <p className="text-[11px] text-[#8E7D7D]">
                        📞 {ord.shippingAddress?.phone}
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-[#6B5B5B]">{ord.deliveryDate}</p>
                      <p className="text-[11px] text-[#8E7D7D]">{ord.deliverySlot}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-bold text-[#6B5B5B] block">
                        {ord.paymentMethod}
                      </span>
                      <span className={`text-[10px] font-semibold ${
                        ord.paymentStatus === 'Completed' ? 'text-emerald-700' : 'text-amber-700'
                      }`}>
                        {ord.paymentStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColors[ord.orderStatus]}`}>
                        {ord.orderStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-serif font-bold text-[#8A5A64]">
                      ₹{ord.totalAmount}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/admin/orders/${ord._id}`}
                        className="bg-[#FDE8EC] text-[#8A5A64] hover:bg-[#FCD1D9] px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors inline-flex items-center gap-1"
                      >
                        <span>Manage</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-xs text-[#8E7D7D]">
            No orders match the selected filters.
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminOrders;
