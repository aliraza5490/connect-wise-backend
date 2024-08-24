import Mentor from '@models/Mentor';
import mongoose from 'mongoose';
import { z } from 'zod';

export default async (req: IReq, res: IRes) => {
  const schema = z.object({
    mentorID: z.string().min(2).max(25),
  });

  const value = schema.safeParse(req.body);

  if (!value.success) {
    return res.status(400).json({
      errors: value.error.errors,
      message: 'Invalid data',
    });
  }

  const mentors = await Mentor.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(value.data.mentorID),
      },
    },
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'forWhom',
        as: 'reviews',
        pipeline: [
          {
            $project: {
              type: 0,
              __v: 0,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        rating: {
          // rounded to 1 decimal place average rating
          $round: [{ $avg: '$reviews.rating' }, 1],
        },
        reviewsCount: {
          $size: '$reviews',
        },
      },
    },
    {
      $project: {
        reviewsCount: 0,
        password: 0,
        isActive: 0,
        createdAt: 0,
        __v: 0,
      },
    },
  ]);

  return res.send(mentors?.length > 0 ? mentors[0] : {});
};
