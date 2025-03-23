import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASSWORD } from "../config/env.js";

// Create email transporter with authentication information
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
  secure: true, // Use SSL/TLS
});

/**
 * Creates an email template for product expiration notifications
 */
const createExpirationEmailTemplate = (
  product,
  daysRemaining,
  expirationDate
) => {
  return {
    subject: `Syntara Product Expiration Alert - ${product.productName} expires in ${daysRemaining} days`,
    html: `
      <h1>Syntara Product Expiration Notification</h1>
      <p>This is an important notification regarding your product subscription.</p>
      
      <h2>Product Details:</h2>
      <ul>
      <li><strong>Client:</strong> ${product.clientName}</li>
      <li><strong>Product Name:</strong> ${product.productName}</li>
      <li><strong>Deployment Date:</strong> ${new Date(
        product.productAddedDate
      ).toLocaleDateString()}</li>
      <li><strong>Expiration Date:</strong> ${new Date(
        expirationDate
      ).toLocaleDateString()}</li>
      <li><strong>Days Remaining:</strong> ${daysRemaining}</li>
      </ul>

      <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
        <p><strong>Action Required:</strong> Please renew your subscription to ensure uninterrupted service.</p>
      </div>
    `,
  };
};

/**
 * Sends an expiration notification to administrators
 * @param {Array} admins - List of administrators to notify
 * @param {Object} product - Expiring product details
 * @param {Number} daysRemaining - Number of days remaining before expiration
 * @param {Date} expirationDate - Expiration date
 * @returns {Promise} - Email sending promise
 */
const sendExpirationNotification = async (
  admins,
  product,
  daysRemaining,
  expirationDate
) => {
  try {
    if (!Array.isArray(admins) || admins.length === 0) {
      throw new Error("No administrators specified for notification");
    }

    const { subject, html } = createExpirationEmailTemplate(
      product,
      daysRemaining,
      expirationDate
    );

    const mailOptions = {
      from: EMAIL_USER,
      to: admins.map((admin) => admin.email).join(","),
      subject,
      html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Expiration notification sent for ${product.productName}`);
    return result;
  } catch (error) {
    console.error(`Error sending expiration notification:`, error.message);
    throw error;
  }
};

export { sendExpirationNotification };
