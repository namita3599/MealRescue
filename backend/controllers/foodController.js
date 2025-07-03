import FoodPost from '../models/FoodPost.js';
import nodemailer from 'nodemailer';
import cloudinary from '../utils/cloudinary.js';
import streamifier from 'streamifier';

export const createFoodPost = async (req, res) => {
  if (req.user.role !== 'user') {
    return res.status(403).json({ message: 'Only regular users can create food posts' });
  }

  try {
    const { title, description, address, quantity, city, isVeg } = req.body;

    if (!title || !address || !city || !quantity || typeof isVeg === 'undefined') {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    //Cloudinary upload
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'MealRescue/food',
            allowed_formats: ['jpg', 'jpeg', 'png'],
            transformation: [{ width: 800, height: 600, crop: 'limit' }],
          },
          (err, result) => {
            if (result) resolve(result);
            else reject(err);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);

    const newPost = new FoodPost({
      user: req.user._id,
      title,
      description, // optional
      photo: result.secure_url,
      address,
      quantity,
      city,
      isVeg: isVeg === 'true' || isVeg === true,
    });

    await newPost.save();

    res.status(201).json({ message: 'Post created successfully', post: newPost });

  } catch (err) {

    if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ message: 'Validation Error', errors: messages });
    }

    console.error(err);
    res.status(500).json({ message: 'Failed to create post', error: err.message });
  }
};

// GET /api/posts?city=CityName
export const getFoodPostsByCity = async (req, res) => {
  const { city } = req.query;

  try {
    const posts = await FoodPost.find({ 
      city: {$regex: new RegExp(`^${city}$`, 'i')}, 
      claimed: false })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch posts', error: err.message });
  }
};

// PATCH /api/posts/:id/claim
export const claimFoodPost = async (req, res) => {
  const ngoId = req.user._id;

  if (req.user.role !== 'ngo') {
    return res.status(403).json({ message: 'Only NGOs can claim food posts' });
  }

  try {
    const post = await FoodPost.findById(req.params.id).populate('user');

    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.claimed) return res.status(400).json({ message: 'Post already claimed' });

    post.claimed = true;
    post.claimedBy = ngoId;
    await post.save();

    //Email to user
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: post.user.email,
      subject: 'Your Meal Rescue post has been claimed!',
      html: `<p>Hi ${post.user.name},</p>
             <p>Your food post in <strong>${post.city}</strong> has been claimed by <strong>${req.user.name}</strong>.</p>
             <p>Thank you for contributing to reduce food waste! </p>`,
    };

    await transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Email sending failed');
      } else {
        console.log('Email sent');
      }
    }
    );

    res.status(200).json({ message: 'Post claimed and email sent successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Failed to claim post', error: err.message });
  }
};
