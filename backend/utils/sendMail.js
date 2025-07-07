import nodemailer from "nodemailer";

export const sendMail = async ({ to, subject, text }) => {
  try {
    const transporter = nodemailer.createTransport({
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
    };

    await transporter.sendMail(mailOptions);
    console.log("📩 Email sent to", to);
  } catch (err) {
    console.error("❌ Email send error:", err.message);
    throw new Error("Failed to send email");
  }
};
