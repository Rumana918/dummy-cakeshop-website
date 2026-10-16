import ContactMessage from '../models/ContactMessage.js';
import { sendEmail } from '../utils/email.js';

// @desc    Submit contact message
// @route   POST /api/contact
export const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and message' });
    }

    const contact = await ContactMessage.create({
      name,
      email,
      phone: phone || '',
      subject: subject || 'General Inquiry',
      message
    });

    // Notify shop owner via email
    sendEmail({
      to: process.env.EMAIL_FROM || 'hello@sweetwhisk.com',
      subject: `New Inquiry from ${name}: ${subject || 'Contact Us'}`,
      html: `
        <div style="font-family: 'Poppins', sans-serif; padding: 20px;">
          <h3>New Message on Sweet Whisk Website</h3>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
          <div style="background: #FFF9F3; padding: 15px; border-radius: 8px;">
            ${message}
          </div>
        </div>
      `
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been sent to our bakery team. We will get back to you shortly.',
      contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact messages (Admin)
// @route   GET /api/contact
export const getMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, count: messages.length, messages });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark contact message as read (Admin)
// @route   PATCH /api/contact/:id/read
export const markAsRead = async (req, res, next) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    message.isRead = true;
    await message.save();

    res.json({ success: true, message });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact message (Admin)
// @route   DELETE /api/contact/:id
export const deleteMessage = async (req, res, next) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    next(error);
  }
};
