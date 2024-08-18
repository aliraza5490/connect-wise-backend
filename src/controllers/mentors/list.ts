import Mentor from '@models/Mentor';

export default async (req: IReq, res: IRes) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const skip = (page - 1) * limit;

  const totalDocs = await Mentor.countDocuments({
    isFeatured: false,
    isActive: true,
  });

  const mentors = await Mentor.aggregate([
    {
      $match: {
        isFeatured: false,
        isActive: true,
      },
    },
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'forWhom',
        as: 'reviews',
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
      },
    },
  ]);

  const totalPages = Math.ceil(totalDocs / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  const nextPage = hasNextPage ? page + 1 : null;
  const prevPage = hasPrevPage ? page - 1 : null;
  const pagingCounter = (page - 1) * limit + 1;

  res.json({
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
