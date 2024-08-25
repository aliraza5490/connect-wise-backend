import Mentor from '@models/Mentor';

export default async (req: IReq, res: IRes) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const skip = (page - 1) * limit;

  const totalDocs = await Mentor.aggregate([
    {
      $match: {
        isActive: true,
      },
    },
    {
      $lookup: {
        from: 'premiums',
        localField: '_id',
        foreignField: 'mentor',
        as: 'premium',
        pipeline: [
          {
            $match: {
              isActive: true,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        isFeatured: {
          $cond: {
            if: {
              $gt: [
                {
                  $size: '$premium',
                },
                0,
              ],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $match: {
        isFeatured: true,
      },
    },
  ]);

  const mentors = await Mentor.aggregate([
    {
      $match: {
        isActive: true,
      },
    },
    {
      $lookup: {
        from: 'premiums',
        localField: '_id',
        foreignField: 'mentor',
        as: 'premium',
        pipeline: [
          {
            $match: {
              isActive: true,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'mentor',
        as: 'reviews',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'user',
              foreignField: '_id',
              as: 'user',
              pipeline: [
                {
                  $project: {
                    firstName: 1,
                    lastName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: '$user',
          },
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
        isFeatured: {
          $cond: {
            if: {
              $gt: [
                {
                  $size: '$premium',
                },
                0,
              ],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $match: {
        isFeatured: true,
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
        premiums: 0,
        password: 0,
        isActive: 0,
        createdAt: 0,
        __v: 0,
      },
    },
  ]);

  const totalPages = Math.ceil(totalDocs?.length / limit);
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
