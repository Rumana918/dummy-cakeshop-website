import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export const Profile = () => {
  const { user, updateUser } = useAuth();

  // Profile Details State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);

  // Address Modal/Form State
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [label, setLabel] = useState('Home');
  const [recipientName, setRecipientName] = useState(user?.name || '');
  const [addrPhone, setAddrPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Bloom City');
  const [state, setState] = useState('Maharashtra');
  const [zipCode, setZipCode] = useState('400001');
  const [isDefault, setIsDefault] = useState(false);

  // Update Profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await authAPI.updateProfile({ name, phone, avatar });
      updateUser(res.data.user);
      toast.success('Profile details updated successfully! ✨');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setChangingPass(true);
    try {
      await authAPI.changePassword({ currentPassword, newPassword });
      toast.success('Password changed successfully! 🔒');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setChangingPass(false);
    }
  };

  // Add Address
  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await authAPI.addAddress({
        label,
        recipientName,
        phone: addrPhone,
        street,
        city,
        state,
        zipCode,
        isDefault
      });
      setAddresses(res.data.addresses);
      updateUser({ ...user, addresses: res.data.addresses });
      toast.success('New delivery address added!');
      setShowAddAddress(false);
      setStreet('');
    } catch (err) {
      toast.error(err.message || 'Failed to save address');
    }
  };

  // Delete Address
  const handleDeleteAddress = async (id) => {
    try {
      const res = await authAPI.deleteAddress(id);
      setAddresses(res.data.addresses);
      updateUser({ ...user, addresses: res.data.addresses });
      toast('Address removed');
    } catch (err) {
      toast.error(err.message || 'Failed to delete address');
    }
  };

  // Set Default Address
  const handleSetDefault = async (id) => {
    try {
      const res = await authAPI.setDefaultAddress(id);
      setAddresses(res.data.addresses);
      updateUser({ ...user, addresses: res.data.addresses });
      toast.success('Default address updated');
    } catch (err) {
      toast.error(err.message || 'Failed to update default address');
    }
  };

  return (
    <div className="w-full bg-[#FFF9F3] py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-8">
          <span className="text-[#894C5C] font-semibold text-xs uppercase tracking-widest">
            Account Management
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#8A5A64] font-bold mt-1">
            My Sweet Profile
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Personal Info & Password */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* 1. Personal Details Form */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FDE8EC] shadow-sm">
              <h2 className="font-serif text-xl font-bold text-[#8A5A64] mb-6">
                Personal Information
              </h2>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1.5">
                    Email Address (Read-only)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-4 py-2.5 bg-[#FDE8EC]/50 border border-[#FDE8EC] rounded-xl text-sm text-[#8E7D7D] cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1.5">
                    Primary Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="bg-[#894C5C] text-white hover:bg-[#733949] px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm"
                >
                  {savingProfile ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>

            {/* 2. Change Password Form */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FDE8EC] shadow-sm">
              <h2 className="font-serif text-xl font-bold text-[#8A5A64] mb-6">
                Change Password
              </h2>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1.5">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1.5">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={changingPass}
                  className="bg-[#894C5C] text-white hover:bg-[#733949] px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm"
                >
                  {changingPass ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>

          </div>

          {/* Right Column: Saved Delivery Addresses */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#FDE8EC] shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-xl font-bold text-[#8A5A64]">
                Saved Addresses
              </h2>
              <button
                type="button"
                onClick={() => setShowAddAddress(!showAddAddress)}
                className="bg-[#FDE8EC] text-[#8A5A64] hover:bg-[#F4A7B9] hover:text-[#733949] px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {showAddAddress ? 'close' : 'add'}
                </span>
                <span>{showAddAddress ? 'Cancel' : 'Add New'}</span>
              </button>
            </div>

            {/* Add Address Form Accordion */}
            {showAddAddress && (
              <form onSubmit={handleAddAddress} className="p-5 bg-[#FFF9F3] rounded-2xl border border-[#FDE8EC] mb-6 space-y-3">
                <h4 className="font-bold text-xs text-[#8A5A64] uppercase tracking-wider">
                  New Delivery Address
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#8E7D7D] mb-1">Address Label</label>
                    <select
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B]"
                    >
                      <option value="Home">Home</option>
                      <option value="Office">Office</option>
                      <option value="Celebration Venue">Celebration Venue</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#8E7D7D] mb-1">Recipient Name</label>
                    <input
                      type="text"
                      required
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-[#8E7D7D] mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={addrPhone}
                    onChange={(e) => setAddrPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#8E7D7D] mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="House/Flat number, Street name"
                    className="w-full px-3 py-2 bg-white border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full px-3 py-2 bg-white border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B]"
                  />
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State"
                    className="w-full px-3 py-2 bg-white border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B]"
                  />
                  <input
                    type="text"
                    required
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="Zip"
                    className="w-full px-3 py-2 bg-white border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-[#6B5B5B]">
                    <input
                      type="checkbox"
                      checked={isDefault}
                      onChange={(e) => setIsDefault(e.target.checked)}
                      className="accent-[#894C5C]"
                    />
                    <span>Set as default</span>
                  </label>

                  <button
                    type="submit"
                    className="bg-[#894C5C] text-white px-5 py-2 rounded-full text-xs font-bold shadow-sm"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}

            {/* Address Cards List */}
            <div className="space-y-4">
              {addresses.length > 0 ? (
                addresses.map((addr) => (
                  <div
                    key={addr._id}
                    className={`p-5 rounded-2xl border transition-all ${
                      addr.isDefault
                        ? 'border-[#894C5C] bg-[#FFF9F3]'
                        : 'border-[#FDE8EC] bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#8A5A64] bg-[#FDE8EC] px-2.5 py-0.5 rounded-full">
                          {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] bg-[#FFE9A8] text-[#71612E] px-2 py-0.5 rounded-full font-bold">
                            Default Address
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {!addr.isDefault && (
                          <button
                            type="button"
                            onClick={() => handleSetDefault(addr._id)}
                            className="text-xs text-[#894C5C] hover:underline"
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(addr._id)}
                          className="text-[#8E7D7D] hover:text-red-500"
                          title="Delete address"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>

                    <p className="font-semibold text-sm text-[#6B5B5B]">{addr.recipientName}</p>
                    <p className="text-xs text-[#8E7D7D] mt-1 leading-relaxed">
                      {addr.street}, {addr.city}, {addr.state} - {addr.zipCode}
                    </p>
                    <p className="text-xs text-[#8E7D7D] mt-1">📞 {addr.phone}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-xs text-[#8E7D7D]">
                  No delivery addresses saved yet. Click "Add New" to save one!
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;
