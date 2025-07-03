import mongoose from 'mongoose';

const foodPostSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500, // Optional, but capped
    },
    photo: { type: String, required: true },         // Cloudinary URL
    address: { type: String, required: true },
    city: { type: String, required: true },
    quantity: { type: String, required: true },
    isVeg: { type: Boolean, required: true },

    claimed: { type: Boolean, default: false },
    claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // NGO ID
    claimedAt: { type: Date }, 
  },
  { timestamps: true }
);


export default mongoose.model('FoodPost', foodPostSchema);
