import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

dotenv.config();
const app = express();

app.use(cors({ origin: '*' }));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', foodRoutes);
app.use('/api/profile', profileRoutes);

app.get('/', (req, res) => {
  res.send('Meal Rescue API is running');
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: 'mealrescue', 
  })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
