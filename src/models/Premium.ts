import mongoose from 'mongoose';

const { Schema } = mongoose;

const PremiumSchema = new Schema({
  mentor: {
    type: Schema.Types.ObjectId,
    ref: 'Mentor',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  fulfilled: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Premium', PremiumSchema);
