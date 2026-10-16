import nodemailer from 'nodemailer';

let transporter;

const getTransporter = () => {
  if (!transporter) {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: Number(process.env.EMAIL_PORT) === 465,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    } else {
      // Development fallback
      transporter = {
        sendMail: async (mailOptions) => {
          console.log('\n--- [Nodemailer Preview / Simulation] ---');
          console.log(`To: ${mailOptions.to}`);
          console.log(`Subject: ${mailOptions.subject}`);
          console.log(`Preview: Email dispatched successfully.`);
          console.log('----------------------------------------\n');
          return { messageId: 'simulated-' + Date.now() };
        }
      };
    }
  }
  return transporter;
};

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const mailer = getTransporter();
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Sweet Whisk Bakery" <orders@sweetwhisk.com>',
      to,
      subject,
      html,
      text: text || ''
    };
    const info = await mailer.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.warn(`[Email Warning]: Failed to send email to ${to}: ${error.message}`);
    return null;
  }
};

export const sendOrderConfirmationEmail = async (order, user) => {
  const itemsHtml = order.items.map(item => `
    <tr style="border-bottom: 1px solid #fde8ec;">
      <td style="padding: 10px; font-family: 'Poppins', sans-serif;">
        <strong>${item.name}</strong><br>
        <span style="font-size: 12px; color: #6B5B5B;">Variant: ${item.weight} | Flavor: ${item.flavor}</span>
        ${item.messageOnCake ? `<br><span style="font-size: 12px; color: #8A5A64;">Message: "${item.messageOnCake}"</span>` : ''}
      </td>
      <td style="padding: 10px; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; text-align: right;">₹${item.price * item.quantity}</td>
    </tr>
  `).join('');

  const html = `
    <div style="background-color: #FFF9F3; padding: 30px; font-family: 'Poppins', Arial, sans-serif; color: #6B5B5B;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(244, 167, 185, 0.15); border: 1px solid #FDE8EC;">
        <div style="background-color: #FDE8EC; padding: 24px; text-align: center; border-bottom: 2px solid #F4A7B9;">
          <h1 style="color: #8A5A64; margin: 0; font-family: 'Playfair Display', Georgia, serif;">Sweet Whisk Patisserie</h1>
          <p style="color: #6B5B5B; margin: 6px 0 0;">Artisanal Cakes & Sweet Delights</p>
        </div>
        <div style="padding: 24px;">
          <h2 style="color: #8A5A64; font-size: 20px;">Thank You for Your Order!</h2>
          <p>Hi ${order.shippingAddress.recipientName || user.name},</p>
          <p>We are delighted to receive your order <strong>#${order.orderNumber}</strong>. Our pastry chefs are preparing everything with fresh, organic ingredients!</p>
          
          <div style="background-color: #FFF9F3; border-radius: 12px; padding: 16px; margin: 20px 0; border: 1px dashed #F4A7B9;">
            <p style="margin: 0 0 8px;"><strong>Delivery Date:</strong> ${order.deliveryDate}</p>
            <p style="margin: 0 0 8px;"><strong>Delivery Slot:</strong> ${order.deliverySlot}</p>
            <p style="margin: 0;"><strong>Delivery Address:</strong> ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.zipCode}</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <thead>
              <tr style="background-color: #FFF9F3; color: #8A5A64;">
                <th style="padding: 8px; text-align: left;">Item</th>
                <th style="padding: 8px; text-align: center;">Qty</th>
                <th style="padding: 8px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 8px; text-align: right; font-weight: bold;">Subtotal:</td>
                <td style="padding: 8px; text-align: right;">₹${order.itemsPrice}</td>
              </tr>
              ${order.discount ? `
              <tr>
                <td colspan="2" style="padding: 8px; text-align: right; color: #8A5A64;">Discount:</td>
                <td style="padding: 8px; text-align: right; color: #8A5A64;">-₹${order.discount}</td>
              </tr>` : ''}
              <tr>
                <td colspan="2" style="padding: 8px; text-align: right;">Delivery:</td>
                <td style="padding: 8px; text-align: right;">${order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</td>
              </tr>
              <tr style="border-top: 2px solid #FDE8EC; font-size: 16px; font-weight: bold; color: #8A5A64;">
                <td colspan="2" style="padding: 10px; text-align: right;">Total Paid / Due (${order.paymentMethod}):</td>
                <td style="padding: 10px; text-align: right;">₹${order.totalAmount}</td>
              </tr>
            </tfoot>
          </table>

          <div style="text-align: center; margin-top: 30px;">
            <p style="font-size: 13px; color: #847376;">Questions regarding your bake? Reply directly or WhatsApp us at +91 98765 43210.</p>
          </div>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: user.email || order.shippingAddress.phone,
    subject: `Order Confirmed #${order.orderNumber} - Sweet Whisk Bakery`,
    html
  });
};

export const sendOrderStatusEmail = async (order, customerEmail) => {
  const html = `
    <div style="background-color: #FFF9F3; padding: 30px; font-family: 'Poppins', Arial, sans-serif; color: #6B5B5B;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(244, 167, 185, 0.15); border: 1px solid #FDE8EC; padding: 24px;">
        <h2 style="color: #8A5A64;">Order #${order.orderNumber} Status Update</h2>
        <p>Dear Customer,</p>
        <p>The status of your order has been updated to:</p>
        <div style="display: inline-block; background-color: #FDE8EC; color: #8A5A64; padding: 8px 16px; border-radius: 9999px; font-weight: bold; margin: 12px 0;">
          ${order.orderStatus}
        </div>
        <p>Delivery Date: <strong>${order.deliveryDate}</strong> (${order.deliverySlot})</p>
        <p>Thank you for choosing Sweet Whisk!</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: customerEmail,
    subject: `Order #${order.orderNumber} Status: ${order.orderStatus} - Sweet Whisk`,
    html
  });
};

export const sendCustomCakeQuoteEmail = async (customRequest) => {
  const html = `
    <div style="background-color: #FFF9F3; padding: 30px; font-family: 'Poppins', Arial, sans-serif; color: #6B5B5B;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #FDE8EC;">
        <h2 style="color: #8A5A64;">Custom Cake Quote from Sweet Whisk</h2>
        <p>Hi ${customRequest.customerName},</p>
        <p>We reviewed your bespoke cake request for your <strong>${customRequest.occasion}</strong>!</p>
        <p><strong>Flavor:</strong> ${customRequest.flavor} | <strong>Size:</strong> ${customRequest.size}</p>
        <p><strong>Quote Price:</strong> <span style="font-size: 20px; color: #8A5A64; font-weight: bold;">₹${customRequest.quotePrice}</span></p>
        ${customRequest.adminNotes ? `<p><strong>Chef's Note:</strong> ${customRequest.adminNotes}</p>` : ''}
        <p>Please contact us or reply to this email to confirm your order and schedule delivery!</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: customRequest.email,
    subject: `Quote for your Custom Cake Request - Sweet Whisk`,
    html
  });
};
