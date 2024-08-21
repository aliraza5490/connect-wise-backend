import Chat from '@models/Chat';

export default async (req: IReq, res: IRes) => {
  let filter;
  if (req.user.pricePerMonth) {
    filter = {
      mentor: req.user._id,
    };
  } else {
    filter = {
      user: req.user._id,
    };
  }

  const chatHistory = await Chat.find(filter);

  return res.send(chatHistory);
};
