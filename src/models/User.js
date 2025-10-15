import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  
  // Profile information
  profileImage: { type: String, default: "/assets/images/avatar/01.jpg" },
  mobileNo: { type: String },
  address: { type: String },
  nationality: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  
  // Profile completion
  profileCompletion: { type: Number, default: 0 },
  emailVerified: { type: Boolean, default: false },
  mobileVerified: { type: Boolean, default: false },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;