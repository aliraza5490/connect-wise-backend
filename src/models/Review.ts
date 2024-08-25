import mongoose from 'mongoose';

const { Schema } = mongoose;

const ReviewSchema = new Schema({
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mentor: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Mentor',
  },
  type: {
    type: String,
    enum: ['ByMentorForUser', 'ByUserForMentor'],
    default: 'ByUserForMentor',
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

export default mongoose.model('Review', ReviewSchema);
