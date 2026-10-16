import React, { useState } from 'react';
import { contactAPI } from '../services/api';
import toast from 'react-hot-toast';

export const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('Please complete all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const res = await contactAPI.submit({ name, email, phone, subject, message });
      toast.success(res.data.message || 'Message sent! We will be in touch shortly. 💌');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err) {
      toast.error(err.message || 'Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#FFF9F3] py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[#894C5C] font-semibold text-xs uppercase tracking-widest">
            We’d Love to Hear From You
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#8A5A64] font-medium mt-1">
            Contact &amp; Visit Our Bakery
          </h1>
          <p className="text-sm text-[#8E7D7D] mt-2">
            Have questions about custom flavors, large corporate dessert tables, or dietary options? Reach out or visit our sunny storefront.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-[#FDE8EC] shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-[#8A5A64] mb-2">
              Send Us a Message
            </h2>
            <p className="text-xs text-[#8E7D7D] mb-6">
              Our front-of-house team responds within 2-4 hours during business days.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Emma Watson"
                    className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="emma@example.com"
                    className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1.5">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1.5">
                    Inquiry Topic
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Wedding / Multi-Tier Cake Consultation">Wedding Consultation</option>
                    <option value="Corporate Catering">Corporate Catering</option>
                    <option value="Delivery Status Inquiry">Delivery Status Inquiry</option>
                    <option value="Dietary / Allergens Question">Dietary / Allergens Question</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1.5">
                  Your Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you have in mind..."
                  className="w-full px-4 py-3 bg-[#FFF9F3] border border-[#FDE8EC] rounded-2xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-[#894C5C] text-white hover:bg-[#733949] px-8 py-3 rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-2"
              >
                {submitting ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Right Column: Bakery Location, Hours & WhatsApp */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick WhatsApp Connect */}
            <div className="bg-[#DFF3E8] p-6 rounded-3xl border border-emerald-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                  Instant Assistant
                </span>
                <h4 className="font-serif text-lg font-bold text-[#3E4F48] mt-0.5">
                  Chat on WhatsApp
                </h4>
                <p className="text-xs text-[#50625A] mt-0.5">
                  Quick answers from our pastry dispatch desk.
                </p>
              </div>

              <a
                href="https://wa.me/919876543210?text=Hi%20Sweet%20Whisk!%20I%20have%20an%20inquiry%20regarding%20a%20cake."
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:scale-105 transition-transform shadow-md shrink-0"
                title="Message on WhatsApp"
              >
                <span className="material-symbols-outlined text-[24px]">chat</span>
              </a>
            </div>

            {/* Visit Details Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FDE8EC] shadow-sm space-y-5">
              <h3 className="font-serif text-xl font-bold text-[#8A5A64]">
                Bakery Details
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-[#6B5B5B]">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#894C5C] text-[20px] shrink-0 mt-0.5">
                    location_on
                  </span>
                  <div>
                    <strong className="text-[#8A5A64] block">Storefront Address</strong>
                    <p className="text-[#8E7D7D] mt-0.5">
                      123 Pastry Lane, Sugarloaf District, Bloom City, 400001
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#894C5C] text-[20px] shrink-0 mt-0.5">
                    schedule
                  </span>
                  <div>
                    <strong className="text-[#8A5A64] block">Opening Hours</strong>
                    <p className="text-[#8E7D7D] mt-0.5">Monday - Friday: 7:00 AM - 7:00 PM</p>
                    <p className="text-[#8E7D7D]">Saturday - Sunday: 8:00 AM - 6:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#894C5C] text-[20px] shrink-0 mt-0.5">
                    call
                  </span>
                  <div>
                    <strong className="text-[#8A5A64] block">Phone Inquiries</strong>
                    <p className="text-[#8E7D7D] mt-0.5">+91 98765 43210 / +91 98765 43211</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#894C5C] text-[20px] shrink-0 mt-0.5">
                    mail
                  </span>
                  <div>
                    <strong className="text-[#8A5A64] block">Direct Email</strong>
                    <p className="text-[#8E7D7D] mt-0.5">hello@sweetwhisk.com</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Embedded Google Map */}
        <div className="w-full h-80 rounded-3xl overflow-hidden border border-[#FDE8EC] shadow-sm bg-[#FDE8EC]/40">
          <iframe
            title="Sweet Whisk Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.56206308527!2d77.2090212!3d28.6139391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM2JzUwLjIiTiA3N8KwMTInMzIuNSJF!5e0!3m2!1sen!2sin!4v1620000000000"
            className="w-full h-full border-0"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

      </div>
    </div>
  );
};

export default Contact;
