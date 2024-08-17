import Mentor from '@models/Mentor';

export default async (req: IReq, res: IRes) => {
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
        foreignField: 'mentor',
        as: 'reviews',
      },
    },
    {
      $addFields: {
        rating: {
          $avg: '$reviews.rating',
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
