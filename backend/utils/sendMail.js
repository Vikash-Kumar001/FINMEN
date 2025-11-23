import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // Validate email configuration
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      const missingVars = [];
      if (!process.env.MAIL_USER) missingVars.push("MAIL_USER");
      if (!process.env.MAIL_PASS) missingVars.push("MAIL_PASS");
      console.error(`❌ Email configuration missing: ${missingVars.join(", ")} not set`);
      throw new Error(`Email service not configured: ${missingVars.join(", ")} environment variables are missing`);
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
    try {
      await transporter.verify();
    } catch (verifyErr) {
      console.error("❌ Email transporter verification failed:", verifyErr.message);
      throw new Error(`Email service verification failed: ${verifyErr.message}`);
    }

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
    const errorMessage = err?.message || "Unknown error";
    console.error("❌ Email send error:", errorMessage);
    console.error("Full error details:", {
      message: err?.message,
      code: err?.code,
      response: err?.response,
      responseCode: err?.responseCode,
      command: err?.command,
      stack: err?.stack
    });
    throw new Error(`Failed to send email: ${errorMessage}`);
  }
};

// Keep the old function name for backward compatibility
export const sendMail = sendEmail;