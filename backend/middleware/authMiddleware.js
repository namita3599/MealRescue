import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Token must be in format: Bearer <token>
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found or deleted' });
    }

    req.user = user; // attach user to request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authMiddleware;
