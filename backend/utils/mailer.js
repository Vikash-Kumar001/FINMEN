import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendApprovalEmail = async (toEmail, name) => {
  await transporter.sendMail({
    from: `"FINMEN Team" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: "Educator Account Approved",
    html: `<p>Hi ${name},</p><p>Your educator account has been approved. You can now log in and start using the educator dashboard.</p><p>– The FINMEN Team</p>`,
  });
};
