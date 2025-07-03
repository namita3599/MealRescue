import User from '../models/User.js';
import FoodPost from '../models/FoodPost.js';
import cloudinary from '../utils/cloudinary.js';

// Helper function to extract publicId from image URL
const getPublicIdFromUrl = (url) => {
  const parts = url.split('/');
  const fileName = parts[parts.length - 1]; // e.g. "abc123.jpg"
  const publicId = `MealRescue/food/${fileName.split('.')[0]}`;
  return publicId;
};

// PATCH /api/profile/edit-name
export const editName = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || name.trim().length < 2) {
        return res.status(400).json({ message: 'Name must be at least 2 characters' });
        }

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.name = name.trim();
        await user.save();

        res.status(200).json({ message: 'Name updated successfully',
            user: {
                name: user.name, 
                email: user.email, 
                role: user.role } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

    export const changePassword = async (req, res) => {
        const userId = req.user._id;
        const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Current and new passwords are required' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) return res.status(401).json({ message: 'Incorrect current password' });

        user.password = newPassword; // will be hashed in pre-save hook
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
};

// DELETE /api/profile/delete-account
export const deleteAccount = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find all posts by the user
        const posts = await FoodPost.find({ user: userId });

        // Delete images from Cloudinary
        for (const post of posts) {
        const publicId = getPublicIdFromUrl(post.photo);
        if (publicId) {
            await cloudinary.uploader.destroy(publicId);
        }
        }

        // Delete user's posts from DB
        await FoodPost.deleteMany({ user: userId });

        // Delete  account
        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: 'Account and all related posts deleted' });
    } catch (err) {
        console.error('Error in deleteAccount:', err);
        res.status(500).json({ message: 'Failed to delete account', error: err.message });
  }
};
