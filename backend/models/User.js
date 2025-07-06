import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' }, // user or ngo

    //for email verification
    isVerified: { type: Boolean, default: false },
    otp: String,
    otpExpires: Date,
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  
  if (!this.isModified('password')) return next();

  // Check if password is already hashed
  if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  
  this.password = hashedPassword;
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
