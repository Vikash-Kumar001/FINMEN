import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Finmen Support" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text,
      html, // Added HTML support for better email formatting
    };

    await transporter.sendMail(mailOptions);
    console.log("📩 Email sent to", to);
  } catch (err) {
    console.error("❌ Email send error:", err.message);
    throw new Error("Failed to send email");
  }
};

// Keep the old function name for backward compatibility
export const sendMail = sendEmail;