import Chat from '@models/Chat';

export default async (req: IReq, res: IRes) => {
  if (req.user?.type == 'mentor') {
    const chatHistory = await Chat.find({
      mentor: req.user._id,
    })
      .populate('user', 'firstName lastName avatar')
      .sort({ createdAt: -1 });
    const chatHistoryWithStatus = chatHistory.map((chat) => {
      return {
        ...chat.toObject(),
        status: 'online',
        isPaused: new Date(chat.pausingOn).getTime() < new Date().getTime(),
      };
    });
    return res.send(chatHistoryWithStatus);
  }

  const chatHistory = await Chat.find({
    user: req.user._id,
  })
    .populate('mentor', 'firstName lastName avatar')
    .sort({ createdAt: -1 });
  const chatHistoryWithStatus = chatHistory.map((chat) => {
    return {
      ...chat.toObject(),
      status: 'online',
      isPaused: new Date(chat.pausingOn).getTime() < new Date().getTime(),
    };
  });

  return res.send(chatHistoryWithStatus);
};
