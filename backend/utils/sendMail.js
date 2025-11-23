import nodemailer from "nodemailer";
import axios from "axios";

// Retry function for email sending with better error handling
const retryEmailSend = async (transporter, mailOptions, maxRetries = 2, delay = 2000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const info = await transporter.sendMail(mailOptions);
      return info;
    } catch (err) {
      const isLastAttempt = attempt === maxRetries;
      const isTimeoutError = err?.code === 'ETIMEDOUT' || err?.message?.includes('timeout');
      const isConnectionError = err?.code === 'ECONNREFUSED' || err?.code === 'ECONNRESET';
      
      if (isLastAttempt) {
        throw err;
      }
      
      if (isTimeoutError || isConnectionError) {
        const errorType = isConnectionError ? 'connection failed' : 'timed out';
        console.log(`⏳ Email send attempt ${attempt} ${errorType}, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        // Increase delay for next retry (exponential backoff)
        delay *= 1.5;
      } else {
        // For non-timeout/connection errors, throw immediately
        throw err;
      }
    }
  }
};

// Helper function to create transporter with specific port
const createTransporter = (port, host) => {
  const useSecure = port === 465;
  return nodemailer.createTransport({
    host: host,
    port: port,
    secure: useSecure, // true for 465 (SSL), false for 587 (TLS)
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    // Reduced timeouts - if connection doesn't establish quickly, it's likely blocked
    connectionTimeout: 15000, // 15 seconds (faster failure detection)
    greetingTimeout: 15000,
    socketTimeout: 30000, // 30 seconds for actual sending
    // Additional options for better reliability
    tls: {
      // Don't reject unauthorized certificates (useful for some network configurations)
      rejectUnauthorized: false,
      // Enable STARTTLS for port 587
      ciphers: 'SSLv3',
    },
    // Require TLS for port 587
    requireTLS: !useSecure,
    // Disable pooling to avoid connection issues
    pool: false,
    // Add debug logging in development
    debug: process.env.NODE_ENV === 'development',
    logger: process.env.NODE_ENV === 'development',
  });
};

// Send email using Resend API (HTTP-based, works on cloud platforms)
const sendEmailViaResend = async ({ to, subject, text, html, from }) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY not configured');
  }

  // Format from email - Resend accepts "Name <email@domain.com>" or just "email@domain.com"
  let fromEmail = from || process.env.RESEND_FROM_EMAIL;
  
  // If no from email is set, try to use MAIL_USER or default to Resend's test domain
  if (!fromEmail) {
    if (process.env.MAIL_USER) {
      fromEmail = `"Wise Student" <${process.env.MAIL_USER}>`;
    } else {
      fromEmail = 'onboarding@resend.dev'; // Resend's default test domain
    }
  }
  
  // Ensure from email is in correct format
  if (!fromEmail.includes('<') && fromEmail.includes('@')) {
    fromEmail = `"Wise Student" <${fromEmail}>`;
  }
  
  try {
    const response = await axios.post(
      'https://api.resend.com/emails',
      {
        from: fromEmail,
        to: Array.isArray(to) ? to : [to],
        subject,
        html: html || text,
        text: text || html?.replace(/<[^>]*>/g, ''),
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      }
    );

    console.log(`✅ Email sent via Resend to ${to}, ID: ${response.data.id}`);
    return { messageId: response.data.id, response: response.data };
  } catch (error) {
    console.error('❌ Resend API error:', error.response?.data || error.message);
    throw new Error(`Resend API error: ${error.response?.data?.message || error.message}`);
  }
};

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // Check if Resend is configured (preferred for cloud platforms)
    if (process.env.RESEND_API_KEY) {
      console.log(`📧 Using Resend API for email delivery`);
      const from = process.env.MAIL_USER ? `"Wise Student" <${process.env.MAIL_USER}>` : undefined;
      return await sendEmailViaResend({ to, subject, text, html, from });
    }

    // Fallback to SMTP if Resend is not configured
    // Validate email configuration
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      const missingVars = [];
      if (!process.env.MAIL_USER) missingVars.push("MAIL_USER");
      if (!process.env.MAIL_PASS) missingVars.push("MAIL_PASS");
      console.error(`❌ Email configuration missing: ${missingVars.join(", ")} not set`);
      console.error(`❌ Environment check - NODE_ENV: ${process.env.NODE_ENV}`);
      console.error(`💡 Tip: Consider using Resend API (set RESEND_API_KEY) for better cloud platform compatibility`);
      throw new Error(`Email service not configured: ${missingVars.join(", ")} environment variables are missing. Consider using Resend API instead.`);
    }
    
    // Log email configuration status (without exposing password)
    console.log(`📧 Using SMTP for email delivery - User: ${process.env.MAIL_USER}, Password: ${process.env.MAIL_PASS ? '***' : 'NOT SET'}`);

    // Use explicit SMTP configuration for better reliability in production
    // Render.com often blocks port 587, so we try 465 (SSL) first, then fallback to 587
    // Port 465 with SSL is more likely to work on cloud platforms
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const configuredPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : null;
    
    // Try ports in order: configured port -> 465 -> 587
    const portsToTry = configuredPort ? [configuredPort] : [465, 587];
    
    const mailOptions = {
      from: `"Wise Student" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text: text || html?.replace(/<[^>]*>/g, ''), // Fallback to plain text from HTML
      html, // Added HTML support for better email formatting
    };

    console.log(`📧 Attempting to send email to ${to} with subject: ${subject}`);
    const startTime = Date.now();
    
    // Try each port until one works
    let lastError = null;
    for (const port of portsToTry) {
      try {
        const useSecure = port === 465;
        console.log(`📧 Trying SMTP connection: ${smtpHost}:${port} (secure: ${useSecure})`);
        
        const transporter = createTransporter(port, smtpHost);
        const info = await retryEmailSend(transporter, mailOptions);
        
        const duration = Date.now() - startTime;
        console.log(`✅ Email sent successfully to ${to} via port ${port}`);
        console.log(`📩 Message ID: ${info.messageId}`);
        console.log(`⏱️ Email send duration: ${duration}ms`);
        console.log(`📧 Response: ${JSON.stringify(info.response || 'N/A')}`);
        
        return info;
      } catch (err) {
        lastError = err;
        const isConnectionError = err?.code === 'ETIMEDOUT' || err?.code === 'ECONNREFUSED' || err?.code === 'ECONNRESET';
        
        if (isConnectionError && portsToTry.indexOf(port) < portsToTry.length - 1) {
          // If connection failed and there are more ports to try, continue
          console.warn(`⚠️ Port ${port} failed, trying next port...`);
          continue;
        } else {
          // If this is the last port or it's not a connection error, throw
          throw err;
        }
      }
    }
    
    // If we get here, all ports failed
    throw lastError || new Error('All SMTP ports failed');
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
    if (errorCode === 'ETIMEDOUT' || errorCode === 'ECONNREFUSED' || errorCode === 'ECONNRESET' || errorMessage.includes('timeout')) {
      const isProduction = process.env.NODE_ENV === 'production';
      const resendTip = `💡 SOLUTION: Use Resend API instead of SMTP. Set RESEND_API_KEY in environment variables. Get free API key at https://resend.com/api-keys`;
      const errorMsg = isProduction 
        ? `SMTP connection failed. Render.com blocks SMTP connections. ${resendTip}`
        : `Email service connection timeout. Please check your network connection and SMTP settings. ${resendTip}`;
      console.error(resendTip);
      throw new Error(errorMsg);
    } else if (errorCode === 'EAUTH') {
      throw new Error(`Email authentication failed. Please check your MAIL_USER and MAIL_PASS credentials. Ensure you're using a Gmail App Password, not your regular password.`);
    } else {
      throw new Error(`Failed to send email: ${errorMessage}`);
    }
  }
};

// Keep the old function name for backward compatibility
export const sendMail = sendEmail;