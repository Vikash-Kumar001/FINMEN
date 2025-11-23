import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // Validate email configuration
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      console.error("❌ Email configuration missing: MAIL_USER or MAIL_PASS not set");
      throw new Error("Email service not configured");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      // Add connection timeout
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    // Verify connection before sending
    await transporter.verify();

    const mailOptions = {
      from: `"Wise Student" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text: text || html?.replace(/<[^>]*>/g, ''), // Fallback to plain text from HTML
      html, // Added HTML support for better email formatting
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("📩 Email sent to", to, "Message ID:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ Email send error:", err.message);
    console.error("Full error:", err);
    throw new Error(`Failed to send email: ${err.message}`);
  }
};

// Keep the old function name for backward compatibility
export const sendMail = sendEmail;