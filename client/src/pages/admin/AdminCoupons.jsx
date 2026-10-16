import React, { useEffect, useState } from 'react';
import { couponAPI } from '../../services/api';
import toast from 'react-hot-toast';

export const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('percent');
  const [discountValue, setDiscountValue] = useState('');
  const [minOrderValue, setMinOrderValue] = useState('499');
  const [maxDiscount, setMaxDiscount] = useState('');
  const [expiryDate, setExpiryDate] = useState(() => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    return nextYear.toISOString().split('T')[0];
  });
  const [usageLimit, setUsageLimit] = useState('500');
  const [saving, setSaving] = useState(false);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await couponAPI.getAll();
      setCoupons(res.data.coupons || []);
    } catch (err) {
      console.error('Failed to load coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!code || !discountValue || !expiryDate) return;

    setSaving(true);
    try {
      await couponAPI.create({
        code: code.toUpperCase().trim(),
        discountType,
        discountValue: Number(discountValue),
        minOrderValue: Number(minOrderValue) || 0,
        maxDiscount: maxDiscount ? Number(maxDiscount) : null,
        expiryDate,
        usageLimit: Number(usageLimit) || 100
      });
      toast.success(`Coupon ${code.toUpperCase()} created successfully! 🎉`);
      setShowModal(false);
      setCode('');
      setDiscountValue('');
      fetchCoupons();
    } catch (err) {
      toast.error(err.message || 'Failed to create coupon');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, couponCode) => {
    if (!window.confirm(`Delete coupon "${couponCode}"?`)) return;
    try {
      await couponAPI.delete(id);
      setCoupons((prev) => prev.filter((c) => c._id !== id));
      toast.success('Coupon deleted');
    } catch (err) {
      toast.error(err.message || 'Failed to delete coupon');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#894C5C]">
            Promotions &amp; Discounts
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#8A5A64]">
            Bakery Coupons ({coupons.length})
          </h1>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-[#894C5C] text-white hover:bg-[#733949] px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-3xl border border-[#FDE8EC] shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-[#8E7D7D]">Loading coupons...</div>
        ) : coupons.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#FFF9F3] text-[#8E7D7D] border-b border-[#FDE8EC] text-xs">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Code</th>
                  <th className="py-3.5 px-4 font-semibold">Discount</th>
                  <th className="py-3.5 px-4 font-semibold">Min Order</th>
                  <th className="py-3.5 px-4 font-semibold">Valid Until</th>
                  <th className="py-3.5 px-4 font-semibold">Usage</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FDE8EC]/60">
                {coupons.map((c) => (
                  <tr key={c._id} className="hover:bg-[#FFF9F3]/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#894C5C] font-mono text-sm">
                      {c.code}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-[#6B5B5B]">
                      {c.discountType === 'percent' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                      {c.maxDiscount && (
                        <span className="text-[10px] text-[#8E7D7D] block">Up to ₹{c.maxDiscount}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-[#6B5B5B]">
                      ₹{c.minOrderValue}
                    </td>

                    <td className="py-3.5 px-4 text-[#8E7D7D]">
                      {new Date(c.expiryDate).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-xs">
                      {c.usedCount} / {c.usageLimit}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        c.isActive && new Date(c.expiryDate) > new Date()
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {c.isActive && new Date(c.expiryDate) > new Date() ? 'Active' : 'Expired'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(c._id, c.code)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-xs text-[#8E7D7D]">
            No promotional coupons created yet.
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FDE8EC] shadow-2xl max-w-md w-full animate-fadeIn">
            <h3 className="font-serif text-xl font-bold text-[#8A5A64] mb-4">
              Create Promotional Coupon
            </h3>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SWEET25"
                  className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm font-mono font-bold uppercase text-[#894C5C] outline-none focus:border-[#F4A7B9]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
                    Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B] outline-none"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder={discountType === 'percent' ? '15' : '100'}
                    className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
                    Min Order Value (₹)
                  </label>
                  <input
                    type="number"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(e.target.value)}
                    className="w-full px-4 py-2 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
                    Max Discount (₹, opt)
                  </label>
                  <input
                    type="number"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                    placeholder="300"
                    className="w-full px-4 py-2 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    className="w-full px-4 py-2 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B] outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 text-xs font-semibold text-[#8E7D7D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#894C5C] text-white hover:bg-[#733949] px-6 py-2 rounded-full text-xs font-bold shadow-sm"
                >
                  {saving ? 'Creating...' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminCoupons;
