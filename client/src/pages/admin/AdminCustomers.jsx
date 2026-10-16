import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

export const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getCustomers();
      setCustomers(res.data.customers || []);
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleToggleBlock = async (id, isBlocked, name) => {
    try {
      await adminAPI.toggleBlockCustomer(id);
      setCustomers((prev) =>
        prev.map((c) => (c._id === id ? { ...c, isBlocked: !isBlocked } : c))
      );
      toast.success(`${name} has been ${isBlocked ? 'unblocked' : 'suspended'}`);
    } catch (err) {
      toast.error(err.message || 'Failed to update customer status');
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#894C5C]">
            Patron Community
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#8A5A64]">
            Bakery Customers ({customers.length})
          </h1>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full sm:w-72 px-4 py-2 bg-white border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B] outline-none shadow-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-[#FDE8EC] shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-[#8E7D7D]">Loading customer records...</div>
        ) : filteredCustomers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#FFF9F3] text-[#8E7D7D] border-b border-[#FDE8EC] text-xs">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Customer</th>
                  <th className="py-3.5 px-4 font-semibold">Email</th>
                  <th className="py-3.5 px-4 font-semibold">Phone</th>
                  <th className="py-3.5 px-4 font-semibold">Total Orders</th>
                  <th className="py-3.5 px-4 font-semibold">Total Spent</th>
                  <th className="py-3.5 px-4 font-semibold">Account Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FDE8EC]/60">
                {filteredCustomers.map((c) => (
                  <tr key={c._id} className="hover:bg-[#FFF9F3]/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#8A5A64]">
                      {c.name}
                    </td>
                    <td className="py-3.5 px-4 text-[#6B5B5B]">{c.email}</td>
                    <td className="py-3.5 px-4 text-[#8E7D7D]">{c.phone || 'N/A'}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#8A5A64]">
                      {c.totalOrders || 0} orders
                    </td>
                    <td className="py-3.5 px-4 font-serif font-bold text-[#894C5C]">
                      ₹{(c.totalSpent || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        c.isBlocked ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {c.isBlocked ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggleBlock(c._id, c.isBlocked, c.name)}
                        className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${
                          c.isBlocked
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                        }`}
                      >
                        {c.isBlocked ? 'Unblock' : 'Suspend'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-xs text-[#8E7D7D]">
            No customer accounts found.
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminCustomers;
