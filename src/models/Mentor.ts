import mongoose from 'mongoose';

const { Schema } = mongoose;

const MentorSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
    },
    avatar: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'null'],
      required: true,
    },
    country: {
      type: String,
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
    linkedInProfile: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    pricePerMonth: {
      type: Number,
      required: true,
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

export default mongoose.model('Mentor', MentorSchema);
