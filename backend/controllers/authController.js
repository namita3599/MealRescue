import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { registerSchema, loginSchema } from '../validators/authValidator.js';

export const register = async (req, res) => {

  // Joi validation
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { name, email, password, role } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // // Hash password
    // const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      // password: hashedPassword,
      password,
      role: role || 'user', // default is normal user
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: '3d',
    });

    res.status(201).json({ 
      user: {
       id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role 
      },
      token });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

export const login = async (req, res) => {

  // Joi validation
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user){
       return res.status(404).json({ message: 'User not found' })
      };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch){
       return res.status(400).json({ message: 'Invalid credentials' })};

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '3d',
    });

    res.status(200).json({ 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      }, 
        token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }

};
