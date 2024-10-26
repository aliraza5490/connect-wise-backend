import Chat from '@models/Chat';
import { io } from '@root/server';
import { onlineUsersStore } from '@root/webSockets';
import { z } from 'zod';

export default async (req: IReq, res: IRes) => {
  const schema = z.object({
    message: z.string().min(1).max(1000),
    chatID: z.string().min(1).max(25),
  });

  const value = schema.safeParse(req.body);

  if (!value.success) {
    return res.status(400).json({
      errors: value.error.errors,
      message: 'Invalid data',
    });
  }

  const chat = await Chat.findOne({ _id: value.data.chatID });

  if (!chat) {
    return res.status(404).json({
      message: 'Chat not found',
    });
  }

  const userRole = req.user?.pricePerMonth ? 'mentor' : 'user';

  if (
    new Date(chat.pausingOn).getTime() < new Date().getTime() &&
    userRole !== 'mentor'
  ) {
    return res.status(403).json({
      message: 'Chat is paused',
    });
  }

  if (!req.user?.pricePerMonth && String(chat.user) !== String(req.user._id)) {
    return res.status(403).json({
      message: 'Forbidden',
    });
  }

  if (req.user?.pricePerMonth && String(chat.mentor) !== String(req.user._id)) {
    return res.status(403).json({
      message: 'Forbidden',
    });
  }

  chat.messages.push({
    message: value.data.message,
    by: req.user._id,
    date: new Date(),
  });

  await chat.save();

  const latestMessage = chat.messages[chat.messages.length - 1];

  const toUser = String(userRole === 'user' ? chat.mentor : chat.user);

  const toOnlineUser = onlineUsersStore.get(toUser);
  const eventName = userRole === 'user' ? 'newMessageMentor' : 'newMessage';

  if (toOnlineUser) {
    io.to(toOnlineUser).emit(eventName, {
      ...latestMessage.toObject(),
      chatID: chat._id,
    });
  }

  return res.send({
    ...latestMessage.toObject(),
  });
};
