import Chat from '@models/Chat';

export default async (req: IReq, res: IRes) => {
  const userRole = req.user?.type;
  const filter = { _id: req.params.chatID, [userRole]: req.user._id };

  const chat = await Chat.findOne(filter, {
    messages: 1,
  });

  return res.send(chat?.messages || []);
};
