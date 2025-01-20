import Chat from '@models/Chat';
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

  const userRole = req.user?.type;

  if (
    new Date(chat.pausingOn).getTime() < new Date().getTime() &&
    userRole !== 'mentor'
  ) {
    return res.status(403).json({
      message: 'Chat is paused',
    });
  }

  if (userRole == 'user' && String(chat.user) !== String(req.user._id)) {
    return res.status(403).json({
      message: 'Forbidden',
    });
  }

  if (userRole == 'mentor' && String(chat.mentor) !== String(req.user._id)) {
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

  return res.send({
    ...latestMessage.toObject(),
  });
};
