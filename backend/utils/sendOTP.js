import dotenv from 'dotenv';
dotenv.config();

import { sendMail, EMAIL_USER } from './mailer.js';

export const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: 'Meal Rescue - Verify Your Email',
    html: `<p>Your OTP for email verification is:</p><h2>${otp}</h2><p>This OTP is valid for 5 minutes.</p>`,
  };

  try {
    const info = await sendMail(mailOptions);
    return info;
  } catch (err) {
    if (!err.code) {
      err.code = 'OTP_EMAIL_SEND_FAILED';
    }
    throw err;
  }
};