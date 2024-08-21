import Chat from '@models/Chat';

export default async (req: IReq, res: IRes) => {
  // 1. get the chat history of the user for each mentor
  const chatHistory = await Chat.find({
    user: req.user._id,
  });

  return res.send(chatHistory);
};
