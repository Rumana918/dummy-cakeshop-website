import React, { useEffect, useState } from 'react';
import { customCakeAPI } from '../../services/api';
import toast from 'react-hot-toast';

export const AdminCustomRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState(null);
  const [status, setStatus] = useState('all');

  // Quote form state
  const [quotePrice, setQuotePrice] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [reqStatus, setReqStatus] = useState('Quoted');
  const [saving, setSaving] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await customCakeAPI.getAll({ status });
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error('Failed to load custom requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [status]);

  const openQuoteModal = (req) => {
    setSelectedReq(req);
    setQuotePrice(req.quotePrice ? req.quotePrice.toString() : '');
    setAdminNotes(req.adminNotes || '');
    setReqStatus(req.status === 'Pending' ? 'Quoted' : req.status);
  };

  const handleSaveQuote = async (e) => {
    e.preventDefault();
    if (!selectedReq) return;

    setSaving(true);
    try {
      await customCakeAPI.update(selectedReq._id, {
        quotePrice: Number(quotePrice),
        adminNotes,
        status: reqStatus
      });
      toast.success('Quote updated and email dispatched to customer! 💌');
      setSelectedReq(null);
      fetchRequests();
    } catch (err) {
      toast.error(err.message || 'Failed to update quote');
    } finally {
      setSaving(false);
    }
  };

  const statusColors = {
    'Pending': 'bg-[#FFE9A8] text-[#71612E]',
    'Quoted': 'bg-[#FFD9E0] text-[#733949]',
    'Accepted': 'bg-[#DFF3E8] text-[#3E4F48]',
    'Rejected': 'bg-rose-100 text-rose-800',
    'In Progress': 'bg-[#F4A7B9] text-[#733949]',
    'Completed': 'bg-emerald-100 text-emerald-800'
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#894C5C]">
            Bespoke Cake Studio
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#8A5A64]">
            Custom Cake Inquiries ({requests.length})
          </h1>
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 bg-white border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B] outline-none cursor-pointer shadow-sm"
        >
          <option value="all">All Request Statuses</option>
          <option value="Pending">Pending Review</option>
          <option value="Quoted">Quoted</option>
          <option value="Accepted">Accepted by Client</option>
          <option value="In Progress">In Progress (Baking)</option>
          <option value="Completed">Completed</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Requests Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-[#8E7D7D]">Loading inquiries...</div>
      ) : requests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white rounded-3xl border border-[#FDE8EC] shadow-sm p-6 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="bg-[#FFE9A8] text-[#71612E] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                      {req.occasion}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#8A5A64] mt-1">
                      {req.customerName}
                    </h3>
                    <p className="text-xs text-[#8E7D7D]">
                      ✉️ {req.email} • 📞 {req.phone}
                    </p>
                  </div>

                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColors[req.status] || 'bg-gray-100'}`}>
                    {req.status}
                  </span>
                </div>

                <div className="bg-[#FFF9F3] p-3.5 rounded-2xl border border-[#FDE8EC] text-xs text-[#6B5B5B] space-y-1 mb-3">
                  <p><strong>Flavor &amp; Size:</strong> {req.flavor} • {req.size}</p>
                  <p><strong>Target Date:</strong> {req.deliveryDate} ({req.deliveryTimeSlot})</p>
                  {req.quotePrice > 0 && (
                    <p className="font-bold text-[#894C5C]">
                      Quoted Price: ₹{req.quotePrice}
                    </p>
                  )}
                </div>

                <div>
                  <h5 className="text-[11px] font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
                    Design Vision:
                  </h5>
                  <p className="text-xs text-[#8E7D7D] leading-relaxed">
                    {req.designDescription}
                  </p>
                </div>

                {/* Reference Images */}
                {req.referenceImages?.length > 0 && (
                  <div className="pt-3">
                    <h5 className="text-[11px] font-bold text-[#8A5A64] uppercase tracking-wider mb-1.5">
                      Reference Photos:
                    </h5>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {req.referenceImages.map((imgUrl, i) => (
                        <a
                          key={i}
                          href={imgUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-16 h-16 rounded-xl overflow-hidden border border-[#FDE8EC] shrink-0"
                        >
                          <img src={imgUrl} alt="Reference" className="w-full h-full object-cover" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#FDE8EC] flex justify-end">
                <button
                  onClick={() => openQuoteModal(req)}
                  className="bg-[#894C5C] text-white hover:bg-[#733949] px-5 py-2 rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">price_change</span>
                  <span>Set Quote &amp; Email Client</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-xs text-[#8E7D7D] bg-white rounded-3xl border border-[#FDE8EC]">
          No custom cake inquiries in this category.
        </div>
      )}

      {/* Quote Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FDE8EC] shadow-2xl max-w-md w-full animate-fadeIn">
            <h3 className="font-serif text-xl font-bold text-[#8A5A64] mb-1">
              Set Price Quote &amp; Status
            </h3>
            <p className="text-xs text-[#8E7D7D] mb-4">
              For {selectedReq.customerName} ({selectedReq.occasion})
            </p>

            <form onSubmit={handleSaveQuote} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
                  Estimated Price Quote (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={quotePrice}
                  onChange={(e) => setQuotePrice(e.target.value)}
                  placeholder="e.g. 3500"
                  className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
                  Status
                </label>
                <select
                  value={reqStatus}
                  onChange={(e) => setReqStatus(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B] outline-none cursor-pointer"
                >
                  <option value="Quoted">Quoted</option>
                  <option value="Accepted">Accepted by Client</option>
                  <option value="In Progress">In Progress (Baking)</option>
                  <option value="Completed">Completed</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
                  Chef's Note (Emailed to Customer)
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Price includes hand-sculpted sugar flowers and refrigerated courier delivery."
                  className="w-full px-4 py-2 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedReq(null)}
                  className="px-5 py-2 text-xs font-semibold text-[#8E7D7D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#894C5C] text-white hover:bg-[#733949] px-6 py-2 rounded-full text-xs font-bold shadow-sm"
                >
                  {saving ? 'Sending Quote...' : 'Send Quote Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminCustomRequests;
