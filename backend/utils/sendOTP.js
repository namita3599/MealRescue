import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});

export const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Meal Rescue - Verify Your Email',
    html: `<p>Your OTP for email verification is:</p><h2>${otp}</h2><p>This OTP is valid for 5 minutes.</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
  } catch (err) {
    throw err; // rethrow so controller handles it
  }
};