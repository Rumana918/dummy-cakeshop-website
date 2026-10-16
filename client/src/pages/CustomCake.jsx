import React, { useState } from 'react';
import { customCakeAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const CustomCake = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [successRequest, setSuccessRequest] = useState(null);

  // Form Fields
  const [occasion, setOccasion] = useState('Birthday');
  const [size, setSize] = useState('1 kg (6-8 servings)');
  const [flavor, setFlavor] = useState('Pistachio Raspberry Bloom');
  const [isEggless, setIsEggless] = useState(true);
  const [designDescription, setDesignDescription] = useState('');
  const [referenceFiles, setReferenceFiles] = useState([]);
  const [referenceUrl, setReferenceUrl] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(() => {
    // 3 days in advance minimum for custom cake
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 3);
    return minDate.toISOString().split('T')[0];
  });
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState('Morning (10:00 AM - 1:00 PM)');
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const occasionsList = [
    { name: 'Birthday', icon: 'cake' },
    { name: 'Wedding', icon: 'favorite' },
    { name: 'Anniversary', icon: 'celebration' },
    { name: 'Baby Shower', icon: 'child_care' },
    { name: 'Corporate & Milestone', icon: 'apartment' },
    { name: 'Other Celebration', icon: 'party_mode' }
  ];

  const sizesList = [
    '1 kg (6-8 servings)',
    '1.5 kg (10-12 servings)',
    '2 kg (14-18 servings)',
    '3 kg (2-tier, 25-30 servings)',
    '5+ kg (Multi-tier wedding centerpiece)'
  ];

  const flavorsList = [
    'Pistachio Raspberry Bloom',
    'Belgian Dark Chocolate Ganache Truffle',
    'Tahitian Vanilla Bean & Strawberries',
    'Classic Red Velvet Cream Cheese',
    'Lavender Wild Honey & Blueberries',
    'Lotus Biscoff Salted Caramel',
    'Ceremonial Matcha White Chocolate'
  ];

  const handleFileChange = (e) => {
    if (e.target.files) {
      setReferenceFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerName || !email || !phone || !designDescription || !deliveryDate) {
      toast.error('Please complete all contact and date details');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('customerName', customerName);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('occasion', occasion);
      formData.append('size', size);
      formData.append('flavor', `${flavor} ${isEggless ? '(Eggless)' : ''}`);
      formData.append('designDescription', designDescription);
      formData.append('deliveryDate', deliveryDate);
      formData.append('deliveryTimeSlot', deliveryTimeSlot);

      if (referenceUrl) {
        formData.append('referenceImages', referenceUrl);
      }

      referenceFiles.forEach((file) => {
        formData.append('referenceImages', file);
      });

      const res = await customCakeAPI.create(formData);
      setSuccessRequest(res.data.customRequest);
      toast.success('Custom cake inquiry submitted successfully! 🎂');
    } catch (err) {
      toast.error(err.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#FFF9F3] py-12 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[#894C5C] font-semibold text-xs uppercase tracking-widest">
            Bespoke Patisserie Studio
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#8A5A64] font-medium mt-1">
            Design Your Custom Dream Cake
          </h1>
          <p className="text-sm text-[#8E7D7D] mt-2">
            Share your theme, preferred flavors, and reference photos. Our pastry artists will tailor an estimate and custom blueprint for your event.
          </p>
        </div>

        {successRequest ? (
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#FDE8EC] shadow-md text-center max-w-xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-[#DFF3E8] text-[#3E4F48] flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[40px]">check_circle</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#8A5A64] mb-2">
              Inquiry Dispatched to Chef!
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5B5B] leading-relaxed mb-6">
              Thank you, <strong>{successRequest.customerName}</strong>. Our head pastry chef is reviewing your <strong>{successRequest.occasion}</strong> design. We will send a formal quote and mockup confirmation to <strong>{successRequest.email}</strong> within 12 hours.
            </p>

            <div className="p-4 bg-[#FFF9F3] rounded-2xl border border-[#FDE8EC] text-xs text-[#8A5A64] text-left mb-6 space-y-1">
              <p><strong>Occasion:</strong> {successRequest.occasion}</p>
              <p><strong>Flavor &amp; Size:</strong> {successRequest.flavor} • {successRequest.size}</p>
              <p><strong>Desired Date:</strong> {successRequest.deliveryDate} ({successRequest.deliveryTimeSlot})</p>
              <p><strong>Status:</strong> Under Chef Review (Quote Pending)</p>
            </div>

            <button
              onClick={() => {
                setSuccessRequest(null);
                setStep(1);
                setDesignDescription('');
              }}
              className="bg-[#894C5C] text-white hover:bg-[#733949] px-8 py-3 rounded-full text-xs font-bold transition-all shadow-sm"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#FDE8EC] shadow-sm">
            
            {/* Step Progress Indicators */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#FDE8EC]">
              {[
                { s: 1, label: 'Occasion & Size' },
                { s: 2, label: 'Flavors & Recipe' },
                { s: 3, label: 'Design & Visuals' },
                { s: 4, label: 'Delivery & Contact' }
              ].map((item) => (
                <div
                  key={item.s}
                  onClick={() => item.s < step && setStep(item.s)}
                  className={`flex items-center gap-2 ${item.s < step ? 'cursor-pointer' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step === item.s
                        ? 'bg-[#894C5C] text-white shadow-sm'
                        : step > item.s
                        ? 'bg-[#DFF3E8] text-[#3E4F48]'
                        : 'bg-[#FFF9F3] text-[#8E7D7D] border border-[#FDE8EC]'
                    }`}
                  >
                    {step > item.s ? '✓' : item.s}
                  </div>
                  <span className={`text-xs hidden md:inline font-semibold ${step === item.s ? 'text-[#8A5A64]' : 'text-[#8E7D7D]'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              
              {/* STEP 1: Occasion & Size */}
              {step === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-3">
                      1. What celebration are we baking for?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {occasionsList.map((occ) => (
                        <button
                          key={occ.name}
                          type="button"
                          onClick={() => setOccasion(occ.name)}
                          className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                            occasion === occ.name
                              ? 'border-[#894C5C] bg-[#FFF9F3] text-[#894C5C] shadow-sm'
                              : 'border-[#FDE8EC] hover:border-[#F4A7B9] text-[#6B5B5B]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[24px] text-[#894C5C]">{occ.icon}</span>
                          <span className="text-xs font-bold">{occ.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-2.5">
                      2. Estimated Cake Weight &amp; Servings
                    </label>
                    <div className="space-y-2">
                      {sizesList.map((sz) => (
                        <label
                          key={sz}
                          className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                            size === sz
                              ? 'border-[#894C5C] bg-[#FFF9F3]'
                              : 'border-[#FDE8EC] hover:border-[#F4A7B9]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="size"
                            checked={size === sz}
                            onChange={() => setSize(sz)}
                            className="accent-[#894C5C]"
                          />
                          <span className="text-xs sm:text-sm font-semibold text-[#6B5B5B]">{sz}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="bg-[#894C5C] text-white hover:bg-[#733949] px-7 py-3 rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-2"
                    >
                      <span>Next: Flavors &amp; Diet</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Flavors & Diet */}
              {step === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-3">
                      Select Base Sponge &amp; Filling Flavor
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {flavorsList.map((flv) => (
                        <button
                          key={flv}
                          type="button"
                          onClick={() => setFlavor(flv)}
                          className={`p-3.5 rounded-2xl border text-left text-xs font-semibold transition-all ${
                            flavor === flv
                              ? 'border-[#894C5C] bg-[#FFF9F3] text-[#894C5C] shadow-sm'
                              : 'border-[#FDE8EC] hover:border-[#F4A7B9] text-[#6B5B5B]'
                          }`}
                        >
                          {flv}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-[#FFF9F3] rounded-2xl border border-[#FDE8EC]">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isEggless}
                        onChange={(e) => setIsEggless(e.target.checked)}
                        className="w-4 h-4 accent-[#894C5C] rounded"
                      />
                      <div>
                        <span className="text-xs font-bold text-[#3E4F48] block">
                          Bake this 100% Eggless (Vegetarian)
                        </span>
                        <span className="text-[11px] text-[#8E7D7D]">
                          We utilize cultured yogurt and organic flaxseed emulsion for an equally light, moist crumb.
                        </span>
                      </div>
                    </label>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-3 rounded-full text-xs font-semibold text-[#8E7D7D] hover:text-[#8A5A64]"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="bg-[#894C5C] text-white hover:bg-[#733949] px-7 py-3 rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-2"
                    >
                      <span>Next: Design &amp; Visuals</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Design & Visuals */}
              {step === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-2">
                      Describe Your Cake Vision &amp; Theme
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={designDescription}
                      onChange={(e) => setDesignDescription(e.target.value)}
                      placeholder="e.g. Pastel pink and ivory watercolor frosting with fresh peony flowers, subtle gold foil accents, and 'Happy 1st Birthday Maya' piped on an acrylic arch."
                      className="w-full px-4 py-3 bg-[#FFF9F3] border border-[#FDE8EC] rounded-2xl text-xs sm:text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-2">
                      Upload Reference Images (Pinterest, sketch, invitation)
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full text-xs text-[#8E7D7D] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#FFD9E0] file:text-[#733949] hover:file:bg-[#F4A7B9] cursor-pointer"
                    />
                    {referenceFiles.length > 0 && (
                      <p className="text-xs text-emerald-700 mt-2 font-medium">
                        ✓ {referenceFiles.length} file(s) attached
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1.5">
                      Or Paste Image / Pinterest URL
                    </label>
                    <input
                      type="url"
                      value={referenceUrl}
                      onChange={(e) => setReferenceUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs sm:text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-6 py-3 rounded-full text-xs font-semibold text-[#8E7D7D] hover:text-[#8A5A64]"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!designDescription.trim()) {
                          toast.error('Please describe your cake theme');
                          return;
                        }
                        setStep(4);
                      }}
                      className="bg-[#894C5C] text-white hover:bg-[#733949] px-7 py-3 rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-2"
                    >
                      <span>Next: Contact &amp; Schedule</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Delivery & Contact */}
              {step === 4 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1.5">
                        Celebration Delivery Date
                      </label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs sm:text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1.5">
                        Time Window
                      </label>
                      <select
                        value={deliveryTimeSlot}
                        onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs sm:text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                      >
                        <option value="Morning (10:00 AM - 1:00 PM)">Morning (10:00 AM - 1:00 PM)</option>
                        <option value="Afternoon (1:00 PM - 4:00 PM)">Afternoon (1:00 PM - 4:00 PM)</option>
                        <option value="Evening (5:00 PM - 8:00 PM)">Evening (5:00 PM - 8:00 PM)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <h4 className="text-xs font-bold text-[#8A5A64] uppercase tracking-wider">
                      Contact Information
                    </h4>

                    <div>
                      <label className="block text-xs text-[#8E7D7D] mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Emma Vance"
                        className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-[#8E7D7D] mb-1">Email for Quote &amp; Sketch</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="emma@example.com"
                          className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[#8E7D7D] mb-1">Phone / WhatsApp Number</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-[#FDE8EC]">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-6 py-3 rounded-full text-xs font-semibold text-[#8E7D7D] hover:text-[#8A5A64]"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-[#894C5C] text-white hover:bg-[#733949] px-8 py-3.5 rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                    >
                      {submitting ? 'Submitting to Bakery...' : 'Submit Custom Inquiry'}
                    </button>
                  </div>
                </div>
              )}

            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default CustomCake;
