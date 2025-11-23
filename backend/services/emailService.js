import nodemailer from 'nodemailer';

// Use explicit SMTP configuration for better reliability in production
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
  // Increased timeouts for production environments
  connectionTimeout: 30000, // 30 seconds
  greetingTimeout: 30000,
  socketTimeout: 30000,
  tls: {
    rejectUnauthorized: false,
  },
  pool: false,
});

export const sendOtpEmail = async (to, otp) => {
  const info = await transporter.sendMail({
    from: `"FinMen" <${process.env.MAIL_USER}>`,
    to,
    subject: 'Your FinMen OTP Code',
    html: `<p>Your OTP code is <b>${otp}</b>. It is valid for 10 minutes.</p>`,
  });
  return info;
};
