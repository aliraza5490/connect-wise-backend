import Chat from '@models/Chat';
import Order from '@models/Order';
import Review from '@models/Review';
import mongoose from 'mongoose';
import { z } from 'zod';

export default async (req: IReq, res: IRes) => {
  const schema = z.object({
    chatID: z.string().min(24).max(25),
    rating: z.number().min(1).max(5),
    review: z.string().min(10).max(500),
  });

  const value = schema.safeParse(req.body);

  const chat = await Chat.findOne({
    _id: new mongoose.Types.ObjectId(value.data.chatID),
    user: req.user?._id,
    pausingOn: { $lt: new Date() },
  });

  const order = await Order.findOne({
    _id: chat?.order,
    user: req.user?._id,
  });

  if (!chat || !order || !!order?.review) {
    return res.status(400).send('Invalid chat ID or already reviewed.');
  }

  if (!value.success) {
    return res.status(400).json({
      errors: value.error.errors,
      message: 'Invalid data',
    });
  }

  const review = await Review.create({
    user: req.user?._id,
    mentor: chat.mentor,
    rating: value.data.rating,
    review: value.data.review,
  });

  await Order.updateOne(
    { _id: chat.order },
    {
      $set: {
        review: review._id,
      },
    },
  );

  return res.status(201).json(review);
};
