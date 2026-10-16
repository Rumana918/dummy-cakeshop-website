import React, { useEffect, useState } from 'react';
import { reviewAPI } from '../../services/api';
import toast from 'react-hot-toast';

export const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await reviewAPI.getAll();
      setReviews(res.data.reviews || []);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleApprove = async (id) => {
    try {
      const res = await reviewAPI.toggleApprove(id);
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, isApproved: res.data.isApproved } : r))
      );
      toast.success(res.data.isApproved ? 'Review approved & visible' : 'Review unapproved');
    } catch (err) {
      toast.error('Failed to update review');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      await reviewAPI.delete(id);
      setReviews((prev) => prev.filter((r) => r._id !== id));
      toast.success('Review deleted');
    } catch (err) {
      toast.error('Failed to delete review');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#894C5C]">
          Patron Feedback
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#8A5A64]">
          Customer Reviews ({reviews.length})
        </h1>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-3xl border border-[#FDE8EC] shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-[#8E7D7D]">Loading reviews...</div>
        ) : reviews.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#FFF9F3] text-[#8E7D7D] border-b border-[#FDE8EC] text-xs">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Product</th>
                  <th className="py-3.5 px-4 font-semibold">Reviewer</th>
                  <th className="py-3.5 px-4 font-semibold">Rating</th>
                  <th className="py-3.5 px-4 font-semibold">Feedback</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FDE8EC]/60">
                {reviews.map((rev) => (
                  <tr key={rev._id} className="hover:bg-[#FFF9F3]/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#8A5A64]">
                      {rev.product?.name || 'Cake'}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#6B5B5B]">
                      {rev.userName}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center text-amber-500 text-xs">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-[16px] fill">star</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs text-xs text-[#6B5B5B]">
                      {rev.title && <strong className="block text-[#8A5A64]">{rev.title}</strong>}
                      <p className="line-clamp-2 text-[#8E7D7D]">{rev.comment}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleApprove(rev._id)}
                        className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                          rev.isApproved
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {rev.isApproved ? 'Approved' : 'Pending'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(rev._id)}
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
            No reviews submitted yet.
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminReviews;
