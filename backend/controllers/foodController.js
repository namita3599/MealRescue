import FoodPost from '../models/FoodPost.js';
import cloudinary from '../utils/cloudinary.js';
import streamifier from 'streamifier';
import { sendMail } from '../utils/mailer.js';

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
  const { city, veg } = req.query;

  if (req.user.role !== 'ngo') {
    return res.status(403).json({ message: 'Only NGOs can view unclaimed posts' });
  }

  try {

    const query = {
      city: { $regex: new RegExp(`^${city}$`, 'i') },
      claimed: false,
    };

    if (veg?.toLowerCase() === 'veg') {
      query.isVeg = true;
    } else if (veg?.toLowerCase() === 'nonveg') {
      query.isVeg = false;
    }
    // If veg is 'all' or not provided, no filter is added

    const posts = await FoodPost.find(query)
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
    const post = await FoodPost.findById(req.params.id)
      .populate('user')
      .populate('claimedBy', 'name');

    if (!post) return res.status(404).json({ message: 'Post not found' });

    const sendClaimNotification = async () => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: post.user.email,
        subject: 'Your Meal Rescue post has been claimed!',
        html: `<p>Hi ${post.user.name},</p>
               <p>Your food post <strong>"${post.title}"</strong> in <strong>${post.city}</strong> has been claimed by <strong>${req.user.name}</strong>.</p>
               <p>Thank you for contributing to reduce food waste! </p>`,
      };

      const info = await sendMail(mailOptions);
      post.claimNotificationSent = true;
      post.claimNotificationSentAt = new Date();
      await post.save();
      return info;
    };

    if (post.claimed) {
      const claimedById = post.claimedBy?._id ? String(post.claimedBy._id) : String(post.claimedBy || '');
      if (claimedById && claimedById !== String(ngoId)) {
        return res.status(400).json({ message: 'Post already claimed by another NGO' });
      }

      if (post.claimNotificationSent) {
        return res.status(400).json({ message: 'Post already claimed' });
      }

      try {
        const info = await sendClaimNotification();
        console.log('Claim notification resent to:', post.user.email, 'response:', info.response);
        return res.status(200).json({
          message: 'Post was already claimed, and notification email has now been sent.',
          emailDelivered: true,
          emailError: null,
        });
      } catch (emailError) {
        console.error('Claim notification resend failed:', emailError.message);
        return res.status(200).json({
          message: 'Post was already claimed, but notification email is still failing.',
          emailDelivered: false,
          emailError: emailError.message,
        });
      }
    }

    post.claimed = true;
    post.claimedBy = ngoId;
    post.claimedAt = new Date();
    await post.save();

    let emailDelivered = false;
    let emailErrorMessage = null;

    try {
      const info = await sendClaimNotification();
      emailDelivered = true;
      console.log('Email sent successfully to:', post.user.email, 'response:', info.response);
    } catch (emailError) {
      emailErrorMessage = emailError.message;
      console.error('Email sending failed:', emailError.message);
      // Claim should still succeed even if email fails.
    }

    res.status(200).json({
      message: emailDelivered ? 'Post claimed and notification email sent.' : 'Post claimed, but notification email could not be sent.',
      emailDelivered,
      emailError: emailErrorMessage,
    });

  } catch (err) {
    res.status(500).json({ message: 'Failed to claim post', error: err.message });
  }
};

