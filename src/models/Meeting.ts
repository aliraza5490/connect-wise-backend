import mongoose from 'mongoose';

const { Schema } = mongoose;

const MeetingSchema = new Schema({
  chatID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  startedBy: {
    enum: ['user', 'mentor'],
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  meetingID: {
    type: String,
    required: true,
  },
  roomUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Meeting', MeetingSchema);
