import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'null'],
      required: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Email is not valid'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    avatar: {
      type: String,
      default: '',
    },
    linkedInProfile: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('User', UserSchema);
