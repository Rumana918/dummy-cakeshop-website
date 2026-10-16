import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  shopName: {
    type: String,
    default: 'Sweet Whisk'
  },
  tagline: {
    type: String,
    default: 'Artisanal Bakery & Patisserie'
  },
  logoUrl: {
    type: String,
    default: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2tF1YpvT9zih0-5StXLRF-P413DlxukJ7BfnahPwAWITkYtg8dKf75TYjUIgft_LfYuwG2kD1kLj0BwQde3ZxXFNStOI31TnwjwVRyeXbNHmRTBMBQiEqrKxFBY4L37E1N1osFy13Kqwap5Yz1w6M68mxKPUhx63kHbZJKvPOqDLl_j-Q9sDHEZzAYCqFTWHP3rq0e7s19oOdcnFvbMpMo5AjfxPcjBzP5JHgM7lfV35G-hu-L5gT'
  },
  heroBanner: {
    badge: { type: String, default: 'Artisanal Bakery & Patisserie' },
    title: { type: String, default: 'Handcrafted with Love & Sweetness' },
    subtitle: { type: String, default: 'Experience the pure bliss of organic ingredients, traditional French techniques, and a modern artisanal touch in every single bite. Baked fresh daily for your sweetest moments.' },
    imageUrl: { type: String, default: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVpULMsjNNStgGGl9ON5NQfN_H6uurOrBYeVKbSaWwSjWiGYY5BV5a6R2l3u_fdoNRmnEUcMqI6LSDzO9dgHP_-i0d23eRl1QEBApjWki7DkGCNsKdCUUDGCBPLdd6s_iXFbfYZ9T4jysgnlEPVpyfR6JAtxUTe9gZSD7qljPxVVV4bOzC2fjUh4PQgk5Olx-21zGtrM-I51CZ0mIPpKf-J-IIT8D-PkSmnJ76GKBJB76DJM69jfpw' },
    specialTitle: { type: String, default: 'Matcha White Chocolate Croissant & Rose Latte Combo' },
    specialOriginalPrice: { type: Number, default: 999 },
    specialDiscountedPrice: { type: Number, default: 749 }
  },
  contact: {
    address: { type: String, default: '123 Pastry Lane, Sugarloaf District, Bloom City' },
    email: { type: String, default: 'hello@sweetwhisk.com' },
    phone: { type: String, default: '+91 98765 43210' },
    whatsapp: { type: String, default: '919876543210' },
    openingHoursWeekdays: { type: String, default: 'Mon - Fri: 7:00 AM - 7:00 PM' },
    openingHoursWeekends: { type: String, default: 'Sat - Sun: 8:00 AM - 6:00 PM' },
    googleMapsEmbed: { type: String, default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.56206308527!2d77.2090212!3d28.6139391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM2JzUwLjIiTiA3N8KwMTInMzIuNSJF!5e0!3m2!1sen!2sin!4v1620000000000' }
  },
  delivery: {
    standardFee: { type: Number, default: 50 },
    freeDeliveryAbove: { type: Number, default: 999 },
    slots: {
      type: [String],
      default: [
        'Morning (9:00 AM - 12:00 PM)',
        'Afternoon (1:00 PM - 4:00 PM)',
        'Evening (5:00 PM - 8:00 PM)',
        'Express Delivery (within 2 hours)'
      ]
    }
  },
  socialLinks: {
    instagram: { type: String, default: 'https://instagram.com/sweetwhisk' },
    facebook: { type: String, default: 'https://facebook.com/sweetwhisk' },
    pinterest: { type: String, default: 'https://pinterest.com/sweetwhisk' }
  },
  announcement: {
    type: String,
    default: '✨ Free delivery on all orders above ₹999! Fresh morning bakes dispatched from 8 AM.'
  }
}, {
  timestamps: true
});

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
