// backend/models/FoodPost.js
import mongoose from 'mongoose';

const foodPostSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    photo: { type: String, required: true }, // Cloudinary URL
    address: { type: String, required: true },
    quantity: { type: String, required: true },
    isVeg: { type: Boolean, required: true },
    city: { type: String, required: true },
    claimed: { type: Boolean, default: false },
    claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // NGO ID
  },
  { timestamps: true }
);

export default mongoose.model('FoodPost', foodPostSchema);
