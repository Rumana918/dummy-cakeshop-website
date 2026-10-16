import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminAPI.getStats();
        setStats(res.data.stats || {});
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-[#F4A7B9] border-t-[#894C5C] rounded-full animate-spin"></div>
      </div>
    );
  }

  const {
    todayOrdersCount = 0,
    totalRevenue = 0,
    pendingOrdersCount = 0,
    newCustomRequestsCount = 0,
    totalCustomers = 0,
    lowStockProducts = [],
    recentOrders = [],
    salesByDate = []
  } = stats || {};

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#894C5C]">
            Live Overview
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#8A5A64]">
            Bakery Operations Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products/add"
            className="bg-[#894C5C] text-white hover:bg-[#733949] px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Add New Cake</span>
          </Link>
        </div>
      </div>

      {/* Bento Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Today's Orders */}
        <div className="bg-[#FDE8EC]/70 p-6 rounded-3xl border border-[#F4A7B9]/30 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-[#8A5A64] uppercase tracking-wider">Today's Orders</span>
            <div className="w-9 h-9 rounded-full bg-[#F4A7B9] text-[#733949] flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            </div>
          </div>
          <div>
            <span className="font-serif text-3xl font-bold text-[#8A5A64]">{todayOrdersCount}</span>
            <p className="text-[11px] text-[#8E7D7D] mt-1 flex items-center gap-1">
              <span className="text-emerald-700 font-bold">Live</span> fresh orders today
            </p>
          </div>
        </div>

        {/* Card 2: Total Revenue */}
        <div className="bg-[#FFF9F3] p-6 rounded-3xl border border-[#FDE8EC] shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-[#8A5A64] uppercase tracking-wider">Total Revenue</span>
            <div className="w-9 h-9 rounded-full bg-[#FFE9A8] text-[#71612E] flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[20px]">payments</span>
            </div>
          </div>
          <div>
            <span className="font-serif text-3xl font-bold text-[#894C5C]">₹{totalRevenue.toLocaleString()}</span>
            <p className="text-[11px] text-[#8E7D7D] mt-1">Confirmed &amp; fulfilled orders</p>
          </div>
        </div>

        {/* Card 3: Pending Orders */}
        <div className="bg-[#FFF9F3] p-6 rounded-3xl border border-[#FDE8EC] shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-[#8A5A64] uppercase tracking-wider">Pending Orders</span>
            <div className="w-9 h-9 rounded-full bg-[#FFD9E0] text-[#733949] flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[20px]">oven_gen</span>
            </div>
          </div>
          <div>
            <span className="font-serif text-3xl font-bold text-[#8A5A64]">{pendingOrdersCount}</span>
            <p className="text-[11px] text-[#8E7D7D] mt-1">
              <Link to="/admin/orders?status=Pending" className="text-[#894C5C] font-semibold underline">
                View orders to bake
              </Link>
            </p>
          </div>
        </div>

        {/* Card 4: Custom Cake Requests */}
        <div className="bg-[#FFF9F3] p-6 rounded-3xl border border-[#FDE8EC] shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-[#8A5A64] uppercase tracking-wider">Custom Requests</span>
            <div className="w-9 h-9 rounded-full bg-[#DFF3E8] text-[#3E4F48] flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[20px]">cake</span>
            </div>
          </div>
          <div>
            <span className="font-serif text-3xl font-bold text-[#8A5A64]">{newCustomRequestsCount}</span>
            <p className="text-[11px] text-[#8E7D7D] mt-1">
              <Link to="/admin/custom-requests" className="text-[#894C5C] font-semibold underline">
                Pending custom quotes
              </Link>
            </p>
          </div>
        </div>

      </div>

      {/* Sales Trend & Low Stock Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sales Chart Section (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-[#FDE8EC] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#8A5A64]">Sales Activity (Last 30 Days)</h3>
              <p className="text-xs text-[#8E7D7D]">Daily revenue trends across all cake orders</p>
            </div>
            <span className="bg-[#DFF3E8] text-[#3E4F48] px-3 py-1 rounded-full text-xs font-bold">
              {salesByDate.length} Active Days
            </span>
          </div>

          {/* Simple Visual Bar Chart */}
          <div className="h-48 flex items-end gap-2 pt-6 pb-2 border-b border-[#FDE8EC] overflow-x-auto">
            {salesByDate.length > 0 ? (
              salesByDate.map((item, idx) => {
                const maxVal = Math.max(...salesByDate.map(d => d.totalSales), 1000);
                const heightPercent = Math.max(15, Math.round((item.totalSales / maxVal) * 100));
                return (
                  <div key={idx} className="flex-1 min-w-[28px] flex flex-col items-center gap-1 group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-8 bg-[#894C5C] text-white text-[10px] py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none z-10">
                      ₹{item.totalSales} ({item.orderCount} ord)
                    </div>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-[#F4A7B9] group-hover:bg-[#894C5C] rounded-t-lg transition-colors"
                    ></div>
                    <span className="text-[9px] text-[#8E7D7D] truncate w-full text-center">
                      {item._id.slice(8)}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-[#8E7D7D]">
                No sales records in the last 30 days yet. As customers order, daily revenue bars appear here.
              </div>
            )}
          </div>
          <div className="flex justify-between items-center text-[10px] text-[#8E7D7D] pt-3">
            <span>Aggregated from live customer checkout receipts</span>
            <span>Total Customers: <strong>{totalCustomers}</strong></span>
          </div>
        </div>

        {/* Low Stock Alerts (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#FDE8EC] shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-lg font-bold text-[#8A5A64]">Low-Stock Alerts</h3>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
          </div>
          <p className="text-xs text-[#8E7D7D]">Cakes with 5 or fewer items remaining in inventory:</p>

          <div className="space-y-3">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((prod) => (
                <div key={prod._id} className="p-3 bg-[#FFF9F3] rounded-2xl border border-[#FDE8EC] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={prod.images?.[0]}
                      alt={prod.name}
                      className="w-10 h-10 rounded-lg object-cover bg-[#FDE8EC]"
                    />
                    <div>
                      <p className="font-bold text-xs text-[#8A5A64] line-clamp-1">{prod.name}</p>
                      <p className="text-[10px] text-amber-700 font-semibold">{prod.stock} in stock</p>
                    </div>
                  </div>
                  <Link
                    to={`/admin/products/edit/${prod._id}`}
                    className="text-[11px] text-[#894C5C] font-semibold underline hover:text-[#733949]"
                  >
                    Restock
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-4 bg-[#DFF3E8] rounded-2xl text-xs text-[#3E4F48] text-center">
                All cakes are well-stocked! ✨
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Recent Orders Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FDE8EC] shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#8A5A64]">Recent Customer Orders</h3>
            <p className="text-xs text-[#8E7D7D]">Live fulfillment tracking for incoming orders</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-[#894C5C] bg-[#FDE8EC] hover:bg-[#FCD1D9] px-4 py-2 rounded-full transition-colors"
          >
            View All Orders
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="text-[#8E7D7D] border-b border-[#FDE8EC] text-xs">
                <th className="pb-3 font-semibold">Order ID</th>
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Delivery Date</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Total</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FDE8EC]/60">
              {recentOrders.length > 0 ? (
                recentOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-[#FFF9F3]/60 transition-colors">
                    <td className="py-3 font-bold text-[#894C5C]">#{ord.orderNumber}</td>
                    <td className="py-3 font-medium text-[#6B5B5B]">
                      {ord.shippingAddress?.recipientName || ord.user?.name || 'Customer'}
                    </td>
                    <td className="py-3 text-[#8E7D7D]">{ord.deliveryDate}</td>
                    <td className="py-3">
                      <span className="bg-[#FFD9E0] text-[#733949] px-2.5 py-0.5 rounded-full font-bold text-[11px]">
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 text-right font-bold text-[#8A5A64]">₹{ord.totalAmount}</td>
                    <td className="py-3 text-right">
                      <Link
                        to={`/admin/orders/${ord._id}`}
                        className="text-xs text-[#894C5C] hover:underline font-semibold"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-xs text-[#8E7D7D]">
                    No orders placed yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
