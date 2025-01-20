import mongoose from 'mongoose';

const { Schema } = mongoose;

const PremiumSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    subscriptionID: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Premium', PremiumSchema, 'premiums');
