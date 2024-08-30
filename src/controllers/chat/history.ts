import Chat from '@models/Chat';
import { onlineUsersStore } from '@root/webSockets';

export default async (req: IReq, res: IRes) => {
  if (req.user?.pricePerMonth) {
    const chatHistory = await Chat.find({
      mentor: req.user._id,
    })
      .populate('user', 'firstName lastName avatar')
      .sort({ createdAt: -1 });
    const chatHistoryWithStatus = chatHistory.map((chat) => {
      return {
        ...chat.toObject(),
        status: onlineUsersStore.get(String(chat.user._id))
          ? 'online'
          : 'offline',
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
      status: onlineUsersStore.get(String(chat.mentor._id))
        ? 'online'
        : 'offline',
      isPaused: new Date(chat.pausingOn).getTime() < new Date().getTime(),
    };
  });

  return res.send(chatHistoryWithStatus);
};
