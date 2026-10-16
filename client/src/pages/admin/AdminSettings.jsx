import React, { useEffect, useState } from 'react';
import { settingsAPI } from '../../services/api';
import toast from 'react-hot-toast';

export const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [shopName, setShopName] = useState('');
  const [tagline, setTagline] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [openingHoursWeekdays, setOpeningHoursWeekdays] = useState('');
  const [openingHoursWeekends, setOpeningHoursWeekends] = useState('');
  const [standardFee, setStandardFee] = useState('50');
  const [freeDeliveryAbove, setFreeDeliveryAbove] = useState('999');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [specialTitle, setSpecialTitle] = useState('');
  const [specialOriginalPrice, setSpecialOriginalPrice] = useState('999');
  const [specialDiscountedPrice, setSpecialDiscountedPrice] = useState('749');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await settingsAPI.get();
        const s = res.data.settings || {};
        setSettings(s);
        setShopName(s.shopName || 'Sweet Whisk');
        setTagline(s.tagline || 'Artisanal Bakery & Patisserie');
        setAnnouncement(s.announcement || '');
        setAddress(s.contact?.address || '');
        setEmail(s.contact?.email || '');
        setPhone(s.contact?.phone || '');
        setWhatsapp(s.contact?.whatsapp || '');
        setOpeningHoursWeekdays(s.contact?.openingHoursWeekdays || '');
        setOpeningHoursWeekends(s.contact?.openingHoursWeekends || '');
        setStandardFee(s.delivery?.standardFee?.toString() || '50');
        setFreeDeliveryAbove(s.delivery?.freeDeliveryAbove?.toString() || '999');
        setHeroTitle(s.heroBanner?.title || '');
        setHeroSubtitle(s.heroBanner?.subtitle || '');
        setSpecialTitle(s.heroBanner?.specialTitle || '');
        setSpecialOriginalPrice(s.heroBanner?.specialOriginalPrice?.toString() || '999');
        setSpecialDiscountedPrice(s.heroBanner?.specialDiscountedPrice?.toString() || '749');
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsAPI.update({
        shopName,
        tagline,
        announcement,
        contact: {
          address,
          email,
          phone,
          whatsapp,
          openingHoursWeekdays,
          openingHoursWeekends
        },
        delivery: {
          standardFee: Number(standardFee),
          freeDeliveryAbove: Number(freeDeliveryAbove)
        },
        heroBanner: {
          title: heroTitle,
          subtitle: heroSubtitle,
          specialTitle,
          specialOriginalPrice: Number(specialOriginalPrice),
          specialDiscountedPrice: Number(specialDiscountedPrice)
        }
      });
      toast.success('Website configuration saved successfully! ✨');
    } catch (err) {
      toast.error(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-[#8E7D7D]">Loading settings...</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Title */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#894C5C]">
          Store Preferences
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#8A5A64]">
          Shop &amp; Website Configuration
        </h1>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Brand & Announcement */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FDE8EC] shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#8A5A64]">Bakery Identity</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
                Shop Brand Name
              </label>
              <input
                type="text"
                required
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
                Brand Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
              Top Announcement Banner Message
            </label>
            <input
              type="text"
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
            />
          </div>
        </div>

        {/* Contact & Hours */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FDE8EC] shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#8A5A64]">Contact &amp; Storefront Details</h3>

          <div>
            <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
              Storefront Street Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
                WhatsApp Digits
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-4 py-2 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
                Weekday Hours
              </label>
              <input
                type="text"
                value={openingHoursWeekdays}
                onChange={(e) => setOpeningHoursWeekdays(e.target.value)}
                className="w-full px-4 py-2 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
                Weekend Hours
              </label>
              <input
                type="text"
                value={openingHoursWeekends}
                onChange={(e) => setOpeningHoursWeekends(e.target.value)}
                className="w-full px-4 py-2 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Delivery Rates */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FDE8EC] shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#8A5A64]">Delivery Pricing Rules</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
                Standard Chilled Delivery Fee (₹)
              </label>
              <input
                type="number"
                value={standardFee}
                onChange={(e) => setStandardFee(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
                Free Delivery Cart Threshold (₹)
              </label>
              <input
                type="number"
                value={freeDeliveryAbove}
                onChange={(e) => setFreeDeliveryAbove(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Hero & Special Offer Promo */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FDE8EC] shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#8A5A64]">Homepage Special Offer Promo</h3>

          <div>
            <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
              Today's Special Title
            </label>
            <input
              type="text"
              value={specialTitle}
              onChange={(e) => setSpecialTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
                Original Price (₹)
              </label>
              <input
                type="number"
                value={specialOriginalPrice}
                onChange={(e) => setSpecialOriginalPrice(e.target.value)}
                className="w-full px-4 py-2 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
                Discounted Promo Price (₹)
              </label>
              <input
                type="number"
                value={specialDiscountedPrice}
                onChange={(e) => setSpecialDiscountedPrice(e.target.value)}
                className="w-full px-4 py-2 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#894C5C] text-white hover:bg-[#733949] px-8 py-3 rounded-full text-xs font-bold transition-all shadow-md"
          >
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>

      </form>

    </div>
  );
};

export default AdminSettings;
