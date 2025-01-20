import Chat from '@models/Chat';

export default async (req: IReq, res: IRes) => {
  const userRole = req.user?.type === 'user' ? 'mentor' : 'user';

  const chats = await Chat.aggregate([
    {
      $match: { [req.user?.type]: req.user._id },
    },
    {
      $lookup: {
        from: userRole == 'mentor' ? 'mentors' : 'users',
        localField: userRole,
        foreignField: '_id',
        as: userRole,
        pipeline: [
          {
            $addFields: {
              fullName: {
                $concat: ['$firstName', ' ', '$lastName'],
              },
            },
          },
          {
            $project: { firstName: 1, lastName: 1, fullName: 1, avatar: 1 },
          },
        ],
      },
    },
    {
      $unwind: `$${userRole}`,
    },
    {
      $addFields: {
        isOnline: true,
        isPaused: new Date('$pausingOn').getTime() < new Date().getTime(),
        user: `$${userRole}`,
        lastMessage: { $arrayElemAt: ['$messages', -1] },
      },
    },
    {
      $project: {
        _id: 1,
        user: 1,
        isOnline: 1,
        isPaused: 1,
        lastMessage: 1,
      },
    },
  ]);

  return res.send(chats);
};
