import Chat from '@models/Chat';

export default async (req: IReq, res: IRes) => {
  // 1. get the chat history of the mentor for each user/mentee
  const chatHistory = await Chat.find({
    mentor: req.user._id,
  });

  return res.send(chatHistory);
};
