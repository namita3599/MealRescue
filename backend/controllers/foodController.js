import FoodPost from '../models/FoodPost.js';
import cloudinary from '../utils/cloudinary.js';
import streamifier from 'streamifier';

export const createFoodPost = async (req, res) => {
  if (req.user.role !== 'user') {
    return res.status(403).json({ message: 'Only regular users can create food posts' });
  }

  try {
    const { address, quantity, city, isVeg } = req.body;

    if (!address || !city || !quantity || typeof isVeg === 'undefined') {
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
      photo: result.secure_url,
      address,
      quantity,
      city,
      isVeg: isVeg === 'true' || isVeg === true,
    });

    await newPost.save();

    res.status(201).json({ message: 'Post created successfully', post: newPost });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create post', error: err.message });
  }
};
