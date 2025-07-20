const otpMap = new Map(); // Use Redis for production

export const generateOtp = (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpMap.set(email, { otp, expires: Date.now() + 10 * 60 * 1000 });
  return otp;
};

export const verifyOtp = (email, otp) => {
  const record = otpMap.get(email);
  if (!record) return false;
  if (record.otp !== otp) return false;
  if (Date.now() > record.expires) {
    otpMap.delete(email);
    return false;
  }
  otpMap.delete(email); // Delete after use
  return true;
};
