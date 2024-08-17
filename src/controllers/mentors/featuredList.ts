import Mentor from '@models/Mentor';

export default async (req: IReq, res: IRes) => {
  const mentors = await Mentor.aggregate([
    {
      $match: {
        isFeatured: true,
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
      },
    },
    {
      $project: {
        password: 0,
      },
    },
  ]);

  return res.json(mentors);
};
