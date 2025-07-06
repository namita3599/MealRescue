import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { registerSchema, loginSchema } from '../validators/authValidator.js';
import { sendOTP } from '../utils/sendOTP.js';

export const register = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    await sendOTP(email, otp); // send email

    // Send everything back to frontend (plain password - will be hashed by model)
    res.status(200).json({
      message: "OTP sent. Please verify.",
      tempUser: { name, email, password, role: role || 'user' },
      otp,
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

export const login = async (req, res) => {
  //joi
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email first.' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '3d',
    });

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

export const verifyOTP = async (req, res) => {
  const { otpInput, actualOtp, tempUser } = req.body;

  if (!otpInput || !actualOtp || !tempUser) {
    return res.status(400).json({ message: "Missing required data" });
  }

  if (otpInput !== actualOtp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  try {
    const existingUser = await User.findOne({ email: tempUser.email });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered" });
    }

    const newUser = new User({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password, // Model will hash this automatically
      role: tempUser.role,
      isVerified: true,
    });

    await newUser.save();

    res.status(201).json({ message: "Email verified. You can now log in." });
  } catch (err) {
    res.status(500).json({ message: "Verification failed", error: err.message });
  }
};