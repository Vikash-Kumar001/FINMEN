// services/emailService.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

exports.sendOtpEmail = async (to, otp) => {
  const info = await transporter.sendMail({
    from: `"FinMen" <${process.env.MAIL_USER}>`,
    to,
    subject: "Your FinMen OTP Code",
    html: `<p>Your OTP code is <b>${otp}</b>. It is valid for 10 minutes.</p>`,
  });
  return info;
};
