import mongoose from 'mongoose';

const { Schema } = mongoose;

const ChatSchema = new Schema(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    pausingOn: {
      type: Date,
      required: true,
    },
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
    messages: {
      type: [
        {
          by: {
            type: Schema.Types.ObjectId, // User or Mentor
            required: true,
          },
          message: {
            type: String,
            required: true,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Chat', ChatSchema);
