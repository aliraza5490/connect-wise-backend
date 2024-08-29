import Chat from '@models/Chat';
import Meeting from '@models/Meeting';
import wherebyAPI from '@utils/wherebyAPI';
import { z } from 'zod';

export default async (req: IReq, res: IRes) => {
  const schema = z.object({
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

  if (new Date(chat.pausingOn).getTime() < new Date().getTime()) {
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

  const { data } = await wherebyAPI.createMeeting();

  await Meeting.create({
    chatID: chat._id,
    startedBy: req.user?.pricePerMonth ? 'mentor' : 'user',
    startDate: data.startDate,
    endDate: data.endDate,
    roomUrl: data.roomUrl,
    meetingID: data.meetingId,
  });

  return res.status(200).json({
    url: data.roomUrl,
  });
};
