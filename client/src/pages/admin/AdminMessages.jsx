import React, { useEffect, useState } from 'react';
import { contactAPI } from '../../services/api';
import toast from 'react-hot-toast';

export const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await contactAPI.getAll();
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await contactAPI.markAsRead(id);
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, isRead: true } : m))
      );
      toast.success('Message marked as read');
    } catch (err) {
      toast.error('Failed to update message');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await contactAPI.delete(id);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      toast.success('Message deleted');
    } catch (err) {
      toast.error('Failed to delete message');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#894C5C]">
          Inbox &amp; Inquiries
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#8A5A64]">
          Customer Messages ({messages.length})
        </h1>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-3xl border border-[#FDE8EC] shadow-sm overflow-hidden p-6 space-y-4">
        {loading ? (
          <div className="py-20 text-center text-xs text-[#8E7D7D]">Loading inquiries...</div>
        ) : messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`p-5 rounded-2xl border transition-all ${
                  msg.isRead ? 'bg-[#FFF9F3]/60 border-[#FDE8EC]' : 'bg-white border-[#F4A7B9] shadow-sm'
                }`}
              >
                <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif text-base font-bold text-[#8A5A64]">
                        {msg.subject || 'General Inquiry'}
                      </h4>
                      {!msg.isRead && (
                        <span className="bg-[#FFE9A8] text-[#71612E] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#8E7D7D] mt-0.5">
                      From: <strong>{msg.name}</strong> (✉️ {msg.email} {msg.phone ? `• 📞 ${msg.phone}` : ''})
                    </p>
                  </div>

                  <span className="text-[11px] text-[#8E7D7D]">
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>

                <p className="text-xs text-[#6B5B5B] leading-relaxed mb-4 bg-white p-3 rounded-xl border border-[#FDE8EC]/60">
                  {msg.message}
                </p>

                <div className="flex justify-end items-center gap-3 pt-2 border-t border-[#FDE8EC]">
                  {!msg.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(msg._id)}
                      className="text-xs font-semibold text-[#894C5C] hover:underline"
                    >
                      Mark as Read
                    </button>
                  )}
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Sweet Whisk Inquiry')}`}
                    className="bg-[#FDE8EC] text-[#8A5A64] hover:bg-[#FCD1D9] px-3.5 py-1 rounded-full text-xs font-bold transition-colors inline-flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">reply</span>
                    <span>Reply Email</span>
                  </a>
                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="text-rose-500 hover:text-rose-700 p-1"
                    title="Delete"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-xs text-[#8E7D7D]">
            No contact messages received yet.
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminMessages;
