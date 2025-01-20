import mongoose from 'mongoose';

const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mentor: {
      type: Schema.Types.ObjectId,
      ref: 'Mentor',
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    review: {
      type: Schema.Types.ObjectId,
      ref: 'Review',
      default: null,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    expiringOn: {
      type: Date,
      required: true,
      // default 30 days from now
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Order', OrderSchema);
