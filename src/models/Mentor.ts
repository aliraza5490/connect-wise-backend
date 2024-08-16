import mongoose from 'mongoose';

const { Schema } = mongoose;

const MentorSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
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
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  expertise: {
    type: String,
    default: '',
  },
  experience: {
    type: String,
    default: '',
  },
  pricePerMonth: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Mentor', MentorSchema);
