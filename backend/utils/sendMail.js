import nodemailer from "nodemailer";

// Retry function for email sending
const retryEmailSend = async (transporter, mailOptions, maxRetries = 3, delay = 2000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const info = await transporter.sendMail(mailOptions);
      return info;
    } catch (err) {
      const isLastAttempt = attempt === maxRetries;
      const isTimeoutError = err?.code === 'ETIMEDOUT' || err?.message?.includes('timeout');
      
      if (isLastAttempt) {
        throw err;
      }
      
      if (isTimeoutError) {
        console.log(`⏳ Email send attempt ${attempt} timed out, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        // Increase delay for next retry (exponential backoff)
        delay *= 1.5;
      } else {
        // For non-timeout errors, throw immediately
        throw err;
      }
    }
  }
};

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

    // Use explicit SMTP configuration for better reliability in production
    // This works better than using service: "gmail" on platforms like Render
    const smtpPort = parseInt(process.env.SMTP_PORT || "587");
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      // Increased timeouts for production environments (Render.com needs more time)
      connectionTimeout: 30000, // 30 seconds
      greetingTimeout: 30000,
      socketTimeout: 30000,
      // Additional options for better reliability
      tls: {
        // Don't reject unauthorized certificates (useful for some network configurations)
        rejectUnauthorized: false,
      },
      // Disable pooling for now to avoid connection issues
      // Pool connections can sometimes cause issues on cloud platforms
      pool: false,
    });

    // Skip verification in production to avoid extra connection overhead
    // Verification adds an extra connection attempt which can timeout
    // We'll rely on the actual sendMail to verify the connection works

    const mailOptions = {
      from: `"Wise Student" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text: text || html?.replace(/<[^>]*>/g, ''), // Fallback to plain text from HTML
      html, // Added HTML support for better email formatting
    };

    // Use retry logic for sending email
    const info = await retryEmailSend(transporter, mailOptions);
    console.log("📩 Email sent to", to, "Message ID:", info.messageId);
    return info;
  } catch (err) {
    const errorMessage = err?.message || "Unknown error";
    const errorCode = err?.code || "UNKNOWN";
    
    console.error("❌ Email send error:", errorMessage);
    console.error("Full error details:", {
      message: err?.message,
      code: err?.code,
      response: err?.response,
      responseCode: err?.responseCode,
      command: err?.command,
      stack: err?.stack
    });
    
    // Provide more specific error messages
    if (errorCode === 'ETIMEDOUT' || errorMessage.includes('timeout')) {
      throw new Error(`Email service connection timeout. Please check your network connection and SMTP settings.`);
    } else if (errorCode === 'EAUTH') {
      throw new Error(`Email authentication failed. Please check your MAIL_USER and MAIL_PASS credentials.`);
    } else {
      throw new Error(`Failed to send email: ${errorMessage}`);
    }
  }
};

// Keep the old function name for backward compatibility
export const sendMail = sendEmail;