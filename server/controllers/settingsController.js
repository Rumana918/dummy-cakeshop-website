import Settings from '../models/Settings.js';

// @desc    Get website settings & shop details
// @route   GET /api/settings
export const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json({ success: true, settings });
  } catch (error) {
    next(error);
  }
};

// @desc    Update website settings (Admin)
// @route   PUT /api/settings
export const updateSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    const {
      shopName,
      tagline,
      logoUrl,
      heroBanner,
      contact,
      delivery,
      socialLinks,
      announcement
    } = req.body;

    if (shopName) settings.shopName = shopName;
    if (tagline) settings.tagline = tagline;
    if (logoUrl) settings.logoUrl = logoUrl;
    if (heroBanner) settings.heroBanner = { ...settings.heroBanner, ...heroBanner };
    if (contact) settings.contact = { ...settings.contact, ...contact };
    if (delivery) settings.delivery = { ...settings.delivery, ...delivery };
    if (socialLinks) settings.socialLinks = { ...settings.socialLinks, ...socialLinks };
    if (announcement !== undefined) settings.announcement = announcement;

    const updated = await settings.save();
    res.json({ success: true, settings: updated });
  } catch (error) {
    next(error);
  }
};
