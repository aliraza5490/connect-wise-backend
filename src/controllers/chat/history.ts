import Chat from '@models/Chat';

export default async (req: IReq, res: IRes) => {
  if (req.user?.pricePerMonth) {
    const chatHistory = await Chat.find({
      mentor: req.user._id,
    }).populate('user', 'firstName lastName avatar');
    return res.send(chatHistory);
  }

  const chatHistory = await Chat.find({
    user: req.user._id,
  }).populate('mentor', 'firstName lastName avatar');
  return res.send(chatHistory);
};
