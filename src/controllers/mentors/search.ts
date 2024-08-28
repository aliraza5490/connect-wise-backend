import Mentor from '@models/Mentor';
import { z } from 'zod';

export default async (req: IReq, res: IRes) => {
  const schema = z.object({
    query: z.string().min(2).max(80),
    page: z.number().int().min(1),
  });

  const value = schema.safeParse(req.body);

  if (!value.success) {
    return res.status(400).json({
      errors: value.error.errors,
      message: 'Invalid data',
    });
  }

  const totalDocs = await Mentor.countDocuments({
    isActive: true,
    $text: {
      $search: value.data.query,
    },
  });

  const page = value.data.page;
  const limit = 12;
  const skip = (page - 1) * limit;

  const mentors = await Mentor.aggregate([
    {
      $search: {
        index: 'mentor-search-index',
        text: {
          query: value.data.query,
          path: {
            wildcard: '*',
          },
          fuzzy: {
            prefixLength: 2,
          },
        },
      },
    },
    {
      $match: {
        isActive: true,
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
          $round: [{ $avg: '$reviews.rating' }, 1],
        },
        reviewsCount: {
          $size: '$reviews',
        },
      },
    },
    {
      $sort: {
        rating: -1,
        reviewsCount: -1,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
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

  const totalPages = Math.ceil(totalDocs / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  const nextPage = hasNextPage ? page + 1 : null;
  const prevPage = hasPrevPage ? page - 1 : null;
  const pagingCounter = (page - 1) * limit + 1;

  return res.json({
    docs: mentors,
    totalDocs,
    limit,
    page,
    totalPages,
    hasNextPage,
    nextPage,
    hasPrevPage,
    prevPage,
    pagingCounter,
  });
};
