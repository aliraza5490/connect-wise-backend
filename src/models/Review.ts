import mongoose from 'mongoose';

const { Schema } = mongoose;

const ReviewSchema = new Schema({
  by: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  forWhom: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  type: {
    type: String,
    enum: ['ByMentorForUser', 'ByUserForMentor'],
    default: 'ByUserForMentor',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});